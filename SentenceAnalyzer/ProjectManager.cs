using CsvHelper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SentenceAnalyzer
{
    internal class ProjectManager
    {
        private const string TranslateFileName = "translate.json";
        private const string ConvertFileName = "convert.json";

        public static Task<ProjectManager> CreateAsync(string translateFile, string convertFile, bool breakSentencesIfNewLine)
        {
            return Task.Run(() =>
            {
                var story = FileUtils.FileToObject<StoryModel>(translateFile);

                var projectsDir = FileUtils.GetDir("Projects");
                var projectDir = FileUtils.GetDir(projectsDir, story.Title);

                File.Copy(translateFile, Path.Combine(projectDir, TranslateFileName));
                File.Copy(convertFile, Path.Combine(projectDir, ConvertFileName));

                return new ProjectManager(new Project
                {
                    BreakSentencesIfNewLine = breakSentencesIfNewLine,
                    ProjectDir = projectDir
                });
            });
        }

        private StoryModel _translateStory;
        private StoryModel _convertStory;
        private int _workingTranslateChapterCount;
        private int _workingConvertChapterCount;

        public Project Project { get; }

        public ProjectManager(Project project)
        {
            Project = project;
        }

        public SessionInfo GetSessionInfo()
        {
            return _translateStory != null && _convertStory != null
                ? new SessionInfo
                {
                    SessionId = Project.CurrentSession,
                    CurrentTranslateChapter = Project.CurrentTranslateChapter,
                    TranslateChapterCount = _workingTranslateChapterCount,
                    TranslateChapterTotal = _translateStory.Chapters.Count,
                    CurrentConvertChapter = Project.CurrentConvertChapter,
                    ConvertChapterCount = _workingConvertChapterCount,
                    ConvertChapterTotal = _convertStory.Chapters.Count
                }
                : null;
        }

        public Task LoadAsync()
        {
            return Task.Run(() =>
            {
                _translateStory = FileUtils.FileToObject<StoryModel>(Path.Combine(Project.ProjectDir, TranslateFileName));
                _convertStory = FileUtils.FileToObject<StoryModel>(Path.Combine(Project.ProjectDir, ConvertFileName));
                _translateStory.Chapters = GetSortedChapters(_translateStory);
                _workingConvertChapterCount = 1;
                _workingTranslateChapterCount = 1;
            });
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

        public bool CanMoveNext()
        {
            return CanAddTranslateChapter() && CanAddConvertChapter();
        }

        public void MoveNext()
        {
            if (CanMoveNext())
            {
                Project.CurrentTranslateChapter += _workingTranslateChapterCount;
                Project.CurrentConvertChapter += _workingConvertChapterCount;
                Project.CurrentSession++;
                _workingTranslateChapterCount = 1;
                _workingConvertChapterCount = 1;
            }
        }

        public List<SentencePairModel> GetCurrent()
        {
            return GetSentencePairs(Project.CurrentTranslateChapter, Project.CurrentConvertChapter);
        }

        private List<SentencePairModel> GetSentencePairs(int translateIndex, int convertIndex)
        {
            var translateSentences = ExtractSentences(_translateStory, translateIndex);
            var convertSentences = ExtractSentences(_convertStory, convertIndex);

            var max = Math.Max(convertSentences.Count, translateSentences.Count);
            var sentencePairs = new List<SentencePairModel>(max);
            for (var i = 0; i < max; i++)
            {
                var translateSentence = i < translateSentences.Count
                    ? translateSentences[i]
                    : new SentenceModel { Id = Guid.NewGuid().ToString(), Text = string.Empty };
                var convertSentence = i < convertSentences.Count
                    ? convertSentences[i]
                    : new SentenceModel { Id = Guid.NewGuid().ToString(), Text = string.Empty };
                sentencePairs.Add(new SentencePairModel { Translate = translateSentence, Convert = convertSentence });
            }

            return sentencePairs;
        }

        private List<SentenceModel> ExtractSentences(StoryModel story, int pos)
        {
            if (pos >= 0 && pos < story.Chapters.Count)
            {
                var chapter = story.Chapters[pos];
                return ExtractSentences(chapter.Content);
            }

            return new List<SentenceModel>(0);
        }

        private List<SentenceModel> ExtractSentences(string text)
        {
            var config = new List<string> { "." };
            if (Project.BreakSentencesIfNewLine)
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

        public bool CanAddTranslateChapter()
        {
            return _translateStory != null && Project.CurrentTranslateChapter < _translateStory.Chapters.Count - _workingTranslateChapterCount;
        }

        public bool CanAddConvertChapter()
        {
            return _convertStory != null && Project.CurrentConvertChapter < _convertStory.Chapters.Count - _workingConvertChapterCount;
        }

        public bool CanRemoveTranslateChapter()
        {
            return _workingTranslateChapterCount > 0 && CanAddTranslateChapter();
        }

        public bool CanRemoveConvertChapter()
        {
            return _workingConvertChapterCount > 0 && CanAddConvertChapter();
        }

        public List<SentencePairModel> AddTranslateChapter()
        {
            if (CanAddTranslateChapter())
            {
                _workingTranslateChapterCount++;
                return GetSentencePairs(Project.CurrentTranslateChapter + _workingTranslateChapterCount - 1, -1);
            }

            return new List<SentencePairModel>(0);
        }

        public List<SentencePairModel> AddConvertChapter()
        {
            if (CanAddConvertChapter())
            {
                _workingConvertChapterCount++;
                return GetSentencePairs(-1, Project.CurrentConvertChapter + _workingConvertChapterCount - 1);
            }

            return new List<SentencePairModel>(0);
        }

        public void RemoveTranslateChapter(bool removeFirst)
        {
            if (!CanRemoveTranslateChapter()) return;

            _workingTranslateChapterCount--;

            if (removeFirst)
            {
                _translateStory.Chapters.RemoveAt(Project.CurrentTranslateChapter);
            }
            else
            {
                var last = Project.CurrentTranslateChapter + _workingTranslateChapterCount;
                _translateStory.Chapters.RemoveAt(last);
            }

            if (_workingTranslateChapterCount == 0)
            {
                AddTranslateChapter();
            }
        }

        public void RemoveConvertChapter(bool removeFirst)
        {
            if (!CanRemoveConvertChapter()) return;

            _workingConvertChapterCount--;

            if (removeFirst)
            {
                _convertStory.Chapters.RemoveAt(Project.CurrentConvertChapter);
            }
            else
            {
                var last = Project.CurrentConvertChapter + _workingConvertChapterCount;
                _convertStory.Chapters.RemoveAt(last);
            }

            if (_workingConvertChapterCount == 0)
            {
                AddConvertChapter();
            }
        }

        public async Task SaveAsync(IEnumerable<SentencePairModel> sessionData = null)
        {
            await FileUtils.ObjectToFileAsync(Project, Path.Combine(Project.ProjectDir, "project.json"));
            await FileUtils.ObjectToFileAsync(_translateStory, Path.Combine(Project.ProjectDir, TranslateFileName));
            await FileUtils.ObjectToFileAsync(_convertStory, Path.Combine(Project.ProjectDir, ConvertFileName));

            if (sessionData == null) return;

            var segmentsDir = FileUtils.GetDir(Project.ProjectDir, "segments");
            var fileName = Path.Combine(segmentsDir, $"{Project.CurrentSession:D4}.csv");
            using var writer = new StreamWriter(fileName);
            using var csv = new CsvWriter(writer, new CultureInfo("vi"));
            var rows = sessionData
                .Where(item => item.IsValid)
                .Select(item => new CsvRowModel
                {
                    Translate = item.Translate.Text,
                    Convert = item.Convert.Text
                });
            await csv.WriteRecordsAsync(rows);
        }
    }
}