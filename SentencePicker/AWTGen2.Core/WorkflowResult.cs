namespace AWTGen2.Core
{
    public class WorkflowResult
    {
        public Context Context { get; internal set; }
        public ResultType Type { get; }
        public object Data { get; }

        public WorkflowResult(ResultType type, object data)
        {
            Type = type;
            Data = data;
        }
    }
}