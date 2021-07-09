using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AWTGen2.Core.Proxy
{
    public class ProxyPool : IDisposable
    {
        private readonly Dictionary<ProxyBase, State> _proxyDict = new();
        private readonly SemaphoreSlim _semaphoreSlim = new(1);
        private readonly object _lockObj = new();

        public void Set(IEnumerable<ProxyBase> proxies)
        {
            if (proxies == null)
            {
                return;
            }

            lock (_lockObj)
            {
                _proxyDict.Clear();
                foreach (var proxy in proxies)
                {
                    _proxyDict.Add(proxy, State.Ready);
                }
            }
        }

        public void Set(ProxyBase proxy, State state)
        {
            if (proxy == null)
                return;

            lock (_lockObj)
            {
                if (_proxyDict.ContainsKey(proxy))
                    _proxyDict[proxy] = state;
            }
        }

        public Dictionary<ProxyBase, State> GetAll()
        {
            lock (_lockObj)
            {
                return new Dictionary<ProxyBase, State>(_proxyDict);
            }
        }

        public async Task<ProxyBase> GetAsync(CancellationToken token)
        {
            await _semaphoreSlim.WaitAsync(token);

            try
            {
                while (true)
                {
                    var proxy = DoGet();
                    if (proxy != null)
                        return proxy;

                    token.ThrowIfCancellationRequested();
                    await Task.Delay(100, token);
                }
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        public bool AreAllDeath()
        {
            lock (_lockObj)
            {
                return _proxyDict.All(pair => pair.Value == State.Died);
            }
        }

        private ProxyBase DoGet()
        {
            lock (_lockObj)
            {
                foreach (var pair in _proxyDict)
                {
                    if (pair.Value == State.Ready)
                    {
                        _proxyDict[pair.Key] = State.Used;
                        return pair.Key;
                    }
                }
            }

            return null;
        }

        public enum State
        {
            Ready,
            Used,
            Died
        }

        public void Dispose()
        {
            _semaphoreSlim?.Dispose();
        }
    }
}