namespace Portfolio.Options;

public class ContactNotificationOptions
{
    public const string SectionName = "ContactNotification";

    /// <summary>
    /// Whether email notifications are active. Defaults to false so local development
    /// and tests run cleanly without needing external SMTP provider credentials.
    /// </summary>
    public bool Enabled { get; set; } = false;

    /// <summary>
    /// SMTP Relay Host (e.g. "mail.smtp2go.com").
    /// </summary>
    public string SmtpHost { get; set; } = "mail.smtp2go.com";

    /// <summary>
    /// SMTP Relay Port (typically 587 or 2525 for TLS, or 465 for SSL).
    /// </summary>
    public int SmtpPort { get; set; } = 587;

    /// <summary>
    /// SMTP Authentication Username. Must be configured locally via .NET User Secrets
    /// or in production via environment variables.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// SMTP Authentication Password. Never commit to version control.
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Whether to enforce STARTTLS encryption on connect.
    /// </summary>
    public bool UseTls { get; set; } = true;

    /// <summary>
    /// Verified sender email address configured on the SMTP provider (e.g. notifications@mtanviranjum.tech).
    /// </summary>
    public string SenderEmail { get; set; } = "notifications@mtanviranjum.tech";

    /// <summary>
    /// Display name for the sender.
    /// </summary>
    public string SenderName { get; set; } = "Tanvir Anjum Portfolio";

    /// <summary>
    /// Destination email address where notifications will be delivered.
    /// Defaults to the portfolio owner's direct email.
    /// </summary>
    public string OwnerEmail { get; set; } = "tanviranjum201@gmail.com";
}
