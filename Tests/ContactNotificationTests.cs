using System.Text.Encodings.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
}
