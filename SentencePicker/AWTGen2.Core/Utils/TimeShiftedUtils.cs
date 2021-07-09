#nullable enable
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AWTGen2.Core.Utils
{
    public static class TimeShiftedUtils
    {
        public static Action Debounce(this Action action, int milliseconds)
        {
            CancellationTokenSource lastCToken = null;

            return () =>
            {
                //Cancel/dispose previous
                lastCToken?.Cancel();
                try
                {
                    lastCToken?.Dispose();
                }
                catch
                {
                    // ignored
                }

                var tokenSrc = lastCToken = new CancellationTokenSource();

                Task.Delay(milliseconds).ContinueWith(task => { action(); }, tokenSrc.Token);
            };
        }

        public static Action<T> Debounce<T>(this Action<T> func, int milliseconds = 300)
        {
            CancellationTokenSource? cancelTokenSource = null;

            return arg =>
            {
                cancelTokenSource?.Cancel();
                cancelTokenSource = new CancellationTokenSource();

                Task.Delay(milliseconds, cancelTokenSource.Token)
                    .ContinueWith(t =>
                    {
                        if (!t.IsCanceled)
                        {
                            func(arg);
                        }
                    }, TaskScheduler.Default);
            };
        }
    }
}