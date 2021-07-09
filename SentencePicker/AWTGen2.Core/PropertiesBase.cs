using System.Collections.Generic;

namespace AWTGen2.Core
{
    public abstract class PropertiesBase
    {
        private readonly Dictionary<string, object> _properties = new();

        public T GetProperty<T>(string name, T defaultValue = default)
        {
            lock (_properties)
            {
                return _properties.ContainsKey(name) ? (T)_properties[name] : defaultValue;
            }
        }

        public void SetProperty(string name, object value)
        {
            lock (_properties)
            {
                _properties[name] = value;
            }
        }

        public void RemoveProperty(string key)
        {
            lock (_properties)
            {
                _properties.Remove(key);
            }
        }
    }
}