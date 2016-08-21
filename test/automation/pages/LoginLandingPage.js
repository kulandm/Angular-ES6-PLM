/**
 * @ngdoc object
 * @name ViewTestsPage.LoginLandingPage
 *
 * @description This page corresponds to the login page where the Sign In button is shown.
 *
 * ##Dependencies
 *
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var AppHeader = require('../components/AppHeader');

function LoginLandingPage() {

	LoginLandingPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.LoginLandingPage#route
	 * @propertyOf ViewTestsPage.LoginLandingPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/login?customer=' + browser.params.tenant;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.LoginLandingPage#urlRegex
	 * @propertyOf ViewTestsPage.LoginLandingPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/login');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.LoginLandingPage#urlContains
	 * @propertyOf ViewTestsPage.LoginLandingPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'login';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.LoginLandingPage#signInBtn
	 * @propertyOf ViewTestsPage.LoginLandingPage
	 * @description `private` WebElement for Sign In button.
	 */
	var signInBtn = by.css('#loginButton');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.LoginLandingPage#signIn
	 * @methodOf ViewTestsPage.LoginLandingPage
	 * @description Clicks the Sign In button.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.signIn = function () {
		browser.wait(function () {
			return element(signInBtn).isPresent();
		},30000);
		var deferred = protractor.promise.defer();
		deferred.fulfill(element(signInBtn).click());
		return deferred.promise;
	};
}

util.inherits(LoginLandingPage, GenericPage);

module.exports = new LoginLandingPage();
