using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace SentenceAnalyzer
{
    internal class DiffToBrushConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var diff = Math.Abs((int)value);
            if (diff < 10)
                return new SolidColorBrush(Colors.DarkGreen);
            if (diff < 25)
                return new SolidColorBrush(Colors.Green);
            if (diff < 50)
                return new SolidColorBrush(Colors.YellowGreen);
            return new SolidColorBrush(Colors.Red);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}