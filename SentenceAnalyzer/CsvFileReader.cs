using CsvHelper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace SentenceAnalyzer
{
    internal class CsvFileReader : IFileReader
    {
        private readonly string _sentenceName;

        public CsvFileReader(string sentenceName)
        {
            _sentenceName = sentenceName;
        }

        public List<SentenceModel> Read(string file)
        {
            using var reader = new StreamReader(file);
            using var csv = new CsvReader(reader, new CultureInfo("vi"));
            return csv.GetRecords<CsvRowModel>()
                .Select(item => new SentenceModel
                {
                    Id = Guid.NewGuid().ToString(),
                    Text = _sentenceName == "Translate" ? item.Translate : item.Convert
                })
                .ToList();
        }
    }
}