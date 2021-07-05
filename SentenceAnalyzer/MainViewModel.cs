using Blackcat.Configuration;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.CommandWpf;
using Ookii.Dialogs.Wpf;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace SentenceAnalyzer
{
    internal class MainViewModel : ViewModelBase
    {
        private readonly MainWindow _view;
        private bool _isLoading;
        private ObservableCollection<SentencePairModel> _sentencePairs;
        private string _processingText;
        private bool _isSaving;
        private ProjectManager _projectManager;

        public RelayCommand SaveCommand { get; }
        public RelayCommand MoveNextCommand { get; }
        public RelayCommand<string> AddChapterCommand { get; }
        public RelayCommand<string> RemoveChapterCommand { get; }
        public RelayCommand ReloadCommand { get; }
        public RelayCommand ExportCommand { get; }
        public RelayCommand SettingsCommand { get; }
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

        public SessionInfo SessionInfo => _projectManager?.GetSessionInfo();

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

        public MainViewModel(MainWindow view)
        {
            _view = view;
            SaveCommand = new RelayCommand(HandleSave, CanSave);
            MoveNextCommand = new RelayCommand(HandleMoveNext, CanMoveNext);
            AddChapterCommand = new RelayCommand<string>(HandleAddChapter, CanAddChapter);
            RemoveChapterCommand = new RelayCommand<string>(HandleRemoveChapter, CanRemoveChapter);
            ReloadCommand = new RelayCommand(HandleReload, CanReload);
            ExportCommand = new RelayCommand(HandleExport, CanExport);
            SettingsCommand = new RelayCommand(HandleSettings);
            ClosingCommand = new RelayCommand<CancelEventArgs>(HandleClosing);
        }

        private void HandleClosing(CancelEventArgs arg)
        {
            if (ConfigLoader.Default.Get<AppSettings>().AutoSave)
            {
                var thread = new Thread(() =>
                {
                    SaveAsync().Wait();
                })
                { IsBackground = false };
                thread.Start();
            }
        }

        private void HandleSettings()
        {
            new SettingsWindow(ConfigLoader.Default.Get<AppSettings>()) { Owner = _view }.ShowDialog();
            if (SentencePairs != null)
            {
                SentencePairs = new ObservableCollection<SentencePairModel>(SentencePairs);
            }
        }

        private bool CanExport()
        {
            return _projectManager?.CanExport() ?? false;
        }

        private async void HandleExport()
        {
            ProcessingText = "Exporting...";
            try
            {
                var saveCurrent = MessageBox.Show(
                    _view,
                    "Save current session before export?",
                    "Exporter",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question,
                    MessageBoxResult.No) == MessageBoxResult.Yes;

                if (saveCurrent)
                {
                    await SaveAsync();
                }

                var dialog = new VistaFolderBrowserDialog();
                if (dialog.ShowDialog(_view) ?? false)
                {
                    await _projectManager.ExportAsync(dialog.SelectedPath);
                }
            }
            finally
            {
                ProcessingText = null;
            }
        }

        private async void HandleReload()
        {
            IsLoading = true;
            try
            {
                await _projectManager.LoadAsync();
                SentencePairs = new ObservableCollection<SentencePairModel>();
                ShowPairs(_projectManager.GetCurrent());
                UpdateUi();
            }
            finally
            {
                IsLoading = false;
            }
        }

        private bool CanReload()
        {
            return _projectManager != null;
        }

        private void UpdateUi()
        {
            RaisePropertyChanged(nameof(ValidRowCount));
            RaisePropertyChanged(nameof(SessionInfo));
            SaveCommand.RaiseCanExecuteChanged();
            MoveNextCommand.RaiseCanExecuteChanged();
            AddChapterCommand.RaiseCanExecuteChanged();
            RemoveChapterCommand.RaiseCanExecuteChanged();
            ReloadCommand.RaiseCanExecuteChanged();
            ExportCommand.RaiseCanExecuteChanged();
        }

        private void HandleRemoveChapter(string arg)
        {
            var removeFirst = MessageBox.Show(
                _view,
                "Remove first?",
                "Remove chapter",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question,
                MessageBoxResult.No) == MessageBoxResult.Yes;

            var test = removeFirst ? SentencePairs.First() : SentencePairs.Last();
            SentencePairs =
                new ObservableCollection<SentencePairModel>(SentencePairs.Where(pair => pair.Id != test.Id));

            if (arg == "translate")
            {
                _projectManager?.RemoveTranslateChapter(removeFirst);
            }
            else
            {
                _projectManager?.RemoveConvertChapter(removeFirst);
            }
        }

        private bool CanRemoveChapter(string arg)
        {
            return arg == "translate"
                ? _projectManager?.CanRemoveTranslateChapter() ?? false
                : _projectManager?.CanRemoveConvertChapter() ?? false;
        }

        private bool CanAddChapter(string arg)
        {
            return arg == "translate"
                ? _projectManager?.CanAddTranslateChapter() ?? false
                : _projectManager?.CanAddConvertChapter() ?? false;
        }

        private void HandleAddChapter(string arg)
        {
            if (arg == "translate")
            {
                var result = _projectManager?.AddTranslateChapter() ?? new List<SentencePairModel>(0);
                ShowPairs(result);
            }
            else
            {
                var result = _projectManager?.AddConvertChapter() ?? new List<SentencePairModel>(0);
                ShowPairs(result);
            }
        }

        private void ShowPairs(List<SentencePairModel> pairs)
        {
            var id = Guid.NewGuid().ToString();
            foreach (var pair in pairs)
            {
                pair.Id = id;
                SentencePairs.Add(pair);
            }
            UpdateUi();
        }

        private bool CanMoveNext()
        {
            return _projectManager?.CanMoveNext() ?? false;
        }

        private async void HandleMoveNext()
        {
            if (_projectManager != null)
            {
                await SaveAsync();
                _projectManager.MoveNext();
                SentencePairs.Clear();
                ShowPairs(_projectManager.GetCurrent());
            }
        }

        private bool CanSave()
        {
            return _projectManager != null && SentencePairs is { Count: > 0 } && !IsSaving;
        }

        private async void HandleSave()
        {
            await SaveAsync();
        }

        private async Task SaveAsync()
        {
            if (_projectManager == null)
            {
                return;
            }

            IsSaving = true;
            try
            {
                await _projectManager.SaveAsync(SentencePairs);
            }
            finally
            {
                IsSaving = false;
            }
        }

        public async void Load(string translateFile, string convertFile, bool breakSentencesIfNewLine)
        {
            IsLoading = true;
            try
            {
                var projectManager = await ProjectManager.CreateAsync(translateFile, convertFile, breakSentencesIfNewLine);
                await LoadAsync(projectManager);
            }
            finally
            {
                IsLoading = false;
            }
        }

        public async Task LoadAsync(ProjectManager projectManager)
        {
            IsLoading = true;
            try
            {
                _projectManager = projectManager;
                await _projectManager.LoadAsync();
                await _projectManager.SaveAsync();
                SentencePairs = new ObservableCollection<SentencePairModel>();
                ShowPairs(_projectManager.GetCurrent());
            }
            finally
            {
                IsLoading = false;
            }
        }

        public void RemoveSentences(List<SentencePairModel> pairs, string sentenceName)
        {
            foreach (var pair in pairs)
            {
                var removeIndex = SentencePairs.IndexOf(pair);
                if (removeIndex == -1) continue;

                SentencePairs.Remove(pair);
                for (var i = removeIndex; i < SentencePairs.Count; i++)
                {
                    var current = SentencePairs[i];
                    var next = i < SentencePairs.Count - 1 ? SentencePairs[i + 1] : null;
                    current.SetSentenceValue(sentenceName, next != null ? next.GetSentenceValue(sentenceName) : string.Empty);
                    current.NotifyChanged();
                }
            }

            RemoveEmptyPairs();
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
                SentencePairs.Remove(pair);
            }

            RemoveEmptyPairs();
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

            RemoveEmptyPairs();
            first.Translate.Text = translateText;
            first.Convert.Text = convertText;
            first.NotifyChanged();
            RaisePropertyChanged(nameof(ValidRowCount));
        }

        private void RemoveEmptyPairs()
        {
            foreach (var pair in new List<SentencePairModel>(SentencePairs))
            {
                if (pair.IsEmpty)
                {
                    SentencePairs.Remove(pair);
                }
            }
        }

        private void RunOnUi(Action action)
        {
            _view.Dispatcher.Invoke(action);
        }
    }
}