using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Portfolio.Models;
using Portfolio.Options;

namespace Portfolio.Services;

public class ResendContactNotificationService : IContactNotificationService
{
    private readonly HttpClient _httpClient;
    private readonly ContactNotificationOptions _options;
    private readonly ILogger<ResendContactNotificationService> _logger;

    public ResendContactNotificationService(
        HttpClient httpClient,
        IOptions<ContactNotificationOptions> options,
        ILogger<ResendContactNotificationService> logger)
    {
        _httpClient = httpClient;
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

        // 2. Validate essential API configuration
        if (string.IsNullOrWhiteSpace(_options.ResendApiKey))
        {
            _logger.LogWarning("Email notification enabled with ResendApi provider but ResendApiKey is not configured.");
            return new NotificationResult
            {
                Success = false,
                IsConfigured = false,
                ErrorMessage = "Resend API key is not configured",
                AttemptedAtUtc = DateTime.UtcNow
            };
        }

        if (string.IsNullOrWhiteSpace(_options.SenderEmail) || string.IsNullOrWhiteSpace(_options.OwnerEmail))
        {
            _logger.LogWarning("Email notification enabled but SenderEmail or OwnerEmail is not configured.");
            return new NotificationResult
            {
                Success = false,
                IsConfigured = false,
                ErrorMessage = "Sender or recipient email not configured",
                AttemptedAtUtc = DateTime.UtcNow
            };
        }

        try
        {
            // 3. Format subject and sender
            var subjectLine = string.IsNullOrWhiteSpace(message.Subject)
                ? $"[Portfolio Contact] New message from {message.Name}"
                : $"[Portfolio Contact] {message.Subject} (from {message.Name})";

            var fromField = string.IsNullOrWhiteSpace(_options.SenderName)
                ? _options.SenderEmail
                : $"{_options.SenderName} <{_options.SenderEmail}>";

            // 4. Construct plain text alternative
            var plainText = $@"New Contact Message Received
--------------------------------------------------
From:      {message.Name} <{message.Email}>
Subject:   {message.Subject ?? "(No Subject)"}
Timestamp: {message.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC
IP Hash:   {message.ClientIpHash ?? "N/A"}

Message:
{message.Message}
--------------------------------------------------
Reply directly to this email to respond to {message.Name}.";

            // 5. Construct HTML version with strict encoding to prevent XSS / HTML injection
            var htmlBody = $@"<!DOCTYPE html>
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

            // 6. Build Resend API payload matching official REST schema
            var payload = new ResendEmailRequest
            {
                From = fromField,
                To = new List<string> { _options.OwnerEmail },
                ReplyTo = new List<string> { message.Email },
                Subject = subjectLine,
                Html = htmlBody,
                Text = plainText
            };

            var apiUrl = string.IsNullOrWhiteSpace(_options.ResendApiUrl)
                ? "https://api.resend.com/emails"
                : _options.ResendApiUrl;

            using var request = new HttpRequestMessage(HttpMethod.Post, apiUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ResendApiKey.Trim());
            request.Content = JsonContent.Create(payload);

            var response = await _httpClient.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation(
                    "Contact notification email successfully accepted by Resend API for message {MessageId} to {RecipientEmail}.",
                    message.Id,
                    _options.OwnerEmail);

                return new NotificationResult
                {
                    Success = true,
                    IsConfigured = true,
                    AttemptedAtUtc = DateTime.UtcNow
                };
            }

            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var safeSnippet = errorBody.Length > 500 ? errorBody[..500] : errorBody;

            _logger.LogError(
                "Resend API rejected contact notification for message {MessageId}. StatusCode: {StatusCode}, Error: {ErrorSnippet}",
                message.Id,
                (int)response.StatusCode,
                safeSnippet);

            return new NotificationResult
            {
                Success = false,
                IsConfigured = true,
                ErrorMessage = $"Resend API error ({(int)response.StatusCode}): {safeSnippet}",
                AttemptedAtUtc = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to deliver contact notification email via Resend API for message {MessageId}. Error: {ErrorReason}",
                message.Id,
                ex.Message);

            return new NotificationResult
            {
                Success = false,
                IsConfigured = true,
                ErrorMessage = ex.Message,
                AttemptedAtUtc = DateTime.UtcNow
            };
        }
    }

    private class ResendEmailRequest
    {
        [JsonPropertyName("from")]
        public string From { get; set; } = string.Empty;

        [JsonPropertyName("to")]
        public List<string> To { get; set; } = new();

        [JsonPropertyName("reply_to")]
        public List<string>? ReplyTo { get; set; }

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("html")]
        public string Html { get; set; } = string.Empty;

        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }
}
