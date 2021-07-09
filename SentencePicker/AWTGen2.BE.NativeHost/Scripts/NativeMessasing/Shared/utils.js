WrapInGlobalContext(function () {
	var gcontext = this;
	gcontext.MatchChars = function (c1, c2) {
		return c1 === "?" || c1 === c2;
	};
	gcontext.MatchCharsPrefix = function (c1, c2) {
		return c1 === "?" || c2 === "?" || c1 === c2;
	};
	gcontext.ComputePrefixFunction = function (pattern, beginPattern, patternLen) {
		var state = -1;
		var pi = new Array(patternLen);
		pi[0] = state;
		var i;
		for (i = 1; i < patternLen; ++i) {
			while (state > -1 && !gcontext.MatchCharsPrefix(pattern[beginPattern + state + 1], pattern[beginPattern + i])) {
				state = pi[state];
			}
			if (gcontext.MatchCharsPrefix(pattern[beginPattern + i], pattern[beginPattern + state + 1])) {
				state++;
			}
			pi[i] = state;
		}
		return pi;
	};
	gcontext.StringWildcardMatch = function (psPattern, psText, caseSensitive) {
		caseSensitive = typeof caseSensitive === "undefined" ? true : caseSensitive;
		gcontext.TraceMessage(
			'StrWildcardMatch(psPattern: "' +
				psPattern +
				'" psText: "' +
				psText +
				'" caseSensitive: ' +
				caseSensitive.toString() +
				")"
		);
		if (psPattern == null) {
			psPattern = "";
		}
		if (psText == null) {
			psText = "";
		}
		if (psPattern === "") {
			return psText === "";
		}
		if (!caseSensitive) {
			psPattern = psPattern.toLowerCase();
			psText = psText.toLowerCase();
		}
		var beginPattern = 0;
		var beginText = 0;
		var endPattern = psPattern.length - 1;
		var endText = psText.length - 1;
		if (psPattern[beginPattern] != "*") {
			while (psPattern[beginPattern] != "*" && beginPattern <= endPattern && beginText <= endText) {
				if (!gcontext.MatchChars(psPattern[beginPattern], psText[beginText])) {
					return false;
				}
				++beginPattern;
				++beginText;
			}
		}
		if (psPattern[endPattern] != "*") {
			while (psPattern[endPattern] != "*" && beginPattern <= endPattern && beginText <= endText) {
				if (!gcontext.MatchChars(psPattern[endPattern], psText[endText])) {
					return false;
				}
				--endPattern;
				--endText;
			}
		}
		if (beginPattern > endPattern) {
			return beginText > endText;
		}
		if (psPattern[beginPattern] != "*" || psPattern[endPattern] != "*") {
			return false;
		}
		while (beginPattern <= endPattern) {
			while (psPattern[beginPattern] == "*" && beginPattern <= endPattern) {
				beginPattern++;
			}
			if (beginPattern > endPattern) {
				break;
			}
			var substrLen = 0;
			while (psPattern[beginPattern + substrLen] != "*") {
				++substrLen;
			}
			var pi = gcontext.ComputePrefixFunction(psPattern, beginPattern, substrLen);
			var state = -1;
			var canMatch = false;
			for (; beginText <= endText; ++beginText) {
				while (state > -1 && !gcontext.MatchChars(psPattern[beginPattern + state + 1], psText[beginText])) {
					state = pi[state];
				}
				if (gcontext.MatchChars(psPattern[beginPattern + state + 1], psText[beginText])) {
					state++;
				}
				if (state == substrLen - 1) {
					canMatch = true;
					break;
				}
			}
			if (!canMatch) {
				return false;
			}
			beginPattern += substrLen;
			++beginText;
		}
		return true;
	};
	gcontext.DeleteForbiddenCharacters = function (text) {
		if (text == null || text.length === 0) {
			return "";
		}
		var out_text = text.replace(/\r/g, " ");
		out_text = out_text.replace(/\n/g, " ");
		return out_text;
	};
	gcontext.TruncateStringUsingWildcard = function (text, maxLen) {
		if (text == null) {
			return "";
		}
		if (text.length <= maxLen) {
			return text;
		}
		var out_text = text.slice(0, maxLen);
		out_text += "*";
		return out_text;
	};
	gcontext.ConcatObjects = function (o1, o2) {
		var result = {};
		if (o1 != null) {
			result = o1;
		}
		if (o2 != null) {
			for (var prop in o2) {
				result[prop] = o2[prop];
			}
		}
		return result;
	};
	gcontext.IsObjectEmpty = function (obj) {
		if (obj == null) {
			return true;
		}
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	};
	gcontext.TrimWhiteSpaces = function (text) {
		var out_text = text.trim();
		var whiteSpaceCodes = [0x200e, 0x2022];
		while (out_text.length !== 0 && whiteSpaceCodes.indexOf(out_text.charCodeAt(0)) !== -1) {
			out_text = out_text.slice(1);
		}
		while (out_text.length !== 0 && whiteSpaceCodes.indexOf(out_text.charCodeAt(out_text.length - 1)) !== -1) {
			out_text = out_text.slice(0, out_text.length - 1);
		}
		return out_text;
	};
	gcontext.IsWhiteSpaceCharacter = function (ch) {
		return ch === "\t" || ch === "\r" || ch === "\n" || ch === " " || ch === "\u200E" || ch === "\u2022";
	};
	gcontext.UiRect = function UiRect(left, top, width, height) {
		return {
			left: left,
			top: top,
			right: left + width,
			bottom: top + height,
			getWidth: function () {
				return this.right - this.left;
			},
			getHeight: function () {
				return this.bottom - this.top;
			},
			Intersects: function (rc2) {
				return this.right > rc2.left && this.left < rc2.right && this.bottom > rc2.top && this.top < rc2.bottom;
			},
			Contains: function (point) {
				return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
			},
			Scale: function (factor) {
				return UiRect(this.left * factor, this.top * factor, this.getWidth() * factor, this.getHeight() * factor);
			},
			ScaleInv: function (factor) {
				return UiRect(this.left / factor, this.top / factor, this.getWidth() / factor, this.getHeight() / factor);
			},
			IsEqual: function (rc2) {
				return this.left === rc2.left && this.top === rc2.top && this.right === rc2.right && this.bottom === rc2.bottom;
			},
			Offset: function (dx, dy) {
				return UiRect(this.left + dx, this.top + dy, this.getWidth(), this.getHeight());
			},
			MathRound: function () {
				return UiRect(
					Math.round(this.left),
					Math.round(this.top),
					Math.round(this.getWidth()),
					Math.round(this.getHeight())
				);
			},
			Union: function (rc2) {
				var resultLeft = Math.min(this.left, rc2.left);
				var resultTop = Math.min(this.top, rc2.top);
				var resultRight = Math.max(this.right, rc2.right);
				var resultBottom = Math.max(this.bottom, rc2.bottom);
				return UiRect(resultLeft, resultTop, resultRight - resultLeft, resultBottom - resultTop);
			},
			ContainsRect: function (rc2) {
				var p1 = {
					x: rc2.left,
					y: rc2.top,
				};
				var p2 = {
					x: rc2.left,
					y: rc2.bottom,
				};
				var p3 = {
					x: rc2.right,
					y: rc2.top,
				};
				var p4 = {
					x: rc2.right,
					y: rc2.bottom,
				};
				return this.Contains(p1) && this.Contains(p2) && this.Contains(p3) && this.Contains(p4);
			},
			toString: function () {
				return "(" + left + " " + top + " " + width + " " + height + ")";
			},
		};
	};
	gcontext.RectToString = function (rect) {
		return "[" + rect.left + " " + rect.top + " " + rect.right + " " + rect.bottom + "]";
	};
	gcontext.UnformatSpecialJsCharacters = function (code) {
		var out_unformattedCode = code;
		out_unformattedCode = out_unformattedCode.replace(/%CR%/g, "\r");
		out_unformattedCode = out_unformattedCode.replace(/%LF%/g, "\n");
		return out_unformattedCode;
	};
	gcontext.ExecuteWithRetry = function (predicateFunc, coreFunc, debugTag) {
		var initTimeout = 30000;
		var timeout = 100;
		var maxTries = initTimeout / timeout;
		var fnWrapper = function () {
			if (predicateFunc() === true) {
				coreFunc();
			} else {
				maxTries--;
				if (maxTries >= 0) {
					gcontext.TraceMessage("ExecuteWithRetry: condition for " + debugTag + " is false; retrying later");
					setTimeout(fnWrapper, timeout);
				} else {
					gcontext.TraceMessage("ExecuteWithRetry: timed out while waiting to execute '" + debugTag + "'");
				}
			}
		};
		fnWrapper();
	};
	gcontext.Stopwatch = function () {
		var m_startTime;
		var m_msTimeout;
		var m_bTimeoutElapsed;
		return {
			Start: function (msTimeout) {
				m_msTimeout = msTimeout;
				m_bTimeoutElapsed = N_FALSE;
				m_startTime = new Date().getTime();
			},
			TimeoutElapsed: function () {
				if (m_bTimeoutElapsed === N_FALSE) {
					var crtTime = new Date().getTime();
					if (crtTime - m_startTime > m_msTimeout) m_bTimeoutElapsed = N_TRUE;
				}
				return m_bTimeoutElapsed;
			},
		};
	};
	gcontext.ChainCalls = function (arr, onEach, onFinal) {
		var isNonEmptyArr = arr && "number" === typeof arr.length && 0 !== arr.length;
		var max = isNonEmptyArr ? arr.length : 0;
		var process = function (i) {
			if (max === i) {
				onFinal(true, max);
			} else {
				var next = function (itsOk) {
					if ("boolean" === typeof itsOk && !itsOk) {
						onFinal(false, i);
					} else {
						process(i + 1);
					}
				};
				onEach(next, i);
			}
		};
		process(0);
	};

	gcontext.IsExecutableScriptTab = function (tab) {
		return !gcontext.IsBrowserSettingsUrl(tab.url) && tab.status !== "unloaded";
	};
	gcontext.ExecuteOnTabWithWindowInfo = function (scriptFileName, params, returnFunc) {
		chrome.windows.get(params.windowId, {}, function (window) {
			const { top: windowTop, left: windowLeft } = window;
			const inputParams = {
				...params,
				windowTop,
				windowLeft,
			};
			gcontext.ExecuteOnTab(scriptFileName, inputParams, returnFunc);
		});
	};
	gcontext.ExecuteOnTab = function (scriptFileName, params, returnFunc) {
		const navInfo = gcontext.GetTabNavigationInfo(params.tabId);
		ExecuteScript(params.tabId, 0, scriptFileName, params || {}, function (outputParams) {
			if (outputParams !== undefined) {
				returnFunc({...outputParams, pageSession: navInfo.pageSession});
			} else {
				returnFunc({ status: N_FALSE, pageSession: navInfo.pageSession });
			}
		});
	};
	gcontext.ExecuteOnAllTabs = function (scriptFileName, params, returnFunc) {
		chrome.tabs.query({}, function (tabs) {
			for (let i = 0; i < tabs.length; i++) {
				const tab = tabs[i];
				if (gcontext.IsExecutableScriptTab(tab)) {
					const navInfo = gcontext.GetTabNavigationInfo(params.tabId);
					ExecuteScript(tab.id, undefined, scriptFileName, params || {}, function (outputParams, outputFrameId) {
						returnFunc({ ...(outputParams || {}), TabId: tab.id, pageSession: navInfo.pageSession });
					});
				}
			}
		});
	};
	gcontext.HandleResultCallback = function (message, returnFunc, resultIfSuccess) {
		const lastError = chrome.runtime.lastError;
		if (lastError) {
			gcontext.TraceError(`Error: ${lastError.message}`);
			returnFunc({ status: N_FALSE });
		} else {
			const navInfo = gcontext.GetTabNavigationInfo(message.tabId);
			returnFunc({ status: N_TRUE, ...(resultIfSuccess || {}), pageSession: navInfo.pageSession });
		}
	};

	gcontext.GetValidDelayBetweenEvents = function (delayBetweenEvents) {
		let config;
		if (!Array.isArray(delayBetweenEvents)) {
			config = {
				from: delayBetweenEvents,
				to: delayBetweenEvents,
			};
		} else {
			config = {
				from: delayBetweenEvents[0],
				to: delayBetweenEvents[1],
			};
		}

		function validValue(value) {
			return isFinite(value) && value >= 0;
		}

		config.valid = validValue(config.from) && validValue(config.to);
		return config;
	};

	gcontext.RandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
});

function EnableTracingInTab(tabId) {
	gcontext.TraceMessage("EnableTracingInTab tabId: " + tabId);
	if (gcontext.IsTracingEnabled()) {
		var args = {
			code:
				"if (typeof g_globalContext !== 'undefined' && typeof g_globalContext.EnableTracing !== 'undefined') g_globalContext.EnableTracing();",
		};
		if (!gcontext.xbrowser.isModeSingleFrame()) {
			args.allFrames = true;
			args.matchAboutBlank = true;
		}
		chrome.tabs.executeScript(tabId, args, function () {
			if (chrome.runtime.lastError) {
				var errorMsg = chrome.runtime.lastError.message;
				gcontext.TraceMessage(
					"EnableTracingInTab failed for some frames in tabId=" + tabId + ", errorMsg: " + errorMsg
				);
			}
		});
	}
}

function GetChromePageZoom(tabId, callback) {
	gcontext.TraceMessage("Getting zoom level for tab: " + tabId);
	chrome.tabs.getZoom(tabId, function (out_zoomFactor) {
		if (chrome.runtime.lastError) {
			var errorMsg = chrome.runtime.lastError.message;
			gcontext.TraceMessage("GetChromePageZoom failed for tabId:" + tabId + ", errorMsg: " + errorMsg);
			callback(1.0);
		} else {
			gcontext.TraceMessage(out_zoomFactor + " zoom level for tab: " + tabId);
			callback(out_zoomFactor);
		}
	});
}

function getFileCodeObjectForFrame(scriptName, frameId) {
	const resObj = getFileCodeObject(scriptName);

	if (frameId !== undefined && !gcontext.xbrowser.isModeSingleFrame()) {
		resObj.frameId = frameId;
		resObj.matchAboutBlank = true;
	}

	if (frameId === undefined) {
		resObj.allFrames = true;
		resObj.matchAboutBlank = true;
		resObj.runAt = "document_start";
	}

	return resObj;
}

function ExecuteScript(tabId, frameId, scriptName, inputParams, returnFunc) {
	function ExecuteScriptInFrame() {
		gcontext.TraceMessage(`ExecuteScript: execute script = ${scriptName}, in frameId = ${frameId}`);
		chrome.tabs.executeScript(tabId, getFileCodeObjectForFrame(scriptName, frameId), function () {
			chrome.tabs.executeScript(tabId, getFileCodeObjectForFrame("ProxyCall.js", frameId), function () {
				if (chrome.runtime.lastError) {
					gcontext.TraceMessage(
						"ExecuteScript: cannot inject script into frame, lastError.message: " + chrome.runtime.lastError.message
					);
					return returnFunc(undefined, frameId);
				}

				inputParams.tabId = tabId;
				inputParams.frameId = frameId;
				gcontext.xbrowser.tabs.sendMessage(tabId, inputParams, frameId, function (outputParams) {
					gcontext.TraceMessage(
						`ExecuteScript: received response from script = ${scriptName}, in frameId = ${frameId}`
					);

					if (chrome.runtime.lastError) {
						gcontext.TraceMessage(
							"ExecuteScript: cannot send message to tab/frame, lastError.message: " + chrome.runtime.lastError.message
						);
						return returnFunc(undefined, frameId);
					}

					if (outputParams) {
						gcontext.TraceMessage("ExecuteScript: got final response");
						return returnFunc(outputParams, frameId);
					}
				});
			});
		});
	}

	try {
		ExecuteScriptInFrame();
	} catch (e) {
		gcontext.TraceError("ExecuteScript: caught exception, message: " + e.message);
		return returnFunc(undefined, frameId);
	}
}
