using System.Collections.Generic;

namespace SentenceAnalyzer
{
    internal interface ISentencesReader
    {
        List<SentenceModel> ReadTranslate();

        List<SentenceModel> ReadConvert();
    }
}