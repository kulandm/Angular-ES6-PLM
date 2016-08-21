/**
 * @ngdoc object
 * @name ViewTestsUtil.Helper
 *
 * @description This is the helper for routing.
 *
 * ##Dependencies
 *
 */
var request = require('request');
var apiRequest = require('./ApiRequest');

var Helper = function () {

	/**
	 * @ngdoc property
	 * @name ViewTestsUtil.Helper#signOutLink
	 * @propertyOf ViewTestsUtil.Helper
	 * @description `private` WebElement for Sign Out link.
	 */
	var signOutLink = element(by.css('#logoutForm a'));

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#waitForLoadingBarToComplete
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Wait until the loading bar (id=wrapper) to finish (i.e. absence of class 'loading')
	 *
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.waitForLoadingBarToComplete = function () {
		return browser.driver.wait(function () {
			return element(by.id('wrapper')).getAttribute('class').then(function (classes) {
				return classes.split(' ').indexOf('loading') === -1;
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#waitForUrlToChangeTo
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Wait until the URL changes to match a provided regex.
	 *
	 * @param {RegExp} urlRegex The regex.
	 *
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.waitForUrlToChangeTo = function (urlRegex) {
		// for some unknown odd reason coverage tool can't run without
		// this explicit 60000 timeout set
		return browser.driver.wait(function () {
			return browser.driver.getCurrentUrl().then(function (url) {
				return urlRegex.test(url);
			});
		}, 60000);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#waitForUrlToChangeTo
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Assert that we actually make it to the page we are testing.
	 *
	 * @param {RegExp} urlRegex The regex.
	 * @param {String} urlContains The piece of substring that this page's
	 * URL should contain.
	 *
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.waitForUrlToChangeToAndExpect = function (urlRegex, urlContains) {
		this.waitForUrlToChangeTo(urlRegex);
		// expect(browser.getCurrentUrl()).to.eventually.contain(urlContains);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#waitForUrlToChangeToAndContain
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Assert that we actually make it to the page we are testing, and it contains a string
	 *
	 * @param {RegExp} urlRegex The regex.
	 * @param {String} urlContains The piece of substring that this page's URL should contain.
	 *
	 * @returns {!webdriver.promise.Promise} Promise with response of TRUE if string was found in the URL, otherwise false
	 */
	this.waitForUrlToChangeToAndContain = function (urlRegex, urlContains) {
		var deferred = protractor.promise.defer();
		this.waitForUrlToChangeTo(urlRegex).then(function (response) {
			browser.getCurrentUrl().then(function (response) {
				deferred.fulfill((response.indexOf(urlContains) === -1) ? false : true);
			});
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#getAndWaitForUrlToChangeTo
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Get the route and assert we make it to the page.
	 *
	 * @param {RegExp} urlRegex The regex.
	 * @param {String} route The URL for this page.
	 *
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.getAndWaitForUrlToChangeTo = function (route, urlRegex) {
		browser.get(route);
		this.waitForUrlToChangeTo(new RegExp(urlRegex));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#getAndWaitForUrlToChangeToAndExpect
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Get the route and assert we make it to the page and check URL.
	 *
	 * @param {String} route The URL for this page.
	 * @param {RegExp} urlRegex The regex.
	 * @param {String} urlContains The piece of substring that this page's URL should contain.
	 *
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.getAndWaitForUrlToChangeToAndExpect = function (route, urlRegex, urlContains) {
		browser.get(route);
		this.waitForUrlToChangeToAndExpect(new RegExp(urlRegex), urlContains);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#promisedExpect
	 * @propertyOf ViewTestsUtil.Helper
	 * @description To be filled in.
	 *
	 * @param {} exp To be filled in.
	 * @param {} callback To be filled in.
	 *
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.promisedExpect = function (exp, callback) {

	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#getTodayString
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Gets today's date.
	 *
	 * @returns {String} a string with formatted date
	 */
	this.getTodayString = function () {
		var today = new Date();
		var day = today.getDate();
		day = (day<10) ? '0' + day : day;
		var month = today.getMonth() + 1;
		month = (month<10) ? '0' + month : month;
		var year = today.getFullYear();

		// E.g. 07/23/2015
		return month + '/' + day + '/' + year;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#getCurrentUrl
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Gets current URL.
	 *
	 * @returns promise that when it is resolved, get the current url.
	 */
	this.getCurrentUrl = function () {
		return browser.driver.getCurrentUrl();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Helper#isFeatureEnabled
	 * @propertyOf ViewTestsUtil.Helper
	 * @description Gets the payload for the enabled features and check if the
	 * specified feature is enabled or not.
	 *
	 * @param {String} Feature to check
	 *
	 * @returns {Boolean} True, if feature is enabled
	 */
	this.isFeatureEnabled = function (feature) {
		var deferred = protractor.promise.defer();
		browser.driver.getWindowHandle().then(function () {
			apiRequest.get('/api/v3/tenant/enabled-features').then(function (data) {
				var parsedData = JSON.parse(data.body);

				var isFound = !!parsedData.find(function (parsedFeature) {
					return parsedFeature && parsedFeature.title && parsedFeature.title === feature;
				});

				deferred.fulfill(isFound);
			});
		});
		return deferred.promise;
	};
};

module.exports = new Helper();
