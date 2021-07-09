using System.Collections.Generic;
using System.ComponentModel;

namespace AWTGen2.Settings.Tool
{
    public class UserAgentOptions
    {
        [Description("Default: uses default standard user-agent, Custom: uses custom user-agent, Random: uses random user-agent")]
        public UserAgentMode Mode { get; set; }

        [Description("Custom user-agent, will be used if Mode is Custom")]
        public string CustomUserAgent { get; set; }

        [Description("Add or remove supported user-agents, this list will be used to get random user-agent in Random mode")]
        public List<UserAgent> SupportedList { get; set; }

        [Browsable(false)]
        public UserAgent SelectedUserAgent { get; set; }

        public override string ToString()
        {
            return Mode.ToString();
        }
    }
}