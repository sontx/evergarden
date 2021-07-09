using AWTGen2.BE.Connector.Extensions.Options;
using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using AWTGen2.BE.Core.Utils;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector.Extensions
{
    public static class ElementExtensions
    {
        public static async Task<bool> TypeIntoAsync(this BrowserConnector connector, TypeIntoOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.TypeInto, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> ClickAsync(this BrowserConnector connector, ClickOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.Click, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<string> GetAttributeAsync(this BrowserConnector connector, GetAttributeOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetAttribute, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => data["value"]?.Value<string>(), option.ThrowIfFailed);
        }

        public static async Task<Element> GetElementAsync(this BrowserConnector connector, GetElementOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetElement, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, CommonConverter.Parse<Element>, option.ThrowIfFailed);
        }

        public static async Task<Dictionary<string, object>> GetElementStyleAsync(this BrowserConnector connector, GetElementStyleOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetElementStyle, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => CommonConverter.Parse<Dictionary<string, object>>(data["style"]?.ToString()), option.ThrowIfFailed);
        }

        public static async Task<bool> GetVisibilityAsync(this BrowserConnector connector, GetVisibilityOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetElementVisibility, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => data["visible"]?.Value<bool>() ?? false, option.ThrowIfFailed);
        }

        public static async Task<string> GetHtmlAsync(this BrowserConnector connector, GetHtmlOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetHtml, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => data["html"]?.Value<string>(), option.ThrowIfFailed);
        }

        public static async Task<string> GetTextAsync(this BrowserConnector connector, GetTextOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.GetText, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => data["text"]?.Value<string>(), option.ThrowIfFailed);
        }

        public static async Task<bool> SelectItemsAsync(this BrowserConnector connector, SelectItemsOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.SelectItems, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> SetAttributeAsync(this BrowserConnector connector, SetAttributeOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.SetAttribute, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }

        public static async Task<bool> SetCheckboxAsync(this BrowserConnector connector, SetCheckboxOption option)
        {
            var result = await connector.CallFunctionAsync<JObject>(SupportedFunctions.SetCheckbox, option, option.TimeoutInMillis).ConfigureAwait(false);
            return ResultHelper.ExtractResult(result, data => true, option.ThrowIfFailed);
        }
    }
}