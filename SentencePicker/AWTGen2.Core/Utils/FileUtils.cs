using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AWTGen2.Core.Utils
{
    public static class FileUtils
    {
        public static Task<string[]> ReadAllLinesAsync(string fileName)
        {
            return Task.Run(() => File.ReadAllLines(fileName));
        }

        public static Task<string> ReadAllTextAsync(string fileName)
        {
            return Task.Run(() => File.ReadAllText(fileName));
        }

        public static string GetValidFileName(string name, char invalidCharReplacement)
        {
            var invalidFileNameChars = Path.GetInvalidFileNameChars();
            var validFileNameBuilder = new StringBuilder(name.Length);
            foreach (var ch in name)
            {
                validFileNameBuilder.Append(invalidFileNameChars.Contains(ch) ? invalidCharReplacement : ch);
            }

            return validFileNameBuilder.ToString();
        }
    }
}