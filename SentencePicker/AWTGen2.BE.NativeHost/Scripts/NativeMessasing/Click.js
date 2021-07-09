if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnClick", function (gcontext, message, sender, sendResponse) {
		function getElementOffset(element) {
			const rect = element.getBoundingClientRect();
			const devicePixelRatio = window.devicePixelRatio;
			return {
				offsetX: (rect.width / 2) * devicePixelRatio,
				offsetY: (rect.height / 2) * devicePixelRatio,
			};
		}

		const {
			selector,
			button,
			clickType,
			windowLeft,
			windowTop,
			useScreenCoords,
			ctrlOn = false,
			altOn = false,
			shiftOn = false,
			wait,
			delayBetweenEvents = 0,
		} = message;

		gcontext.TraceMessage("OnClick");

		const element = document.querySelector(selector);
		if (!element) {
			gcontext.TraceMessage(`OnClick: ${selector} was not found in the DOM`);
			return sendResponse({ status: N_FALSE });
		}

		element.scrollIntoView({ block: "center", inline: "center" });

		const { offsetX, offsetY } = getElementOffset(element);

		let evtScreenX = 0;
		let evtScreenY = 0;
		let evtClientX = 0;
		let evtClientY = 0;

		if (useScreenCoords) {
			gcontext.TraceMessage("OnClick: using SCREEN_COORDS");
			evtScreenX = offsetX;
			evtScreenY = offsetY;
			evtClientX = Math.floor((offsetX - windowLeft) / window.devicePixelRatio);
			evtClientY = Math.floor((offsetY - windowTop) / window.devicePixelRatio);
		} else {
			gcontext.TraceMessage("OnClick: using CLIENT_COORDS");
			const cssRect = gcontext.GetElementClientBoundingCssRectangle(document, element);
			const clientRect = gcontext.CssToClientRect(cssRect, window.devicePixelRatio);
			evtScreenX = windowLeft + clientRect.left + offsetX;
			evtScreenY = windowTop + clientRect.top + offsetY;
			const cssOffsetX = offsetX / window.devicePixelRatio;
			const cssOffsetY = offsetY / window.devicePixelRatio;
			evtClientX = Math.floor(cssRect.left + cssOffsetX);
			evtClientY = Math.floor(cssRect.top + cssOffsetY);
		}

		gcontext.RaiseClickEvent(
			element,
			window,
			button,
			clickType,
			evtScreenX,
			evtScreenY,
			evtClientX,
			evtClientY,
			ctrlOn,
			altOn,
			shiftOn,
			wait,
			delayBetweenEvents,
			function (success) {
				if (wait) {
					sendResponse({ status: success ? N_TRUE : N_FALSE });
				}
			}
		);

		if (!wait) {
			sendResponse({ status: N_TRUE });
		}
	});
}
