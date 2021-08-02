using GalaSoft.MvvmLight;
using System;
using System.Collections.Generic;
using System.Linq;

namespace TitleCompare
{
    public class ComparedItem : ObservableObject
    {
        private Chapter _source;
        private Chapter _target;

        public Chapter Source
        {
            get => _source;
            set
            {
                if (Set(ref _source, value))
                {
                    NotifyChange();
                }
            }
        }

        public Chapter Target
        {
            get => _target;
            set
            {
                if (Set(ref _target, value))
                {
                    NotifyChange();
                }
            }
        }

        private void NotifyChange()
        {
            RaisePropertyChanged(nameof(SourceFile));
            RaisePropertyChanged(nameof(TargetFile));
            RaisePropertyChanged(nameof(LengthDiff));
            RaisePropertyChanged(nameof(WordsDiff));
            RaisePropertyChanged(nameof(ContentLengthDiff));
            RaisePropertyChanged(nameof(ContentDiff));
        }

        public string SourceFile => Source?.FileName;
        public string TargetFile => Target?.FileName;
        public int LengthDiff => (int)(((float)Target.Title.Length - Source.Title.Length) / Math.Max(Target.Title.Length, Source.Title.Length) * 100F);

        public int WordsDiff => CompareDiff(Source.Title, Target.Title);
        public int ContentDiff => CompareDiff(Source.Content, Target.Content);

        private int CompareDiff(string source, string target)
        {
            if (string.IsNullOrWhiteSpace(source) || string.IsNullOrWhiteSpace(target))
                return 100;

            var translateWords = target
                .ToLower()
                .Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries);
            var convertWords = source
                .ToLower()
                .Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries)
                .ToArray();

            var matchedWords = new List<string>();
            foreach (var translateWord in translateWords)
            {
                for (var i = 0; i < convertWords.Length; i++)
                {
                    if (translateWord == convertWords[i])
                    {
                        matchedWords.Add(translateWord);
                        convertWords[i] = string.Empty;
                    }
                }
            }

            return (int)((float)(translateWords.Length - matchedWords.Count) / translateWords.Length * 100F);
        }

        public int ContentLengthDiff => (int)(((float)Target.Content.Length - Source.Content.Length) / Math.Max(Target.Content.Length, Source.Content.Length) * 100F);
    }
}