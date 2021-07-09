var g_csLoaded = false;

window.chrome = window.chrome || window.browser;

function injectScript() {
	function addStyle(styleString) {
		const style = document.createElement('style');
		style.textContent = styleString;
		document.head.append(style);
	}

	addStyle(`
	.sentences-analyzer-container li {
		margin-bottom: 10px;
	}
	`)

	function sendText(st) {
		console.log(st)
		chrome.runtime.sendMessage({
			type: "selectedText",
			host: window.location.host,
			text: st
		}, function (response) {
		});
	}

	function moveNext(element) {
		const nextElement = element.nextElementSibling;
		if (nextElement) {
			nextElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		}
	}

	function registerEventHandlers(element) {
		element.addEventListener("mouseenter", e => {
			element.style.border = "1px solid red";
		});
		element.addEventListener("mouseout", e => {
			element.style.border = "unset";
		});
		element.addEventListener("click", e => {
			const selectedText = getSelection().toString();
			if (selectedText.length > 0 && selectedText.trim().length === 0) {
				return;
			}
			const text = selectedText.trim() || element.getAttribute("text-data");
			sendText(text);
			element.style.background = "gray";
			moveNext(element);
		})
	}

	function preprocessing(root) {
		const text = root.innerText || "";
		const parts = text.split(".").map(st => st.trim().replace(/\n/g, "")).filter(st => st.length > 0);

		root.innerHTML = null;
		const ul = document.createElement("ul");
		ul.className = "sentences-analyzer-container"
		root.appendChild(ul);
		for (const part of parts) {
			const element = document.createElement("li");
			element.innerText = part + ".";
			element.setAttribute("text-data", part);
			element.style.cursor = "default";
			ul.appendChild(element);
			registerEventHandlers(element);
		}
	}

	function getElement(selector, callback) {
		const found = document.querySelector(selector);
		if (found) {
			callback(found);
		}

		const observer = new MutationObserver(function (mutations) {
			const hasAddedNodes = mutations.some(function (mutation) {
				return !!mutation.addedNodes;
			});
			if (hasAddedNodes) {
				const element = document.querySelector(selector);
				if (element) {
					observer.disconnect();
					callback(element);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	let containerSelector;
	switch (window.location.host) {
		case "truyenfull.vn":
			console.log("----------Listening truyenfull.vn");
			containerSelector = "#chapter-c";
			break;
		case "m.truyencv.vn":
			console.log("----------Listening truyencv.vn");
			containerSelector = "div.fontSize-2";
			break;
		case "metruyenchu.com":
			console.log("----------Listening metruyenchu.vn");
			containerSelector = "#js-read__content";
			break;
	}

	if (!containerSelector) {
		return;
	}

	getElement(containerSelector, root => {
		console.log("----------FOUND");
		setTimeout(() => {
			preprocessing(root);
		}, 1000);
	})
}

var logger = {
	log: function (message) {
		try {
			console.log(message);
		} catch (e) { }
	},
	error: function (message) {
		try {
			console.error(message);
		} catch (e) { }
	},
};

// When code map is loaded for a new implementation, this listener to receive the new content code
chrome.runtime.onMessage.addListener(function OnBackgroundMessage(message, sender, sendResponse) {
	switch (message.type) {
		case "content_load":
			logger.log("OnBackgroundMessage: content scripts loaded from new g_codeMap");
			InitializeContent(message);
			sendResponse();
			injectScript();
			break;
		default:
			break;
	}
});

function InitializeContent(message) {
	logger.log("InitializeContent");

	try {
		eval.call(window, message.contentCode);
		g_csLoaded = true;
	} catch (ex) {
		logger.log("OnContentScriptLoadRequest failed to evaluate content script " + ex.message);
	}
}

window.addEventListener('hashchange', function() { 
	console.log("hashchange")
	injectScript();
})

window.addEventListener('popstate', function() { 
  console.log("popstate")
  injectScript();
})

window.addEventListener("load", () => {
	if (window === top) {
		const bodyElement = document.querySelector("body");
		const temp = `
        <div>
          <div id="awt-gen2-highlighted-top"></div>
          <div id="awt-gen2-highlighted-left"></div>
          <div id="awt-gen2-highlighted-right"></div>
          <div id="awt-gen2-highlighted-bottom"></div>
        </div>
        `;
		bodyElement.insertAdjacentHTML("beforeend", temp);
		injectScript();
	}
});