if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnInjectAsyncFunction", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("InjectAsyncFunction");

		const { code, args } = message;

		const wrapperCode = `
const _clientFunc = ${code};
try {
    const result = await _clientFunc(args);
    return {
        isErr: false,
        result: result
    };
} catch (ex) {
    return {
        isErr: true,
        result: ex.toString()
    };
}
`;

		function sendError(err) {
			sendResponse({ status: N_FALSE, error: typeof err === "string" ? err : err.message });
		}

		try {
			const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
			const wrapperFunc = new AsyncFunction("args", wrapperCode);
			wrapperFunc(args || {})
				.then((ret) => {
					if (ret.isErr) {
						sendResponse({ status: N_FALSE, error: ret.result });
					} else {
						sendResponse({ status: N_TRUE, result: ret.result });
					}
				})
				.catch((err) => {
					sendError(err);
				});
		} catch (err) {
			sendError(err);
		}
	});
}
