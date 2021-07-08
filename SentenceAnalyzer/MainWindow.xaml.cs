using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;

namespace SentenceAnalyzer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private readonly MainViewModel _vm;

        public MainWindow()
        {
            InitializeComponent();
            _vm = new MainViewModel(this);
            DataContext = _vm;
        }

        internal void HighlightEditor(SentencePairModel sentencePair)
        {
            if (sentencePair == null || sentencePair.Translate.Text.Length == sentencePair.Convert.Text.Length)
            {
                return;
            }

            var richTextBox1 = new RichTextBox(new FlowDocument(new Paragraph(new Run(sentencePair.Translate.Text))));
            var richTextBox2 = new RichTextBox(new FlowDocument(new Paragraph(new Run(sentencePair.Convert.Text))));
            ContentControl1.Content = richTextBox1;
            ContentControl2.Content = richTextBox2;

            var highlightTextBox = sentencePair.Translate.Text.Length < sentencePair.Convert.Text.Length
                ? richTextBox2
                : richTextBox1;
            var minLength = Math.Min(sentencePair.Translate.Text.Length, sentencePair.Convert.Text.Length);
            var textRange = new TextRange(highlightTextBox.Document.ContentStart, highlightTextBox.Document.ContentEnd);
            var highlightRange = new TextRange(textRange.Start, textRange.Start.GetPositionAtOffset(minLength));
            highlightRange.ApplyPropertyValue(TextElement.ForegroundProperty, Brushes.DarkGreen);

            HighlightMatchedWords(richTextBox1, sentencePair.MatchedWordsCached);
            HighlightMatchedWords(richTextBox2, sentencePair.MatchedWordsCached);
        }

        private void HighlightMatchedWords(RichTextBox richTextBox, string[] matchedWords)
        {
            var ranges = GetAllWordRanges(richTextBox.Document);
            foreach (var range in ranges)
            {
                var normalizedWord = range.Text.NonUnicode().ToLower();
                if (matchedWords.Contains(normalizedWord))
                {
                    range.ApplyPropertyValue(TextElement.FontWeightProperty, FontWeights.ExtraBold);
                    range.ApplyPropertyValue(TextElement.FontStyleProperty, FontStyles.Italic);
                }
            }
        }

        private static IEnumerable<TextRange> GetAllWordRanges(FlowDocument document)
        {
            var pattern = @"[^\W\d](\w|[-']{1,2}(?=\w))*";
            var pointer = document.ContentStart;
            while (pointer != null)
            {
                if (pointer.GetPointerContext(LogicalDirection.Forward) == TextPointerContext.Text)
                {
                    var textRun = pointer.GetTextInRun(LogicalDirection.Forward);
                    var matches = Regex.Matches(textRun, pattern);
                    foreach (Match match in matches)
                    {
                        var startIndex = match.Index;
                        var length = match.Length;
                        var start = pointer.GetPositionAtOffset(startIndex);
                        var end = start.GetPositionAtOffset(length);
                        yield return new TextRange(start, end);
                    }
                }

                pointer = pointer.GetNextContextPosition(LogicalDirection.Forward);
            }
        }

        private void DataGrid_OnPreviewKeyDown(object sender, KeyEventArgs e)
        {
            var isDelete = e.Key == Key.Delete;
            var isMerge = e.Key == Key.M && (Keyboard.IsKeyDown(Key.LeftCtrl) || Keyboard.IsKeyDown(Key.RightCtrl));
            if (!isDelete && !isMerge)
            {
                return;
            }

            var dataGrid = (DataGrid)sender;
            var cells = dataGrid.SelectedCells;
            if (cells.Count == 0 && cells.All(cell => cell.Column.Header.ToString() == "Translate" || cell.Column.Header.ToString() == "Convert"))
                return;

            var test = cells[0];
            var isSameColumn = cells.All(cell => cell.Column.Header.ToString() == test.Column.Header.ToString());

            var pairs = cells.Select(cell => cell.Item as SentencePairModel).Distinct().ToList();
            if (isDelete)
            {
                if (isSameColumn)
                {
                    _vm.RemoveSentences(pairs, test.Column.Header.ToString());
                }
                else
                {
                    _vm.RemoveSentencePairs(pairs);
                }
            }
            else if (pairs.Count > 1)
            {
                if (isSameColumn)
                {
                    _vm.MergeSentences(pairs, test.Column.Header.ToString());
                }
                else
                {
                    _vm.MergeSentencePairs(pairs);
                }
            }
        }

        protected override async void OnDrop(DragEventArgs e)
        {
            if (!e.Data.GetDataPresent(DataFormats.FileDrop)) return;

            var files = (string[])e.Data.GetData(DataFormats.FileDrop);
            if (files.Length == 2 && files.All(file =>
                file.ToLower().EndsWith("translate.json") || file.ToLower().EndsWith("convert.json")))
            {
                _vm.Load(files.First(file => file.ToLower().EndsWith("translate.json")),
                    files.First(file => file.ToLower().EndsWith("convert.json")));
            }
            else if (files.Length == 1)
            {
                var file = files.First();
                if (Directory.Exists(file))
                {
                    var projectFile = Path.Combine(file, "project.json");
                    if (File.Exists(projectFile))
                    {
                        var project = FileUtils.FileToObject<Project>(projectFile);
                        project.ProjectDir = file;
                        await _vm.LoadAsync(new ProjectManager(project));
                    }
                }
                else if (file.EndsWith("project.json"))
                {
                    var project = FileUtils.FileToObject<Project>(file);
                    project.ProjectDir = Path.GetDirectoryName(file);
                    await _vm.LoadAsync(new ProjectManager(project));
                }
            }
        }

        private void MenuButton_OnClick(object sender, RoutedEventArgs e)
        {
            if (sender is Button button)
            {
                button.ContextMenu.DataContext = _vm;
                button.ContextMenu.IsOpen = true;
            }
        }

        protected override void OnPreviewKeyDown(KeyEventArgs e)
        {
            if (e.Key == Key.Escape)
            {
                CloseEditor();
            }
            base.OnPreviewKeyDown(e);
        }

        private void EditorCloseButton_OnClick(object sender, RoutedEventArgs e)
        {
            CloseEditor();
        }

        private void CloseEditor()
        {
            var sentencePair = _vm.EditingSentencePair;
            if (sentencePair != null && ContentControl1.Content is RichTextBox richTextBox1 && ContentControl2.Content is RichTextBox richTextBox2)
            {
                var newTranslate = GetDocumentText(richTextBox1);
                var newConvert = GetDocumentText(richTextBox2);
                sentencePair.Translate.Text = newTranslate.Trim();
                sentencePair.Convert.Text = newConvert.Trim();
            }
            _vm.EditingSentencePair = null;
        }

        private string GetDocumentText(RichTextBox richTextBox)
        {
            var range = new TextRange(richTextBox.Document.ContentStart, richTextBox.Document.ContentEnd);
            return range.Text;
        }
    }
}