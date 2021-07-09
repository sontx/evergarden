using System;
using System.Collections.Generic;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace SentencePicker
{
    internal class DiffToBrushConverter : IValueConverter
    {
        private static readonly List<Filter> _filters = new List<Filter>
        {
            new() {Peak = 10, Color = Brushes.Green},
            new() {Peak = 25, Color = Brushes.YellowGreen},
            new() {Peak = 50, Color = Brushes.Yellow},
            new() {Peak = 75, Color = Brushes.Red},
            new() {Peak = 100, Color = Brushes.DarkRed},
        };

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var diff = Math.Abs(long.Parse(value.ToString()));

            var filters = _filters;
            if (filters != null)
            {
                var found = filters.Find(filter => diff <= filter.Peak);
                if (found != null)
                {
                    return found.Color;
                }
            }

            return Brushes.Red;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }

        private class Filter
        {
            public SolidColorBrush Color { get; set; }
            public int Peak { get; set; }
        }
    }
}