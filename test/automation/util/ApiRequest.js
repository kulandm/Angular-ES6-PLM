'use strict';

let request = require('request');

/**
 * @ngdoc object
 * @name ViewTestsUtil.ApiRequest
 *
 * @description This is a helper to make direct requests to the api.
 *
 * ##Dependencies
 *
 */
let ApiRequest = function () {
	/**
	 * @function
	 * @name addCookies
	 * @description Takes the cookies of the session of PLM 360 site and add them to a request jar.
	 *
	 * @param {Object} j: the jar in which copy the cookies
	 * @param {String} requestUrl: the request URL
	 *
	 * @return {Object} promise that will be resolved when the cookies are copied into the jar.
	 */
	let addCookies = (j, requestUrl) => {
		return browser.manage().getCookies().then(function (cookies) {
			cookies.forEach(function (cookie) {
				let requestCookie = request.cookie(cookie.name + '=' + cookie.value);
				j.setCookie(requestCookie, requestUrl);
			});
		});
	};

	/**
	 * @function
	 * @name makeRequest
	 * @description Makes a PUT request.
	 *
	 * @param {Object} j: the jar in which copy the cookies
	 * @param {String} requestUrl: the request URL
	 * @param {Object} requestData: the data
	 * @return {Object} promise that will be resolved when the cookies are copied into the jar.
	 */
	let makeRequest = (method, requestUrl, requestData) => {
		let deferred = protractor.promise.defer();

		requestUrl = browser.baseUrl + '/' + requestUrl;

		return browser.wait(function () {
			let j = request.jar();

			let options = {
				method: method,
				url: requestUrl,
				headers: {'Content-Type': 'application/json'},
				jar: j
			};

			if (method === 'POST' || method === 'PUT') {
				options.headers.Accept = 'application/json';
				if (requestData) {
					options.body = requestData;
				}
			}

			addCookies(j, requestUrl).then(function () {
				request(options, function (error, response, body) {
					deferred.fulfill({
						error: error,
						response: response,
						body: body
					});
				});
			});

			return deferred.promise;
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.ApiRequest#put
	 * @propertyOf ViewTestsUtil.ApiRequest
	 * @description Makes a PUT request.
	 *
	 * @param {String} requestUrl: the url
	 * @param {String} requestData: the data
	 *
	 * @return {Object} promise that will be resolved when the response is returned by the server.
	 */
	this.put = function (requestUrl, requestData) {
		return makeRequest('PUT', requestUrl, requestData);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.ApiRequest#get
	 * @propertyOf ViewTestsUtil.ApiRequest
	 * @description Makes a GET request.
	 *
	 * @param {String} requestUrl: the url
	 *
	 * @return {Object} promise that will be resolved when the response is returned by the server.
	 */
	this.get = function (requestUrl) {
		return makeRequest('GET', requestUrl);
	};
};

module.exports = new ApiRequest();
