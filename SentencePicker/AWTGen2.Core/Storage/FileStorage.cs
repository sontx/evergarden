using System;
using System.Collections.Generic;
using System.IO;

namespace AWTGen2.Core.Storage
{
    public class FileStorage : IStorage
    {
        private readonly string _fileName;
        private readonly object _lockObj = new();

        public FileStorage(string fileName)
        {
            _fileName = fileName;
        }

        public List<string> Read()
        {
            if (!File.Exists(_fileName))
                return new List<string>();

            return new List<string>(File.ReadAllLines(_fileName));
        }

        public void Save(IEnumerable<string> lines)
        {
            lock (_lockObj)
            {
                File.WriteAllLines(_fileName, lines);
            }
        }

        public void Save(string line)
        {
            lock (_lockObj)
            {
                File.AppendAllText(_fileName, line + Environment.NewLine);
            }
        }

        public void Clear()
        {
            if (File.Exists(_fileName))
                File.Delete(_fileName);
        }
    }
}