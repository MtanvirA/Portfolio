using System.Text.Encodings.Web;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Portfolio.Models;
using Portfolio.Options;

namespace Portfolio.Services;

public class SmtpContactNotificationService : IContactNotificationService
{
    private readonly ContactNotificationOptions _options;
    private readonly ILogger<SmtpContactNotificationService> _logger;

    public SmtpContactNotificationService(
        IOptions<ContactNotificationOptions> options,
        ILogger<SmtpContactNotificationService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task<NotificationResult> SendNotificationAsync(ContactMessage message, CancellationToken cancellationToken = default)
    {
        // 1. Check if notifications are enabled
        if (!_options.Enabled)
        {
            _logger.LogDebug("Email notification skipped: notifications are disabled in configuration.");
            return new NotificationResult
            {
                Success = true,
                IsConfigured = false,
                AttemptedAtUtc = DateTime.UtcNow
            };
        }

        // 2. Validate essential provider configuration
        if (string.IsNullOrWhiteSpace(_options.SmtpHost) ||
            string.IsNullOrWhiteSpace(_options.Username) ||
            string.IsNullOrWhiteSpace(_options.Password))
        {
            _logger.LogWarning("Email notification enabled but SMTP host, username, or password is not configured.");
            return new NotificationResult
            {
                Success = false,
                IsConfigured = false,
                ErrorMessage = "SMTP host or credentials not configured",
                AttemptedAtUtc = DateTime.UtcNow
            };
        }

        try
        {
            // 3. Construct MimeMessage with safe encoding
            var mimeMessage = new MimeMessage();

            // From: Configured verified sender identity
            mimeMessage.From.Add(new MailboxAddress(_options.SenderName, _options.SenderEmail));

            // To: Configured portfolio owner destination
            mimeMessage.To.Add(new MailboxAddress("Portfolio Owner", _options.OwnerEmail));

            // Reply-To: Visitor's validated contact email for convenient owner response
            mimeMessage.ReplyTo.Add(new MailboxAddress(message.Name, message.Email));

            // Subject: Clearly identifiable subject line
            var subjectLine = string.IsNullOrWhiteSpace(message.Subject)
                ? $"[Portfolio Contact] New message from {message.Name}"
                : $"[Portfolio Contact] {message.Subject} (from {message.Name})";
            mimeMessage.Subject = subjectLine;

            // Safe body construction: HTML-encoded and plain text alternative
            var builder = new BodyBuilder();

            // Plain text version
            builder.TextBody = $@"New Contact Message Received
--------------------------------------------------
From:      {message.Name} <{message.Email}>
Subject:   {message.Subject ?? "(No Subject)"}
Timestamp: {message.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC
IP Hash:   {message.ClientIpHash ?? "N/A"}

Message:
{message.Message}
--------------------------------------------------
Reply directly to this email to respond to {message.Name}.";

            // HTML version with safe encoding to prevent injection
            builder.HtmlBody = $@"<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
        .header {{ border-bottom: 2px solid #090a0f; padding-bottom: 12px; margin-bottom: 16px; }}
        .badge {{ display: inline-block; background-color: #d4ff3a; color: #090a0f; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }}
        .meta-table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
        .meta-table td {{ padding: 6px 0; font-size: 14px; }}
        .meta-label {{ color: #64748b; font-weight: 600; width: 110px; }}
        .message-box {{ background: #f1f5f9; border-left: 4px solid #14b8a6; padding: 16px; border-radius: 4px; font-size: 15px; white-space: pre-wrap; word-break: break-word; }}
        .footer {{ margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }}
    </style>
</head>
<body>
    <div class=""card"">
        <div class=""header"">
            <span class=""badge"">Portfolio Contact</span>
            <h2 style=""margin: 8px 0 0 0; color: #090a0f;"">New Message Received</h2>
        </div>
        <table class=""meta-table"">
            <tr>
                <td class=""meta-label"">Sender:</td>
                <td><strong>{HtmlEncoder.Default.Encode(message.Name)}</strong></td>
            </tr>
            <tr>
                <td class=""meta-label"">Email:</td>
                <td><a href=""mailto:{HtmlEncoder.Default.Encode(message.Email)}"" style=""color: #0284c7;"">{HtmlEncoder.Default.Encode(message.Email)}</a></td>
            </tr>
            <tr>
                <td class=""meta-label"">Subject:</td>
                <td>{HtmlEncoder.Default.Encode(message.Subject ?? "(No Subject)")}</td>
            </tr>
            <tr>
                <td class=""meta-label"">Received:</td>
                <td>{message.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC</td>
            </tr>
        </table>
        <div class=""message-box"">{HtmlEncoder.Default.Encode(message.Message)}</div>
        <div class=""footer"">
            You can reply directly to this email to contact {HtmlEncoder.Default.Encode(message.Name)}.
        </div>
    </div>
</body>
</html>";

            mimeMessage.Body = builder.ToMessageBody();

            // 4. Connect, authenticate, and send via MailKit
            using var client = new SmtpClient();

            // Enforce appropriate security socket options
            var security = _options.UseTls
                ? (_options.SmtpPort == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls)
                : SecureSocketOptions.None;

            await client.ConnectAsync(_options.SmtpHost, _options.SmtpPort, security, cancellationToken);
            await client.AuthenticateAsync(_options.Username, _options.Password, cancellationToken);
            await client.SendAsync(mimeMessage, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Contact notification email successfully accepted by SMTP provider for message {MessageId} to {RecipientEmail}.", message.Id, _options.OwnerEmail);

            return new NotificationResult
            {
                Success = true,
                IsConfigured = true,
                AttemptedAtUtc = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            // Log failure safely without disclosing credentials or full raw payloads
            _logger.LogError(ex, "Failed to deliver contact notification email for message {MessageId}. Error: {ErrorReason}", message.Id, ex.Message);

            return new NotificationResult
            {
                Success = false,
                IsConfigured = true,
                ErrorMessage = ex.Message,
                AttemptedAtUtc = DateTime.UtcNow
            };
        }
    }
}
