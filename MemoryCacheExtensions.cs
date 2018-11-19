using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Fetched.Business.Extensions
{
    /// <summary>
    /// Cache Extensions for ensuring that the cache population method is called only once
    /// when caching its output.
    /// </summary>
    public static class MemoryCacheExtensions
    {
        /// <summary>
        /// Gets an item from the cache. If the item does not exist, the value factory delegate
        /// is called and its output is cached in a thread safe way.
        /// </summary>
        /// <typeparam name="TItem">The type of the item.</typeparam>
        /// <param name="cache">The cache.</param>
        /// <param name="key">The key.</param>
        /// <param name="factory">The factory.</param>
        /// <returns>The cached item.</returns>
        public static TItem GetOrCreateExclusive<TItem>(this IMemoryCache cache, object key, Func<ICacheEntry, TItem> factory)
        {
            if (!cache.TryGetValue(key, out object result))
            {
                SemaphoreSlim exclusiveLock;

                lock (cache)
                {
                    exclusiveLock = cache.GetOrCreate(key + "__exclusive__", entry =>
                    {
                        entry.Priority = CacheItemPriority.NeverRemove;
                        return new SemaphoreSlim(1);
                    });
                }

                exclusiveLock.Wait();

                try
                {
                    if (cache.TryGetValue(key, out result))
                    {
                        return (TItem)result;
                    }

                    ICacheEntry entry = cache.CreateEntry(key);
                    result = factory(entry);
                    entry.SetValue(result);
                    entry.Dispose();
                }
                finally
                {
                    exclusiveLock.Release();
                }
            }

            return (TItem)result;
        }

        /// <summary>
        /// Gets an item from the cache. If the item does not exist, the value factory delegate
        /// is called and its output is cached in a thread safe way.
        /// </summary>
        /// <typeparam name="TItem">The type of the item.</typeparam>
        /// <param name="cache">The cache.</param>
        /// <param name="key">The key.</param>
        /// <param name="factory">The factory.</param>
        /// <returns>The cached item.</returns>
        public static async Task<TItem> GetOrCreateExclusiveAsync<TItem>(this IMemoryCache cache, object key, Func<ICacheEntry, Task<TItem>> factory)
        {
            if (!cache.TryGetValue(key, out TItem result))
            {
                SemaphoreSlim exclusiveLock;

                lock (cache)
                {
                    exclusiveLock = cache.GetOrCreate(key + "__exclusive__", entry =>
                    {
                        entry.Priority = CacheItemPriority.NeverRemove;
                        return new SemaphoreSlim(1);
                    });
                }

                await exclusiveLock.WaitAsync();

                try
                {
                    if (cache.TryGetValue(key, out result))
                    {
                        return result;
                    }

                    ICacheEntry entry = cache.CreateEntry(key);
                    result = await factory(entry); //.ConfigureAwait(false);
                    entry.SetValue(result);
                    entry.Dispose();
                }
                finally
                {
                    exclusiveLock.Release();
                }
            }

            return result;
        }
    }
}
