using AWTGen2.BE.Core.Utils;
using System;
using System.Diagnostics;
using System.Linq;
using System.Management;

namespace AWTGen2.BE.Core
{
    public class ConnectionName
    {
        public static readonly string ConnectionIdArgName = "--namedpipe-connection-id";
        public const string ConnectionIdArgDefaultValue = "Default";

        public string BrowserProcessName { get; }
        private readonly string _connectionId;

        public static ConnectionName InstanceFromCalling()
        {
            var process = GetBrowserProcess();
            var commandLine = GetCommandLine(process);
            var connectionId = ExtractConnectionId(commandLine) ?? ConnectionIdArgDefaultValue;
            return new ConnectionName(process.ProcessName, connectionId) { ProcessId = process.Id };
        }

        public int ProcessId { get; private set; } = -1;
        public string Name => $"AWTGen2/{Environment.UserName}/{BrowserProcessName}/{_connectionId}";

        public ConnectionName(string processName, string connectionId = ConnectionIdArgDefaultValue)
        {
            BrowserProcessName = processName;
            _connectionId = connectionId;
        }

        private static string GetCommandLine(Process process)
        {
            using (var searcher = new ManagementObjectSearcher("SELECT CommandLine FROM Win32_Process WHERE ProcessId = " + process.Id))
            using (var objects = searcher.Get())
            {
                return objects.Cast<ManagementBaseObject>().SingleOrDefault()?["CommandLine"]?.ToString();
            }
        }

        private static string ExtractConnectionId(string commandLine)
        {
            if (string.IsNullOrEmpty(commandLine))
                return null;

            var prefix = ConnectionIdArgName + "=";
            var index = commandLine.IndexOf(prefix, StringComparison.Ordinal);
            if (index < 0)
                return ConnectionIdArgDefaultValue;

            return commandLine.Substring(index + prefix.Length).TrimStart('"').TrimEnd('"');
        }

        public string GetName()
        {
            return $"AWTGen2/{Environment.UserName}/{BrowserProcessName}/{_connectionId}";
        }

        private static Process GetBrowserProcess()
        {
            var parent = ParentProcessUtils.GetParentProcess();
            return parent.ProcessName != "cmd"
                ? parent
                : ParentProcessUtils.GetParentProcess(parent.Id);
        }
    }
}