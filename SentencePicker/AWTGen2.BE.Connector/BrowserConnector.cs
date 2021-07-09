using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace AWTGen2.BE.Connector
{
    public partial class BrowserConnector : IDisposable
    {
        private readonly ConnectionName _connectionName;
        public static readonly int N_TRUE = 1;
        public static readonly int N_FALSE = 0;

        private readonly NativeHostConnector _connector;
        private readonly ManualResetEvent _waitPendingRequestEvent = new ManualResetEvent(true);
        private readonly List<Func<Message, bool>> _registeredResponseHandlers = new List<Func<Message, bool>>(10);

        public int ProcessId { get; private set; }

        public Action<Message> OnUnhandledMessage { get; set; }
        public Action OnDisconnected { get; set; }

        public string PreviousPageSession { get; private set; }
        public string CurrentPageSession { get; private set; }

        public BrowserConnector(ConnectionName connectionName)
        {
            _connectionName = connectionName;
            _connector = new NativeHostConnector(connectionName.Name)
            {
                OnReceivedMessage = OnReceivedMessage,
                OnRemoteDisconnected = HandleDisconnected
            };
            _connector.Start();
        }

        private void HandleDisconnected()
        {
            OnDisconnected?.Invoke();
        }

        private void OnReceivedMessage(Message message)
        {
            UpdatePageSession(message.Data);

            lock (_registeredResponseHandlers)
            {
                foreach (var registeredResponseHandler in _registeredResponseHandlers)
                {
                    if (registeredResponseHandler(message))
                        return;
                }
            }

            OnUnhandledMessage?.Invoke(message);
        }

        public Task<T> CallFunctionAsync<T>(string method, dynamic args, int timeoutInMillis = Timeout.Infinite, bool blockOther = true) where T : class, new()
        {
            return Task.Run(() =>
            {
                ManualResetEvent waitResponseEvent = null;
                Func<Message, bool> responseHandler = null;
                try
                {
                    if (blockOther)
                    {
                        _waitPendingRequestEvent.WaitOne();
                        _waitPendingRequestEvent.Reset();
                    }

                    RefreshPageSessionInternal();

                    var requestId = Guid.NewGuid().ToString();
                    Message receivedMessage = null;

                    waitResponseEvent = new ManualResetEvent(false);
                    responseHandler = message =>
                    {
                        if (requestId == message.RequestId)
                        {
                            receivedMessage = message;
                            waitResponseEvent.Set();
                            return true;
                        }

                        return false;
                    };

                    lock (_registeredResponseHandlers)
                    {
                        _registeredResponseHandlers.Add(responseHandler);
                    }

                    _connector.Send(new Message
                    {
                        Method = method,
                        RequestId = requestId,
                        Data = args
                    });

                    bool isTimeout;
                    if (timeoutInMillis != Timeout.Infinite)
                        isTimeout = !waitResponseEvent.WaitOne(timeoutInMillis);
                    else
                        isTimeout = !waitResponseEvent.WaitOne();

                    if (isTimeout)
                    {
                        if (_connector.IsConnected)
                        {
                            throw new TimeoutException();
                        }

                        throw new BrowserConnectionException("Cannot communicate with the browser extension.");
                    }

                    if (receivedMessage?.Data != null)
                    {
                        return JsonConvert.DeserializeObject<T>(receivedMessage.Data.ToString());
                    }
                }
                catch (Exception ex)
                {
                    if (!(ex is ObjectDisposedException))
                    {
                        Trace.TraceError(ex.Message);
                        Trace.TraceError(ex.StackTrace);

                        throw;
                    }
                }
                finally
                {
                    if (blockOther)
                    {
                        SetWaitPendingRequestEvent();
                    }

                    waitResponseEvent?.Close();

                    if (responseHandler != null)
                    {
                        lock (_registeredResponseHandlers)
                        {
                            _registeredResponseHandlers.Remove(responseHandler);
                        }
                    }
                }

                return default(T);
            });
        }

        private void SetWaitPendingRequestEvent()
        {
            try
            {
                _waitPendingRequestEvent.Set();
            }
            catch
            {
                // ignored
            }
        }

        private void UpdatePageSession(object result)
        {
            if (result != null)
            {
                if (result is JObject jObject && jObject.ContainsKey("pageSession"))
                {
                    CurrentPageSession = jObject["pageSession"]?.Value<string>();
                    if (string.IsNullOrEmpty(PreviousPageSession))
                        PreviousPageSession = CurrentPageSession;
                }
            }
        }

        public void RefreshPageSessionInternal()
        {
            PreviousPageSession = CurrentPageSession;
        }

        public void Dispose()
        {
            _connector.OnReceivedMessage = null;
            _waitPendingRequestEvent.Close();
            _connector.Stop();
        }
    }
}