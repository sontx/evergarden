using System.Collections.Generic;

namespace SentenceAnalyzer
{
    internal class CsvSentencesReader : ISentencesReader
    {
        private readonly string _csvFile;

        public CsvSentencesReader(string csvFile)
        {
            _csvFile = csvFile;
        }

        public List<SentenceModel> ReadTranslate()
        {
            return new CsvFileReader("Translate").Read(_csvFile);
        }

        public List<SentenceModel> ReadConvert()
        {
            return new CsvFileReader("Convert").Read(_csvFile);
        }
    }
}