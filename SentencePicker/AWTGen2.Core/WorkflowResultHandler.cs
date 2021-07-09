using AWTGen2.Core.Proxy;
using System;

namespace AWTGen2.Core
{
    public class WorkflowResultHandler
    {
        public Action<Context> OnProxyDied { get; set; }
        public Action<Context, Exception> OnError { get; set; }
        public Action<Context, object> OnSuccess { get; set; }
        public Action<Context> OnFailed { get; set; }

        public virtual void Handle(WorkflowResult result)
        {
            switch (result.Type)
            {
                case ResultType.Success:
                    OnSuccessImpl(result);
                    break;

                case ResultType.Fail:
                    OnFailedImpl(result);
                    break;

                case ResultType.Cancel:
                    break;

                case ResultType.Error:
                    OnErrorImpl(result);
                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        protected virtual void OnSuccessImpl(WorkflowResult result)
        {
            OnSuccess?.Invoke(result.Context, result.Data);
        }

        protected virtual void OnFailedImpl(WorkflowResult result)
        {
            OnFailed?.Invoke(result.Context);
        }

        protected virtual void OnCancelImpl(WorkflowResult result)
        {
        }

        protected virtual void OnErrorImpl(WorkflowResult result)
        {
            if (result.Data is ProxyDiedException)
            {
                OnProxyDiedImpl(result);
            }
            else if (result.Data is Exception exception)
            {
                OnError?.Invoke(result.Context, exception);
            }
        }

        protected virtual void OnProxyDiedImpl(WorkflowResult result)
        {
            OnProxyDied?.Invoke(result.Context);
        }
    }
}