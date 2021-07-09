using Newtonsoft.Json;
using System;
using System.Linq;
using System.Reflection;
using System.Threading;

namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class OptionBase
    {
        public int TimeoutInMillis { get; set; } = Timeout.Infinite;

        [JsonIgnore]
        public bool ThrowIfFailed { get; set; } = true;

        public T Clone<T>() where T : OptionBase
        {
            var newOption = Activator.CreateInstance<T>();

            var srcType = GetType();
            var destType = newOption.GetType();

            var srcProps = srcType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(prop => prop.CanRead && prop.CanWrite)
                .ToArray();
            var destProps = destType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(prop => prop.CanRead && prop.CanWrite)
                .ToArray();

            foreach (var srcProp in srcProps)
            {
                foreach (var destProp in destProps)
                {
                    if (srcProp.Name != destProp.Name)
                        continue;

                    var value = srcProp.GetValue(this);
                    destProp.SetValue(newOption, value);
                    break;
                }
            }

            return newOption;
        }
    }
}