using System.Collections.Concurrent;

namespace Portfolio.Services;

public interface IRateLimitService
{
    bool IsAllowed(string clientIp, int maxRequests = 5, TimeSpan? window = null);
}

public class MemoryRateLimitService : IRateLimitService
{
    private readonly ConcurrentDictionary<string, List<DateTime>> _requestTracker = new();
    private static readonly TimeSpan DefaultWindow = TimeSpan.FromMinutes(5);

    public bool IsAllowed(string clientIp, int maxRequests = 5, TimeSpan? window = null)
    {
        if (string.IsNullOrWhiteSpace(clientIp))
        {
            clientIp = "unknown-client";
        }

        var cutoff = DateTime.UtcNow - (window ?? DefaultWindow);
        var timestamps = _requestTracker.GetOrAdd(clientIp, _ => new List<DateTime>());

        lock (timestamps)
        {
            timestamps.RemoveAll(t => t < cutoff);
            if (timestamps.Count >= maxRequests)
            {
                return false;
            }

            timestamps.Add(DateTime.UtcNow);
            return true;
        }
    }
}
