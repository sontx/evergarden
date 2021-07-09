using System;

namespace AWTGen2.Core
{
    public class WorkflowDescriptor
    {
        public Context Context { get; internal set; }
        public DateTime StartedTime { get; internal set; }
        public DateTime StoppedTime { get; internal set; }
        public WorkflowStatus Status { get; internal set; }
    }
}