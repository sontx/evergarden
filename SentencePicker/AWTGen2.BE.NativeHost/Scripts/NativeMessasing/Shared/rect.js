WrapInGlobalContext(function () {
	var gcontext = this;
	gcontext.GetPageRenderOffsets = function (refPageRenderOfsX, refPageRenderOfsY, pageZoomFactor, windowParams) {
		var windowObj = window;
		if (windowParams) windowObj = windowParams;
		if (refPageRenderOfsX > 0 || refPageRenderOfsY > 0)
			return {
				x: refPageRenderOfsX,
				y: refPageRenderOfsY,
			};
		var innerWidthPixels = windowObj.innerWidth * pageZoomFactor;
		var innerHeightPixels = windowObj.innerHeight * pageZoomFactor;
		var resizeBorderSize = (windowObj.outerWidth - innerWidthPixels) / 2;
		return {
			x: resizeBorderSize,
			y: windowObj.outerHeight - innerHeightPixels - resizeBorderSize,
		};
	};
	gcontext.CssToScreenRect = function (cssRect, renderParams, useClientCoordinates, windowParams) {
		var windowObj = window;
		if (windowParams) windowObj = windowParams;
		var clientToCssScaleFactor = windowObj.devicePixelRatio;
		var finalRectangle = gcontext.CssToClientRect(cssRect, clientToCssScaleFactor);
		var isFirefox = windowObj.mozInnerScreenX !== undefined;
		var pageRenderOfs = {
			x: 0,
			y: 0,
		};
		if (isFirefox === false) {
			pageRenderOfs = gcontext.GetPageRenderOffsets(
				renderParams.pageRenderOfsX,
				renderParams.pageRenderOfsY,
				renderParams.pageZoomValue,
				windowParams
			);
			pageRenderOfs.x = (pageRenderOfs.x * clientToCssScaleFactor) / renderParams.pageZoomValue;
			pageRenderOfs.y = (pageRenderOfs.y * clientToCssScaleFactor) / renderParams.pageZoomValue;
		}
		finalRectangle = finalRectangle.Offset(pageRenderOfs.x, pageRenderOfs.y);
		if (useClientCoordinates === N_FALSE) {
			var windowLeft = isFirefox ? windowObj.mozInnerScreenX * clientToCssScaleFactor : renderParams.windowLeft;
			var windowTop = isFirefox ? windowObj.mozInnerScreenY * clientToCssScaleFactor : renderParams.windowTop;
			finalRectangle = finalRectangle.Offset(windowLeft, windowTop);
		}
		return finalRectangle;
	};
	gcontext.CssToClientRect = function (cssRect, zoomFactor) {
		return cssRect.Scale(zoomFactor).MathRound();
	};
	gcontext.ScreenToCssPos = function (screenPos, renderParams) {
		var clientToCssScaleFactor = window.devicePixelRatio;
		var isFirefox = window.mozInnerScreenX !== undefined;
		var windowLeft = isFirefox ? window.mozInnerScreenX * clientToCssScaleFactor : renderParams.windowLeft;
		var windowTop = isFirefox ? window.mozInnerScreenY * clientToCssScaleFactor : renderParams.windowTop;
		var pageRenderOfs = {
			x: 0,
			y: 0,
		};
		if (isFirefox == false) {
			pageRenderOfs = gcontext.GetPageRenderOffsets(
				renderParams.pageRenderOfsX,
				renderParams.pageRenderOfsY,
				renderParams.pageZoomValue
			);
		}
		var screenX = screenPos.x;
		var screenY = screenPos.y;
		var clientPos = {
			x: screenX - windowLeft - pageRenderOfs.x,
			y: screenY - windowTop - pageRenderOfs.y,
		};
		var cssPos = gcontext.ClientToCssPos(clientPos, clientToCssScaleFactor);
		return cssPos;
	};
	gcontext.ScreenToCssRect = function (screenRect, renderParams) {
		var clientToCssScaleFactor = window.devicePixelRatio;
		var isFirefox = window.mozInnerScreenX !== undefined;
		var windowLeft = isFirefox ? window.mozInnerScreenX * clientToCssScaleFactor : renderParams.windowLeft;
		var windowTop = isFirefox ? window.mozInnerScreenY * clientToCssScaleFactor : renderParams.windowTop;
		var pageRenderOfs = {
			x: 0,
			y: 0,
		};
		if (isFirefox == false) {
			pageRenderOfs = gcontext.GetPageRenderOffsets(
				renderParams.pageRenderOfsX,
				renderParams.pageRenderOfsY,
				renderParams.pageZoomValue
			);
		}
		var clientOffsetX = windowLeft + pageRenderOfs.x;
		var clientOffsetY = windowTop + pageRenderOfs.y;
		var clientRect = screenRect.Offset(-clientOffsetX, -clientOffsetY);
		var cssRect = gcontext.ClientToCssRect(clientRect, clientToCssScaleFactor);
		return cssRect;
	};
	gcontext.ClientToCssRect = function (clientRect, zoomFactor) {
		return clientRect.ScaleInv(zoomFactor).MathRound();
	};
	gcontext.ClientToCssPos = function (clientPos, zoomFactor) {
		return {
			x: Math.round(clientPos.x / zoomFactor),
			y: Math.round(clientPos.y / zoomFactor),
		};
	};
	gcontext.GetChromeWindowScreenCoords = function (chromeWindow) {
		return {
			left: chromeWindow.left,
			top: chromeWindow.top,
		};
	};
	gcontext.InitKeyboardEvent = function (
		event,
		type,
		canBubble,
		cancelable,
		view,
		keyCode,
		charCode,
		ctrlOn,
		altOn,
		shiftOn
	) {
		if (event.initKeyboardEvent) {
			event.initKeyboardEvent(type, canBubble, cancelable, view, ctrlOn, altOn, shiftOn, false, keyCode, charCode);
		} else {
			event.initKeyEvent(type, canBubble, cancelable, view, ctrlOn, altOn, shiftOn, false, keyCode, charCode);
		}
	};
	gcontext.CreateBackgroundPageComm = function (portName) {
		var m_crtRequestId = 0;
		var m_returnMap = {};
		var m_msgPort = chrome.runtime.connect({
			name: portName,
		});
		m_msgPort.onMessage.addListener(function (message) {
			if (message.returnId !== undefined) {
				DismissReturnCallback(message.returnId, message);
			}
		});

		function RegisterReturnCallback(returnFunc) {
			++m_crtRequestId;
			m_returnMap[m_crtRequestId] = returnFunc;
			return m_crtRequestId;
		}

		function DismissReturnCallback(returnId, params) {
			var returnFunc = m_returnMap[returnId];
			if (returnFunc !== undefined) {
				returnFunc(params);
				delete m_returnMap[returnId];
			}
		}
		return {
			CallFunction: function (functionName, inputParams, returnFunc) {
				if (returnFunc !== undefined) inputParams.requestId = RegisterReturnCallback(returnFunc);
				inputParams.functionCall = functionName;
				m_msgPort.postMessage(inputParams);
			},
			Disconnect: function () {
				m_msgPort.disconnect();
			},
		};
	};
});
