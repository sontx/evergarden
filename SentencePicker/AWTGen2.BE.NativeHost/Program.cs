using AWTGen2.BE.Core;
using AWTGen2.Core.Utils;
using log4net;
using System;

namespace AWTGen2.BE.NativeHost
{
    internal class Program
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(Program));

        private static void Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            LoggerConfig.Config();

            var connectionName = ConnectionName.InstanceFromCalling();
            if (connectionName.BrowserProcessName != "chrome"
                && connectionName.BrowserProcessName != "firefox"
                && connectionName.BrowserProcessName != "msedge")
            {
                Log.Info("It must be called from browser.");
                return;
            }

            Log.Info("Browser is loading NativeHost");
            Log.Info("Connecting to browser extension and tool...");

            var name = connectionName.Name;
            Log.Info($"Listening from tool on {name}");

            var extensionConnector = new ExtensionConnector();
            var toolConnector = new ToolConnector(name, connectionName.ProcessId);

            extensionConnector.GetToolConnector = () => toolConnector;
            toolConnector.GetExtensionConnector = () => extensionConnector;
            extensionConnector.OnExit = () => Log.Info("NativeHost is shutdown-ing");

            extensionConnector.Start();
            toolConnector.Start();

            Log.Info("Ready for communication!");
        }

        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            var msg = "Unhandled exception occurred";
            if (e.ExceptionObject is Exception ex)
            {
                Log.Error(msg, ex);
            }
            else
            {
                Log.Error(msg);
            }
        }
    }
}