namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class ClickOption : ElementEventsOption
    {
        public ClickButton Button { get; set; }
        public ClickType ClickType { get; set; }
        public bool UseScreenCoords { get; set; }
        public bool CtrlOn { get; set; }
        public bool AltOn { get; set; }
        public bool ShiftOn { get; set; }
        public bool Wait { get; set; } = true;
    }

    public enum ClickButton
    {
        Left,
        Middle,
        Right,
        BrowserBack,
        BrowserForward
    }

    public enum ClickType
    {
        Single,
        Double,
        Hover,
        Down,
        Up
    }
}