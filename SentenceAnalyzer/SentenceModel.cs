using GalaSoft.MvvmLight;

namespace SentenceAnalyzer
{
    internal class SentenceModel : ObservableObject
    {
        private string _text;
        public string Id { get; set; }

        public string Text
        {
            get => _text;
            set => Set(ref _text, value);
        }

        public override string ToString()
        {
            return Text;
        }
    }
}