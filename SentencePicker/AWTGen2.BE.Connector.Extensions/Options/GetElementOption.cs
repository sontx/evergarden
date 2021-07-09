namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class GetElementOption : ElementOption
    {
        public int Timeout => TimeoutInMillis;
        public bool GetInnerText { get; set; }
        public bool GetInnerHtml { get; set; }
    }
}