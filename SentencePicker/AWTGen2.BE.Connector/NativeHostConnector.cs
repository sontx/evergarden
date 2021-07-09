using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using System;

namespace AWTGen2.BE.Connector
{
    internal class NativeHostConnector : CommClient
    {
        public Action<Message> OnReceivedMessage { get; set; }
        public Action OnRemoteDisconnected { get; set; }

        public NativeHostConnector(string name) : base(name)
        {
        }

        protected override void OnMessage(Message message)
        {
            OnReceivedMessage?.Invoke(message);
        }

        protected override void OnDisconnected()
        {
            base.OnDisconnected();
            OnRemoteDisconnected?.Invoke();
        }
    }
}