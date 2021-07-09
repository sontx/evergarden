using System;
using System.Collections.Generic;
using System.Linq;
using GalaSoft.MvvmLight;

namespace SentencePicker
{
    internal class SentencePairModel : ObservableObject
    {
        private SentenceModel _translate;
        private SentenceModel _convert;

        public SentenceModel Translate
        {
            get => _translate;
            set
            {
                if (Set(ref _translate, value))
                {
                    NotifyChanged();
                }
            }
        }

        public SentenceModel Convert
        {
            get => _convert;
            set
            {
                if (Set(ref _convert, value))
                {
                    NotifyChanged();
                }
            }
        }
        
        public bool IsEmpty => string.IsNullOrWhiteSpace(Translate.Text) && string.IsNullOrWhiteSpace(Convert.Text);

        public bool IsValid => !string.IsNullOrWhiteSpace(Translate.Text) && !string.IsNullOrWhiteSpace(Convert.Text);

        public int LengthDiffPercent => (int)(((float)Translate.Text.Length - Convert.Text.Length) / Math.Max(Translate.Text.Length, Convert.Text.Length) * 100F);

        public string[] MatchedWordsCached { get; private set; }

        public int WordsDiffPercent
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Translate.Text) || string.IsNullOrWhiteSpace(Convert.Text))
                    return 100;

                var translateWords = Translate.Text
                    .NonUnicode()
                    .Prune()
                    .Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries);
                var convertWords = Convert.Text
                    .NonUnicode()
                    .Prune()
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

                MatchedWordsCached = matchedWords.ToArray();
                return (int)((float)(translateWords.Length - matchedWords.Count) / translateWords.Length * 100F);
            }
        }

        public void NotifyChanged()
        {
            RaisePropertyChanged(nameof(LengthDiffPercent));
            RaisePropertyChanged(nameof(WordsDiffPercent));
            RaisePropertyChanged(nameof(IsValid));
        }
    }
}