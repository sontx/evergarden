using AWTGen2.BE.Connector;
using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using Newtonsoft.Json.Linq;
using System;

namespace SentencePicker
{
    internal class SentencePickerListener : IDisposable
    {
        private readonly BrowserConnector _edgeConnector;
        private readonly BrowserConnector _chromeConnector;

        public Action<PickedData> OnPicked { get; set; }

        public SentencePickerListener()
        {
            _edgeConnector = new BrowserConnector(new ConnectionName("msedge"));
            _chromeConnector = new BrowserConnector(new ConnectionName("chrome"));
            Start();
        }

        public void Start()
        {
            _edgeConnector.OnUnhandledMessage = OnUnhandledMessage;
            _chromeConnector.OnUnhandledMessage = OnUnhandledMessage;
        }

        private void OnUnhandledMessage(Message msg)
        {
            if (!string.IsNullOrEmpty(msg.Method))
            {
                return;
            }

            var jobj = (JObject)msg.Data;
            var pickedData = jobj.ToObject<PickedData>();
            OnPicked?.Invoke(pickedData);
        }

        public void Dispose()
        {
            _edgeConnector?.Dispose();
            _chromeConnector?.Dispose();
        }
    }
}