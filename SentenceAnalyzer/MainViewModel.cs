using CsvHelper;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.CommandWpf;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace SentenceAnalyzer
{
    internal class MainViewModel : ViewModelBase
    {
        private readonly Window _view;
        private bool _isLoading;
        private ObservableCollection<SentencePairModel> _sentencePairs;
        private string _processingText;
        private bool _isSaving;

        public RelayCommand SaveCommand { get; }

        public ObservableCollection<SentencePairModel> SentencePairs
        {
            get => _sentencePairs;
            set => RunOnUi(() =>
            {
                if (Set(ref _sentencePairs, value))
                {
                    RaisePropertyChanged(nameof(ValidRowCount));
                    SaveCommand.RaiseCanExecuteChanged();
                }
            });
        }

        public string ProcessingText
        {
            get => _processingText;
            set => Set(ref _processingText, value);
        }

        public bool IsLoading
        {
            get => _isLoading;
            set => RunOnUi(() =>
            {
                if (Set(ref _isLoading, value))
                {
                    ProcessingText = _isLoading ? "Loading..." : null;
                }
            });
        }

        public bool IsSaving
        {
            get => _isSaving;
            set => RunOnUi(() =>
            {
                if (Set(ref _isSaving, value))
                {
                    SaveCommand.RaiseCanExecuteChanged();
                    ProcessingText = _isSaving ? "Saving..." : null;
                }
            });
        }

        public int ValidRowCount => SentencePairs?.Count(pair => pair.IsValid) ?? 0;

        public MainViewModel(Window view)
        {
            _view = view;
            SaveCommand = new RelayCommand(HandleSave, CanSave);
        }

        private bool CanSave()
        {
            return SentencePairs is { Count: > 0 } && !IsSaving;
        }

        private async void HandleSave()
        {
            IsSaving = true;
            try
            {
                var path = Path.GetFullPath(Path.Combine("data", "ouptut.csv"));
                using var writer = new StreamWriter(path);
                using var csv = new CsvWriter(writer, new CultureInfo("vi"));
                var rows = SentencePairs
                    .Where(item => item.IsValid)
                    .Select(item => new CsvRowModel
                    {
                        Translate = item.Translate.Text,
                        Convert = item.Convert.Text
                    });
                await csv.WriteRecordsAsync(rows);
                MessageBox.Show($"Saved to {path}");
            }
            finally
            {
                IsSaving = false;
            }
        }

        public void Load(ISentencesReader reader)
        {
            Task.Run(() =>
            {
                IsLoading = true;

                try
                {
                    var translateSentences = reader.ReadTranslate();
                    var convertSentences = reader.ReadConvert();
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

                    SentencePairs = new ObservableCollection<SentencePairModel>(sentencePairs);
                }
                finally
                {
                    IsLoading = false;
                }
            });
        }

        public void RemoveSentences(List<SentencePairModel> pairs, string sentenceName)
        {
            foreach (var pair in pairs)
            {
                var removeIndex = SentencePairs.IndexOf(pair);
                for (var i = removeIndex; i < SentencePairs.Count; i++)
                {
                    var current = SentencePairs[i];
                    var next = i < SentencePairs.Count - 1 ? SentencePairs[i + 1] : null;
                    current.SetSentenceValue(sentenceName, next != null ? next.GetSentenceValue(sentenceName) : string.Empty);
                    current.NotifyChanged();
                }
            }
            RaisePropertyChanged(nameof(ValidRowCount));
        }

        public void RemoveSentencePairs(List<SentencePairModel> pairs)
        {
            foreach (var pair in pairs)
            {
                SentencePairs.Remove(pair);
            }
            RaisePropertyChanged(nameof(ValidRowCount));
        }

        public void MergeSentences(List<SentencePairModel> pairs, string sentenceName)
        {
            var first = pairs.First();
            var currentValue = first.GetSentenceValue(sentenceName);
            for (var i = 1; i < pairs.Count; i++)
            {
                var pair = pairs[i];
                currentValue += " " + pair.GetSentenceValue(sentenceName);
            }

            first.SetSentenceValue(sentenceName, currentValue);
            first.NotifyChanged();
            RemoveSentences(pairs.Where(item => item != first).ToList(), sentenceName);
            RaisePropertyChanged(nameof(ValidRowCount));
        }

        public void MergeSentencePairs(List<SentencePairModel> pairs)
        {
            var first = pairs.First();
            var translateText = first.Translate.Text;
            var convertText = first.Convert.Text;
            for (var i = 1; i < pairs.Count; i++)
            {
                var pair = pairs[i];
                translateText += " " + pair.Translate.Text.Trim();
                convertText += " " + pair.Convert.Text.Trim();
                SentencePairs.Remove(pair);
            }

            first.Translate.Text = translateText;
            first.Convert.Text = convertText;
            first.NotifyChanged();
            RaisePropertyChanged(nameof(ValidRowCount));
        }

        private void RunOnUi(Action action)
        {
            _view.Dispatcher.Invoke(action);
        }
    }
}