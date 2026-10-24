using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Portfolio.Data;
using Portfolio.Options;
using Portfolio.Services;
using Portfolio.ViewModels;
using Xunit;

namespace Portfolio.Tests;

public class ContactServiceTests
{
    private ApplicationDbContext CreateInMemoryDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task SubmitMessageAsync_ValidModel_PersistsMessageSuccessfully()
    {
        using var db = CreateInMemoryDbContext("TestDb_Success");
        var limiter = new MemoryRateLimitService();
        var service = new ContactService(db, limiter, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "John Doe",
            Email = "john@example.com",
            Subject = "Project Inquiry",
            Message = "Hello Tanvir, great portfolio work on ShareSync!"
        };

        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        Assert.True(result.Success);
        Assert.NotNull(result.SavedMessageId);
        Assert.False(result.IsDatabaseError);
        Assert.False(result.IsSpamRejected);

        var saved = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == result.SavedMessageId);
        Assert.NotNull(saved);
        Assert.Equal("John Doe", saved.Name);
        Assert.Equal("john@example.com", saved.Email);
        Assert.Equal("Project Inquiry", saved.Subject);
        Assert.Equal("New", saved.Status);
        Assert.NotNull(saved.ClientIpHash);
    }

    [Fact]
    public async Task SubmitMessageAsync_EmailStoredLowercaseAndTrimmed()
    {
        using var db = CreateInMemoryDbContext("TestDb_Normalize");
        var limiter = new MemoryRateLimitService();
        var service = new ContactService(db, limiter, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "  Jane Doe  ",
            Email = "  Jane.Doe@EXAMPLE.COM  ",
            Message = "Testing string normalization during persistence."
        };

        var result = await service.SubmitMessageAsync(model, "127.0.0.1");

        Assert.True(result.Success);
        var saved = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == result.SavedMessageId);
        Assert.NotNull(saved);
        Assert.Equal("Jane Doe", saved.Name);
        Assert.Equal("jane.doe@example.com", saved.Email);
    }

    [Fact]
    public async Task SubmitMessageAsync_HoneypotFilled_RejectsAsSpam()
    {
        using var db = CreateInMemoryDbContext("TestDb_Honeypot");
        var limiter = new MemoryRateLimitService();
        var service = new ContactService(db, limiter, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "Spam Bot",
            Email = "bot@spammer.com",
            Message = "Cheap deals online click here now!",
            HoneyPotCompany = "Automated Bot Company" // Honeypot filled
        };

        var result = await service.SubmitMessageAsync(model, "10.0.0.1");

        Assert.False(result.Success);
        Assert.True(result.IsSpamRejected);
        Assert.Null(result.SavedMessageId);

        var count = await db.ContactMessages.CountAsync();
        Assert.Equal(0, count);
    }

    [Fact]
    public async Task SubmitMessageAsync_ExceedsRateLimit_RejectsWithFriendlyMessage()
    {
        using var db = CreateInMemoryDbContext("TestDb_RateLimit");
        var limiter = new MemoryRateLimitService();
        var service = new ContactService(db, limiter, NullLogger<ContactService>.Instance);

        var ip = "192.168.10.50";

        // Submit 3 times (the maximum allowed)
        for (int i = 0; i < 3; i++)
        {
            var m = new ContactFormViewModel
            {
                Name = $"User {i}",
                Email = $"user{i}@example.com",
                Message = $"Test message number {i} for rate limiting."
            };
            var res = await service.SubmitMessageAsync(m, ip);
            Assert.True(res.Success);
        }

        // 4th submission should be blocked by rate limiter
        var blockedModel = new ContactFormViewModel
        {
            Name = "User 4",
            Email = "user4@example.com",
            Message = "This 4th message should be blocked by rate limit."
        };
        var blockedRes = await service.SubmitMessageAsync(blockedModel, ip);

        Assert.False(blockedRes.Success);
        Assert.True(blockedRes.IsRateLimited);
        Assert.Contains("wait a few minutes", blockedRes.Message);
    }

    [Fact]
    public async Task SubmitMessageAsync_DatabaseThrowsException_ReturnsGracefulDatabaseError()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_Failing")
            .Options;

        using var db = new FailingDbContext(options);
        var limiter = new MemoryRateLimitService();
        var service = new ContactService(db, limiter, NullLogger<ContactService>.Instance);

        var model = new ContactFormViewModel
        {
            Name = "Database Test",
            Email = "db@test.com",
            Message = "Testing database exception catch."
        };

        var result = await service.SubmitMessageAsync(model, "10.1.1.1");

        Assert.False(result.Success);
        Assert.True(result.IsDatabaseError);
        Assert.Null(result.SavedMessageId);
        Assert.Contains("database server is currently unreachable", result.Message);
        Assert.DoesNotContain("Simulated connection timeout", result.Message); // Does not leak exception internal
    }

    [Fact]
    public void PortfolioOptions_GetWhatsAppUrl_SanitizesPhoneNumber_AndEncodesMessage()
    {
        var options = new PortfolioOptions
        {
            WhatsAppNumber = "+880 1718-659824"
        };

        var message = "Hello & welcome";
        var url = options.GetWhatsAppUrl(message);

        Assert.StartsWith("https://wa.me/8801718659824", url);
        Assert.Contains(Uri.EscapeDataString(message), url);
    }

    private class FailingDbContext : ApplicationDbContext
    {
        public FailingDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            throw new DbUpdateException("Simulated connection timeout");
        }
    }
}
