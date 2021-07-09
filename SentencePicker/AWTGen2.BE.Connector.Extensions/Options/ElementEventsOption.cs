namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class ElementEventsOption : ElementOption
    {
        /// <summary>
        /// It can be:
        /// <para>- An integer represents delay time in milliseconds</para>
        /// <para>- An array which contains two elements, represents delay time in milliseconds will be randomized from the first element to the second</para>
        /// </summary>
        public object DelayBetweenEvents { get; set; }
    }
}