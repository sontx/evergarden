if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetHtml", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetHtml");
		const { selector } = message;
		let html;
		if (selector) {
			const element = document.querySelector(selector);
			if (element) {
				html = element.outerHTML;
			} else {
				sendResponse({ status: N_FALSE });
				return;
			}
		} else {
			html = document.documentElement.outerHTML;
		}

		sendResponse({ status: N_TRUE, html });
	});
}
