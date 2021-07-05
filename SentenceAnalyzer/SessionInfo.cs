namespace SentenceAnalyzer
{
    internal class SessionInfo
    {
        public int SessionId { get; set; }
        public int CurrentTranslateChapter { get; set; }
        public int TranslateChapterCount { get; set; }
        public int TranslateChapterTotal { get; set; }
        public int CurrentConvertChapter { get; set; }
        public int ConvertChapterCount { get; set; }
        public int ConvertChapterTotal { get; set; }

        public string TranslateSummary =>
            TranslateChapterCount > 1
                ? $"[{CurrentTranslateChapter} - {CurrentTranslateChapter + TranslateChapterCount - 1 }] / {TranslateChapterTotal}"
                : $"{CurrentTranslateChapter} / {TranslateChapterTotal}";

        public string ConvertSummary =>
            ConvertChapterCount > 1
            ? $"[{CurrentConvertChapter} - {CurrentConvertChapter + ConvertChapterCount - 1 }] / {ConvertChapterTotal}"
            : $"{CurrentConvertChapter} / {ConvertChapterTotal}";
    }
}