using AWTGen2.BE.Connector.Extensions.Options;
using System;

namespace AWTGen2.BE.Connector.Extensions.WaitOptions
{
    public class WaitUrlOption : TabBasedOption
    {
        public Func<string, bool> Condition { get; set; }
    }
}