var expect = require('./NextPLMSetup').expect;

var Helper = function () {

	/**
	 * @name waitForUrlToChangeTo
	 * @description Wait until the URL changes to match a provided regex
	 * @param {RegExp} urlRegex wait until the URL changes to match this regex
	 * @returns {!webdriver.promise.Promise} Promise
	 */
	this.waitForUrlToChangeTo = function (urlRegex) {
		var currentUrl;

		return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
				currentUrl = url;
			}
		).then(function waitForUrlToChangeTo() {
				return browser.wait(function waitForUrlToChangeTo() {
					return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
						// console.log(urlRegex + '\n' + url + '\n' + urlRegex.test(url) + '\n' + '\n');
						return urlRegex.test(url);
					});
				});
			}
		);
	};

	// Assert that we actually make it to the page we are testing
	this.waitForUrlToChangeToAndExpect = function (urlRegex , urlContains) {
		this.waitForUrlToChangeTo(urlRegex).then(function () {
			expect(browser.getCurrentUrl()).to.eventually.contain(urlContains);
		});
	};

	this.getAndWaitForUrlToChangeTo = function (route, urlRegex) {
		browser.get(route);
		this.waitForUrlToChangeTo(new RegExp(urlRegex));
	};

	this.getAndWaitForUrlToChangeToAndExpect = function (route, urlRegex, urlContains) {
		browser.get(route);
		this.waitForUrlToChangeToAndExpect(new RegExp(urlRegex), urlContains);
	};

	this.getElementByTagContainingText = function (tag, text) {
	   return element(by.xpath('//' + tag + '[contains(text(),"' + text + '")]'));
	};
};

module.exports = new Helper();
