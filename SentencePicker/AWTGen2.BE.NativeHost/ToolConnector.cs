using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using System;

namespace AWTGen2.BE.NativeHost
{
    internal class ToolConnector : CommServer
    {
        private readonly int _processId;
        public Func<ExtensionConnector> GetExtensionConnector { get; set; }

        public ToolConnector(string name, int processId)
            : base(name)
        {
            _processId = processId;
        }

        public void SendToTool(dynamic obj)
        {
            Send(obj);
        }

        protected override void OnMessage(Message message)
        {
            var extensionConnector = GetExtensionConnector();
            if (extensionConnector == null)
                return;

            if (message.Method == SupportedFunctions.GetNativeHostState)
            {
                HandleGetNativeHostState(message, extensionConnector);
            }
            else
            {
                extensionConnector.SendToExtension(message);
            }
        }

        private void HandleGetNativeHostState(Message message, ExtensionConnector extensionConnector)
        {
            var state = new
            {
                extensionConnector.IsScriptsLoaded,
                extensionConnector.IsSentHandshake,
                ProcessId = _processId
            };
            message.Data = state;
            SendToTool(message);
        }
    }
}