using log4net;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AWTGen2.Core
{
    public abstract class Workflow
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(Workflow));

        protected static Random Random = new(DateTime.Now.Millisecond);

        public WorkflowDescriptor Descriptor { get; } = new();

        public async Task<WorkflowResult> StartAsync(Context context, CancellationToken cancellationToken)
        {
            Descriptor.StartedTime = DateTime.Now;
            Descriptor.Status = WorkflowStatus.Running;

            WorkflowResult result;
            try
            {
                result = await DoStartAsync(context, cancellationToken);
                Descriptor.Status = WorkflowStatus.Finish;
            }
            catch (Exception ex)
            {
                if (ex is OperationCanceledException || cancellationToken.IsCancellationRequested)
                {
                    Descriptor.Status = WorkflowStatus.Cancelled;
                    Log.Warn("Workflow process is cancelled");
                    result = new WorkflowResult(ResultType.Cancel, null);
                }
                else
                {
                    Descriptor.Status = WorkflowStatus.Error;
                    Log.Error("Error while running workflow", ex);
                    result = new WorkflowResult(ResultType.Error, ex);
                }
            }
            finally
            {
                Descriptor.StoppedTime = DateTime.Now;
            }

            result.Context = context;
            return result;
        }

        protected abstract Task<WorkflowResult> DoStartAsync(Context context, CancellationToken cancellationToken);

        protected WorkflowResult OK(object data)
        {
            return new WorkflowResult(ResultType.Success, data);
        }

        protected WorkflowResult Fail()
        {
            return new WorkflowResult(ResultType.Fail, null);
        }
    }
}