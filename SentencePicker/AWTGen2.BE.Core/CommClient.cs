using AWTGen2.BE.Core.Data;
using AWTGen2.BE.Core.Utils;
using log4net;
using NamedPipeWrapper;
using System;
using System.Threading.Tasks;

namespace AWTGen2.BE.Core
{
    public abstract class CommClient
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(CommClient));

        private readonly NamedPipeClient<string> _client;
        private volatile bool _raiseDisconnected;

        public bool IsConnected { get; private set; }

        protected CommClient(string name)
        {
            _client = new NamedPipeClient<string>(name) { AutoReconnect = true };
            _client.Disconnected += _client_Disconnected;
            _client.Error += _client_Error;
            _client.ServerMessage += _client_ServerMessage;
        }

        public async void Start()
        {
            await Task.Run(() =>
            {
                _client.Start();
                _client.WaitForConnection(30000);
                IsConnected = true;
            });
        }

        public void Stop()
        {
            _client.Disconnected -= _client_Disconnected;
            _client.Error -= _client_Error;
            _client.ServerMessage -= _client_ServerMessage;

            _client.Stop();

            if (!_raiseDisconnected)
            {
                _raiseDisconnected = true;
                OnDisconnected();
            }
        }

        public void Send(dynamic message)
        {
            var json = CommonConverter.GetString(message);
            if (json != null)
            {
                _client.PushMessage(json);
                Log.Debug("NamedPipeClient sent a message");
            }
        }

        protected virtual void OnError(Exception ex)
        {
        }

        protected virtual void OnDisconnected()
        {
            Log.Info("NamedPipeClient disconnected");
            IsConnected = false;
        }

        protected abstract void OnMessage(Message message);

        private void _client_ServerMessage(NamedPipeConnection<string, string> connection, string stMessage)
        {
            Log.Debug("NamedPipeClient received a message");
            var message = CommonConverter.Parse<Message>(stMessage);
            if (message != null)
                OnMessage(message);
            else
                Log.Error($"Can not parse message to JSON object: {stMessage}");
        }

        private void _client_Error(Exception exception)
        {
            Log.Error("NamedPipeClient error", exception);
            OnError(exception);
        }

        private void _client_Disconnected(NamedPipeConnection<string, string> connection)
        {
            if (!_raiseDisconnected)
            {
                _raiseDisconnected = true;
                OnDisconnected();
            }
        }
    }
}