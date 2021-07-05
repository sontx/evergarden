using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

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
                var newLineAsEndSentence = MessageBox.Show(
                    this,
                    "Break sentences if new line?",
                    Title,
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question,
                    MessageBoxResult.Yes) != MessageBoxResult.No;

                _vm.Load(files.First(file => file.ToLower().EndsWith("translate.json")),
                    files.First(file => file.ToLower().EndsWith("convert.json")),
                    newLineAsEndSentence);
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
    }
}