using System;

namespace AWTGen2.Settings.Tool
{
    public class UserAgent
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public bool IsMobile { get; set; }

        public override string ToString()
        {
            return Name;
        }

        public static UserAgent Parse(string line)
        {
            var parts = line.Split(new[] { '|' }, 3, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length != 3)
                throw new FormatException("Wrong UserAgent format, it should be 'name|isMobile|value'");

            return new UserAgent
            {
                Name = parts[0].Trim(),
                IsMobile = bool.Parse(parts[1]),
                Value = parts[2].Trim('\r', '\n')
            };
        }
    }
}