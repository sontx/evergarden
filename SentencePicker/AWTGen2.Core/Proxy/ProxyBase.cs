namespace AWTGen2.Core.Proxy
{
    public abstract class ProxyBase
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        public bool NeedAuthenticate()
        {
            return !string.IsNullOrEmpty(UserName);
        }

        public override string ToString()
        {
            return $"{Host}:{Port}";
        }
    }
}