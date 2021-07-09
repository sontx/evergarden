if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnStartSelectingElement", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnStartSelectingElement");

		const highlightRect = {
			top: document.getElementById("awt-gen2-highlighted-top"),
			left: document.getElementById("awt-gen2-highlighted-left"),
			right: document.getElementById("awt-gen2-highlighted-right"),
			bottom: document.getElementById("awt-gen2-highlighted-bottom"),
		};

		function setElementStyle(element, styles) {
			Object.assign(element.style, styles);
		}

		function highlightElement(event) {
			if (event.target.tagName === "body" || event.target.tagName === "html") {
				return;
			}

			const targetOffset = event.target.getBoundingClientRect();
			const targetHeight = targetOffset.height;
			const targetWidth = targetOffset.width;

			// top
			setElementStyle(highlightRect.top, {
				left: `${targetOffset.left - 2}px`,
				top: `${targetOffset.top - 2}px`,
				width: `${targetWidth + 4}px`,
			});

			// bottom
			setElementStyle(highlightRect.bottom, {
				left: `${targetOffset.left - 3}px`,
				top: `${targetOffset.top + targetHeight}px`,
				width: `${targetWidth + 4}px`,
			});

			// left
			setElementStyle(highlightRect.left, {
				left: `${targetOffset.left - 3}px`,
				top: `${targetOffset.top - 2}px`,
				height: `${targetHeight + 4}px`,
			});

			// right
			setElementStyle(highlightRect.right, {
				left: `${targetOffset.left + targetWidth + 1}px`,
				top: `${targetOffset.top - 2}px`,
				height: `${targetHeight + 4}px`,
			});
		}

		function clearHighlight() {
			setElementStyle(highlightRect.left, { height: 0 });
			setElementStyle(highlightRect.right, { height: 0 });
			setElementStyle(highlightRect.top, { width: 0 });
			setElementStyle(highlightRect.bottom, { width: 0 });
		}

		function addHighlightEventListener() {
			document.addEventListener("mouseover", highlightElement);
			document.addEventListener("mouseout", clearHighlight);
		}

		function stopHighlightWhenHover() {
			document.removeEventListener("mouseover", highlightElement);
			document.removeEventListener("mouseout", clearHighlight);
		}

		function handleClick(event) {
			event.preventDefault();
			event.stopPropagation();
			stopSelectingElement();
			const target = event.target;
			sendResponse({
				selector: gcontext.getBetterCssSelector(target),
				tagName: target.tagName.toLowerCase(),
				attributes: gcontext.getAttributes(target),
			});
		}

		function handleKeyDown(evt) {
			if (evt.key === "Escape") {
				stopSelectingElement();
				sendResponse({});
			}
		}

		function stopSelectingElement() {
			clearHighlight();
			stopHighlightWhenHover();
			document.removeEventListener("keydown", handleKeyDown, true);
			document.removeEventListener("click", handleClick, true);
		}

		gcontext.StopSelectingElement = stopSelectingElement;

		addHighlightEventListener();
		document.addEventListener("keydown", handleKeyDown, true);
		document.addEventListener("click", handleClick, true);
	});
}
