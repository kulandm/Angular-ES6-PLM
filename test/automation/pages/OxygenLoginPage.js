/**
 * @ngdoc object
 * @name ViewTestsPage.OxygenLoginPage
 *
 * @description This page corresponds to the oxygen login page.
 *
 * ##Dependencies
 *
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');

function OxygenLoginPage() {

	OxygenLoginPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.OxygenLoginPage#route
	 * @propertyOf ViewTestsPage.OxygenLoginPage
	 * @description The URL for this page.
	 */
	this.route = '/';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.OxygenLoginPage#urlRegex
	 * @propertyOf ViewTestsPage.OxygenLoginPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/Authentication/Landing');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.OxygenLoginPage#urlContains
	 * @propertyOf ViewTestsPage.OxygenLoginPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'ReturnUrl';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.OxygenLoginPage#username
	 * @propertyOf ViewTestsPage.OxygenLoginPage
	 * @description `private` The user name input box.
	 */
	var username = element(by.id('userName'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.OxygenLoginPage#password
	 * @propertyOf ViewTestsPage.OxygenLoginPage
	 * @description `private` The password input box.
	 */
	var password = element(by.id('password'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.OxygenLoginPage#signInBtn
	 * @propertyOf ViewTestsPage.OxygenLoginPage
	 * @description `private` The Sign In button.
	 */
	var signInBtn = element(by.id('btnSubmit'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.OxygenLoginPage#validationMessage
	 * @methodOf ViewTestsPage.OxygenLoginPage
	 * @description Get the element by message (xpath).
	 *
	 * @param {String} message The message.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.validationMessage = function (message) {
		return element(by.xpath("//span[contains(text(),'"+message+"')]"));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.OxygenLoginPage#login
	 * @methodOf ViewTestsPage.OxygenLoginPage
	 * @description Enter user name and password and logs user into oxygen.
	 *
	 * @param {String} usernameStr The user name to be entered into the input box.
	 * @param {String} passwordStr The password to be entered into the input box.
	 *
	 * @returns {Object} A Promise that resolves when the click on the Sign In button is completed.
	 */
	this.login = function (usernameStr, passwordStr) {
		expect(username).not.to.be.null;
		expect(password).not.to.be.null;
		expect(signInBtn).not.to.be.null;
		username.sendKeys(usernameStr);
		password.sendKeys(passwordStr);
		return signInBtn.click();
	};
}

util.inherits(OxygenLoginPage, GenericPage);

module.exports = new OxygenLoginPage();