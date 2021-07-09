using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SentencePicker
{
    internal static class FileUtils
    {
        public static string GetDir(params string[] paths)
        {
            var path = Path.Combine(paths);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return path;
        }

        public static T FileToObject<T>(string file)
        {
            var json = File.ReadAllText(file);
            return JsonConvert.DeserializeObject<T>(json);
        }

        public static void ObjectToFile(object obj, string file)
        {
            var json = JsonConvert.SerializeObject(obj, Formatting.Indented);
            File.WriteAllText(file, json);
        }

        public static Task ObjectToFileAsync(object obj, string file)
        {
            return Task.Run(() => ObjectToFile(obj, file));
        }
    }
}