using AWTGen2.BE.Core;
using AWTGen2.BE.Core.Data;
using AWTGen2.BE.Core.Utils;
using log4net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Threading;

namespace AWTGen2.BE.NativeHost
{
    internal class ExtensionConnector
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(ExtensionConnector));

        private readonly ThreadWrapper _thread;

        public Func<ToolConnector> GetToolConnector { get; set; }
        public Action OnExit { get; set; }
        public bool IsScriptsLoaded { get; set; }
        public bool IsSentHandshake { get; set; }

        public ExtensionConnector()
        {
            _thread = new ThreadWrapper
            {
                DoWork = WaitForInComingMessage
            };
        }

        private void WaitForInComingMessage()
        {
            try
            {
                Thread.Sleep(200);
                SendHandshake();
                IsSentHandshake = true;

                Log.Info("Waiting for incoming messages...");

                var toolConnector = GetToolConnector();

                JObject data;
                while ((data = ReadFromExtension()) != null)
                {
                    var method = data.Property("method")?.Value?.Value<string>();
                    Log.Debug($"Received a message from the extension: {method}");

                    if (method == SupportedFunctions.LoadScripts)
                    {
                        SendScriptsToExtension(data.Property("requestId")?.Value?.Value<string>());
                        Log.Debug("Sent scripts back to the extension");
                    }
                    else if (method == SupportedFunctions.LoadedScripts)
                    {
                        IsScriptsLoaded = true;
                        Log.Debug("The extensions loaded scripts");
                    }
                    else
                    {
                        toolConnector.SendToTool(data);
                        Log.Debug("Sent message to the tool");
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Error("Error while receiving messages from the extension", ex);
            }
            finally
            {
                Log.Info("Exit waiting for incoming message!");
                OnExit?.Invoke();
            }
        }

        private void SendHandshake()
        {
            SendToExtension(new Message { Method = SupportedFunctions.Handshake });
            Log.Info("Sent handshake to the extension");
            Thread.Sleep(1000);
        }

        private JObject ReadFromExtension()
        {
            try
            {
                return DoReadFromExtension();
            }
            catch (Exception ex)
            {
                Log.Error("Can not convert message from extension to JSON object", ex);
                return null;
            }
        }

        private JObject DoReadFromExtension()
        {
            var lengthBytes = new byte[4];
            var stdin = Console.OpenStandardInput();
            stdin.Read(lengthBytes, 0, 4);
            var length = BitConverter.ToInt32(lengthBytes, 0);
            var buffer = new char[length];
            using (var reader = new StreamReader(stdin))
            {
                while (reader.Peek() >= 0)
                {
                    reader.Read(buffer, 0, buffer.Length);
                }
            }

            return JsonConvert.DeserializeObject<JObject>(new string(buffer));
        }

        /// <summary>
        /// Source code: https://stackoverflow.com/questions/30880709/c-sharp-native-host-with-chrome-native-messaging
        /// </summary>
        public void SendToExtension(dynamic obj)
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(CommonConverter.GetString(obj));
            var stdout = Console.OpenStandardOutput();
            stdout.WriteByte((byte)((bytes.Length >> 0) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 8) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 16) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 24) & 0xFF));
            stdout.Write(bytes, 0, bytes.Length);
            stdout.Flush();
        }

        private void SendScriptsToExtension(string id)
        {
            var backgroundScript = ScriptReader.GetBackgroundScript();
            var contentScript = ScriptReader.GetContentScript();
            var functionCallScripts = ScriptReader.GetFunctionCallScripts();

            var message = new JObject { { "background", backgroundScript }, { "content", contentScript } };
            foreach (var functionCallScript in functionCallScripts)
            {
                message.Add(functionCallScript.Key, functionCallScript.Value);
            }

            message.Add("returnId", id);

            SendToExtension(message);
        }

        public void Start()
        {
            _thread.Start(false);
        }
    }
}