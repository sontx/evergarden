namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class StartBlockingResourcesOption : OptionBase
    {
        /// <summary>
        /// Refer to <see cref="ResourceType"/>
        /// </summary>
        public string[] BlockedResources { get; set; }
    }

    public static class ResourceType
    {
        public static readonly string MainFrame = "main_frame";
        public static readonly string SubFrame = "sub_frame";
        public static readonly string StyleSheet = "stylesheet";
        public static readonly string Script = "script";
        public static readonly string Image = "image";
        public static readonly string Font = "font";
        public static readonly string Object = "object";
        public static readonly string XmlHttpRequest = "xmlhttprequest";
        public static readonly string Ping = "ping";
        public static readonly string CSPReport = "csp_report";
        public static readonly string Media = "media";
        public static readonly string WebSocket = "websocket";
        public static readonly string Other = "other";
    }
}