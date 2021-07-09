using System.ComponentModel;

namespace AWTGen2.Settings.Browser
{
    public class WindowLocationOption
    {
        [Description("Should we randomize window's location in the screen")]
        public bool Random { get; set; }

        [Description("Random range for window's location when Random is true")]
        public int RandomRange { get; set; }
    }
}