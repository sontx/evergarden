using System.Collections.Generic;
using Blackcat.Configuration;

namespace AWTGen2.Settings.Proxy
{
    [ConfigClass(Key = nameof(ProxySettings))]
    public class ProxySettings
    {
        /// <summary>
        /// Should be one of: Direct, Auto Detect, System and Fixed Server.
        /// </summary>
        public ProxyProviderType ProviderType { get; set; }

        /// <summary>
        /// It works when <see cref="ProviderType"/> is Fixed Server, should be one of: Socks5, Socks4, Http, Https...
        /// </summary>
        public ProxyType ProxyType { get; set; }

        /// <summary>
        /// It works when <see cref="ProxyType"/> is Socks5, Socks4, Http, Https and Quic
        /// </summary>
        public List<ProxyOptions> Proxies { get; set; }

        /// <summary>
        /// Options for Luminati in case <see cref="ProxyType"/> is Luminati
        /// </summary>
        public LuminatiOptions Luminati { get; set; }
    }
}