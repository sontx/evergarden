using System.Collections.Generic;
using System.Windows.Media;

namespace SentenceAnalyzer
{
    internal class AppSettings
    {
        public List<DiffFilter> Filters { get; set; }

        public bool AutoSave { get; set; }
        public bool BreakSentencesIfNewLine { get; set; }
    }

    internal class DiffFilter
    {
        public int Peak { get; set; }
        public Color Color { get; set; }

        public override string ToString()
        {
            return Peak.ToString();
        }
    }
}