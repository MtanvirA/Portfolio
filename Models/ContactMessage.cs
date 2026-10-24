using System.ComponentModel.DataAnnotations;

namespace Portfolio.Models;

public class ContactMessage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Subject { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string Status { get; set; } = "New";

    [MaxLength(100)]
    public string? ClientIpHash { get; set; }

    [MaxLength(50)]
    public string NotificationStatus { get; set; } = "NotConfigured";

    public DateTime? NotificationSentAtUtc { get; set; }

    [MaxLength(500)]
    public string? NotificationError { get; set; }
}

