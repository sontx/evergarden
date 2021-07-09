if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnSelectItems", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnSelectItems");

		function selectItemByIndex(el, values) {
			for (let value of values) {
				el[value].selected = true;
			}
		}

		function selectItemByValue(el, values) {
			for (let index = 0; index < el.length; index++) {
				for (let value of values) {
					if (el.options[index].value === value) {
						el.options[index].selected = true;
					}
				}
			}
		}

		function selectItemByText(el, values) {
			for (let index = 0; index < el.length; index++) {
				for (let value of values) {
					if (el.options[index].text === value) {
						el.options[index].selected = true;
					}
				}
			}
		}

		const {
			selector,
			selectedItems,
			selectBy,
			reset,
			simulateClick,
			delayBetweenEvents,
			windowLeft,
			windowTop,
		} = message;

		try {
			const element = document.querySelector(selector);
			if (!element) {
				gcontext.TraceError(`OnSelectItems: selector = ${selector} was not found in the DOM`);
				sendResponse({ status: N_FALSE });
				return;
			}

			if (element.tagName !== "SELECT") {
				gcontext.TraceError(`OnSelectItems does not support for ${element.tagName}`);
				sendResponse({ status: N_FALSE });
				return;
			}

			element.scrollIntoView({ block: "center", inline: "center" });

			if (reset && element.multiple) {
				for (let i = 0; i < element.length; i++) {
					element[i].selected = false;
				}
			}

			function doChange() {
				if (selectBy === 0) {
					selectItemByIndex(element, selectedItems);
				} else if (selectBy === 1) {
					selectItemByValue(element, selectedItems);
				} else if (selectBy === 2) {
					selectItemByText(element, selectedItems);
				}
			}

			function raiseChangeEvent() {
				if (element.dispatchEvent) {
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("change", true, false);
					element.dispatchEvent(evt);
				}
			}

			if (simulateClick) {
				gcontext.simulateLeftClick(
					document,
					window,
					element,
					windowLeft,
					windowTop,
					delayBetweenEvents,
					function (success) {
						if (!success) {
							sendResponse({ status: N_FALSE });
							return;
						}

						doChange();
						raiseChangeEvent();

						gcontext.simulateLeftClick(
							document,
							window,
							element,
							windowLeft,
							windowTop,
							delayBetweenEvents,
							function (success) {
								sendResponse({ status: success ? N_TRUE : N_FALSE });
							}
						);
					}
				);
			} else {
				doChange();
				raiseChangeEvent();
				sendResponse({ status: N_TRUE });
			}
		} catch (e) {
			gcontext.TraceMessage("OnSelectItems exception: " + e);
			sendResponse({ status: N_FALSE });
		}
	});
}
