using System;
using System.Text;

namespace AWTGen2.Core.Utils
{
    public static class StringEncoder
    {
        public static string Encode(string st)
        {
            return string.IsNullOrEmpty(st) ? st : Convert.ToBase64String(Encoding.UTF8.GetBytes(st));
        }

        public static string Decode(string st)
        {
            return string.IsNullOrEmpty(st) ? st : Encoding.UTF8.GetString(Convert.FromBase64String(st));
        }
    }
}