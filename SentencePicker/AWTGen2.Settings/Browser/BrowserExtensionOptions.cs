using System.Collections.Generic;
using System.ComponentModel;

namespace AWTGen2.Settings.Browser
{
    public class BrowserExtensionOptions
    {
        [Description("Whether to load enabled extensions from the list when launching a new browser")]
        public bool Enabled { get; set; }

        [Description("All supported browser extensions")]
        public List<BrowserExtension> Extensions { get; set; }
    }
}