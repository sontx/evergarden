using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AWTGen2.Settings.Browser
{
    public class BrowserExtension
    {
        private readonly object _lockObj = new object();
        private JObject _jsonContent;

        public string Location { get; set; }

        [JsonIgnore]
        public string Name
        {
            get
            {
                LoadIfNeeded();
                return GetTranslatedMessage(_jsonContent["name"]?.Value<string>());
            }
        }

        [JsonIgnore]
        public string Description
        {
            get
            {
                LoadIfNeeded();
                return GetTranslatedMessage(_jsonContent["description"]?.Value<string>());
            }
        }

        [JsonIgnore]
        public string Icon
        {
            get
            {
                LoadIfNeeded();
                var name = _jsonContent["icons"]?.Value<string>("16");
                return string.IsNullOrEmpty(name) ? null : Path.Combine(Location, name);
            }
        }

        public bool Enabled { get; set; }

        [JsonIgnore]
        public bool IsFrozen { get; set; }

        private string GetTranslatedMessage(string value)
        {
            var localesDir = Path.Combine(Location, "_locales");
            if (!Directory.Exists(localesDir))
                return value;

            var start = "__MSG_";
            var end = "__";

            if (!(value.StartsWith(start) && value.EndsWith(end)))
                return value;

            var key = value.Substring(start.Length).Substring(0, value.Length - start.Length - end.Length);

            if (string.IsNullOrEmpty(key))
                return value;

            var preferLocales = new[] { "en", "en_US", "en_GB" };
            var localeDir = string.Empty;
            foreach (var preferLocale in preferLocales)
            {
                var temp = Path.Combine(localesDir, preferLocale);
                if (Directory.Exists(temp))
                {
                    localeDir = temp;
                    break;
                }
            }

            if (string.IsNullOrEmpty(localeDir))
            {
                var directories = Directory.GetDirectories(localesDir, "*.*", SearchOption.TopDirectoryOnly);
                localeDir = directories.FirstOrDefault();
            }

            if (string.IsNullOrEmpty(localeDir))
                return value;

            var messageFile = Path.Combine(localeDir, "messages.json");
            if (!File.Exists(messageFile))
                return value;

            var messageFileContent = File.ReadAllText(messageFile);
            var messages = JObject.Parse(messageFileContent);
            return messages.GetValue(key)?.Value<string>("message") ?? value;
        }

        private void LoadIfNeeded()
        {
            lock (_lockObj)
            {
                if (_jsonContent != null)
                    return;

                var manifestPath = Path.Combine(Location, "manifest.json");
                var rawContent = File.ReadAllText(manifestPath);
                _jsonContent = JObject.Parse(rawContent);
            }
        }

        public override string ToString()
        {
            return Name;
        }
    }
}