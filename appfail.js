var request = require('request');

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

	// Empty exception object
    var exception = {
        ExceptionType: "Javascript Error",
        ExceptionMessage: "",
        StackTrace: ""
    };

	var configure = function(params) {
		var newConfig = merge(config,params);
		config = newConfig;
	};

	// submit to REST api
	var postError = function(error) {

		request.post('https://api.appfail.net', {
			error: error
		}, function(error,response,body) {
			// handle errors?
			console.log(response);
		});

	};

	// handle uncaught exceptions
	process.on("uncaughtException", function(e) {

		// clone existing templates
		var newReport = cloneObject(report);
		var newException = cloneObject(exception);
		newReport.OccurrenceTimeUtc = (new Date).toUTCString();
        newException.ExceptionMessage = e.message;
        newException.StackTrace = e.stack;
		newReport.Exceptions.push(newException);

		postError(newReport);

	});

	return {
		configure: configure
	};

}());