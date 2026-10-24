using Microsoft.EntityFrameworkCore;
using Portfolio.Data;
using Portfolio.Options;
using Portfolio.Services;

var builder = WebApplication.CreateBuilder(args);

// Options configuration
builder.Services.Configure<PortfolioOptions>(
    builder.Configuration.GetSection(PortfolioOptions.SectionName));

// Core MVC services
builder.Services.AddControllersWithViews();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});

// Application services registration
builder.Services.AddSingleton<IRateLimitService, MemoryRateLimitService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IEducationService, EducationService>();
builder.Services.AddScoped<ISkillService, SkillService>();
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
