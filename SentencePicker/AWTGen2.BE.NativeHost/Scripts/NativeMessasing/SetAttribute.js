if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnSetAttribute", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnSetAttribute");

		const { selector, name, value } = message;

		const element = document.querySelector(selector);
		if (!element) {
			gcontext.TraceMessage(`OnSetAttribute: selector = ${selector} was not found in the DOM`);
			return sendResponse({ status: N_FALSE });
		}

		element.setAttribute(name, value);
		sendResponse({ status: N_TRUE });
	});
}
