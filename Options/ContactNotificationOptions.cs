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
    /// SMTP Relay Host (e.g. "smtp.gmail.com").
    /// </summary>
    public string SmtpHost { get; set; } = "smtp.gmail.com";

    /// <summary>
    /// SMTP Relay Port (typically 587 for STARTTLS, or 465 for SSL).
    /// </summary>
    public int SmtpPort { get; set; } = 587;

    /// <summary>
    /// SMTP Authentication Username (your full Gmail address).
    /// </summary>
    public string Username { get; set; } = "tanviranjum201@gmail.com";

    /// <summary>
    /// SMTP Authentication Password (Google Account App Password). Never commit to version control.
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Whether to enforce STARTTLS encryption on connect.
    /// </summary>
    public bool UseTls { get; set; } = true;

    /// <summary>
    /// Sender email address (tanviranjum201@gmail.com).
    /// </summary>
    public string SenderEmail { get; set; } = "tanviranjum201@gmail.com";

    /// <summary>
    /// Display name for the sender.
    /// </summary>
    public string SenderName { get; set; } = "Tanvir Anjum Portfolio";

    /// <summary>
    /// Notification delivery provider: "Smtp" (default, for local development via Gmail/MailKit)
    /// or "ResendApi" (for hosted cloud environments like Render where outbound SMTP ports are blocked).
    /// </summary>
    public string Provider { get; set; } = "Smtp";

    /// <summary>
    /// Resend REST API Key (e.g. "re_123456789"). Never commit to version control.
    /// In production, supply via environment variable (ContactNotification__ResendApiKey).
    /// </summary>
    public string ResendApiKey { get; set; } = string.Empty;

    /// <summary>
    /// Base URL for the Resend REST API. Defaults to https://api.resend.com/emails.
    /// </summary>
    public string ResendApiUrl { get; set; } = "https://api.resend.com/emails";

    /// <summary>
    /// Destination email address where notifications will be delivered.
    /// Defaults to the portfolio owner's direct email.
    /// </summary>
    public string OwnerEmail { get; set; } = "tanviranjum201@gmail.com";
}
