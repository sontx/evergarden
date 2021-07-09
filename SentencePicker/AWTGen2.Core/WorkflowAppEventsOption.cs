using System;

namespace AWTGen2.Core
{
    public class WorkflowAppEventsOption
    {
        public Action<WorkflowAppState> OnStateChange { get; set; }
        public Action OnStart { get; set; }
        public Action<bool> OnComplete { get; set; }
        public Action<Context> OnWorkflowStart { get; set; }
        public Action<WorkflowResult> OnWorkflowComplete { get; set; }
    }
}