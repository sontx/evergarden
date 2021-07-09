using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace AWTGen2.Core.Utils
{
    public class ObjectEncoder
    {
        public static string EncodeObject(object obj)
        {
            return new ObjectEncoder().Encode(obj);
        }

        public string ElementSeparator { get; set; } = " | ";
        public string PropertySeparator { get; set; } = " | ";
        public string OpenBracket { get; set; } = "[";
        public string CloseBracket { get; set; } = "]";
        public bool UpperCaseName { get; set; } = true;

        public string Encode(object obj)
        {
            return Encode(obj, null, false);
        }

        public string Encode(object obj, string name, bool ignoreName)
        {
            if (obj == null) return null;
            return obj is IList
                ? EncodeList(obj, name)
                : EncodeObject(obj, ignoreName);
        }

        private string EncodeObject(object obj, bool ignoreName)
        {
            var type = obj.GetType();
            var values = type
                .GetProperties()
                .Where(prop => prop.GetCustomAttribute<EncoderIgnoredAttribute>() == null)
                .Select(prop => IsPrimitive(prop) ? GetPropertyValue(prop, obj) : Encode(prop.GetValue(obj), prop.Name, ignoreName))
                .Where(st => !string.IsNullOrEmpty(st))
                .ToArray();

            if (!values.Any())
                return null;

            var joinedValues = string.Join(PropertySeparator, values);
            var name = "";
            if (!ignoreName)
            {
                var nameAttribute = type.GetCustomAttribute<DisplayNameAttribute>();
                name = nameAttribute != null ? nameAttribute.DisplayName : type.Name.FromCamelCase();
            }
            return BuildBlock(joinedValues, name);
        }

        private string GetPropertyValue(PropertyInfo prop, object container)
        {
            var value = prop.GetValue(container)?.ToString();
            return value.RemoveNewLines();
        }

        private string BuildBlock(string joinedValues, string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var newName = UpperCaseName ? name.ToUpper() : name;
                return $"{newName}: {OpenBracket}{joinedValues}{CloseBracket}";
            }
            return joinedValues;
        }

        private string EncodeList(object listObj, string name)
        {
            var list = listObj as IList;
            if (list.Count > 0)
            {
                var tempList = new List<string>(list.Count);
                foreach (var element in list)
                {
                    if (element != null)
                    {
                        var encoded = Encode(element, null, true);
                        if (!string.IsNullOrEmpty(encoded))
                            tempList.Add(encoded);
                    }
                }

                if (tempList.Count > 1)
                {
                    var decoratedValues = tempList.Select(value => $"{OpenBracket}{value}{CloseBracket}");
                    var joinedValues = string.Join(ElementSeparator, decoratedValues);
                    return BuildBlock(joinedValues, name);
                }
                else if (tempList.Count == 1)
                {
                    var joinedValues = string.Join(ElementSeparator, tempList);
                    return BuildBlock(joinedValues, name);
                }
            }
            return null;
        }

        private bool IsPrimitive(PropertyInfo propertyInfo)
        {
            var type = propertyInfo.PropertyType;
            return type.IsPrimitive || type == typeof(decimal) || type == typeof(string);
        }
    }
}