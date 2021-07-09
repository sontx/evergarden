using AWTGen2.BE.Connector.Extensions.Options;
using AWTGen2.BE.Connector.Extensions.WaitOptions;
using AWTGen2.BE.Core.Data;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector.Extensions
{
    public static class WaitBrowserExtensions
    {
        public static Task<bool> WaitPageLoadedAsync(this BrowserConnector connector, WaitPageLoadedOption option)
        {
            var getTabInfoOption = option.Clone<GetTabInfoOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var tabInfo = await connector.GetTabInfoAsync(WaitTaskHelper.ConfigOption(getTabInfoOption, timeout)).ConfigureAwait(false);
                return tabInfo.ReadyState == ReadyState.Complete;
            }, option.TimeoutInMillis);
        }

        public static async Task<bool> WaitNavigateToAsync(this BrowserConnector connector, WaitNavigateToOption option)
        {
            var previousPageSession = connector.PreviousPageSession;
            var getTabInfoOption = option.Clone<GetTabInfoOption>();

            var result = await WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var tabInfo = await connector.GetTabInfoAsync(WaitTaskHelper.ConfigOption(getTabInfoOption, timeout)).ConfigureAwait(false);
                return tabInfo.PageSession != previousPageSession && !string.IsNullOrEmpty(tabInfo.PageSession) &&
                       tabInfo.ReadyState == ReadyState.Complete;
            }, option.TimeoutInMillis).ConfigureAwait(false);

            if (result)
            {
                connector.RefreshPageSessionInternal();
            }

            return result;
        }

        public static Task<bool> WaitTitleAsync(this BrowserConnector connector, WaitTitleOption option)
        {
            var getTabInfoOption = option.Clone<GetTabInfoOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var tabInfo = await connector.GetTabInfoAsync(WaitTaskHelper.ConfigOption(getTabInfoOption, timeout)).ConfigureAwait(false);
                return option.Condition?.Invoke(tabInfo.Title) ?? false;
            }, option.TimeoutInMillis);
        }

        public static Task<bool> WaitUrlAsync(this BrowserConnector connector, WaitUrlOption option)
        {
            var getTabInfoOption = option.Clone<GetTabInfoOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                var tabInfo = await connector.GetTabInfoAsync(WaitTaskHelper.ConfigOption(getTabInfoOption, timeout)).ConfigureAwait(false);
                return option.Condition?.Invoke(tabInfo.Url) ?? false;
            }, option.TimeoutInMillis);
        }

        public static Task<bool> WaitExpressionAsync(this BrowserConnector connector, WaitExpressionOption option)
        {
            var injectScriptOption = option.Clone<InjectScriptOption>();
            injectScriptOption.Code = $"!!eval(\"{option.Expression?.Replace("\"", "\\\"")}\")";
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                injectScriptOption = WaitTaskHelper.ConfigOption(injectScriptOption, timeout);
                var result = await connector.InjectScriptAsync<bool>(injectScriptOption).ConfigureAwait(false);
                return result;
            }, option.TimeoutInMillis);
        }

        public static Task<bool> WaitFunctionAsync(this BrowserConnector connector, WaitFunctionOption option)
        {
            var injectFunctionOption = option.Clone<InjectFunctionOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                injectFunctionOption = WaitTaskHelper.ConfigOption(injectFunctionOption, timeout);
                var result = await connector.InjectFunctionAsync<bool>(injectFunctionOption).ConfigureAwait(false);
                return result;
            }, option.TimeoutInMillis);
        }

        public static Task<bool> WaitAsyncFunctionAsync(this BrowserConnector connector, WaitFunctionOption option)
        {
            var injectFunctionOption = option.Clone<InjectFunctionOption>();
            return WaitTaskHelper.WaitTaskAsync(async timeout =>
            {
                injectFunctionOption = WaitTaskHelper.ConfigOption(injectFunctionOption, timeout);
                var result = await connector.InjectAsyncFunctionAsync<bool>(injectFunctionOption).ConfigureAwait(false);
                return result;
            }, option.TimeoutInMillis);
        }
    }
}