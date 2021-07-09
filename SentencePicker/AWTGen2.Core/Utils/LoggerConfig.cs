using log4net;
using log4net.Appender;
using log4net.Config;
using log4net.Repository.Hierarchy;
using System;
using System.IO;
using System.Reflection;

namespace AWTGen2.Core.Utils
{
    public static class LoggerConfig
    {
        public static void Config()
        {
            var binDir = Path.GetDirectoryName(Assembly.GetEntryAssembly()?.Location) ?? Environment.CurrentDirectory;
            var logDir = Path.Combine(binDir, "Logs");
            var configFile = Path.Combine(binDir, "log4net.config");

            GlobalContext.Properties["ComponentName"] =
                Path.GetFileNameWithoutExtension(Assembly.GetEntryAssembly()?.Location);
            GlobalContext.Properties["LogDir"] = logDir;

            XmlConfigurator.ConfigureAndWatch(new FileInfo(configFile));
        }

        public static void AddAppender(IAppender appender)
        {
            var hierarchy = (Hierarchy)LogManager.GetRepository();
            hierarchy.Root.AddAppender(appender);
        }

        public static void RemoveAppender(IAppender appender)
        {
            var hierarchy = (Hierarchy)LogManager.GetRepository();
            hierarchy.Root.RemoveAppender(appender);
        }
    }
}