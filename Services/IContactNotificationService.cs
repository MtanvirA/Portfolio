using Portfolio.Models;

namespace Portfolio.Services;

public class NotificationResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime? AttemptedAtUtc { get; set; }
    public bool IsConfigured { get; set; }
}

public interface IContactNotificationService
{
    Task<NotificationResult> SendNotificationAsync(ContactMessage message, CancellationToken cancellationToken = default);
}
