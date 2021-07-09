using AWTGen2.BE.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector
{
    public partial class BrowserConnector
    {
        public async Task WaitForConnectAsync(int timeoutInMillis)
        {
            if (!IsBrowserProcessRunning())
                throw new BrowserConnectionException("Browser process is not running.");

            var stopwatch = Stopwatch.StartNew();
            if (!_connector.IsConnected)
            {
                do
                {
                    await Task.Delay(100).ConfigureAwait(false);
                } while (!_connector.IsConnected && stopwatch.ElapsedMilliseconds < timeoutInMillis);

                if (stopwatch.ElapsedMilliseconds >= timeoutInMillis && !_connector.IsConnected)
                {
                    throw new TimeoutException($"Waiting for connecting is timeout: {timeoutInMillis}ms");
                }
            }
        }

        private bool IsBrowserProcessRunning()
        {
            switch (_connectionName.BrowserProcessName)
            {
                case "chrome":
                    return IsChromeRunning();

                case "msedge":
                    return IsEdgeRunning();

                case "firefox":
                    return IsFirefoxRunning();

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private bool IsChromeRunning()
        {
            return IsProcessRunning("chrome");
        }

        private bool IsEdgeRunning()
        {
            return IsProcessRunning("msedge");
        }

        private bool IsFirefoxRunning()
        {
            return IsProcessRunning("firefox");
        }

        private bool IsProcessRunning(string processName)
        {
            return Process.GetProcessesByName(processName).Length > 0;
        }

        public async Task WaitForReadyAsync(int timeoutInMillis)
        {
            var stopwatch = Stopwatch.StartNew();
            if (!_connector.IsConnected)
            {
                throw new BrowserConnectionException("Cannot communicate with the browser extension.");
            }

            JObject result;
            do
            {
                var timeout = Math.Max(timeoutInMillis - (int)stopwatch.ElapsedMilliseconds, 1000);
                result = await CallFunctionAsync<JObject>(SupportedFunctions.GetNativeHostState, null, timeout).ConfigureAwait(false); ;
            } while ((result == null || (!result["isScriptsLoaded"]?.Value<bool>() ?? false)) && stopwatch.ElapsedMilliseconds < timeoutInMillis);

            if (result == null || (!result["isScriptsLoaded"]?.Value<bool>() ?? false))
                throw new TimeoutException($"Waiting for ready is timeout: {timeoutInMillis}ms");

            ProcessId = result["processId"]?.Value<int>() ?? -1;
        }
    }
}