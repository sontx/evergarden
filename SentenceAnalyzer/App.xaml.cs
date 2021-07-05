using Blackcat.Configuration;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;

namespace SentenceAnalyzer
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
            Dispatcher.UnhandledException += Dispatcher_UnhandledException;
            ConfigLoader.Default.InitializeSettings(new object[]{new AppSettings
            {
                Filters = new List<DiffFilter>
                {
                    new() {Peak = 10, Color = Colors.Green},
                    new() {Peak = 25, Color = Colors.YellowGreen},
                    new() {Peak = 50, Color = Colors.Yellow},
                    new() {Peak = 75, Color = Colors.Red},
                    new() {Peak = 100, Color = Colors.DarkRed},
                }
            }});
            base.OnStartup(e);
        }

        protected override void OnExit(ExitEventArgs e)
        {
            ConfigLoader.Default.Dispose();
            base.OnExit(e);
        }

        private void Dispatcher_UnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            ShowError(e.Exception);
        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            if (e.ExceptionObject is Exception ex)
            {
                ShowError(ex);
            }
        }

        private void ShowError(Exception ex)
        {
            MessageBox.Show(
                $"{ex.Message}{Environment.NewLine}{ex.StackTrace}",
                "Unhandled exception",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
        }
    }
}