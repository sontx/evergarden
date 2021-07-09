using CsvHelper;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.CommandWpf;
using Ookii.Dialogs.Wpf;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace SentencePicker
{
    internal class MainViewModel : ViewModelBase
    {
        private readonly MainWindow _view;
        private readonly SentencePickerListener _listener;
        private ObservableCollection<SentencePairModel> _sentencePairs = new();
        private string _processingText;
        private string _currentFile;
        private SentencePairModel _currentSentencePair;

        public RelayCommand SaveCommand { get; }
        public RelayCommand ExportCommand { get; }
        public RelayCommand<CancelEventArgs> ClosingCommand { get; }

        public ObservableCollection<SentencePairModel> SentencePairs
        {
            get => _sentencePairs;
            set => RunOnUi(() =>
            {
                if (Set(ref _sentencePairs, value))
                {
                    UpdateUi();
                }
            });
        }

        public string ProcessingText
        {
            get => _processingText;
            set => RunOnUi(() => Set(ref _processingText, value));
        }

        public int ValidRowCount => SentencePairs?.Count(pair => pair.IsValid) ?? 0;

        public MainViewModel(MainWindow view)
        {
            _view = view;
            _listener = new SentencePickerListener { OnPicked = OnPicked };
            SaveCommand = new RelayCommand(HandleSave, CanSave);
            ExportCommand = new RelayCommand(HandleExport, CanExport);
            ClosingCommand = new RelayCommand<CancelEventArgs>(HandleClosing);
        }

        private void OnPicked(PickedData pickedData)
        {
            if (string.IsNullOrWhiteSpace(pickedData.Text))
            {
                return;
            }

            RunOnUi(() =>
            {
                var isTranslated = pickedData.Host.ToLower() == "truyenfull.vn";
                if (_currentSentencePair == null
                    || _currentSentencePair.IsValid
                    || (isTranslated && !string.IsNullOrEmpty(_currentSentencePair.Translate.Text))
                    || (!isTranslated && !string.IsNullOrEmpty(_currentSentencePair.Convert.Text)))
                {
                    _currentSentencePair = new SentencePairModel
                    {
                        Translate = new SentenceModel { Text = string.Empty, Id = Guid.NewGuid().ToString() },
                        Convert = new SentenceModel { Text = string.Empty, Id = Guid.NewGuid().ToString() }
                    };
                    SentencePairs.Add(_currentSentencePair);
                }

                if (isTranslated)
                {
                    _currentSentencePair.Translate.Text = pickedData.Text;
                }
                else
                {
                    _currentSentencePair.Convert.Text = pickedData.Text;
                }
                _currentSentencePair.NotifyChanged();
            });
        }

        private void HandleClosing(CancelEventArgs arg)
        {
            _listener.Dispose();
        }

        private bool CanExport()
        {
            return SentencePairs is { Count: > 0 };
        }

        private async void HandleExport()
        {
            ProcessingText = "Exporting...";
            try
            {
                var dialog = new VistaFolderBrowserDialog();
                if (dialog.ShowDialog(_view) ?? false)
                {
                    await SaveAsync();

                    var convertList = new List<string>(SentencePairs.Count);
                    var translateList = new List<string>(SentencePairs.Count);

                    foreach (var pair in SentencePairs)
                    {
                        if (pair.IsEmpty) continue;
                        convertList.Add(pair.Convert.Text);
                        translateList.Add(pair.Translate.Text);
                    }

                    var sourceFile = Path.Combine(dialog.SelectedPath, "source.txt");
                    var targetFile = Path.Combine(dialog.SelectedPath, "target.txt");
                    File.WriteAllText(sourceFile, string.Join(Environment.NewLine, convertList));
                    File.WriteAllText(targetFile, string.Join(Environment.NewLine, translateList));
                }
            }
            finally
            {
                ProcessingText = null;
            }
        }

        private void UpdateUi()
        {
            RaisePropertyChanged(nameof(ValidRowCount));
            SaveCommand.RaiseCanExecuteChanged();
            ExportCommand.RaiseCanExecuteChanged();
        }

        private bool CanSave()
        {
            return SentencePairs is { Count: > 0 };
        }

        private async void HandleSave()
        {
            await SaveAsync();
        }

        private async Task SaveAsync(bool soft = false)
        {
            if (string.IsNullOrEmpty(_currentFile))
            {
                if (soft)
                {
                    return;
                }

                var dialog = new VistaSaveFileDialog { Filter = @"CSV files|*.csv", AddExtension = true };
                if (dialog.ShowDialog() ?? false)
                {
                    _currentFile = dialog.FileName;
                }
                else
                {
                    return;
                }
            }

            try
            {
                ProcessingText = "Saving...";
                var saveData = SentencePairs
                    .Where(pair => !pair.IsEmpty)
                    .Select(pair => new CsvRowModel { Translate = pair.Translate.Text, Convert = pair.Convert.Text });
                using var writer = new StreamWriter(_currentFile);
                using var csv = new CsvWriter(writer, new CultureInfo("vi"));
                await csv.WriteRecordsAsync(saveData);
            }
            finally
            {
                ProcessingText = null;
            }
        }

        public Task LoadAsync(string file)
        {
            ProcessingText = "Loading...";
            return Task.Run(() =>
            {
                try
                {
                    using var reader = new StreamReader(file);
                    using var csv = new CsvReader(reader, new CultureInfo("vi"));
                    var rows = csv.GetRecords<CsvRowModel>();
                    var sentencePairs = new List<SentencePairModel>();
                    foreach (var row in rows)
                    {
                        sentencePairs.Add(new SentencePairModel
                        {
                            Translate = new SentenceModel { Id = Guid.NewGuid().ToString(), Text = row.Translate },
                            Convert = new SentenceModel { Id = Guid.NewGuid().ToString(), Text = row.Convert },
                        });
                    }

                    SentencePairs = new ObservableCollection<SentencePairModel>(sentencePairs);
                    _currentFile = file;
                }
                finally
                {
                    ProcessingText = null;
                }
            });
        }

        private void RunOnUi(Action action)
        {
            _view.Dispatcher.Invoke(action);
        }
    }
}