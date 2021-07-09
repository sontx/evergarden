using AWTGen2.BE.Connector.Extensions.Options;
using AWTGen2.BE.Core;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector.Extensions
{
    internal static class WaitTaskHelper
    {
        private const int CheckInterval = 200;
        private const int PreferMinTimeout = 3000;

        public static async Task<bool> WaitTaskAsync(Func<int, Task<bool>> doCheck, int timeout)
        {
            var stopwatch = Stopwatch.StartNew();
            do
            {
                var maxTimeoutAvailable = (int)Math.Max(timeout - stopwatch.ElapsedMilliseconds, 0);
                var adjustedTimeout = Math.Min(maxTimeoutAvailable, PreferMinTimeout);
                try
                {
                    if (await doCheck(adjustedTimeout).ConfigureAwait(false))
                    {
                        return true;
                    }
                }
                catch (OperationFailedException)
                {
                }
                catch (TimeoutException)
                {
                }

                await Task.Delay(CheckInterval);
            } while (stopwatch.ElapsedMilliseconds < timeout);

            return false;
        }

        public static T ConfigOption<T>(T option, int timeout) where T : OptionBase
        {
            option.ThrowIfFailed = true;
            option.TimeoutInMillis = timeout;
            return option;
        }
    }
}