using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Data;
using Xunit;

namespace Portfolio.Tests;

public class DatabaseConfigurationSafetyTests
{
    private static IServiceCollection CreateBaseServices(Dictionary<string, string?> configurationValues, bool isTestingEnvironment)
    {
        var services = new ServiceCollection();

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configurationValues)
            .Build();

        services.AddSingleton(configuration);

        var useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase") || isTestingEnvironment;

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (useInMemory)
            {
                options.UseInMemoryDatabase("PortfolioDb_Testing");
            }
            else
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    throw new InvalidOperationException(
                        "A database connection string 'ConnectionStrings:DefaultConnection' must be configured. " +
                        "For local development, configure it using .NET User Secrets: " +
                        "dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" \"Server=localhost;Port=3306;Database=portfolio_db;Uid=portfolio_user;Pwd=<password>;\". " +
                        "For production, configure the environment variable 'ConnectionStrings__DefaultConnection'.");
                }

                options.UseMySQL(connectionString);
            }
        });

        return services;
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void ConfigureDbContext_OutsideTesting_WhenConnectionStringMissingOrWhitespace_ThrowsActionableException(string? missingConnection)
    {
        // Arrange: Production / Development simulation outside Testing environment
        var config = new Dictionary<string, string?>
        {
            { "UseInMemoryDatabase", "false" },
            { "ConnectionStrings:DefaultConnection", missingConnection }
        };

        var services = CreateBaseServices(config, isTestingEnvironment: false);
        var provider = services.BuildServiceProvider();

        // Act & Assert: Resolving DbContext must fail with an informative, actionable exception
        var ex = Assert.Throws<InvalidOperationException>(() =>
        {
            using var scope = provider.CreateScope();
            _ = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        });

        Assert.Contains("ConnectionStrings:DefaultConnection", ex.Message);
        Assert.Contains(".NET User Secrets", ex.Message);
        Assert.Contains("portfolio_user", ex.Message);
        Assert.Contains("ConnectionStrings__DefaultConnection", ex.Message);
        
        // Critical safety verification: No fallback to root or empty password
        Assert.DoesNotContain("root", ex.Message, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("Pwd=;", ex.Message);
    }

    [Fact]
    public void ConfigureDbContext_OutsideTesting_WhenValidConnectionStringProvided_DoesNotThrowMissingConfigException()
    {
        // Arrange: Valid connection string provided via configuration (User Secrets or env var)
        var config = new Dictionary<string, string?>
        {
            { "UseInMemoryDatabase", "false" },
            { "ConnectionStrings:DefaultConnection", "Server=localhost;Port=3306;Database=portfolio_db;Uid=portfolio_user;Pwd=ValidPassword123!;" }
        };

        var services = CreateBaseServices(config, isTestingEnvironment: false);
        var provider = services.BuildServiceProvider();

        // Act: Resolving DbContext should configure options without throwing InvalidOperationException
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        Assert.NotNull(context);
        Assert.Contains("MySQL", context.Database.ProviderName, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ConfigureDbContext_WhenTestingEnvironment_UsesInMemoryDatabaseWithoutConnectionString()
    {
        // Arrange: Testing environment with no connection string configured
        var config = new Dictionary<string, string?>
        {
            { "UseInMemoryDatabase", "false" },
            { "ConnectionStrings:DefaultConnection", "" }
        };

        var services = CreateBaseServices(config, isTestingEnvironment: true);
        var provider = services.BuildServiceProvider();

        // Act & Assert: In Testing environment, in-memory DB is used cleanly without exceptions
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        Assert.NotNull(context);
        Assert.True(context.Database.IsInMemory());
    }
}
