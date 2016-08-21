/**
 * @ngdoc object
 * @name ViewTestsUtil.Auth
 *
 * @description This is the authentication helper.
 *
 * ##Dependencies
 *
 */
var helper = require('../util/Helper');
var ss = require('../util/screenshoter');
var mainDashboardPage = require('../pages/MainDashboardPage');
var loginLandingPage = require('../pages/LoginLandingPage.js');
var oxygenLoginPage = require('../pages/OxygenLoginPage.js');
var TermsAndConditionsAcceptanceModal = require('../components/TermsAndConditionsAcceptanceModal');
var request = require('request');

var Auth = function () {

	/**
	 * @ngdoc property
	 * @name ViewTestsUtil.Auth#avatarLink
	 * @propertyOf ViewTestsUtil.Auth
	 * @description `private` WebElement to open the Sign Out menu.
	 */
	var avatarLink = element(by.css('#login-avatar'));

	/**
	 * @ngdoc property
	 * @name ViewTestsUtil.Auth#signOutLink
	 * @propertyOf ViewTestsUtil.Auth
	 * @description `private` WebElement for Sign Out link.
	 */
	var signOutLink = element(by.buttonText('Sign Out'));

	/**
	 * @ngdoc property
	 * @name ViewTestsUtil.Auth#signOutMenuLink
	 * @propertyOf ViewTestsUtil.Auth
	 * @description `private` WebElement for Sign Out menu.
	 */
	var signOutMenuLink = element(by.css('#profileMenuLink'));

	/**
	 * @ngdoc property
	 * @name ViewTestsUtil.Auth#doneTestsCount
	 * @propertyOf ViewTestsUtil.Auth
	 * @description `private` Count for the done tests.
	 */
	var doneTestsCount = 0;

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Auth#doLogin
	 * @propertyOf ViewTestsUtil.Auth
	 * @description The function to login.
	 *
	 * @return {Object} promise that will be resolved when login is performed.
	 */
	this.doLogin = function () {
		return this.doLoginWithParam(browser.params.userId, browser.params.password);
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Auth#doLoginWithParam
	 * @propertyOf ViewTestsUtil.Auth
	 * @description The function to login with given user name and password.
	 * 
	 * @param {String} username: user's login name
	 * @param {String} password: the password
	 *
	 * @return {Object} promise that will be resolved when login is performed.
	 */
	this.doLoginWithParam = function (username, password) {
		if (loggedInUser === username) {// same user, no need to login again
			var deferred = protractor.promise.defer();
			deferred.fulfill(true);
			return deferred.promise;
		} else if (loggedInUser !== null) {// need to log out and login again
			this.doLogout();
		}
		browser.ignoreSynchronization = true;

		loginLandingPage.go();
		browser.driver.getCurrentUrl().then(function (val) {
			expect(val).to.contain('/login');
		});
		loginLandingPage.signIn();

		oxygenLoginPage.waitForLoaded();
		
		oxygenLoginPage.login(username, password);

		mainDashboardPage.waitForLoaded();
		return browser.driver.getCurrentUrl().then(function (val) {
			expect(val).to.contain('/mainDashboard');
			loggedInUser = username;
			browser.ignoreSynchronization = false;
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Auth#incrementTestsCount
	 * @propertyOf ViewTestsUtil.Auth
	 * @description The function to increment the number of tests done.
	 */
	this.incrementTestsCount = function () {
		doneTestsCount++;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Auth#doLogout
	 * @propertyOf ViewTestsUtil.Auth
	 * @description The function to logout.
	 *
	 * @return {Object} promise that will be resolved when logout is performed or rejected if logout is unsuccessful.
	 */
	this.doLogout = function () {
		var deferred = protractor.promise.defer();
		try {
			// sometimes the sidenavbar remain open because the test case did not close it,
			// that covered whole page, need to dismiss it before click the logout.
			browser.getCurrentUrl().then(function (url) {
				if (url.indexOf('view=split') !== -1) {
					// in split view, the logout button been covered
					mainDashboardPage.go();
					mainDashboardPage.waitForEvents();
				}
			});
			var backDrop = element(by.css('.md-sidenav-backdrop'));
			backDrop.isPresent().then(function (isExist) {
				if (isExist) {
					backDrop.isDisplayed().then(function (isShown) {
						if (isShown) {
							backDrop.click();
						}
					});
				}
			});
			avatarLink.click();
			signOutLink.click();
			loggedInUser = null;
			loginLandingPage.waitForLoaded();
			deferred.fulfill(true);
		} catch (e) {
			ss.writeSS('logout');
			deferred.reject(e);
		}
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsUtil.Auth#checkAgreementModal
	 * @propertyOf ViewTestsUtil.Auth
	 * @description The function to check, accept and close the terms and agreement acceptance modal.
	 *
	 * @params {Number} The time that protractor will wait for the modal
	 * @params {Boolean} Whether or not a verification must be forced
	 *
	 * @return {Object} promise that will be resolved when terms are accepted.
	 *
	 */
	this.checkAgreementModal = function (time, force) {
		var deferred = protractor.promise.defer();
		if (!browser.params.acceptedAgreement || force) {
			browser.manage().getCookies().then(function (cookies) {
				var url = browser.baseUrl;
				var j = request.jar();
				var options = {
					url: url + '/api/v3/workspaces',
					headers: {'Content-Type': 'application/json'},
					jar: j
				};

				// Add all cookies to the request
				// Maybe this is unnecessary, could be a better approach
				cookies.forEach(function (cookie) {
					var requestCookie = request.cookie(cookie.name + '=' + cookie.value);
					j.setCookie(requestCookie, url);
				});

				request(options, function (error, response, body) {
					var data = JSON.parse(body);
					var accepted = data.fusionLifecycleTermsOfServiceAccepted || null;
					if (response.statusCode === 403 && accepted === 'false') {
						TermsAndConditionsAcceptanceModal.checkAcceptAndClose(time).then(function (termsAccepted) {
							deferred.fulfill(termsAccepted);
						});
					} else {
						browser.params.acceptedAgreement = true;
						deferred.fulfill(browser.params.acceptedAgreement);
					}
				});
			});
		} else {
			deferred.fulfill(browser.params.acceptedAgreement);
		}
		return deferred.promise;
	};

};

module.exports = new Auth();
