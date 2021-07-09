WrapInGlobalContext(function () {
	var gcontext = this;
	chrome = (chrome && chrome.i18n && chrome) || (browser && browser.i18n && browser);

	let proxyAuth = undefined;

	gcontext.SetPACProxy = function (url) {
		proxyAuth = undefined;

		chrome.proxy.settings.set(
			{
				value: {
					mode: "pac_script",
					pacScript: { url },
				},
				scope: "regular",
			},
			function () { }
		);
	};

	gcontext.SetUnhandledProxy = function (mode) {
		proxyAuth = undefined;

		chrome.proxy.settings.set(
			{
				value: { mode },
				scope: "regular",
			},
			function () { }
		);
	};

	gcontext.SetHandledProxy = function (proxyConfig) {
		const { bypassList, proxyMode, host, port, scheme, username, password } = proxyConfig;
		proxyAuth = { username, password };

		const config = {
			mode: "fixed_servers",
			rules: {
				bypassList: bypassList || [],
			},
		};
		config.rules[proxyMode] = {
			host,
			port,
			scheme,
		};
		chrome.proxy.settings.set(
			{
				value: config,
				scope: "regular",
			},
			function () { }
		);
	};

	function handleAuthRequired(details) {
		if (!proxyAuth) {
			return {};
		}
		
		const {username, password} = proxyAuth;

		return details.isProxy ? {
			authCredentials: {
				username: username,
				password: password
			}
		} : {}
	}

	chrome.webRequest.onAuthRequired.addListener(
		handleAuthRequired,
		{ urls: ["<all_urls>"] },
		['blocking']);
});
