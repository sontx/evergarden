using System.Collections.Generic;

namespace SentenceAnalyzer
{
    internal class JsonSentencesReader : ISentencesReader
    {
        private readonly string _translateFile;
        private readonly string _convertFile;
        private readonly bool _newLineAsEndSentence;

        public JsonSentencesReader(string translateFile, string convertFile, bool newLineAsEndSentence)
        {
            _translateFile = translateFile;
            _convertFile = convertFile;
            _newLineAsEndSentence = newLineAsEndSentence;
        }

        public List<SentenceModel> ReadTranslate()
        {
            return new JsonFileReader(true, _newLineAsEndSentence).Read(_translateFile);
        }

        public List<SentenceModel> ReadConvert()
        {
            return new JsonFileReader(false, _newLineAsEndSentence).Read(_convertFile);
        }
    }
}