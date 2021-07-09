using AWTGen2.BE.Connector.Extensions.Options;
using AWTGen2.BE.Connector.Extensions.WaitOptions;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector.Extensions
{
    public static class WaitElementExtensions
    {
        public static Task<bool> WaitVisibilityAsync(this BrowserConnector connector, WaitVisibilityOption option)
        {
            var getVisibilityOption = option.Clone<GetVisibilityOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var visible = await connector.GetVisibilityAsync(WaitTaskHelper.ConfigOption(getVisibilityOption, timeout)).ConfigureAwait(false);
                return option.WaitVisible ? visible : !visible;
            }, option.TimeoutInMillis);
        }

        public static Task<bool> WaitAttributeAsync(this BrowserConnector connector, WaitAttributeOption option)
        {
            var getAttributeOption = option.Clone<GetAttributeOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var attribute = await connector.GetAttributeAsync(WaitTaskHelper.ConfigOption(getAttributeOption, timeout)).ConfigureAwait(false);
                return option.Condition?.Invoke(attribute) ?? false;
            }, option.TimeoutInMillis);
        }

        public static Task<bool> WaitStyleAsync(this BrowserConnector connector, WaitStyleOption option)
        {
            var getElementStyleOption = option.Clone<GetElementStyleOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var styles = await connector.GetElementStyleAsync(WaitTaskHelper.ConfigOption(getElementStyleOption, timeout)).ConfigureAwait(false);
                return option.Condition?.Invoke(styles) ?? false;
            }, option.TimeoutInMillis);
        }
    }
}