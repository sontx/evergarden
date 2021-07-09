using System.ComponentModel;
using Blackcat.Configuration;

namespace AWTGen2.Settings.Browser
{
    [ConfigClass(Key = nameof(BrowserSettings))]
    public class BrowserSettings
    {
        [Category("Behavior")]
        [Description("Closes the browser after X checking times automatically, 0 means don't close it")]
        public int CloseAfterCycles { get; set; }

        [Category("Behavior")]
        [Description("What should we do when a proxy died")]
        public OnProxyDied OnProxyDied { get; set; }

        [Category("Behavior")]
        [Description("When will we change a proxy")]
        public ChangeProxyPolicy ChangeProxy { get; set; }

        [Description("Delay between key press events")]
        public DelayEvents TypingDelay { get; set; }

        [Description("Delay between typing other events, such as mouse, click, focus...")]
        public DelayEvents EventsDelay { get; set; }

        [Description("Sets browser's size")]
        public WindowSizeOptions WindowSize { get; set; }

        [Description("Sets browser's location")]
        public WindowLocationOption WindowLocation { get; set; }

        [Description("Timeout for navigating to an url, higher value for lower network connection")]
        public int NavigationTimeout { get; set; }

        [Description("Timeout for communicating with the extension")]
        public int CommunicationTimeout { get; set; }

        [Category("Common")]
        [Description("Sets browser name")]
        public string BrowserName { get; set; }

        [Category("Common")]
        [Description("Sets launch mode: 'OpenNew' means open new browser, 'Attached' means using current opened browser")]
        public LaunchMode LaunchMode { get; set; }

        [Category("Common")]
        [Description("Whether using different browser profile for each times opening new browser")]
        public bool IsolatedProfile { get; set; }

        [Category("Common")]
        [Description("Select extensions which will be loaded together with browser")]
        public BrowserExtensionOptions Extensions { get; set; }

        [Category("Optimization")]
        [Description("Don't loading media files such as images, video...")]
        public bool BlockMedia { get; set; }
    }
}