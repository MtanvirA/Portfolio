using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Encodings.Web;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Portfolio.Data;
using Portfolio.Models;
using Portfolio.Options;
using Portfolio.Services;
using Portfolio.ViewModels;
using Xunit;

namespace Portfolio.Tests;

public class ContactNotificationTests
{
    private ApplicationDbContext CreateInMemoryDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    private class TestMockNotificationService : IContactNotificationService
    {
        public bool WasCalled { get; private set; }
        public ContactMessage? CapturedMessage { get; private set; }
        public NotificationResult ResultToReturn { get; set; } = new()
        {
            Success = true,
            IsConfigured = true,
            AttemptedAtUtc = DateTime.UtcNow
        };

        public Task<NotificationResult> SendNotificationAsync(ContactMessage message, CancellationToken cancellationToken = default)
        {
            WasCalled = true;
            CapturedMessage = message;
            return Task.FromResult(ResultToReturn);
        }
    }

    private class ThrowingDbContext : ApplicationDbContext
    {
        public ThrowingDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            throw new DbUpdateException("Database connection terminated abruptly");
        }
    }

    [Fact]
    public async Task SubmitMessageAsync_DatabaseFails_NotificationIsNotAttempted()
    {
        // 1. Arrange: Database throws exception on SaveChangesAsync
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_FailNotification")
            .Options;

        using var db = new ThrowingDbContext(options);
        var limiter = new MemoryRateLimitService();
        var mockNotification = new TestMockNotificationService();
        var service = new ContactService(db, limiter, mockNotification, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "Alice In Chains",
            Email = "alice@example.com",
            Message = "Testing that notification is never dispatched if DB fails."
        };

        // 2. Act
        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        // 3. Assert: DB error returned, and notification was NOT called
        Assert.False(result.Success);
        Assert.True(result.IsDatabaseError);
        Assert.False(mockNotification.WasCalled, "Notification service must NOT be called if database persistence failed.");
    }

    [Fact]
    public async Task SubmitMessageAsync_SuccessfulPersistence_NotificationIsAttempted()
    {
        // Arrange
        using var db = CreateInMemoryDbContext("TestDb_SuccessNotification");
        var limiter = new MemoryRateLimitService();
        var mockNotification = new TestMockNotificationService();
        var service = new ContactService(db, limiter, mockNotification, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "Bob Builder",
            Email = "bob@example.com",
            Subject = "Consulting Gig",
            Message = "Would like to discuss an engineering contract."
        };

        // Act
        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        // Assert
        Assert.True(result.Success);
        Assert.True(mockNotification.WasCalled, "Notification service should be called following successful DB persistence.");
        Assert.NotNull(mockNotification.CapturedMessage);
        Assert.Equal("bob@example.com", mockNotification.CapturedMessage.Email);

        var savedInDb = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == result.SavedMessageId);
        Assert.NotNull(savedInDb);
        Assert.Equal("Sent", savedInDb.NotificationStatus);
        Assert.NotNull(savedInDb.NotificationSentAtUtc);
        Assert.Null(savedInDb.NotificationError);
    }

    [Fact]
    public async Task SubmitMessageAsync_NotificationProviderNotConfigured_VisitorStillReceivesSuccess()
    {
        // Arrange
        using var db = CreateInMemoryDbContext("TestDb_NotConfigured");
        var limiter = new MemoryRateLimitService();
        var mockNotification = new TestMockNotificationService
        {
            ResultToReturn = new NotificationResult
            {
                Success = true,
                IsConfigured = false,
                AttemptedAtUtc = DateTime.UtcNow
            }
        };
        var service = new ContactService(db, limiter, mockNotification, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "Charlie Day",
            Email = "charlie@paddys.com",
            Message = "Local development message with disabled email notification."
        };

        // Act
        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        // Assert
        Assert.True(result.Success, "Visitor must receive a success response even when email notifications are disabled.");
        Assert.NotNull(result.SavedMessageId);

        var saved = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == result.SavedMessageId);
        Assert.NotNull(saved);
        Assert.Equal("NotConfigured", saved.NotificationStatus);
    }

    [Fact]
    public async Task SubmitMessageAsync_EmailProviderFails_VisitorStillReceivesSuccess_AndErrorIsRecorded()
    {
        // Arrange: Email provider simulates failure (e.g. SMTP server unreachable)
        using var db = CreateInMemoryDbContext("TestDb_EmailFailure");
        var limiter = new MemoryRateLimitService();
        var mockNotification = new TestMockNotificationService
        {
            ResultToReturn = new NotificationResult
            {
                Success = false,
                IsConfigured = true,
                ErrorMessage = "Connection timed out to mail.smtp2go.com:587",
                AttemptedAtUtc = DateTime.UtcNow
            }
        };
        var service = new ContactService(db, limiter, mockNotification, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "David Bowie",
            Email = "david@starman.org",
            Message = "Testing email provider failure isolation."
        };

        // Act
        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        // Assert: Visitor receives success because the message was saved in database
        Assert.True(result.Success, "Visitor must still receive success confirmation because database persistence succeeded.");
        Assert.NotNull(result.SavedMessageId);

        // Database record reflects that notification failed, with error recorded
        var saved = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == result.SavedMessageId);
        Assert.NotNull(saved);
        Assert.Equal("Failed", saved.NotificationStatus);
        Assert.Contains("Connection timed out", saved.NotificationError);
    }

    [Fact]
    public async Task SmtpNotificationService_Disabled_ReturnsNotConfiguredResult_WithoutNetworkCall()
    {
        // Arrange
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = false
        });

        var service = new SmtpContactNotificationService(options, NullLogger<SmtpContactNotificationService>.Instance);

        var message = new ContactMessage
        {
            Name = "Eve",
            Email = "eve@example.com",
            Message = "Message when disabled."
        };

        // Act
        var result = await service.SendNotificationAsync(message);

        // Assert
        Assert.True(result.Success);
        Assert.False(result.IsConfigured);
    }

    [Fact]
    public async Task SmtpNotificationService_MissingCredentials_ReturnsFailure_WithoutThrowing()
    {
        // Arrange: Enabled but missing host/credentials
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            SmtpHost = "",
            Username = "",
            Password = ""
        });

        var service = new SmtpContactNotificationService(options, NullLogger<SmtpContactNotificationService>.Instance);

        var message = new ContactMessage
        {
            Name = "Frank",
            Email = "frank@example.com",
            Message = "Testing missing credentials handling."
        };

        // Act
        var result = await service.SendNotificationAsync(message);

        // Assert
        Assert.False(result.Success);
        Assert.False(result.IsConfigured);
        Assert.Contains("credentials not configured", result.ErrorMessage);
    }

    [Fact]
    public void NotificationOptions_DefaultConfiguration_HasSafeValues()
    {
        var options = new ContactNotificationOptions();

        Assert.False(options.Enabled, "Notifications should be disabled by default for zero-friction local development.");
        Assert.Equal("smtp.gmail.com", options.SmtpHost);
        Assert.Equal(587, options.SmtpPort);
        Assert.Equal("tanviranjum201@gmail.com", options.OwnerEmail);
        Assert.Equal("tanviranjum201@gmail.com", options.SenderEmail);
        Assert.Equal("tanviranjum201@gmail.com", options.Username);
        Assert.Empty(options.Password);
    }

    [Fact]
    public void NotificationOptions_CanBindFromConfiguration_WithGmailSettings()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "ContactNotification:Enabled", "false" },
            { "ContactNotification:SmtpHost", "smtp.gmail.com" },
            { "ContactNotification:SmtpPort", "587" },
            { "ContactNotification:Username", "tanviranjum201@gmail.com" },
            { "ContactNotification:Password", "mock_app_password" },
            { "ContactNotification:UseTls", "true" },
            { "ContactNotification:SenderEmail", "tanviranjum201@gmail.com" },
            { "ContactNotification:SenderName", "Tanvir Anjum Portfolio" },
            { "ContactNotification:OwnerEmail", "tanviranjum201@gmail.com" }
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var options = new ContactNotificationOptions();
        configuration.GetSection(ContactNotificationOptions.SectionName).Bind(options);

        Assert.False(options.Enabled);
        Assert.Equal("smtp.gmail.com", options.SmtpHost);
        Assert.Equal(587, options.SmtpPort);
        Assert.Equal("tanviranjum201@gmail.com", options.Username);
        Assert.Equal("mock_app_password", options.Password);
        Assert.True(options.UseTls);
        Assert.Equal("tanviranjum201@gmail.com", options.SenderEmail);
        Assert.Equal("Tanvir Anjum Portfolio", options.SenderName);
        Assert.Equal("tanviranjum201@gmail.com", options.OwnerEmail);
    }

    [Fact]
    public void ContentSafety_HtmlEncoding_PreventsHtmlInjection()
    {
        var maliciousInput = "<script>alert('pwned')</script>&<b>bold</b>";
        var encoded = HtmlEncoder.Default.Encode(maliciousInput);

        Assert.DoesNotContain("<script>", encoded);
        Assert.Contains("&lt;script&gt;", encoded);
        Assert.Contains("&amp;", encoded);
    }

    [Fact]
    public async Task ClientResponse_DoesNotLeakNotificationCredentials()
    {
        using var db = CreateInMemoryDbContext("TestDb_SecretLeakCheck");
        var limiter = new MemoryRateLimitService();
        var mockNotification = new TestMockNotificationService
        {
            ResultToReturn = new NotificationResult
            {
                Success = false,
                IsConfigured = true,
                ErrorMessage = "Auth failed: password super_secret_pass was rejected"
            }
        };
        var service = new ContactService(db, limiter, mockNotification, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "Grace",
            Email = "grace@hopper.org",
            Message = "Checking that notification error details never leak to visitor."
        };

        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        // The visitor message should be clean and reassuring, never leaking internal SMTP errors
        Assert.True(result.Success);
        Assert.DoesNotContain("super_secret_pass", result.Message);
        Assert.DoesNotContain("Auth failed", result.Message);
    }

    private class MockHttpMessageHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> _handler;

        public MockHttpMessageHandler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> handler)
        {
            _handler = handler;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return _handler(request, cancellationToken);
        }
    }

    [Fact]
    public async Task ResendService_WhenDisabled_SkipsSendingAndReturnsSuccess()
    {
        var handlerCalled = false;
        var handler = new MockHttpMessageHandler((req, ct) =>
        {
            handlerCalled = true;
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK));
        });

        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = false,
            Provider = "ResendApi",
            ResendApiKey = "re_test_key"
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "John Doe",
            Email = "john@example.com",
            Message = "Test message"
        };

        var result = await service.SendNotificationAsync(message);

        Assert.True(result.Success);
        Assert.False(result.IsConfigured);
        Assert.False(handlerCalled, "HTTP client should never be invoked when notifications are disabled.");
    }

    [Fact]
    public async Task ResendService_WhenMissingApiKey_ReturnsNotConfigured()
    {
        var handler = new MockHttpMessageHandler((req, ct) => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)));
        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            Provider = "ResendApi",
            ResendApiKey = ""
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "John",
            Email = "john@example.com",
            Message = "Test"
        };

        var result = await service.SendNotificationAsync(message);

        Assert.False(result.Success);
        Assert.False(result.IsConfigured);
        Assert.Contains("Resend API key is not configured", result.ErrorMessage);
    }

    [Fact]
    public async Task ResendService_WhenMissingSenderOrOwnerEmail_ReturnsNotConfigured()
    {
        var handler = new MockHttpMessageHandler((req, ct) => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)));
        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            Provider = "ResendApi",
            ResendApiKey = "re_valid_key",
            SenderEmail = "",
            OwnerEmail = ""
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "John",
            Email = "john@example.com",
            Message = "Test"
        };

        var result = await service.SendNotificationAsync(message);

        Assert.False(result.Success);
        Assert.False(result.IsConfigured);
        Assert.Contains("Sender or recipient email not configured", result.ErrorMessage);
    }

    [Fact]
    public async Task ResendService_SendsExpectedJsonPayloadAndHeaders_WhenSuccessful()
    {
        HttpRequestMessage? capturedRequest = null;
        string? capturedBody = null;

        var handler = new MockHttpMessageHandler(async (req, ct) =>
        {
            capturedRequest = req;
            capturedBody = await req.Content!.ReadAsStringAsync(ct);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{\"id\": \"resend_msg_123\"}", System.Text.Encoding.UTF8, "application/json")
            };
        });

        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            Provider = "ResendApi",
            ResendApiKey = "re_test_secret_key_12345",
            SenderEmail = "notifications@mtanviranjum.tech",
            SenderName = "Tanvir Anjum Portfolio",
            OwnerEmail = "tanviranjum201@gmail.com"
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "Grace Hopper",
            Email = "grace@navy.mil",
            Subject = "Compiler Optimization",
            Message = "Let us discuss modern compiler architectures.",
            CreatedAtUtc = new DateTime(2026, 10, 24, 12, 0, 0, DateTimeKind.Utc),
            ClientIpHash = "hash123"
        };

        var result = await service.SendNotificationAsync(message);

        Assert.True(result.Success);
        Assert.True(result.IsConfigured);
        Assert.NotNull(capturedRequest);
        Assert.Equal(HttpMethod.Post, capturedRequest.Method);
        Assert.Equal(new Uri("https://api.resend.com/emails"), capturedRequest.RequestUri);
        Assert.Equal("Bearer", capturedRequest.Headers.Authorization?.Scheme);
        Assert.Equal("re_test_secret_key_12345", capturedRequest.Headers.Authorization?.Parameter);

        Assert.NotNull(capturedBody);
        using var jsonDoc = JsonDocument.Parse(capturedBody);
        var root = jsonDoc.RootElement;

        Assert.Equal("Tanvir Anjum Portfolio <notifications@mtanviranjum.tech>", root.GetProperty("from").GetString());
        var toArray = root.GetProperty("to").EnumerateArray().Select(e => e.GetString()).ToList();
        Assert.Contains("tanviranjum201@gmail.com", toArray);

        var replyToArray = root.GetProperty("reply_to").EnumerateArray().Select(e => e.GetString()).ToList();
        Assert.Contains("grace@navy.mil", replyToArray);

        Assert.Equal("[Portfolio Contact] Compiler Optimization (from Grace Hopper)", root.GetProperty("subject").GetString());

        var html = root.GetProperty("html").GetString();
        Assert.NotNull(html);
        Assert.Contains("Grace Hopper", html);
        Assert.Contains("grace@navy.mil", html);
        Assert.Contains("Let us discuss modern compiler architectures.", html);

        var text = root.GetProperty("text").GetString();
        Assert.NotNull(text);
        Assert.Contains("From:      Grace Hopper <grace@navy.mil>", text);
        Assert.Contains("Let us discuss modern compiler architectures.", text);
    }

    [Fact]
    public async Task ResendService_HtmlEncodesVisitorInput_PreventingHtmlInjection()
    {
        string? capturedBody = null;
        var handler = new MockHttpMessageHandler(async (req, ct) =>
        {
            capturedBody = await req.Content!.ReadAsStringAsync(ct);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{\"id\": \"msg_safe\"}", System.Text.Encoding.UTF8, "application/json")
            };
        });

        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            Provider = "ResendApi",
            ResendApiKey = "re_test_key",
            SenderEmail = "notifications@mtanviranjum.tech",
            OwnerEmail = "tanviranjum201@gmail.com"
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "<script>alert('xss')</script>",
            Email = "attacker@example.com",
            Subject = "<b>Injected Subject</b>",
            Message = "Testing & evaluating <img src=x onerror=alert(1)>",
            CreatedAtUtc = DateTime.UtcNow
        };

        var result = await service.SendNotificationAsync(message);

        Assert.True(result.Success);
        Assert.NotNull(capturedBody);
        using var jsonDoc = JsonDocument.Parse(capturedBody);
        var html = jsonDoc.RootElement.GetProperty("html").GetString();
        Assert.NotNull(html);

        Assert.DoesNotContain("<script>", html);
        Assert.Contains("&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;", html);
        Assert.DoesNotContain("<b>Injected Subject</b>", html);
        Assert.Contains("&lt;b&gt;Injected Subject&lt;/b&gt;", html);
        Assert.DoesNotContain("<img src=x", html);
        Assert.Contains("&lt;img src=x onerror=alert(1)&gt;", html);
        Assert.Contains("Testing &amp; evaluating", html);
    }

    [Fact]
    public async Task ResendService_HandlesApiErrorResponse_GracefullyWithoutDisclosingSecrets()
    {
        var handler = new MockHttpMessageHandler((req, ct) =>
        {
            var errorResponse = new HttpResponseMessage(HttpStatusCode.UnprocessableEntity)
            {
                Content = new StringContent("{\"statusCode\": 422, \"message\": \"Domain notifications@mtanviranjum.tech not verified\", \"name\": \"validation_error\"}", System.Text.Encoding.UTF8, "application/json")
            };
            return Task.FromResult(errorResponse);
        });

        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            Provider = "ResendApi",
            ResendApiKey = "re_secret_api_key_must_not_leak",
            SenderEmail = "notifications@mtanviranjum.tech",
            OwnerEmail = "tanviranjum201@gmail.com"
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "Alice",
            Email = "alice@example.com",
            Message = "Testing error response handling"
        };

        var result = await service.SendNotificationAsync(message);

        Assert.False(result.Success);
        Assert.True(result.IsConfigured);
        Assert.NotNull(result.ErrorMessage);
        Assert.Contains("422", result.ErrorMessage);
        Assert.Contains("Domain notifications@mtanviranjum.tech not verified", result.ErrorMessage);
        Assert.DoesNotContain("re_secret_api_key_must_not_leak", result.ErrorMessage);
    }

    [Fact]
    public async Task ResendService_HandlesNetworkException_GracefullyWithoutCrashing()
    {
        var handler = new MockHttpMessageHandler((req, ct) =>
        {
            throw new HttpRequestException("DNS resolution failed for api.resend.com: host unreachable");
        });

        var httpClient = new HttpClient(handler);
        var options = Microsoft.Extensions.Options.Options.Create(new ContactNotificationOptions
        {
            Enabled = true,
            Provider = "ResendApi",
            ResendApiKey = "re_test_key",
            SenderEmail = "notifications@mtanviranjum.tech",
            OwnerEmail = "tanviranjum201@gmail.com"
        });

        var service = new ResendContactNotificationService(httpClient, options, NullLogger<ResendContactNotificationService>.Instance);
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = "Bob",
            Email = "bob@example.com",
            Message = "Testing network exception"
        };

        var result = await service.SendNotificationAsync(message);

        Assert.False(result.Success);
        Assert.True(result.IsConfigured);
        Assert.NotNull(result.ErrorMessage);
        Assert.Contains("DNS resolution failed", result.ErrorMessage);
    }

    [Theory]
    [InlineData("Smtp", typeof(SmtpContactNotificationService))]
    [InlineData("smtp", typeof(SmtpContactNotificationService))]
    [InlineData("ResendApi", typeof(ResendContactNotificationService))]
    [InlineData("resendapi", typeof(ResendContactNotificationService))]
    [InlineData("RESENDAPI", typeof(ResendContactNotificationService))]
    public void ProviderSelection_ResolvesExpectedServiceImplementation(string providerName, Type expectedType)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.Configure<ContactNotificationOptions>(options =>
        {
            options.Provider = providerName;
            options.ResendApiKey = "re_test_key";
            options.SenderEmail = "notifications@mtanviranjum.tech";
            options.OwnerEmail = "tanviranjum201@gmail.com";
        });

        services.AddHttpClient<ResendContactNotificationService>();
        services.AddScoped<SmtpContactNotificationService>();
        services.AddScoped<IContactNotificationService>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<ContactNotificationOptions>>().Value;
            if (string.Equals(options.Provider, "ResendApi", StringComparison.OrdinalIgnoreCase))
            {
                return sp.GetRequiredService<ResendContactNotificationService>();
            }
            return sp.GetRequiredService<SmtpContactNotificationService>();
        });

        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();

        var resolvedService = scope.ServiceProvider.GetRequiredService<IContactNotificationService>();

        Assert.NotNull(resolvedService);
        Assert.IsType(expectedType, resolvedService);
    }

    [Fact]
    public void NotificationOptions_CanBindResendConfigurationProperties()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "ContactNotification:Enabled", "true" },
            { "ContactNotification:Provider", "ResendApi" },
            { "ContactNotification:ResendApiKey", "re_custom_api_key_xyz" },
            { "ContactNotification:ResendApiUrl", "https://api.resend.com/emails" },
            { "ContactNotification:SenderEmail", "notifications@mtanviranjum.tech" },
            { "ContactNotification:SenderName", "Tanvir Anjum Portfolio" },
            { "ContactNotification:OwnerEmail", "tanviranjum201@gmail.com" }
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var options = new ContactNotificationOptions();
        configuration.GetSection(ContactNotificationOptions.SectionName).Bind(options);

        Assert.True(options.Enabled);
        Assert.Equal("ResendApi", options.Provider);
        Assert.Equal("re_custom_api_key_xyz", options.ResendApiKey);
        Assert.Equal("https://api.resend.com/emails", options.ResendApiUrl);
        Assert.Equal("notifications@mtanviranjum.tech", options.SenderEmail);
        Assert.Equal("Tanvir Anjum Portfolio", options.SenderName);
        Assert.Equal("tanviranjum201@gmail.com", options.OwnerEmail);
    }
}
