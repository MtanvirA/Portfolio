using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Portfolio.Data;
using Portfolio.Models;
using Portfolio.ViewModels;

namespace Portfolio.Services;

public class ContactSubmissionResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsRateLimited { get; set; }
    public bool IsSpamRejected { get; set; }
    public bool IsDatabaseError { get; set; }
    public Guid? SavedMessageId { get; set; }
    public string? NotificationStatus { get; set; }
}

public interface IContactService
{
    Task<ContactSubmissionResult> SubmitMessageAsync(ContactFormViewModel model, string? clientIp);
}

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IRateLimitService _rateLimitService;
    private readonly IContactNotificationService _notificationService;
    private readonly ILogger<ContactService> _logger;

    public ContactService(
        ApplicationDbContext dbContext,
        IRateLimitService rateLimitService,
        IContactNotificationService notificationService,
        ILogger<ContactService> logger)
    {
        _dbContext = dbContext;
        _rateLimitService = rateLimitService;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<ContactSubmissionResult> SubmitMessageAsync(ContactFormViewModel model, string? clientIp)
    {
        // 1. Honeypot check
        if (!string.IsNullOrWhiteSpace(model.HoneyPotCompany))
        {
            _logger.LogWarning("Spam honeypot triggered by client IP: {ClientIp}", clientIp);
            return new ContactSubmissionResult
            {
                Success = false,
                IsSpamRejected = true,
                Message = "Submission rejected due to automated activity detection."
            };
        }

        // 2. Rate limiting check (max 3 submissions per 5 minutes per IP)
        var effectiveIp = clientIp ?? "unknown-client";
        if (!_rateLimitService.IsAllowed(effectiveIp, maxRequests: 3, TimeSpan.FromMinutes(5)))
        {
            _logger.LogWarning("Rate limit exceeded for contact form submission from IP: {ClientIp}", effectiveIp);
            return new ContactSubmissionResult
            {
                Success = false,
                IsRateLimited = true,
                Message = "You have submitted multiple messages recently. Please wait a few minutes before submitting again, or reach out directly via email or WhatsApp."
            };
        }

        // 3. Prepare entity
        var ipHash = HashClientIp(effectiveIp);
        var messageEntity = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = model.Name.Trim(),
            Email = model.Email.Trim().ToLowerInvariant(),
            Subject = string.IsNullOrWhiteSpace(model.Subject) ? null : model.Subject.Trim(),
            Message = model.Message.Trim(),
            CreatedAtUtc = DateTime.UtcNow,
            Status = "New",
            ClientIpHash = ipHash,
            NotificationStatus = "Pending"
        };

        // 4. Database persistence (Primary step)
        try
        {
            _dbContext.ContactMessages.Add(messageEntity);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Contact message {MessageId} saved successfully for {Email}", messageEntity.Id, messageEntity.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist contact message to database. Check database connection string and server status.");
            
            return new ContactSubmissionResult
            {
                Success = false,
                IsDatabaseError = true,
                Message = "Your message could not be saved right now because the database server is currently unreachable. Please contact me directly via email at tanviranjum201@gmail.com or via WhatsApp."
            };
        }

        // 5. Contact Email Notification (Secondary step, attempted only after confirmed DB persistence)
        try
        {
            var notifResult = await _notificationService.SendNotificationAsync(messageEntity);
            if (notifResult.Success && notifResult.IsConfigured)
            {
                messageEntity.NotificationStatus = "Sent";
                messageEntity.NotificationSentAtUtc = notifResult.AttemptedAtUtc ?? DateTime.UtcNow;
                messageEntity.NotificationError = null;
            }
            else if (!notifResult.IsConfigured)
            {
                messageEntity.NotificationStatus = "NotConfigured";
                messageEntity.NotificationError = notifResult.ErrorMessage;
            }
            else
            {
                messageEntity.NotificationStatus = "Failed";
                messageEntity.NotificationError = notifResult.ErrorMessage != null
                    ? notifResult.ErrorMessage[..Math.Min(500, notifResult.ErrorMessage.Length)]
                    : "Unknown delivery failure";
            }

            // Record notification delivery outcome back to database
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception notifEx)
        {
            _logger.LogWarning(notifEx, "Failed while delivering or recording notification status for message {MessageId}", messageEntity.Id);
            // Do NOT fail the visitor's submission since the message was already safely saved to database
        }

        return new ContactSubmissionResult
        {
            Success = true,
            SavedMessageId = messageEntity.Id,
            NotificationStatus = messageEntity.NotificationStatus,
            Message = "Thank you! Your message has been received and saved. I will respond to your email as soon as possible."
        };
    }

    private static string HashClientIp(string ip)
    {
        if (string.IsNullOrWhiteSpace(ip) || ip == "unknown-client") return "anonymous";
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(ip + "_portfolio_salt"));
        return Convert.ToHexString(bytes)[..16];
    }
}
