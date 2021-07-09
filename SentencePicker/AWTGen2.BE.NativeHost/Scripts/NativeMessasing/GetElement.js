if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnGetElement", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnGetElement");
		const {
			selector,
			timeout = 0,
			getInnerText,
			getInnerHtml,
			pageRenderOfsX = 0,
			pageRenderOfsY = 0,
			pageZoomValue,
			windowLeft,
			windowTop,
		} = message;

		function sendToNativeHost(element) {
			const cssToScreenParams = {
				pageRenderOfsX,
				pageRenderOfsY,
				pageZoomValue,
				windowLeft: (windowLeft * window.devicePixelRatio) / pageZoomValue,
				windowTop: (windowTop * window.devicePixelRatio) / pageZoomValue,
			};
			const cssRect = gcontext.GetElementClientBoundingCssRectangle(document, element);
			const screenRect = gcontext.CssToScreenRect(cssRect, cssToScreenParams, N_FALSE).MathRound();

			sendResponse({
				status: N_TRUE,
				tagName: element.tagName.toLowerCase(),
				attributes: gcontext.getAttributes(element),
				value: element.value,
				innerText: getInnerText ? element.innerText : null,
				innerHtml: getInnerHtml ? element.innerHTML : null,
				rect: {
					x: screenRect.left,
					y: screenRect.top,
					width: screenRect.getWidth(),
					height: screenRect.getHeight(),
				},
			});
		}

		const element = document.querySelector(selector);
		if (element) {
			gcontext.TraceMessage("Found element in the DOM");
			sendToNativeHost(element);
			return;
		}

		if (timeout <= 0) {
			gcontext.TraceMessage("Element was not found in the DOM");
			sendResponse({ status: N_FALSE });
			return;
		}

		gcontext.TraceMessage(`Element was not found in the DOM, waiting for the element appears timeout = ${timeout}ms`);

		let cleanupTimeoutId = undefined;

		const observer = new MutationObserver(function (mutations) {
			const hasAddedNodes = mutations.some(function (mutation) {
				return !!mutation.addedNodes;
			});
			if (hasAddedNodes) {
				const element = document.querySelector(selector);
				if (element) {
					if (cleanupTimeoutId !== undefined) {
						clearTimeout(cleanupTimeoutId);
						cleanupTimeoutId = undefined;
					}
					observer.disconnect();
					sendToNativeHost(element);
					gcontext.TraceMessage("Element was added to the DOM");
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		cleanupTimeoutId = setTimeout(function () {
			cleanupTimeoutId = undefined;
			observer.disconnect();
			sendResponse({ status: N_FALSE });
			gcontext.TraceMessage(`Element was not found in the DOM, timeout = ${timeout}ms`);
		}, timeout);
	});
}
