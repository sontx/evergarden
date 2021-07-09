using CommandLine;

namespace AWTGen2.BE.Command
{
    internal enum BrowserName
    {
        All,
        Chrome,
        Edge,
        Firefox
    }

    internal class CommandOptions
    {
        [Option("register", HelpText = "Register native host with a specific browser")]
        public BrowserName? Register { get; set; }

        [Option("unregister", HelpText = "Unregister native host with a specific browser")]
        public BrowserName? Unregister { get; set; }

        [Option("check", HelpText = "Check if native host is registered with a specific browser")]
        public BrowserName? Check { get; set; }
    }
}