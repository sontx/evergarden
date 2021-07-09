using AWTGen2.BE.Connector.Extensions.Options;
using System;

namespace AWTGen2.BE.Connector.Extensions.WaitOptions
{
    public class WaitAttributeOption : ElementOption
    {
        public string Name { get; set; }
        public Func<string, bool> Condition { get; set; }
    }
}