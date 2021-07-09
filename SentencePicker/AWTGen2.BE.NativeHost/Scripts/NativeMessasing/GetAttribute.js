if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetAttribute", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetAttribute");

		const { selector, name } = message;

		const element = document.querySelector(selector);
		if (!element) {
			gcontext.TraceMessage(`OnGetAttribute: selector = ${selector} was not found in the DOM`);
			return sendResponse({ status: N_FALSE });
		}

		const value = element.getAttribute(name);

		sendResponse({
			status: N_TRUE,
			value: value,
		});
	});
}
