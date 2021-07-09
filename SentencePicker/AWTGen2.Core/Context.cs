namespace AWTGen2.Core
{
    public abstract class Context : PropertiesBase
    {
        private static readonly string InputPropName = nameof(InputPropName);

        public object Input
        {
            get => GetProperty<object>(InputPropName);
            set => SetProperty(InputPropName, value);
        }
    }
}