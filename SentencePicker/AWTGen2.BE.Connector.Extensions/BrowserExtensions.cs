using AWTGen2.BE.Connector.Extensions.Options;
using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using AWTGen2.BE.Core.Utils;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector.Extensions
{
    public static class BrowserExtensions
    {
        public static async Task<BrowserTab> GetCurrentTabAsync(this BrowserConnector connector, GetCurrentTabOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetCurrentTab, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, CommonConverter.Parse<BrowserTab>, option.ThrowIfFailed);
        }

        public static async Task<BrowserTabInfo> GetTabInfoAsync(this BrowserConnector connector, GetTabInfoOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetTabInfo, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, CommonConverter.Parse<BrowserTabInfo>, option.ThrowIfFailed);
        }

        public static async Task<T> InjectScriptAsync<T>(this BrowserConnector connector, InjectScriptOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.InjectScript, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, ResultHelper.ExtractInjectScriptResult<T>, option.ThrowIfFailed);
        }

        public static async Task<T> InjectFunctionAsync<T>(this BrowserConnector connector, InjectFunctionOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.InjectFunction, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, ResultHelper.ExtractInjectScriptResult<T>, option.ThrowIfFailed);
        }

        public static async Task<T> InjectAsyncFunctionAsync<T>(this BrowserConnector connector, InjectFunctionOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.InjectAsyncFunction, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, ResultHelper.ExtractInjectScriptResult<T>, option.ThrowIfFailed);
        }

        public static Task CloseAllTabsAsync(this BrowserConnector connector, CloseAllTabsOption option)
        {
            return connector.CallFunctionAsync<JObject>(SupportedFunctions.CloseAllTabs, option, 1, false);
        }

        public static async Task<bool> NavigateToAsync(this BrowserConnector connector, NavigateToOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.NavigateTo, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> GoBackAsync(this BrowserConnector connector, GoBackOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GoBack, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> GoForwardAsync(this BrowserConnector connector, GoForwardOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GoForward, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> RefreshAsync(this BrowserConnector connector, RefreshOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.Refresh, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<InspectedElement> StartSelectingElementAsync(this BrowserConnector connector, StartSelectingElementOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.StartSelectingElement, option, option.TimeoutInMillis, false).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, CommonConverter.Parse<InspectedElement>, option.ThrowIfFailed);
        }

        public static async Task<bool> StopSelectingElementAsync(this BrowserConnector connector, StopSelectingElementOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.StopSelectingElement, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> StartBlockingResourcesAsync(this BrowserConnector connector, StartBlockingResourcesOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.StartBlockingResources, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> StopBlockingResourcesAsync(this BrowserConnector connector, StopBlockingResourcesOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.StopBlockingResources, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }
    }
}