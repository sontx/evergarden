using System;
using AWTGen2.BE.Core.Data;
using AWTGen2.BE.Core.Utils;
using log4net;
using NamedPipeWrapper;

namespace AWTGen2.BE.Core
{
    public abstract class CommServer
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(CommServer));

        private readonly NamedPipeServer<string> _server;

        protected CommServer(string name)
        {
            _server = new NamedPipeServer<string>(name);
            _server.ClientConnected += _server_ClientConnected;
            _server.ClientDisconnected += _server_ClientDisconnected;
            _server.ClientMessage += _server_ClientMessage;
            _server.Error += _server_Error;
        }

        public void Start()
        {
            _server.Start();
        }

        public void Stop()
        {
            _server.ClientConnected -= _server_ClientConnected;
            _server.ClientDisconnected -= _server_ClientDisconnected;
            _server.ClientMessage -= _server_ClientMessage;
            _server.Error -= _server_Error;

            _server.Stop();
        }

        protected void Send(dynamic message)
        {
            var json = CommonConverter.GetString(message);
            if (json != null)
            {
                _server.PushMessage(json);
                Log.Debug("NamedPipeServer sent a message");
            }
        }

        protected virtual void OnError(Exception ex)
        {
        }

        protected virtual void OnConnected()
        {
        }

        protected virtual void OnDisconnected()
        {
        }

        protected abstract void OnMessage(Message message);

        private void _server_Error(Exception exception)
        {
            Log.Error("NamedPipeServer error", exception);
            OnError(exception);
        }

        private void _server_ClientMessage(NamedPipeConnection<string, string> connection, string stMessage)
        {
            Log.Debug("NamedPipeServer received a message");
            var message = CommonConverter.Parse<Message>(stMessage);
            if (message != null)
                OnMessage(message);
            else
                Log.Error($"Can not parse message to JSON object: {stMessage}");
        }

        private void _server_ClientDisconnected(NamedPipeConnection<string, string> connection)
        {
            Log.Info("NamedPipeServer disconnected");
            OnDisconnected();
        }

        private void _server_ClientConnected(NamedPipeConnection<string, string> connection)
        {
            Log.Info("NamedPipeServer connected");
            OnConnected();
        }
    }
}