/**
 * @ngdoc object
 * @name ViewTestsPage.GenericPage
 *
 * @description This is a parent class of all pages.
 *
 * ##Dependencies
 *
 */
var helper = require('../util/Helper');

function GenericPage() {

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.GenericPage#go
	 * @methodOf ViewTestsPage.GenericPage
	 * @description Visits this page.
	 */
	this.go = function () {
		browser.get(this.route + (this.route.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.GenericPage#waitForLoaded
	 * @methodOf ViewTestsPage.GenericPage
	 * @description Returns when the page is loaded.
	 *
	 * @returns {Object} promise that while to resolved when url is changed.
	 */
	this.waitForLoaded = function () {
		return helper.waitForUrlToChangeTo(this.urlRegex);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.GenericPage#isLoaded
	 * @methodOf ViewTestsPage.GenericPage
	 * @description Checks whether this page is loaded.
	 *
	 * @returns {Boolean} True if this page is loaded.
	 */
	this.isLoaded = function () {
		var that = this;
		return browser.wait(function isLoaded() {
			return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
				return that.urlRegex.test(that.urlContains);
			});
		});
	};
}

module.exports = GenericPage;
