using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace AWTGen2.Settings.Proxy
{
    public class ProxyOptions
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        public override string ToString()
        {
            var temp = new List<string>(2);
            if (!string.IsNullOrEmpty(UserName))
                temp.Add(UserName);
            if (!string.IsNullOrEmpty(Password))
                temp.Add(Password);

            var cred = string.Join("|", temp);

            return !string.IsNullOrEmpty(cred)
                ? $"{Host}:{Port}|{cred}"
                : $"{Host}:{Port}";
        }

        public static ProxyOptions Parse(string st)
        {
            if (string.IsNullOrWhiteSpace(st))
                return null;

            var proxy = GetAnonymousProxy(st);
            if (proxy == null)
                return null;

            var parts = proxy.Split(':');

            if (!int.TryParse(parts[1], out var port) || port <= 0)
                return null;

            var partsEx = st.Split('|');
            return new ProxyOptions
            {
                Host = parts[0].Trim(),
                Port = port,
                UserName = partsEx.Length > 1 ? partsEx[1].Trim() : null,
                Password = partsEx.Length > 2 ? partsEx[2].Trim() : null
            };
        }

        private static string GetAnonymousProxy(string st)
        {
            var regex = new Regex(@"\d*\.\d*\.\d*\.\d*\:\d+");
            var matches = regex.Matches(st);
            return matches.Count > 0 ? matches[0].Value : null;
        }
    }
}