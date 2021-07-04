using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SentenceAnalyzer
{
    internal class JsonFileReader : IFileReader
    {
        private readonly bool _needSortChapters;
        private readonly bool _newLineAsEndSentence;

        public JsonFileReader(bool needSortChapters, bool newLineAsEndSentence)
        {
            _needSortChapters = needSortChapters;
            _newLineAsEndSentence = newLineAsEndSentence;
        }

        public List<SentenceModel> Read(string file)
        {
            var json = File.ReadAllText(file);
            var story = JsonConvert.DeserializeObject<StoryModel>(json);
            var chapters = _needSortChapters ? GetSortedChapters(story) : story.Chapters;
            var text = string.Join(".", chapters.Select(chapter => chapter.Content));
            return ExtractSentences(text, _newLineAsEndSentence);
        }

        private List<ChapterModel> GetSortedChapters(StoryModel story)
        {
            var chapters = story.Chapters;
            chapters.Sort(((chapter1, chapter2) =>
            {
                var chapterNo1 = GetChapterNo(chapter1.Title);
                var chapterNo2 = GetChapterNo(chapter2.Title);
                return chapterNo1 - chapterNo2;
            }));
            return chapters;
        }

        private int GetChapterNo(string title)
        {
            var index = title.IndexOf(":");
            var st = title.Substring(0, index > -1 ? index : title.Length).Substring("Chương".Length).Trim();
            return int.Parse(st);
        }

        private List<SentenceModel> ExtractSentences(string text, bool newLineAsEndSentence)
        {
            var config = new List<string> { "." };
            if (newLineAsEndSentence)
            {
                config.Add(Environment.NewLine);
                config.Add("\n");
            }

            var rawSentences = text.Split(config.ToArray(), StringSplitOptions.RemoveEmptyEntries);
            return rawSentences
                .Select(rawSentence => rawSentence.Prune())
                .Where(rawSentence => !string.IsNullOrWhiteSpace(rawSentence) && rawSentence.Any(char.IsLetter))
                .Select(rawSentence => new SentenceModel { Id = Guid.NewGuid().ToString(), Text = rawSentence })
                .ToList();
        }
    }
}