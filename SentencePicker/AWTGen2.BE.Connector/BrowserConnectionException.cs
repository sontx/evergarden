using System;

namespace AWTGen2.BE.Connector
{
    public class BrowserConnectionException : Exception
    {
        public BrowserConnectionException()
        {
        }

        public BrowserConnectionException(string msg) : base(msg)
        {
        }

        public BrowserConnectionException(string msg, Exception innerException) : base(msg, innerException)
        {
        }
    }
}