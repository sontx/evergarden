namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class SelectItemsOption : ElementEventsOption
    {
        public object[] SelectedItems { get; set; }
        public SelectBy SelectBy { get; set; }
        public bool Reset { get; set; }
        public bool SimulateClick { get; set; }
    }

    public enum SelectBy
    {
        ByIndex,
        ByValue,
        ByText
    }
}