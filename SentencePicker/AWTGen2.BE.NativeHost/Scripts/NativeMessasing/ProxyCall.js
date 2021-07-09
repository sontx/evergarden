if (chrome.extension.onMessage) {
	chrome.extension.onMessage.addListener(function OnProxyMessage(message, sender, sendResponse) {
		chrome.extension.onMessage.removeListener(OnProxyMessage);

		// Ignore proxy handling in frames which don't have g_globalContext
		if (typeof g_globalContext === "undefined") {
			return;
		}

		g_globalContext.TraceMessage(`OnProxyMessage: ${g_functionNameThatWillBeCalled}`);

		const gcontext = g_globalContext;
		const logFunc = gcontext.TraceError ? gcontext.TraceError : console.error;

		if (typeof g_functionThatWillBeCalled !== "function") {
			logFunc("g_functionThatWillBeCalled is not load any function !!!");
			sendResponse({});
			return;
		}

		try {
			g_functionThatWillBeCalled(gcontext, message, sender, function (json) {
				g_functionNameThatWillBeCalled = "";
				g_functionThatWillBeCalled = null;
				sendResponse(json);
			});
		} catch (ex) {
			logFunc(`Function : ${g_functionNameThatWillBeCalled} throw exception : ${ex.message}`);
			sendResponse({
				status: N_FALSE,
				error: ex.message,
			});
		}

		return true;
	});
}
