namespace SentencePicker
{
    internal static class SentencePairExtensions
    {
        public static void SetSentenceValue(this SentencePairModel pair, string sentenceName, string value)
        {
            var sentence = typeof(SentencePairModel).GetProperty(sentenceName).GetValue(pair) as SentenceModel;
            sentence.Text = value;
        }

        public static string GetSentenceValue(this SentencePairModel pair, string sentenceName)
        {
            var sentence = typeof(SentencePairModel).GetProperty(sentenceName).GetValue(pair) as SentenceModel;
            return sentence.Text;
        }
    }
}