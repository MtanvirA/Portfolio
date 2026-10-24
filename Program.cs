using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Portfolio.Data;
using Portfolio.Options;
using Portfolio.Services;

var builder = WebApplication.CreateBuilder(args);

// Cloud / Container Port Binding:
// If the PORT environment variable is set (e.g. by Render, Cloud Run, or Docker),
// bind to 0.0.0.0:{PORT}. Otherwise, preserve local development URLs (launchSettings.json).
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// Options configuration
builder.Services.Configure<PortfolioOptions>(
    builder.Configuration.GetSection(PortfolioOptions.SectionName));
builder.Services.Configure<ContactNotificationOptions>(
    builder.Configuration.GetSection(ContactNotificationOptions.SectionName));

// Reverse proxy forwarded headers configuration with strict trust boundaries.
// By default, ASP.NET Core safely trusts loopback proxies (127.0.0.1 and ::1).
// Do NOT clear KnownProxies or KnownIPNetworks globally, as doing so allows untrusted
// clients to trivially spoof X-Forwarded-For headers and bypass IP rate limiting.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    var forwardLimit = builder.Configuration.GetValue<int?>("ForwardedHeaders:ForwardLimit");
    if (forwardLimit.HasValue)
    {
        options.ForwardLimit = forwardLimit.Value;
    }

    // Trust RFC 1918 private network ranges when enabled for container environments
    // behind platform reverse proxies (Render, Kubernetes, Docker bridges).
    var trustPrivateNetworks = builder.Configuration.GetValue<bool>("ForwardedHeaders:TrustPrivateNetworks");
    if (trustPrivateNetworks)
    {
        options.KnownIPNetworks.Add(new System.Net.IPNetwork(System.Net.IPAddress.Parse("10.0.0.0"), 8));
        options.KnownIPNetworks.Add(new System.Net.IPNetwork(System.Net.IPAddress.Parse("172.16.0.0"), 12));
        options.KnownIPNetworks.Add(new System.Net.IPNetwork(System.Net.IPAddress.Parse("192.168.0.0"), 16));
        options.KnownIPNetworks.Add(new System.Net.IPNetwork(System.Net.IPAddress.Parse("fc00::"), 7));
    }

    // Bind additional trusted proxies from configuration or environment variables
    // (e.g., ForwardedHeaders__KnownProxies__0="10.0.0.1")
    var configuredProxies = builder.Configuration.GetSection("ForwardedHeaders:KnownProxies").Get<string[]>();
    if (configuredProxies != null)
    {
        foreach (var proxy in configuredProxies)
        {
            if (System.Net.IPAddress.TryParse(proxy, out var ip))
            {
                options.KnownProxies.Add(ip);
            }
        }
    }

    // Bind additional trusted CIDR networks from configuration or environment variables
    // (e.g., ForwardedHeaders__KnownNetworks__0="10.0.0.0/8")
    var configuredNetworks = builder.Configuration.GetSection("ForwardedHeaders:KnownNetworks").Get<string[]>();
    if (configuredNetworks != null)
    {
        foreach (var network in configuredNetworks)
        {
            if (System.Net.IPNetwork.TryParse(network, out var ipNetwork))
            {
                options.KnownIPNetworks.Add(ipNetwork);
            }
        }
    }
});

// Core MVC and Antiforgery services with secure cookie policy
builder.Services.AddControllersWithViews();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
});

// Production Health Checks endpoint
builder.Services.AddHealthChecks();

// Application services registration
builder.Services.AddSingleton<IRateLimitService, MemoryRateLimitService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IEducationService, EducationService>();
builder.Services.AddScoped<ISkillService, SkillService>();

// Contact Notification Services: supports local Gmail SMTP and hosted Resend REST API
builder.Services.AddHttpClient<ResendContactNotificationService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(15);
});
builder.Services.AddScoped<SmtpContactNotificationService>();
builder.Services.AddScoped<IContactNotificationService>(sp =>
{
    var options = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<ContactNotificationOptions>>().Value;
    if (string.Equals(options.Provider, "ResendApi", StringComparison.OrdinalIgnoreCase))
    {
        return sp.GetRequiredService<ResendContactNotificationService>();
    }
    return sp.GetRequiredService<SmtpContactNotificationService>();
});

builder.Services.AddScoped<IContactService, ContactService>();

// Database context configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase") 
    || builder.Environment.IsEnvironment("Testing");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (useInMemory)
    {
        options.UseInMemoryDatabase("PortfolioDb_Testing");
    }
    else
    {
        options.UseMySQL(connectionString ?? "Server=localhost;Port=3306;Database=portfolio_db;Uid=root;Pwd=;");
    }
});

var app = builder.Build();

// Forwarded headers from reverse proxies (Render, MonsterASP, Cloudflare, etc.)
app.UseForwardedHeaders();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    await next();
});

app.UseStatusCodePagesWithReExecute("/Home/NotFoundPage", "?statusCode={0}");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Health check endpoint for container orchestrators and cloud host monitors
app.MapHealthChecks("/health");

app.MapControllerRoute(
    name: "project-detail",
    pattern: "projects/{slug}",
    defaults: new { controller = "Projects", action = "Details" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

// Expose Program class for WebApplicationFactory in integration tests
public partial class Program { }
