using System.IO;

namespace TitleCompare
{
    public class Chapter
    {
        public static readonly Chapter Empty = new()
        {
            Content = string.Empty,
            FilePath = string.Empty,
            Title = string.Empty
        };

        public string Title { get; set; }
        public string FilePath { get; set; }
        public string FileName => string.IsNullOrEmpty(FilePath) ? string.Empty : Path.GetFileName(FilePath);
        public string Content { get; set; }

        public Chapter()
        {
        }

        public Chapter(string file)
        {
            FilePath = file;
            Content = File.ReadAllText(file);

            var fileName = FileName;
            var temp = fileName.Substring(fileName.IndexOf('-') + 1).Trim();
            Title = Path.GetFileNameWithoutExtension(temp);
        }

        public void Backup()
        {
            if (!File.Exists(FilePath))
                return;

            var dir = @"F:\personal\github\evergarden\dump\";
            var destDir = Path.Combine(dir,
                Path.GetDirectoryName(FilePath).EndsWith("target") ? "target-backup" : "source-backup");
            var dest = Path.Combine(destDir, Path.GetFileName(FileName));
            File.Move(FilePath, dest);
        }
    }
}