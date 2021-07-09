if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnSetCheckbox", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnSetCheckbox");

		const { selector, doCheck, windowTop, windowLeft, delayBetweenEvents } = message;

		try {
			let targetElement = document.querySelector(selector);
			if (!targetElement) {
				gcontext.TraceMessage(`OnSetCheckbox: selector = ${selector} was not found in the DOM`);
				return sendResponse({ status: N_FALSE });
			}

			targetElement.scrollIntoView({ block: "center", inline: "center" });

			targetElement = gcontext.TryGetCheckableFromElement(targetElement);
			const tagName = targetElement.tagName.toLowerCase();
			if (tagName === "input") {
				const type = targetElement.type.toLowerCase();
				if ((type === "checkbox" || type === "radio") && targetElement.checked != null) {
					const isChecked = !!targetElement.checked;
					if (doCheck !== isChecked) {
						gcontext.simulateLeftClick(
							document,
							window,
							targetElement,
							windowLeft,
							windowTop,
							delayBetweenEvents,
							function (success) {
								if (success) {
									targetElement.checked = doCheck;
								}
								sendResponse({ status: success ? N_TRUE : N_FALSE });
							}
						);
						return;
					}
				}
			}
		} catch (e) {
			gcontext.TraceMessage("OnSetCheckbox exception: " + e);
			return sendResponse({ status: N_FALSE });
		}
		sendResponse({ status: N_TRUE });
	});
}
