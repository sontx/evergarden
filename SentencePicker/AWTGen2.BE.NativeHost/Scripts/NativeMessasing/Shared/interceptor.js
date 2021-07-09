WrapInGlobalContext(function () {
    var gcontext = this;
    chrome = (chrome && chrome.i18n && chrome) || (browser && browser.i18n && browser);

    let blockedResources = [];
    let registered = false;

    function handleRequest(details) {
        console.log(details.type)
        if (blockedResources.includes(details.type)) {
            return { cancel: true };
        }
        return {};
    }

    gcontext.startBlockingResources = function (res) {
        blockedResources = res || [];
        if (!registered) {
            registered = true;
            chrome.webRequest.onBeforeRequest.addListener(
                handleRequest,
                { urls: ["*://*/*"] },
                ["blocking"]);
        }

    }

    gcontext.stopBlockingResources = function () {
        registered = false;
        chrome.webRequest.onBeforeRequest.removeListener(handleRequest);
    }
});
