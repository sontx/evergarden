var g_functionNameThatWillBeCalled = "";
var g_functionThatWillBeCalled = null;
var g_globalContext;
var g_isCustomCacheInitialized;
var g_customIdCache;
var g_crtCustomIdValue;
if (g_isCustomCacheInitialized !== true) {
	g_isCustomCacheInitialized = true;
	g_customIdCache = {};
	g_crtCustomIdValue = 0;
}

var N_TRUE = 1;
var N_FALSE = 0;

function WrapInjectedFunction(funcName, func) {
	g_functionNameThatWillBeCalled = funcName;
	g_functionThatWillBeCalled = func;
}

function WrapInGlobalContext(func) {
	if ("undefined" == typeof g_globalContext) g_globalContext = {};
	g_globalContext.__EnrichContextFunc = func;
	g_globalContext.__EnrichContextFunc();
	g_globalContext.__EnrichContextFunc = null;
}
