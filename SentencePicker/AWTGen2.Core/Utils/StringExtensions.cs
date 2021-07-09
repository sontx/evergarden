﻿using System.Text.RegularExpressions;

namespace AWTGen2.Core.Utils
{
    public static class StringExtensions
    {
        public static string ToStringOrEmpty(this object value)
        {
            return string.Concat(value, "");
        }

        /// <summary>
        /// Converts a string from CamelCase to a human readable format.
        /// Inserts spaces between upper and lower case letters.
        /// Also strips the leading "_" character, if it exists.
        /// </summary>
        /// <remarks>
        /// Source: https://amystechnotes.com/2013/08/05/c-tips-n-tricks-adding-a-from-camel-case-string-extension-method/
        /// </remarks>
        /// <param name="propertyName"></param>
        /// <returns>A human readable string.</returns>
        public static string FromCamelCase(this string propertyName)
        {
            string returnValue = null;
            returnValue = propertyName.ToStringOrEmpty();

            //Strip leading "_" character
            returnValue = Regex.Replace(returnValue, "^_", "").Trim();
            //Add a space between each lower case character and upper case character
            returnValue = Regex.Replace(returnValue, "([a-z])([A-Z])", "$1 $2").Trim();
            //Add a space between 2 upper case characters when the second one is followed by a lower space character
            returnValue = Regex.Replace(returnValue, "([A-Z])([A-Z][a-z])", "$1 $2").Trim();

            return returnValue;
        }

        public static string RemoveNewLines(this string st)
        {
            return st != null ? Regex.Replace(st, @"\t|\n|\r", "").Trim() : null;
        }

        public static bool IsValidNumber(this string st)
        {
            return !string.IsNullOrWhiteSpace(st) && ulong.TryParse(st, out _);
        }
    }
}