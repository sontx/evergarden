using AWTGen2.Settings.Proxy;
using AWTGen2.Settings.Tool;

namespace AWTGen2.Core
{
    public static class ContextExtensions
    {
        private static readonly string ToolSettingsKey = nameof(ToolSettingsKey);
        private static readonly string ProxySettingsKey = nameof(ProxySettingsKey);
        private static readonly string NotifyCompletedKey = nameof(NotifyCompletedKey);

        public static void SetToolSettings(this Context context, ToolSettings settings)
        {
            context.SetProperty(ToolSettingsKey, settings);
        }

        public static ToolSettings GetToolSettings(this Context context)
        {
            return context.GetProperty<ToolSettings>(ProxySettingsKey);
        }

        public static void SetProxySettings(this Context context, ProxySettings settings)
        {
            context.SetProperty(ProxySettingsKey, settings);
        }

        public static ProxySettings GetProxySettings(this Context context)
        {
            return context.GetProperty<ProxySettings>(ProxySettingsKey);
        }
    }
}