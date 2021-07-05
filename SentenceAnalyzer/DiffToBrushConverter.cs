using Blackcat.Configuration;
using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace SentenceAnalyzer
{
    internal class DiffToBrushConverter : IValueConverter
    {
        private readonly AppSettings _settings;

        public DiffToBrushConverter()
        {
            _settings = ConfigLoader.Default.Get<AppSettings>();
        }

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var diff = Math.Abs(long.Parse(value.ToString()));

            var filters = _settings.Filters;
            if (filters != null)
            {
                var found = filters.Find(filter => diff <= filter.Peak);
                if (found != null)
                {
                    return new SolidColorBrush(found.Color);
                }
            }

            return new SolidColorBrush(Colors.Red);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}