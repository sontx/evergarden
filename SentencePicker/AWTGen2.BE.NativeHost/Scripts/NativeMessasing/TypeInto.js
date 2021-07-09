WrapInjectedFunction("TypeInto", function (gcontext, message, sender, sendResponse) {
	gcontext.TraceMessage("Enter TypeInto");
	const { selector, text, append, delayBetweenEvents = -1 } = message;
	var targetElement = document.querySelector(selector);
	if (targetElement == null) {
		gcontext.TraceMessage(`TypeInto: ${selector} was not found in the DOM`);
		return sendResponse({ status: N_FALSE });
	}

	targetElement.scrollIntoView({ block: "center", inline: "center" });
	const htmlWindow = window;

	function startTyping() {
		gcontext.SendKeysToHtmlElement(targetElement, htmlWindow, text, append, delayBetweenEvents, function (success) {
			sendResponse({ status: success ? N_TRUE : N_FALSE });
		});
	}

	if (!append) {
		const tagName = targetElement.tagName;
		const elementText =
			tagName === "INPUT" || tagName === "TEXTAREA"
				? targetElement.value || ""
				: gcontext.getElementText(targetElement) || "";

		if (elementText.length > 0) {
			gcontext.ClearInputElement(targetElement, htmlWindow, elementText.length, delayBetweenEvents, function (success) {
				if (success) {
					startTyping();
				} else {
					sendResponse({ status: N_FALSE });
				}
			});

			return;
		}
	}

	startTyping();
});
