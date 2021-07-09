using System.Collections.Generic;

namespace AWTGen2.Core.Storage
{
    public interface IStorage
    {
        List<string> Read();

        void Save(IEnumerable<string> lines);

        void Save(string line);

        void Clear();
    }
}