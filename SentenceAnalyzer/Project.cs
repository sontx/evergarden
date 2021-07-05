using Newtonsoft.Json;

namespace SentenceAnalyzer
{
    internal class Project
    {
        [JsonIgnore]
        public string ProjectDir { get; set; }

        public bool BreakSentencesIfNewLine { get; set; }
        public int CurrentTranslateChapter { get; set; }
        public int CurrentConvertChapter { get; set; }
        public int CurrentSession { get; set; }
    }
}