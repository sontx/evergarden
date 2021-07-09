var g_loadExternalCode = true;
var g_codeMap = null;
var g_isImplLoaded = false;
var g_fetchedScript = false;

var logger = {
	log: function (message) {
		try {
			console.log(message);
		} catch (e) { }
	},
	error: function (message) {
		try {
			console.error(message);
		} catch (e) { }
	},
};

// Edge has chrome object but only chrome.app so Object which has i18n method is real API object.
chrome = (chrome && chrome.i18n && chrome) || (browser && browser.i18n && browser);

// On first run after installation or update, refresh the opened browser pages
chrome.runtime.onInstalled.addListener(function (details) {
	try {
		if (details.reason === "install") {
			logger.log("AWT extension first installed");
		}

		chrome.tabs.query({}, function (tabsList) {
			for (let tab of tabsList) {
				if (isValidUrl(tab.url)) {
					chrome.tabs.reload(tab.id, {});
				}
			}
		});
	} catch (e) {
		logger.error("AWT Exception: " + e);
	}
});

function IsFirefoxBrowser() {
	return window.mozInnerScreenX !== undefined;
}

function IsChromeBrowser() {
	return !IsFirefoxBrowser();
}

function generateRandomHex(size) {
	return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

// Create the message port that communicates with the Chrome Native Messaging application.
var g_nativeMsgComm = (function () {
	var m_returnMap = {};
	var nativeAppName = IsChromeBrowser() ? "com.awtgen2.chromium" : "com.awtgen2.firefox";

	var m_nativeMsgPort = chrome.runtime.connectNative(nativeAppName);

	var RegisterReturnCallback = function (returnFunc) {
		const requestId = generateRandomHex(16);
		m_returnMap[requestId] = returnFunc;
		return requestId;
	};

	var HandleReturnCallback = function (returnId, params) {
		var returnFunc = m_returnMap[returnId];
		if (returnFunc !== undefined) {
			returnFunc(params);
			delete m_returnMap[returnId];
		}
	};

	var HandleFunctionCall = function (message) {
		if (typeof g_functionCallMap === "undefined") {
			logger.error("HandleFunctionCall could not handle message.method: " + message.method);
			return;
		}

		const requestId = message.requestId;
		const method = message.method;
		const requestedFunc = g_functionCallMap[method];

		if (requestedFunc !== undefined) {
			// Call the requested function and get the return data.
			requestedFunc(message, function (responseData) {
				// Copy the request id to the return data.
				if (requestId && responseData) {
					// Post the return data back to the native messaging app.
					m_nativeMsgPort.postMessage({
						data: responseData,
						requestId: requestId,
						method: method,
					});
				}
			});
		} else {
			logger.error("HandleFunctionCall: requested function is not available message.method: " + message.method);
		}
	};

	m_nativeMsgPort.onMessage.addListener(function (message) {
		if (typeof message === "undefined") {
			logger.error("m_nativeMsgPort.onMessage message param is undefined");
			return;
		}

		if (typeof message === "string") {
			message = JSON.parse(message);
		}

		if (message.method === "Handshake") {
			logger.log("Received handshake message from the extension");
			ChangeImplementation(() => {
				logger.log("Fetched scripts from the native host");
				g_fetchedScript = true;
			});
			return;
		}

		if (message.method) {
			HandleFunctionCall(message);
		} else if (message.returnId) {
			// This message contains return data from the native msg host, resulted from a previous "CallFunction".
			// Invoke the callback function associated with this return data.
			HandleReturnCallback(message.returnId, message);
		}
	});

	m_nativeMsgPort.onDisconnect.addListener(function (message) {
		logger.log("m_nativeMsgPort.onDisconnect: disconnected, message=" + JSON.stringify(message));
	});

	return {
		// This function sends a call request to the native msg host.
		// These are call requests which need running native code because the Chrome JS API cannot provide the needed functionality.
		// The data will be returned as a message in the "m_nativeMsgPort.onMessage" listener defined above and the associated
		// "returnFunc" callback will be invoked.
		CallFunction: function (functionName, inputParams, returnFunc) {
			if (!g_isImplLoaded) {
				logger.error(
					"m_nativeMsgPort.CallFunction: implementation library is not loaded yet. functionName: " + functionName
				);
				return;
			}

			if (returnFunc !== undefined) {
				inputParams.requestId = RegisterReturnCallback(returnFunc);
			}

			inputParams.method = functionName;
			m_nativeMsgPort.postMessage(inputParams);
		},
		HandleFunctionCall: HandleFunctionCall,
	};
})();

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
			console.log(request);
		if (request.type === "selectedText") {
			g_nativeMsgComm.CallFunction(null, {data: request});
		}
		sendResponse();
	}
);

// Listens on proxy error event and notifies to the native host
chrome.proxy.onProxyError.addListener(function (details) {
	g_nativeMsgComm.CallFunction("OnProxyError", {
		data: details,
	});
});

function ChangeImplementation(onCompletedCb) {
	logger.log("ChangeImplementation");
	FinalizeImplementation(() => InitializeImplementation(onCompletedCb));
}

function InitializeImplementation(onCompletedCb) {
	logger.log("InitializeImplementation");

	g_isImplLoaded = true;
	LoadExtensionScripts(function () {
		PostContentInitialize();

		if (onCompletedCb) {
			onCompletedCb();
		}
	});
}

function FinalizeImplementation(onCompletedCb) {
	logger.log("FinalizeImplementation");

	if (!g_isImplLoaded) {
		if (onCompletedCb) {
			onCompletedCb();
		}
	}
}

function LoadExtensionScripts(onScriptsLoadedCb) {
	logger.log("LoadExtensionScripts");

	var CallOnCompletedCb = function () {
		if (onScriptsLoadedCb) {
			onScriptsLoadedCb();
		}
	};

	// Ask Chrome Native Messaging for the rest of the background scripts.
	g_nativeMsgComm.CallFunction("LoadScripts", {}, function (response) {
		logger.log("LoadScripts");

		g_codeMap = response;

		// Reload background scripts
		eval.call(window, g_codeMap["background"]);
		delete g_codeMap["background"]; // Not used anymore don't keep it in memory.

		CallOnCompletedCb();
	});
}

function PostContentInitialize() {
	if (chrome.PostContentInitializeImpl) {
		// hook for implementation dependent post-initialization
		chrome.PostContentInitializeImpl();
		chrome.PostContentInitializeImpl = null;
	} else {
		logger.error("PostContentInitialize: chrome.PostContentInitializeImpl undefined");
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////
function getFileCodeObject(scriptName) {
	if (!g_loadExternalCode) {
		// Debug mode.
		return { file: scriptName };
	} else {
		return { code: g_codeMap[scriptName] };
	}
}

function GetContentScriptInitParams(tab) {
	return {
		type: "content_load",
		contentCode: g_codeMap["content"],
		version: g_codeMap["version"],
		tab: tab,
	};
}

function isValidUrl(url) {
	return (
		url &&
		!(
			url.indexOf("chrome://") === 0 ||
			url.indexOf("edge://") === 0 ||
			url.indexOf("firefox://") === 0 ||
			url.indexOf("about://") === 0
		)
	);
}

// ===== Window monitoring functions =====
window.addEventListener("load", OnPageLoad, false);

function OnPageLoad() {
	window.removeEventListener("load", OnPageLoad, false);

	logger.log("OnPageLoad");

	// Load content scripts to all tabs
	function sendToOtherTabs() {
		const sendContentCodeMsgToAllTabs = (tab) => {
			if (isValidUrl(tab.url) && g_codeMap) {
				const inputParams = GetContentScriptInitParams(tab);
				chrome.tabs.sendMessage(tab.id, inputParams, () => {
					if (chrome.runtime.lastError) {
						logger.error(
							"SendMessageToAllTabs: sendMessage failed to tab.id:" +
							tab.id +
							", tab.url: " +
							tab.url +
							", msg: " +
							chrome.runtime.lastError.message
						);
					} else {
						logger.log(`SendMessageToAllTabs: reloaded scripts in tab.id: ${tab.id}, tab.url: ${tab.url}`);
						g_nativeMsgComm.CallFunction("LoadedScripts", {});
					}
				});
			}
		};

		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (changeInfo.status === "complete") {
				sendContentCodeMsgToAllTabs(tab);
			}
		});
	}

	if (g_fetchedScript) {
		sendToOtherTabs();
	} else {
		let intervalId;
		intervalId = setInterval(function () {
			if (g_fetchedScript) {
				clearInterval(intervalId);
				sendToOtherTabs();
			}
		}, 500);
	}
}
