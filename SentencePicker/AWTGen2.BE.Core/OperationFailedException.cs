using System;

namespace AWTGen2.BE.Core
{
    public class OperationFailedException : Exception
    {
        public OperationFailedException()
        {
        }

        public OperationFailedException(string msg) : base(msg)
        {
        }

        public OperationFailedException(string msg, Exception innerException) : base(msg, innerException)
        {
        }
    }
}