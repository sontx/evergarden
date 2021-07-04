using System.Collections.Generic;

namespace SentenceAnalyzer
{
    internal interface IFileReader
    {
        List<SentenceModel> Read(string file);
    }
}