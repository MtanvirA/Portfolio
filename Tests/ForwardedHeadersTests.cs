using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Portfolio.Services;
using Xunit;

namespace Portfolio.Tests;

public class ForwardedHeadersTests
{
    private static ForwardedHeadersMiddleware CreateMiddleware(
        ForwardedHeadersOptions options,
        RequestDelegate? next = null)
    {
        next ??= (context) => Task.CompletedTask;
        return new ForwardedHeadersMiddleware(
            next,
            NullLoggerFactory.Instance,
            Microsoft.Extensions.Options.Options.Create(options));
    }

    private static ForwardedHeadersOptions CreateDefaultHardenedOptions()
    {
        var options = new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
            ForwardLimit = 1
        };
        // In ASP.NET Core, loopback addresses (127.0.0.1 and ::1) are trusted by default.
        return options;
    }

    [Fact]
    public async Task UntrustedRemoteClient_SpoofedXForwardedFor_IsIgnoredAndRemoteIpPreserved()
    {
        // Arrange
        var options = CreateDefaultHardenedOptions();
        var middleware = CreateMiddleware(options);

        var context = new DefaultHttpContext();
        var untrustedRemoteIp = IPAddress.Parse("198.51.100.55");
        context.Connection.RemoteIpAddress = untrustedRemoteIp;
        context.Request.Headers["X-Forwarded-For"] = "10.0.0.1";
        context.Request.Headers["X-Forwarded-Proto"] = "https";
        context.Request.Scheme = "http";

        // Act
        await middleware.Invoke(context);

        // Assert: The untrusted remote client's spoofed headers are ignored.
        Assert.Equal(untrustedRemoteIp, context.Connection.RemoteIpAddress);
        Assert.Equal("http", context.Request.Scheme);
    }

    [Fact]
    public async Task TrustedLoopbackProxy_ValidForwardedHeaders_AreApplied()
    {
        // Arrange: Connection originates from trusted loopback reverse proxy (127.0.0.1)
        var options = CreateDefaultHardenedOptions();
        var middleware = CreateMiddleware(options);

        var context = new DefaultHttpContext();
        context.Connection.RemoteIpAddress = IPAddress.Loopback;
        context.Request.Headers["X-Forwarded-For"] = "203.0.113.195";
        context.Request.Headers["X-Forwarded-Proto"] = "https";
        context.Request.Scheme = "http";

        // Act
        await middleware.Invoke(context);

        // Assert: Forwarded headers from trusted proxy are safely unpacked
        Assert.Equal(IPAddress.Parse("203.0.113.195"), context.Connection.RemoteIpAddress);
        Assert.Equal("https", context.Request.Scheme);
    }

    [Fact]
    public async Task ConfiguredTrustedNetwork_AcceptsForwardedHeadersFromWithinRange()
    {
        // Arrange: Explicitly configured private CIDR network (e.g. Docker bridge or internal ALB)
        var options = CreateDefaultHardenedOptions();
        options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse("10.0.0.0/8"));
        var middleware = CreateMiddleware(options);

        var context = new DefaultHttpContext();
        context.Connection.RemoteIpAddress = IPAddress.Parse("10.1.2.3");
        context.Request.Headers["X-Forwarded-For"] = "203.0.113.88";
        context.Request.Headers["X-Forwarded-Proto"] = "https";
        context.Request.Scheme = "http";

        // Act
        await middleware.Invoke(context);

        // Assert: Proxy within trusted CIDR network is accepted
        Assert.Equal(IPAddress.Parse("203.0.113.88"), context.Connection.RemoteIpAddress);
        Assert.Equal("https", context.Request.Scheme);
    }

    [Fact]
    public async Task RateLimiter_ProtectsAgainstSpoofedForwardedForFromUntrustedClients()
    {
        // Arrange
        var options = CreateDefaultHardenedOptions();
        var middleware = CreateMiddleware(options);
        var rateLimiter = new MemoryRateLimitService();

        var untrustedClientIp = IPAddress.Parse("198.51.100.99");

        // Act: Simulate an attacker sending 4 requests from the same physical IP
        // but attempting to bypass rate limits by supplying a different X-Forwarded-For header each time.
        var allowedResults = new List<bool>();

        for (int i = 1; i <= 4; i++)
        {
            var context = new DefaultHttpContext();
            context.Connection.RemoteIpAddress = untrustedClientIp;
            context.Request.Headers["X-Forwarded-For"] = $"10.0.0.{i}"; // Attacker cycles spoofed IP

            await middleware.Invoke(context);

            var effectiveIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var isAllowed = rateLimiter.IsAllowed(effectiveIp, maxRequests: 3, TimeSpan.FromMinutes(5));
            allowedResults.Add(isAllowed);
        }

        // Assert: The first 3 requests are allowed, and the 4th is blocked despite spoofed X-Forwarded-For
        Assert.True(allowedResults[0]);
        Assert.True(allowedResults[1]);
        Assert.True(allowedResults[2]);
        Assert.False(allowedResults[3], "4th request from untrusted IP must be blocked; spoofed X-Forwarded-For must not bypass rate limit.");
    }
}
