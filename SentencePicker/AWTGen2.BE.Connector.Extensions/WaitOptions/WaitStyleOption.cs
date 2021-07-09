using AWTGen2.BE.Connector.Extensions.Options;
using System;
using System.Collections.Generic;

namespace AWTGen2.BE.Connector.Extensions.WaitOptions
{
    public class WaitStyleOption : ElementOption
    {
        public string[] Names { get; set; }
        public Func<Dictionary<string, object>, bool> Condition { get; set; }
    }
}