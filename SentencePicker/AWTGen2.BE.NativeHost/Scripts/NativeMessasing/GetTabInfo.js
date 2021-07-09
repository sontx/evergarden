if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetTabInfo", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetTabInfo");
		sendResponse({
			status: N_TRUE,
			readyState: document.readyState,
			url: window.location.href,
			title: document.title,
			userAgent: window.navigator.userAgent,
			...(message || {})
		});
	});
}
