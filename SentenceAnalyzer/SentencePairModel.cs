using GalaSoft.MvvmLight;
using System;
using System.Linq;

namespace SentenceAnalyzer
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

        public string Id { get; set; }

        public bool IsEmpty => string.IsNullOrWhiteSpace(Translate.Text) && string.IsNullOrWhiteSpace(Convert.Text);

        public bool IsValid => !string.IsNullOrWhiteSpace(Translate.Text) && !string.IsNullOrWhiteSpace(Convert.Text);

        public int LengthDiffPercent => (int)(((float)Translate.Text.Length - Convert.Text.Length) / Math.Max(Translate.Text.Length, Convert.Text.Length) * 100F);

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

                var matchedCount = 0;
                foreach (var translateWord in translateWords)
                {
                    for (var i = 0; i < convertWords.Length; i++)
                    {
                        if (translateWord == convertWords[i])
                        {
                            matchedCount++;
                            convertWords[i] = string.Empty;
                        }
                    }
                }

                return (int)((float)(translateWords.Length - matchedCount) / translateWords.Length * 100F);
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