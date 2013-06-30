exports.appfail = (function() {

	// helper - generate fake guid
	var guid = function() {
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};

	// helper - merge two objects together, without using $.extend
	var merge = function(obj1,obj2) {
		var obj3 = {};
		for (var attrOne in obj1) { obj3[attrOne] = obj1[attrOne]; }
		for (var attrTwo in obj2) { obj3[attrTwo] = obj2[attrTwo]; }
		return obj3;
	};

	// helper - clone a JSON object
	var cloneObject = function(obj) {
		var clone =  !obj ? null : (obj instanceof Array ? [] : {});
		for (var i in obj) {
			if(typeof(obj[i]) === "object") {
				clone[i] = cloneObject(obj[i]);
			} else {
				clone[i] = obj[i];
			}
		}
		return clone;
	};

	// template error report
	var report = {
		RequestUrl: "",
		HttpVerb: "",
		ReferrerUrl: "",
		OccurrenceTimeUtc: null,
		User: 'Anonymous',
		PostValuePairs: [],
		QueryValuePairs: [],
		Cookies: [],
		UniqueId: null,
		UserAgent: "",
		HttpStatus: null,
		Exceptions: [],
		PageCorrelationId: guid(),
		IsXHRFailure: false,
		XHRRequestURL: null,
		ConnectionStatus: 'online',
		IsStandalone: false,
		TimeOnPage: 0
	};

	var config = {
		ApiToken: "",
		ApplicationType: "Node",
		ModuleVersion: "2.0",
		FailOccurrences: []
	};

	var setup = function(params) {
		var newConfig = merge(config,params);
		config = newConfig;
	};

	var postErrors = function() {
		// submit to REST api
	};

	// handle uncaught exceptions
	process.on("uncaughtException", function(e) {
		var newReport = cloneObject(newReport);
		// grab stuff from errors
		postErrors();
	});

	return {
		setup: setup
	};

}());