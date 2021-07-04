using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace SentenceAnalyzer
{
    internal class ChapterModel
    {
        public string Content { get; set; }

        [JsonProperty("fullTitle")]
        public string Title { get; set; }

        public override string ToString()
        {
            return Title;
        }
    }
}