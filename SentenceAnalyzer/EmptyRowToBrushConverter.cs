using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace SentenceAnalyzer
{
    internal class EmptyRowToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is SentencePairModel pair)
            {
                if (!pair.IsValid)
                {
                    return new SolidColorBrush(Colors.Gray);
                }
            }
            return new SolidColorBrush(Colors.White);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}