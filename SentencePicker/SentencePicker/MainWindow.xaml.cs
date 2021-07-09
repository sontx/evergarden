using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Input;

namespace SentencePicker
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly MainViewModel _vm;

        public MainWindow()
        {
            InitializeComponent();
            _vm = new MainViewModel(this);
            DataContext = _vm;
        }

        protected override async void OnDrop(DragEventArgs e)
        {
            if (!e.Data.GetDataPresent(DataFormats.FileDrop)) return;

            var files = (string[])e.Data.GetData(DataFormats.FileDrop);
            var file = files?.FirstOrDefault();
            if (file != null && System.IO.Path.GetExtension(file).ToLower() == ".csv")
            {
                await _vm.LoadAsync(file);
            }
        }

        private void DataGrid_OnPreviewKeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Delete)
            {
                var temp = new List<SentencePairModel>();
                foreach (SentencePairModel item in DataGrid.SelectedItems)
                {
                    temp.Add(item);
                }

                foreach (var item in temp)
                {
                    _vm.SentencePairs.Remove(item);
                }
            }
        }
    }
}