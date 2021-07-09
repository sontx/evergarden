if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetText", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetText");

		const { selector } = message;
		const element = document.querySelector(selector);
		let elementText;

		if (!element) {
			gcontext.TraceError(`OnGetText: ${selector} was not found in the DOM`);
			sendResponse({ status: N_FALSE });
			return;
		}

		if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
			elementText = element.value || "";
		} else {
			elementText = gcontext.getElementText(element);
		}

		sendResponse({
			text: elementText,
			status: N_TRUE,
		});
	});
}
