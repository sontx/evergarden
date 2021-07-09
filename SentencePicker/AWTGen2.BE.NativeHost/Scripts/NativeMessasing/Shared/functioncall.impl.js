function OnStartSelectingElement(params, returnFunc) {
	gcontext.ExecuteOnAllTabs("StartSelectingElement.js", (params || {}).data, returnFunc);
}

function OnStopSelectingElement(params, returnFunc) {
	gcontext.ExecuteOnAllTabs("StopSelectingElement.js", (params || {}).data, returnFunc);
}

function OnTypeInto(params, returnFunc) {
	gcontext.ExecuteOnTab("TypeInto.js", (params || {}).data, returnFunc);
}

function OnClick(params, returnFunc) {
	gcontext.ExecuteOnTabWithWindowInfo("Click.js", params.data, returnFunc);
}

function OnGetElement(params, returnFunc) {
	GetChromePageZoom(params.data.tabId, function (pageZoomValue) {
		gcontext.ExecuteOnTabWithWindowInfo("GetElement.js", { pageZoomValue, ...params.data }, returnFunc);
	});
}

function OnGetElementStyle(params, returnFunc) {
	gcontext.ExecuteOnTabWithWindowInfo("GetElementStyle.js", params.data, returnFunc);
}

function OnGetCurrentTab(params, returnFunc) {
	function getCurrentTab(options, canRetry) {
		chrome.tabs.query(options, function (tabs) {
			const lastError = chrome.runtime.lastError;
			if (lastError) {
				gcontext.TraceError(lastError.message);
				returnFunc({ status: N_FALSE });
			} else if (tabs && tabs.length > 0) {
				const tab = tabs[0];
				const navInfo = gcontext.GetTabNavigationInfo(tab.id);
				returnFunc({
					status: N_TRUE,
					tabId: tab.id,
					windowId: tab.windowId,
					url: tab.url,
					title: tab.title,
					favIconUrl: tab.favIconUrl,
					pageSession: navInfo.pageSession,
				});
			} else {
				if (canRetry) {
					getCurrentTab({active: true}, false);
				} else {
					gcontext.TraceError("There is no active tab was found");
					returnFunc({ status: N_FALSE });
				}
			}
		});
	}
	
	getCurrentTab({ currentWindow: true, active: true }, true);
}

function OnGetTabInfo(params, returnFunc) {
	const navigationInfo = gcontext.GetTabNavigationInfo(params.data.tabId);
	gcontext.ExecuteOnTab("GetTabInfo.js", { ...(params || {}).data, ...navigationInfo }, returnFunc);
}

function OnGetText(params, returnFunc) {
	gcontext.ExecuteOnTab("GetText.js", (params || {}).data, returnFunc);
}

function OnCloseAllTabs(params, returnFunc) {
	chrome.tabs.query({}, (tabs) => {
		const tabIds = tabs.map((tab) => tab.id);
		if (gcontext.xbrowser.isFirefox()) {
			function onRemoved() {
				returnFunc({ status: N_TRUE });
			}
			function onError(error) {
				gcontext.TraceError(`Error while closing tabs: ${error}`);
				returnFunc({ status: N_FALSE });
			}
			browser.tabs.remove(tabIds).then(onRemoved, onError);
		} else {
			chrome.tabs.remove(tabIds, function () {
				gcontext.HandleResultCallback(params.data, returnFunc);
			});
		}
	});
}

function OnNavigateTo(params, returnFunc) {
	chrome.tabs.update(params.data.tabId, { url: params.data.url, active: true }, (tab) => {
		gcontext.HandleResultCallback(params.data, returnFunc);
	});
}

function OnRefresh(params, returnFunc) {
	chrome.tabs.reload(params.data.tabId, {}, function () {
		gcontext.HandleResultCallback(params.data, returnFunc);
	});
}

function OnGoBack(params, returnFunc) {
	chrome.tabs.goBack(params.data.tabId, function () {
		gcontext.HandleResultCallback(params.data, returnFunc);
	});
}

function OnGoForward(params, returnFunc) {
	chrome.tabs.goForward(params.data.tabId, function () {
		gcontext.HandleResultCallback(params.data, returnFunc);
	});
}

function OnInjectScript(params, returnFunc) {
	chrome.tabs.executeScript(params.data.tabId, { allFrames: false, code: params.data.code }, function (result) {
		gcontext.HandleResultCallback(params.data, returnFunc, { result: (result || [])[0] });
	});
}

function OnInjectAsyncFunction(params, returnFunc) {
	gcontext.ExecuteOnTab("InjectAsyncFunction.js", (params || {}).data, returnFunc);
}

function OnInjectFunction(params, returnFunc) {
	gcontext.ExecuteOnTab("InjectFunction.js", (params || {}).data, returnFunc);
}

function OnGetHtml(params, returnFunc) {
	gcontext.ExecuteOnTab("GetHtml.js", (params || {}).data, returnFunc);
}

function OnGetAttribute(params, returnFunc) {
	gcontext.ExecuteOnTab("GetAttribute.js", (params || {}).data, returnFunc);
}

function OnSetAttribute(params, returnFunc) {
	gcontext.ExecuteOnTab("SetAttribute.js", (params || {}).data, returnFunc);
}

function OnSetCheckbox(params, returnFunc) {
	gcontext.ExecuteOnTabWithWindowInfo("SetCheckbox.js", params.data, returnFunc);
}

function OnSelectItems(params, returnFunc) {
	gcontext.ExecuteOnTabWithWindowInfo("SelectItems.js", params.data, returnFunc);
}

function OnGetElementVisibility(params, returnFunc) {
	gcontext.ExecuteOnTab("GetElementVisibility.js", params.data, returnFunc);
}

function OnSetProxy(params, returnFunc) {
	gcontext.TraceMessage("OnSetProxy");

	const config = params.data || {};
	const { proxyType, data } = config;

	if (proxyType === "PAC") {
		gcontext.SetPACProxy(data);
	} else if (proxyType === "Unhandled") {
		gcontext.SetUnhandledProxy(data);
	} else if (proxyType === "Handled") {
		gcontext.SetHandledProxy(data);
	} else {
		returnFunc({ status: N_FALSE });
		return;
	}

	returnFunc({ status: N_TRUE });
}

function OnStartBlockingResources(params, returnFunc) {
	gcontext.TraceMessage("OnStartBlockingResources");
	const {blockedResources} = params.data || {};
	gcontext.startBlockingResources(blockedResources);
	returnFunc({status: N_TRUE});
}

function OnStopBlockingResources(params, returnFunc) {
	gcontext.TraceMessage("OnStopBlockingResources");
	gcontext.stopBlockingResources();
	returnFunc({status: N_TRUE});
}