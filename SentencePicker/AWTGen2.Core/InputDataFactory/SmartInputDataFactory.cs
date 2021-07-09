using AWTGen2.Core.Data;

namespace AWTGen2.Core.InputDataFactory
{
    public class SmartInputDataFactory : IInputDataFactory, ICountable, IQueuetable
    {
        private readonly ILineParser _parser;
        private readonly SimpleInputDataFactory _dataFactory;

        public int Count => _dataFactory.Count;

        public SmartInputDataFactory(string fileName, ILineParser parser)
        {
            _dataFactory = new SimpleInputDataFactory(fileName);
            _parser = parser;
        }

        public SmartInputDataFactory(string[] lines, ILineParser parser)
        {
            _dataFactory = new SimpleInputDataFactory(lines);
            _parser = parser;
        }

        public object Factory()
        {
            var line = _dataFactory.Factory()?.ToString();
            return string.IsNullOrEmpty(line) ? null : _parser.Parse(line);
        }

        public void Queue(object value)
        {
            _dataFactory.Queue(value);
        }
    }
}