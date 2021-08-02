using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace TitleCompare
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public ObservableCollection<ComparedItem> Items { get; set; }

        public MainWindow()
        {
            InitializeComponent();

            var source = Directory.GetFiles(@"F:\personal\github\evergarden\dump\source", "*.txt");
            var target = Directory.GetFiles(@"F:\personal\github\evergarden\dump\target", "*.txt");

            var sourceChapters = source.Select(item => new Chapter(item)).ToList();
            var targetChapters = target.Select(item => new Chapter(item)).ToList();

            var list = new List<ComparedItem>(Math.Max(sourceChapters.Count, targetChapters.Count));
            for (var i = 0; i < list.Capacity; i++)
            {
                list.Add(new ComparedItem
                {
                    Source = i < sourceChapters.Count ? sourceChapters[i] : Chapter.Empty,
                    Target = i < targetChapters.Count ? targetChapters[i] : Chapter.Empty
                });
            }

            Items = new ObservableCollection<ComparedItem>(list);
            DataContext = this;

        }

        private string CleanupChapter(string content)
        {
            var lines = new List<string>(content.Split(new[] { '\n' }, StringSplitOptions.None).Select(item => item.Trim()));
            var temp = new List<string>(lines);
            var ignored = "IGNORED>>>>>";
            if (lines.Count > 0)
            {
                if (lines[0].StartsWith("Chương "))
                {
                    lines.RemoveAt(0);
                }

                var start = 0;
                for (var i = 0; i < lines.Count - 1; i++)
                {
                    var current = lines[i];
                    if (string.IsNullOrWhiteSpace(current) || IsRepeat(current))
                    {
                        start = i + 1;
                        continue;
                    }

                    var startText = lines[start];
                    var isEndSentence = startText.EndsWith(".") || startText.EndsWith(";") || startText.EndsWith("\"") ||
                                      startText.EndsWith("?") || startText.EndsWith("】");

                    var next = lines[i + 1];
                    var isNextUppercase = !string.IsNullOrWhiteSpace(next) && (char.IsUpper(next[0]) || next[0] == '"' || next[0] == '【');
                    if (!isEndSentence && !isNextUppercase)
                    {
                        lines[start] = lines[start].Trim() + " " + next.Trim();
                        lines[i + 1] = ignored;
                    }
                }
            }
            return string.Join("\n", lines.Where(line => !string.IsNullOrWhiteSpace(line) && line != ignored));
        }

        private bool IsRepeat(string st)
        {
            if (string.IsNullOrWhiteSpace(st))
                return false;

            st = st.Trim();
            var test = st[0];
            foreach (var ch in st)
            {
                if (ch != test)
                {
                    return false;
                }
            }

            return true;
        }

        private void DataGrid_OnPreviewKeyDown(object sender, KeyEventArgs e)
        {
            if (sender is DataGrid dataGrid && dataGrid.SelectedCells.Count > 0)
            {
                if (e.Key == Key.Delete)
                {
                    var cell = dataGrid.SelectedCells.FirstOrDefault();
                    var comparedItem = cell.Item as ComparedItem;

                    if (Keyboard.IsKeyDown(Key.LeftShift) || Keyboard.IsKeyDown(Key.RightShift))
                    {
                        Items.Remove(comparedItem);
                        comparedItem.Target.Backup();
                        comparedItem.Source.Backup();
                        return;
                    }

                    var isTarget = cell.Column.Header?.ToString() == "Target";
                    var startIndex = Items.IndexOf(comparedItem);
                    if (isTarget)
                    {
                        for (var i = startIndex; i < Items.Count - 1; i++)
                        {
                            var current = Items[i];
                            var next = Items[i + 1];
                            current.Target = next.Target;
                        }
                        Items.Last().Target = Chapter.Empty;
                        comparedItem.Target.Backup();
                    }
                    else
                    {
                        for (var i = startIndex; i < Items.Count - 1; i++)
                        {
                            var current = Items[i];
                            var next = Items[i + 1];
                            current.Source = next.Source;
                        }
                        Items.Last().Source = Chapter.Empty;
                        comparedItem.Source.Backup();
                    }
                }
            }
        }

        private void ButtonBase_OnClick(object sender, RoutedEventArgs e)
        {
            Save(Items.Count - 1);
        }

        private void Save(int to)
        {
            var saveDir = @"F:\personal\github\evergarden\dump\save";
            var targetDir = Path.Combine(saveDir, "target");
            var sourceDir = Path.Combine(saveDir, "source");

            if (Directory.Exists(targetDir))
                Directory.Delete(targetDir, true);
            Directory.CreateDirectory(targetDir);
            if (Directory.Exists(sourceDir))
                Directory.Delete(sourceDir, true);
            Directory.CreateDirectory(sourceDir);

            var count = 0;
            for (var i = 0; i <= to; i++)
            {
                var item = Items[i];
                if (!string.IsNullOrEmpty(item.TargetFile) && !string.IsNullOrEmpty(item.SourceFile))
                {
                    count++;
                    File.WriteAllText(Path.Combine(targetDir, $"{count}.txt"), item.Target.Content);
                    File.WriteAllText(Path.Combine(sourceDir, $"{count}.txt"), CleanupChapter(item.Source.Content));
                }
            }

            MessageBox.Show($"Saved {count} chapters");
        }

        private void DataGrid_OnMouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (sender is DataGrid dataGrid && dataGrid.SelectedCells.Count > 0)
            {
                var cell = dataGrid.SelectedCells.FirstOrDefault();
                var comparedItem = cell.Item as ComparedItem;
                var isTarget = cell.Column.Header?.ToString() == "Target";
                var file = isTarget ? comparedItem.Target.FilePath : comparedItem.Source.FilePath;
                Process.Start("notepad.exe", file);
            }
        }

        private void ButtonBase_OnClick1(object sender, RoutedEventArgs e)
        {
            if (DataGrid.SelectedCells.Count > 0)
            {
                var cell = DataGrid.SelectedCells.FirstOrDefault();
                var comparedItem = cell.Item as ComparedItem;
                var stopIndex = Items.IndexOf(comparedItem);
                Save(stopIndex);
            }
        }
    }
}