using System;
using System.Collections;

namespace AWTGen2.Core.Utils
{
    public static class Precondition
    {
        public static void ArgumentNotNull(object value, string name = null)
        {
            if (value == null)
            {
                if (!string.IsNullOrEmpty(name))
                    throw new ArgumentNullException(name);
                throw new ArgumentNullException();
            }
        }

        public static void ArgumentPositiveNumber(decimal value, string name = null)
        {
            if (value <= 0)
            {
                if (!string.IsNullOrEmpty(name))
                    throw new ArgumentException($"{name} <= 0");
                throw new ArgumentException("Value is <= 0");
            }
        }

        public static void ArgumentNotEmpty(object value, string name = null)
        {
            void DoThrow()
            {
                if (!string.IsNullOrEmpty(name))
                    throw new ArgumentNullException(name);
                throw new ArgumentNullException();
            }

            if (value == null)
            {
                DoThrow();
            }

            if (value is IEnumerable list)
            {
                if (!list.GetEnumerator().MoveNext())
                    DoThrow();
            }
        }
    }
}