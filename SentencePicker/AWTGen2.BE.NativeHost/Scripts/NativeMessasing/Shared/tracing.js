WrapInGlobalContext(function () {
	var gcontext = this;
	gcontext.g_traceEnabled = true;
	gcontext.EnableTracing = function () {
		gcontext.g_traceEnabled = true;
	};
	gcontext.DisableTracing = function () {
		gcontext.g_traceEnabled = false;
	};
	gcontext.IsTracingEnabled = function () {
		return gcontext.g_traceEnabled;
	};
	gcontext.TraceMessage = function (msg) {
		if (gcontext.g_traceEnabled) {
			try {
				console.log("AWTGen2 : " + msg);
			} catch (e) {}
		}
	};
	gcontext.TraceError = function (msg) {
		if (gcontext.g_traceEnabled) {
			try {
				console.error("AWTGen2 : " + msg);
			} catch (e) {}
		}
	};
	gcontext.EnumObjectProps = function (obj, enumValues) {
		if (obj == null) {
			return "<null object>";
		}
		var msg = "";
		for (var prop in obj) {
			var crtObj = null;
			try {
				crtObj = obj[prop];
			} catch (e) {
				crtObj = null;
			}
			if (crtObj == null) {
				continue;
			}
			var propVal = "";
			if (typeof crtObj === "function") {
				propVal = "function {...}";
			} else if (crtObj.toString == null) {
				propVal = "<" + typeof crtObj + ">";
			} else {
				var MAX_VAL = 30;
				propVal = crtObj.toString();
				if (propVal.length > MAX_VAL) {
					propVal = propVal.slice(0, MAX_VAL) + "...";
				}
			}
			msg += prop;
			msg += enumValues === true ? "=[" + propVal + "]\n" : ", ";
		}
		return msg;
	};
});
