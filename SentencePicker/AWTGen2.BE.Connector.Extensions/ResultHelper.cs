using AWTGen2.BE.Core;
using log4net;
using Newtonsoft.Json.Linq;
using System;
using System.Runtime.CompilerServices;
using AWTGen2.BE.Core.Utils;

namespace AWTGen2.BE.Connector.Extensions
{
    internal static class ResultHelper
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(ResultHelper));

        public static T ExtractResult<T>(JObject result, Func<JObject, T> onSuccess, bool throwIfFailed = false, [CallerMemberName] string callerName = "")
        {
            if (result == null || result["status"]?.Value<int>() == BrowserConnector.N_FALSE)
            {
                string errorMessage;
                if (result != null && result.ContainsKey("error"))
                {
                    errorMessage = $"Extension error: {result["error"]?.Value<string>()}";
                }
                else
                {
                    errorMessage = $"{callerName} was failed";
                }

                Log.Error(errorMessage);

                if (throwIfFailed)
                    throw new OperationFailedException(errorMessage);

                return default;
            }

            return onSuccess(result);
        }

        public static T ExtractInjectScriptResult<T>(JObject validResult)
        {
            return CommonConverter.Parse<T>(validResult["result"]);
        }
    }
}