using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace AWTGen2.BE.NativeHost
{
    internal static class ScriptReader
    {
        private static readonly string[] BackgroundFiles =
           {
            "declare.js",
            "xbrowser.js",
            "tracing.js",
            "dom.js",
            "functioncall.map.js",
            "initialize.js",
            "utils.js",
            "functioncall.impl.js",
            "proxy.js",
            "navigation.js",
            "interceptor.js"
        };

        private static readonly string[] ContentFiles =
        {
            "declare.js",
            "xbrowser.js",
            "tracing.js",
            "dom.js",
            "rect.js",
            "utils.js"
        };

        public static Dictionary<string, string> GetFunctionCallScripts()
        {
            var dict = new Dictionary<string, string>();
            var assembly = Assembly.GetExecutingAssembly();
            var resourceFiles = assembly.GetManifestResourceNames().Where(name => !name.Contains(".Shared."));

            foreach (var file in resourceFiles)
            {
                using var stream = assembly.GetManifestResourceStream(file);
                if (stream == null)
                    continue;
                using var reader = new StreamReader(stream);
                var script = reader.ReadToEnd();
                var fileName = GetFileName(file);
                dict.Add(fileName, script);
            }

            return dict;
        }

        private static string GetFileName(string path)
        {
            var lastIndexOf = path.LastIndexOf('.', path.Length - 4);
            return path.Substring(lastIndexOf + 1);
        }

        public static string GetContentScript()
        {
            return MergeScript(ContentFiles);
        }

        public static string GetBackgroundScript()
        {
            return MergeScript(BackgroundFiles);
        }

        private static string MergeScript(string[] fileNames)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceFiles = assembly.GetManifestResourceNames().Where(name => fileNames.Any(name.EndsWith));

            var builder = new StringBuilder();
            foreach (var file in resourceFiles)
            {
                using var stream = assembly.GetManifestResourceStream(file);
                if (stream == null)
                    continue;
                using var reader = new StreamReader(stream);
                var script = reader.ReadToEnd();
#if INTERNAL_BUILD
                builder.AppendLine($"// {Path.GetFileName(file)}");
#endif
                builder.AppendLine(script);
#if INTERNAL_BUILD
                builder.AppendLine();
#endif
            }

            return builder.ToString();
        }
    }
}