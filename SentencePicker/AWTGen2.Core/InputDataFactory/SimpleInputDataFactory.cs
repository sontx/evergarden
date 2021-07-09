using System.Collections.Generic;
using System.IO;

namespace AWTGen2.Core.InputDataFactory
{
    public class SimpleInputDataFactory : IInputDataFactory, ICountable, IQueuetable
    {
        private readonly Queue<string> _lines;

        public int Count => _lines.Count;

        public SimpleInputDataFactory(string fileName)
        {
            var lines = File.ReadAllLines(fileName);
            _lines = new Queue<string>(lines);
        }

        public SimpleInputDataFactory(string[] lines)
        {
            _lines = new Queue<string>(lines);
        }

        public object Factory()
        {
            lock (_lines)
            {
                while (_lines.Count > 0)
                {
                    var line = _lines.Dequeue();
                    if (!string.IsNullOrWhiteSpace(line))
                        return line.Trim();
                }

                return null;
            }
        }

        public void Queue(object value)
        {
            lock (_lines)
            {
                _lines.Enqueue(value.ToString());
            }
        }
    }
}