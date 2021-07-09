using System.Drawing;

namespace AWTGen2.Core.Utils
{
    public static class ImageUtils
    {
        public static byte[] ToBytes(Bitmap img)
        {
            var converter = new ImageConverter();
            return (byte[])converter.ConvertTo(img, typeof(byte[]));
        }
    }
}