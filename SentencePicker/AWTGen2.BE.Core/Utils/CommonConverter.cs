using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace AWTGen2.BE.Core.Utils
{
    public static class CommonConverter
    {
        private static readonly JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.Indented
        };

        private static readonly JsonSerializer JsonSerializer = JsonSerializer.Create(JsonSettings);

        public static T Parse<T>(JToken obj)
        {
            if (obj == null)
                return default;

            try
            {
                return obj.ToObject<T>(JsonSerializer);
            }
            catch
            {
                return default;
            }
        }

        public static T Parse<T>(string st)
        {
            if (string.IsNullOrEmpty(st))
                return default;

            try
            {
                return JsonConvert.DeserializeObject<T>(st, JsonSettings);
            }
            catch
            {
                return default;
            }
        }

        public static string GetString(dynamic message)
        {
            return message == null
                ? null
                : JsonConvert.SerializeObject(message, JsonSettings);
        }
    }
}