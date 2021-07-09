using System.ComponentModel;

namespace AWTGen2.Settings.Browser
{
    public class WindowSizeOptions
    {
        [Description("Select window's size mode")]
        public WindowSizeMode Mode { get; set; }

        [Category("Window size")]
        [Description("Window width")]
        public int Width { get; set; } = 500;

        [Category("Window size")]
        [Description("Window height")]
        public int Height { get; set; } = 800;

        [Description("Random range for both width and height when Mode is Random")]
        public int RandomRange { get; set; }
    }
}