using System;

namespace AWTGen2.Core.Proxy
{
    public class ProxyDiedException : Exception
    {
        public ProxyDiedException()
        {
        }

        public ProxyDiedException(string msg) : base(msg)
        {
        }

        public ProxyDiedException(string msg, Exception innerException) : base(msg, innerException)
        {
        }
    }
}