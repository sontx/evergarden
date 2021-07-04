using System.Collections.Generic;

namespace SentenceAnalyzer
{
    internal class StoryModel
    {
        public string Url { get; set; }
        public string Title { get; set; }
        public List<ChapterModel> Chapters { get; set; }
    }
}