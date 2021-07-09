using AWTGen2.BE.Command.Properties;
using CommandLine;
using Microsoft.Win32;
using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace AWTGen2.BE.Command
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            var parser = new Parser(config => config.HelpWriter = Console.Out);
            var result = parser.ParseArguments<CommandOptions>(args);
            result.WithParsed(options =>
            {
                Func<BrowserName, bool> action = null;
                BrowserName? browserName = null;

                if (options.Register != null)
                {
                    action = Register;
                    browserName = options.Register;
                }
                else if (options.Unregister != null)
                {
                    action = Unregister;
                    browserName = options.Unregister;
                }
                else if (options.Check != null)
                {
                    action = Check;
                    browserName = options.Check;
                }

                if (action != null)
                {
                    if (browserName.Value == BrowserName.All)
                    {
                        DoWork(BrowserName.Chrome, action);
                        DoWork(BrowserName.Edge, action);
                        DoWork(BrowserName.Firefox, action);
                    }
                    else
                    {
                        DoWork(browserName.Value, action);
                    }
                }
            });
        }

        private static void DoWork(BrowserName name, Func<BrowserName, bool> action)
        {
            Console.WriteLine($@"{name}: {action(name)}");
        }

        private static bool Unregister(BrowserName browserName)
        {
            try
            {
                var info = GetInstallInfo(browserName);
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(info.RegPath, true) ??
                                         Registry.CurrentUser.CreateSubKey(info.RegPath))
                {
                    key?.DeleteSubKey("", true);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
                return false;
            }

            return true;
        }

        private static bool Register(BrowserName browserName)
        {
            Console.WriteLine($@"Registering native host for {browserName}...");
            try
            {
                var info = GetInstallInfo(browserName);
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(info.RegPath, true) ??
                                         Registry.CurrentUser.CreateSubKey(info.RegPath))
                {
                    key?.SetValue("", info.ManifestFile, RegistryValueKind.String);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
                return false;
            }

            return true;
        }

        private static bool Check(BrowserName browserName)
        {
            try
            {
                var info = GetInstallInfo(browserName);
                using (RegistryKey key = Registry.CurrentUser.OpenSubKey(info.RegPath, true) ??
                                         Registry.CurrentUser.CreateSubKey(info.RegPath))
                {
                    var value = key?.GetValue("", null)?.ToString();
                    return !string.IsNullOrEmpty(value)
                           && string.Compare(info.ManifestFile, value, StringComparison.OrdinalIgnoreCase) == 0;
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }

            return false;
        }

        private static dynamic GetInstallInfo(BrowserName browserName)
        {
            string regPath;
            dynamic manifest;
            switch (browserName)
            {
                case BrowserName.Chrome:
                    regPath = @"Software\Google\Chrome\NativeMessagingHosts\";
                    manifest = WriteManifestFile(Resources.ChromeNativeMessageManifest);
                    break;

                case BrowserName.Edge:
                    regPath = @"Software\Microsoft\Edge\NativeMessagingHosts\";
                    manifest = WriteManifestFile(Resources.EdgeNativeMessageManifest);
                    break;

                case BrowserName.Firefox:
                    regPath = @"Software\Mozilla\NativeMessagingHosts\";
                    manifest = WriteManifestFile(Resources.FirefoxNativeMessageManifest);
                    break;

                default:
                    throw new ArgumentOutOfRangeException(nameof(browserName), browserName, null);
            }

            return new
            {
                RegPath = regPath + manifest.Name,
                ManifestFile = manifest.FileName
            };
        }

        private static dynamic WriteManifestFile(string content)
        {
            var obj = JObject.Parse(content);
            var name = obj["name"]?.Value<string>();
            var fileName = Path.GetFullPath($"{name}.json");
            File.WriteAllText(fileName, content);
            return new
            {
                FileName = fileName,
                Name = name
            };
        }
    }
}