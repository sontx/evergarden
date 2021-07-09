using System;
using System.Linq;

namespace AWTGen2.Core.Utils
{
    public static class ExceptionUtils
    {
        public static Exception LookupRootException(this Exception ex)
        {
            if (ex.InnerException != null)
                return LookupRootException(ex.InnerException);
            return ex;
        }

        public static bool HasException(this AggregateException ex, Type exceptionType)
        {
            if (ex.InnerException != null && ex.InnerException.GetType() == exceptionType)
            {
                return true;
            }

            return ex.InnerExceptions.Any(item =>
            {
                if (item.GetType() == typeof(AggregateException))
                    return HasException(item as AggregateException, exceptionType);
                return item.GetType() == exceptionType || HasInnerException(ex, exceptionType);
            });
        }

        private static bool HasInnerException(Exception ex, Type exceptionType)
        {
            if (ex.InnerException == null)
                return false;

            return ex.InnerException.GetType() == exceptionType || HasInnerException(ex.InnerException, exceptionType);
        }
    }
}