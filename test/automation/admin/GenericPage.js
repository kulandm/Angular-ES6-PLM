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
var q = require('q');

function GenericPage() {

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.GenericPage#go
	 * @methodOf ViewTestsPage.GenericPage
	 * @description Visits this page.
	 */
	this.go = function () {
		var that = this;
		browser.driver.get(browser.params.plmBaseUrl + this.route);

		return browser.driver.wait(function () {
			return browser.driver.getCurrentUrl().then(function (url) {
				return that.urlRegex.test(url);
			}).then(function () {
				return that.waitForLoaded();
			});
		}, 10000);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.GenericPage#waitForVisible
	 * @methodOf ViewTestsPage.GenericPage
	 * @description Checks whether an element is displayed.
	 * @param {Object} def The promise to be resolved
	 * @param {String} css The string for css locator
	 *
	 */
	this.waitForVisible = function (def, css) {
		var that = this;
		browser.driver.isElementPresent(by.css(css))
		.then(function (isPresent) {
			if (isPresent) {
				browser.driver.findElement(by.css(css)).isDisplayed()
				.then(function (isVisible) {
					if (!isVisible) {
						def.resolve();
					} else {
						setTimeout(function () {
							that.waitForVisible(def, css);
						}, 500);
					}
				});
			} else {
				def.resolve();
			}
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.GenericPage#waitForLoaded
	 * @methodOf ViewTestsPage.GenericPage
	 * @description Returns when the page is loaded.
	 *
	 * @returns {Object} promise that while to resolved when url is changed.
	 */
	this.waitForLoaded = function (deferred) {
		var that = this;
		var deferreds = [q.defer(), q.defer(), q.defer(), q.defer(), q.defer(), q.defer(), q.defer(), q.defer()];
		this.waitForVisible(deferreds[0], '.loading');
		this.waitForVisible(deferreds[1], 'div.overlaySpinner');
		this.waitForVisible(deferreds[2], 'body > div.overlay');
		this.waitForVisible(deferreds[3], 'div.blocker img');
		this.waitForVisible(deferreds[4], 'div#jsloader');
		this.waitForVisible(deferreds[5], 'div.spinner');
		this.waitForVisible(deferreds[6], 'img.imgspinner');
		this.waitForVisible(deferreds[7], 'span.classification-spinner');
		return q.all(deferreds);
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
