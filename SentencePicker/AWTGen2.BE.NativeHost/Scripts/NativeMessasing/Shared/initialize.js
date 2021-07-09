let gcontext = g_globalContext;

chrome.PostContentInitializeImpl = function () {
	InitTracing();
};

function InitTracing() {
	g_nativeMsgComm.CallFunction("IsTraceEnabled", {}, function (response) {
		if (response.isTraceEnabled === N_TRUE) {
			gcontext.EnableTracing();
			gcontext.TraceMessage("InitTracing: start tracing ...");
			chrome.tabs.query(
				{
					url: "<all_urls>",
				},
				function (tabsList) {
					for (var i = 0; i < tabsList.length; ++i) {
						var tab = tabsList[i];
						if (!gcontext.IsBrowserSettingsUrl(tab.url)) {
							EnableTracingInTab(tab.id);
						}
					}
				}
			);
		}
	});
}
