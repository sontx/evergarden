namespace AWTGen2.Core.Utils
{
    public static class SimpleProxyDiedChecker
    {
        public static bool CheckPageDied(string pageContent)
        {
            if (string.IsNullOrWhiteSpace(pageContent))
                return true;

            pageContent = pageContent.ToLower();

            if (pageContent.Contains("denied"))
                return true;
            if (pageContent.Contains("deny"))
                return true;
            if (pageContent.Contains("forbidden"))
                return true;

            return false;
        }
    }
}