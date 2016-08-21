/**
 * @ngdoc object
 * @name ViewTestsPage.AbstractItemViewPage
 *
 * @description This is a parent class of all item view pages (like BOM view, managed item view, change log etc).
 *
 * ##Dependencies
 *
 */
var helper = require('../util/Helper');
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var ItemHeader = require('../components/ItemHeader');

function AbstractItemViewPage() {

	AbstractItemViewPage.super_.call(this);

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AbstractItemViewPage#switchToTab
	 * @methodOf ViewTestsPage.AbstractItemViewPage
	 * @description a helper method to switch tab / view
	 *
	 * @param {String} tabName : the name of the tab to switch to
	 */
	this.switchToTab = function (tabName) {
		var tabLink = element(by.xpath("//*[@id='item-tabs']/li/a[span/text()='" + tabName + "']"));
		var tabLinkInDropdown = element(by.xpath("//*[@id='item-tabs']/li/ul/li/a[span/text()='" + tabName + "']"));
		var moreLink = element(by.css('.df-dropdown-toggle'));
		var activeTab = element(by.css('.df-tab-menu-active a'));
		tabLink.isDisplayed().then(function (shown) {
			if (shown) {
				tabLink.click();
			} else {
				moreLink.click();
				tabLinkInDropdown.click();
			}
		});
		return browser.wait(function () {
			return activeTab.getText().then(function (text) {
				return (text.toLowerCase().indexOf(tabName.toLowerCase()) !== -1);
			});
		}, 9000, 'wait for tab activate timed out');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AbstractItemViewPage#isTabDisplayed
	 * @methodOf ViewTestsPage.AbstractItemViewPage
	 * @description returns a promise that will be resolved when a tab / view is displayed.
	 *
	 * @param {String} tabName : the name of the tab to check the display state
	 *
	 * @return {Object} a display state promise of the tab / view element.
	 */
	this.isTabDisplayed = function (tabName) {
		return element(by.xpath("//*[@id='item-tabs']/li/a/span[text()='" + tabName + "']")).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AbstractItemViewPage#performWorkflowAction
	 * @methodOf ViewTestsPage.AbstractItemViewPage
	 * @description preform the workflow action use the dropdown on the left
	 *
	 * @param {String} actionName : the name of action to select
	 * @param {String} comments : the comments string
	 *
	 */
	this.performWorkflowAction = function (actionName, comments) {
		var deferred = protractor.promise.defer();

		ItemHeader.clickActionsDropDownButton().then(function () {
			element(by.xpath('//button[@ng-click="itemViewerCtrl.showTransitions(this);"]')).click();
		});
		
		browser.wait(function () {
			return element(by.css('div.workflow-flyout')).isDisplayed();
		}, 3000, 'wait for transition dropdown timed out!');
		
		browser.wait(function () {
			return element(by.css('#workflow-transition-select')).click().then(function () {
				return true;
			});
		}, 3000, 'wait for the click to open dropdown');

		element(by.xpath('//*[@id="workflow-transition-select"]//div[contains(@class,"item")][contains(text(),"'+ actionName +'")]'))
		.click().then(function () {
			if (comments) {
				element(by.model('comments')).sendKeys(comments);
			}
			element(by.css('#submit')).click();
		});
		browser.wait(function () {
			return element(by.xpath('//div[@id="loading-bar"][@style="width: 0%;"]')).isPresent();
		}, 30000, 'wait for transition finish timed out!');

		// close notification message
		element(by.css('a[ng-click="close()"]')).click().then(function () {
			deferred.fulfill(true);
		});

		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AbstractItemViewPage#getAvailableTransactions
	 * @methodOf ViewTestsPage.AbstractItemViewPage
	 * @description return the
	 *
	 * @return {Object} a promise of the list of all workflow transaction options.
	 */
	this.getAvailableTransactions = function () {
		ItemHeader.clickActionsDropDownButton();
		element(by.xpath('//a[@ng-click="itemViewerCtrl.showTransitions(this);"]')).click();

		browser.wait(function () {
			return element(by.css('div.workflow-flyout')).isDisplayed();
		}, 3000, 'wait for transition dropdown timed out!');
		return element.all(by.css('#workflow-transition-select .item'));
	};
}

util.inherits(AbstractItemViewPage, GenericPage);
module.exports = AbstractItemViewPage;
