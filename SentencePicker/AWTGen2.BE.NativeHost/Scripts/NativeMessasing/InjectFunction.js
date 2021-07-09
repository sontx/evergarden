if (typeof WrapInjectedFunction === "function") {
	WrapInjectedFunction("OnInjectFunction", function (gcontext, message, sender, sendResponse) {
		gcontext.TraceMessage("OnInjectFunction");

		const { code, args } = message;

		const wrapperCode = `
const _clientFunc = ${code};
try {
    const result = _clientFunc(args);
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

		try {
			const wrapperFunc = new Function("args", wrapperCode);
			const ret = wrapperFunc(args || {});
			if (ret.isErr) {
				sendResponse({ status: N_FALSE, error: ret.result });
			} else {
				sendResponse({ status: N_TRUE, result: ret.result });
			}
		} catch (err) {
			sendResponse({ status: N_FALSE, error: typeof err === "string" ? err : err.message });
		}
	});
}
