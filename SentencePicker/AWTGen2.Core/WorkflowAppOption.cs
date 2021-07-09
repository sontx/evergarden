using System;
using System.Threading;
using System.Threading.Tasks;

namespace AWTGen2.Core
{
    public class WorkflowAppOption : WorkflowAppEventsOption
    {
        public Func<CancellationToken, Task<Workflow>> WorkflowFactory { get; set; }
        public Func<CancellationToken, Task<Context>> ContextFactory { get; set; }
        public Func<object> InputDataFactory { get; set; }
        public int ParallelismCount { get; set; } = 1;
    }
}