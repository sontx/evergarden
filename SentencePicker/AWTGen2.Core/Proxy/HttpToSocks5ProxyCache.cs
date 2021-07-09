using MihaZupan;
using System;
using System.Collections.Generic;

namespace AWTGen2.Core.Proxy
{
    /// <summary>
    /// Convert http proxy to socks proxy for using RestSharp
    /// </summary>
    public sealed class HttpToSocks5ProxyCache : IDisposable
    {
        private readonly Dictionary<ProxyBase, HttpToSocks5ProxyEx> _pool = new();
        private readonly object _lockDict = new();

        public HttpToSocks5Proxy Get(ProxyBase proxy)
        {
            lock (_lockDict)
            {
                if (!_pool.TryGetValue(proxy, out var httpToSocks5Proxy))
                {
                    httpToSocks5Proxy = new HttpToSocks5ProxyEx(proxy.Host, proxy.Port);
                    _pool.Add(proxy, httpToSocks5Proxy);
                }
                httpToSocks5Proxy.UsedCount++;
                return httpToSocks5Proxy;
            }
        }

        public void Remove(ProxyBase proxy)
        {
            lock (_lockDict)
            {
                DoRemove(proxy);
            }
        }

        private void DoRemove(ProxyBase proxy)
        {
            if (_pool.TryGetValue(proxy, out var httpToSocks5Proxy))
            {
                if (httpToSocks5Proxy.UsedCount == 0)
                {
                    httpToSocks5Proxy.StopInternalServer();
                    _pool.Remove(proxy);
                }
                else
                {
                    httpToSocks5Proxy.IsMarkedToRemove = true;
                }
            }
        }

        public void Clear(bool force = false)
        {
            lock (_lockDict)
            {
                if (force)
                {
                    foreach (var proxy in _pool.Values)
                    {
                        proxy.StopInternalServer();
                    }
                    _pool.Clear();
                }
                else
                {
                    var clonedProxies = new List<ProxyBase>(_pool.Keys);
                    foreach (var proxy in clonedProxies)
                    {
                        DoRemove(proxy);
                    }
                }
            }
        }

        public void PutBack(ProxyBase proxy)
        {
            lock (_lockDict)
            {
                if (_pool.TryGetValue(proxy, out var httpToSocks5Proxy) && httpToSocks5Proxy.UsedCount > 0)
                {
                    httpToSocks5Proxy.UsedCount--;
                    if (httpToSocks5Proxy.IsMarkedToRemove)
                    {
                        DoRemove(proxy);
                    }
                }
            }
        }

        public void Dispose()
        {
            Clear(true);
        }

        private class HttpToSocks5ProxyEx : HttpToSocks5Proxy
        {
            public int UsedCount { get; set; }
            public bool IsMarkedToRemove { get; set; }

            public HttpToSocks5ProxyEx(string socks5Hostname, int socks5Port)
                : base(socks5Hostname, socks5Port)
            {
            }
        }
    }
}