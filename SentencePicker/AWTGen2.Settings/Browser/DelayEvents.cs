using System.ComponentModel;

namespace AWTGen2.Settings.Browser
{
    public class DelayEvents
    {
        [Description("Enable delay between events")]
        public bool Enabled { get; set; }

        [Description("Minimum value in milliseconds")]
        public int Minimum { get; set; }

        [Description("Maximun value in milliseconds")]
        public int Maximum { get; set; } = 100;
    }
}