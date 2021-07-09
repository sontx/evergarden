WrapInGlobalContext(function () {
	var gcontext = this;
	gcontext.xbrowser = (function () {
		var isMozilla = false;
		var isEdgeBrowser = false;
		var modeSingleFrame = false;
		var isIOSplatform = false;
		var chromeVersion = 0;
		return {
			init: function () {
				isEdgeBrowser = window.navigator.userAgent.toLowerCase().indexOf("edg") >= 0;
				isMozilla = window.mozInnerScreenX !== undefined;
				chromeVersion = parseInt((/Chrome\/([0-9]+)/.exec(navigator.userAgent) || ["0", "0"])[1]);
				modeSingleFrame = chromeVersion > 0 && chromeVersion < 41;
				if (chrome.tabs && !chrome.tabs.getSelected) {
					chrome.tabs.getSelected = function (wndId, response) {
						const query = { active: true };
						if (typeof wndId === "function") {
							response = wndId;
						} else {
							query.windowId = wndId;
						}
						return chrome.tabs.query(query, function (tabsArray) {
							response(tabsArray[0]);
						});
					};
				}
				if (chrome.extension && !chrome.extension.onMessage) {
					chrome.extension.onMessage = {
						addListener: function (callback) {
							return chrome.runtime.onMessage.addListener(callback);
						},
						removeListener: function (callback) {
							return chrome.runtime.onMessage.removeListener(callback);
						},
					};
				}
				if (chrome.tabs && !chrome.tabs.getZoom) {
					chrome.tabs.getZoom = function (tabId, callback) {
						gcontext.TraceMessage(
							"Warning: chrome.tabs.getZoom() is undefined. Return 100% zoom. User Agent: " + navigator.userAgent
						);
						callback(1);
					};
				}
				var iDevices = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"];
				if (navigator.platform) {
					while (iDevices.length) {
						if (navigator.platform === iDevices.pop()) {
							isIOSplatform = true;
						}
					}
				}
			},
			tabs: {
				sendMessage: function (tabId, message, frameId, responseCallback) {
					gcontext.TraceMessage(
						`Send message to Tab : ${tabId}, Frame : ${frameId}, Single frame mode : ${modeSingleFrame}`
					);
					if (modeSingleFrame || frameId === undefined) {
						chrome.tabs.sendMessage(tabId, message, responseCallback);
					} else {
						chrome.tabs.sendMessage(tabId, message, { frameId: frameId }, responseCallback);
					}
				},
			},
			isFirefox: function () {
				return isMozilla;
			},
			isEdge: function () {
				return isEdgeBrowser;
			},
			isModeSingleFrame: function () {
				return modeSingleFrame;
			},
			isIOS: function () {
				return isIOSplatform;
			},
		};
	})();
	gcontext.xbrowser.init();
});
