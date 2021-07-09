if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("StopSelectingElement", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("Execute StopSelectingElement.js");
		if (gcontext.StopSelectingElement) {
			gcontext.StopSelectingElement();
			gcontext.StopSelectingElement = undefined;
		}
		sendResponse({});
	});
}
