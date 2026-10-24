using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Portfolio.Data;
using Portfolio.Options;
using Portfolio.Services;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddScoped<IContactNotificationService, SmtpContactNotificationService>();
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
