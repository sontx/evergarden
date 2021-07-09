if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetElementVisibility", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetElementVisibility");

		const { selector } = message;

		function isVisible(el) {
			const computedStyles = window.getComputedStyle(el, null);
			const display = computedStyles.display;
			const visibility = computedStyles.visibility;
			return display !== "none" && visibility !== "hidden" && visibility !== "collapse";
		}

		const element = document.querySelector(selector);
		const visible = !!element && isVisible(element);
		sendResponse({ status: N_TRUE, visible });
	});
}
