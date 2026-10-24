using Portfolio.Services;
using Xunit;

namespace Portfolio.Tests;

public class RateLimitServiceTests
{
    [Fact]
    public void IsAllowed_WithinThreshold_ReturnsTrue()
    {
        var limiter = new MemoryRateLimitService();
        var ip = "192.168.1.100";

        Assert.True(limiter.IsAllowed(ip, maxRequests: 3, TimeSpan.FromMinutes(1)));
        Assert.True(limiter.IsAllowed(ip, maxRequests: 3, TimeSpan.FromMinutes(1)));
        Assert.True(limiter.IsAllowed(ip, maxRequests: 3, TimeSpan.FromMinutes(1)));
    }

    [Fact]
    public void IsAllowed_ExceedingThreshold_ReturnsFalse()
    {
        var limiter = new MemoryRateLimitService();
        var ip = "192.168.1.101";

        Assert.True(limiter.IsAllowed(ip, maxRequests: 2, TimeSpan.FromMinutes(1)));
        Assert.True(limiter.IsAllowed(ip, maxRequests: 2, TimeSpan.FromMinutes(1)));
        Assert.False(limiter.IsAllowed(ip, maxRequests: 2, TimeSpan.FromMinutes(1)));
    }

    [Fact]
    public void IsAllowed_NullIp_HandledGracefully()
    {
        var limiter = new MemoryRateLimitService();

        Assert.True(limiter.IsAllowed(string.Empty, maxRequests: 5, TimeSpan.FromMinutes(1)));
    }
}
