WrapInGlobalContext(function () {
	var gcontext = this;
	chrome = (chrome && chrome.i18n && chrome) || (browser && browser.i18n && browser);

	const navigationInfo = {};

	function generateRandomHex(size) {
		return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
	}

	chrome.webNavigation.onBeforeNavigate.addListener(function (data) {
		if (typeof data && data.frameId === 0) {
			const oldInfo = navigationInfo[`${data.tabId}`] || {};
			navigationInfo[`${data.tabId}`] = {
				tabId: data.tabId,
				url: data.url,
				readyState: "loading",
				pageSession: oldInfo.pageSession,
			};
		}
	});
	chrome.webNavigation.onCompleted.addListener(function (data) {
		if (typeof data && data.frameId === 0) {
			navigationInfo[`${data.tabId}`] = {
				tabId: data.tabId,
				url: data.url,
				readyState: "complete",
				pageSession: generateRandomHex(16),
			};
		}
	});

	gcontext.GetTabNavigationInfo = function (tabId) {
		return navigationInfo[`${tabId}`] || {};
	};
});
