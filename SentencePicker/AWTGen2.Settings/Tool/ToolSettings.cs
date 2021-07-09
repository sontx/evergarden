using Blackcat.Configuration;
using System.Collections.Generic;
using System.ComponentModel;

namespace AWTGen2.Settings.Tool
{
    [ConfigClass(Key = nameof(ToolSettings))]
    public class ToolSettings
    {
        [Category("Process")]
        [Description("Parallel processing of workflows")]
        public int ProcessedInParallel { get; set; } = 1;

        [Category("Process")]
        [Description("Delay time in milliseconds for each request")]
        public int RequestDelay { get; set; }

        [Category("Network")]
        [Description("Connection timeout in milliseconds")]
        public int ConnectTimeout { get; set; } = 30000;

        [Category("Network")]
        [Description("Configure user-agent")]
        public UserAgentOptions UserAgent { get; set; } = new UserAgentOptions();

        [Category("Appearance")]
        [Description("Show the tool on top of all opened windows")]
        public bool TopMost { get; set; }

        [Category("Appearance")]
        [Description("When will we show notification")]
        public List<NotificationType> NotificationTypes { get; set; }

        [Browsable(false)]
        public string PluginId { get; set; }
        [Browsable(false)]
        public string PluginDir { get; set; }
    }
}