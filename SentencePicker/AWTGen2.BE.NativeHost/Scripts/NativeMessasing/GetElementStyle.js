if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetElementStyle", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetElementStyle");

		const { selector, names } = message;

		const element = document.querySelector(selector);
		if (!element) {
			gcontext.TraceMessage(`OnGetElementStyle: selector = ${selector} was not found in the DOM`);
			return sendResponse({ status: N_FALSE });
		}

		const styles = window.getComputedStyle(element);
		const result = {};
		for (const styleName of names) {
			const styleValue = styles.getPropertyValue(styleName);
			result[styleName] = styleValue;
		}
		sendResponse({
			status: N_TRUE,
			style: result,
		});
	});
}
