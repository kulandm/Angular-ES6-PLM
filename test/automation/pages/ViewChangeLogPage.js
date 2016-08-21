/**
 * @ngdoc object
 * @name ViewTestsPage.ViewChangeLogPage
 *
 * @description This is a parent class of all pages
 *
 * ##Dependencies
 *
 */
var helper = require('../util/Helper');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');
var util = require('util');
var CreateItem = require('../components/CreateItem');
var ItemHeader = require('../components/ItemHeader');

function ViewChangeLogPage() {

	ViewChangeLogPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewChangeLogPage#route
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description URL for this page
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/9/items/changeLog?tab=change-log&view=split&mode=view&itemId=9@2902';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewChangeLogPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description The regular expression for this page's URL
	 */
	this.urlRegex = new RegExp('/item\/?\\d+@\\d+\/changeLog');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewChangeLogPage#urlContains
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description The piece of substring that this page's URL should contain
	 */
	this.urlContains = 'changeLog';

	/* this.setWorkspace = function (workspace) {
		this.workspace = workspace;
	};

	this.setItemId = function (itemId) {
		this.itemId = itemId;
	}; */

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#getTotalLogItems
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description Gets the total number of workspace items
	 *
	 * @returns {Object} Promise that resolves when element is found and its text is retrieved
	 */
	this.getTotalLogItems = function () {
		return element.all(by.repeater('row in tableData')).count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#sortChangeLogItems
	 * @methodOf ViewTestsPage.ViewChangeLogPage
	 * @description Clicks the header of the table to sort.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.sortChangeLogItems = function () {
		return element.all(by.css('#itemnav table thead tr > th a')).first().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#getChangeLogItemsCount
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description Gets the number of displayed workspace items.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its count is retrieved.
	 */
	this.getChangeLogItemsCount = function () {
		return element.all(by.repeater('(ind, row) in tableData')).count();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewChangeLogPage#changeLogItemsFirstChild
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description This is the first td of the first row.
	 */
	this.changeLogItemsFirstItem = element.all(by.css('#itemnav table tbody > tr > td')).first();

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#getFirstChangeLogItemText
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description Gets the content of the first td of the first row.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its text is retrieved.
	 */
	this.getFirstChangeLogItemText = function () {
		return this.changeLogItemsFirstItem.getText();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewChangeLogPage#changedByLink
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description This is the create item button.
	 */
	this.changedByLink = by.css('#itemnav tbody tr td a');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#isChangedByLink
	 * @methodOf ViewTestsPage.ViewChangeLogPage
	 * @description Gets whether the create item button is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isChangedByLink = function () {
		var deferred = protractor.promise.defer();
		var that = this;
		var timer = (new Date()).getTime();
		var displayLoop = function () {
			if ((new Date()).getTime() - timer > 60000) {
				expect(false).to.equal(true);
				return;
			}
			element.all(that.changedByLink).then(function (elements) {
				if (elements.length) {
					elements[1].isDisplayed().then(function (classes) {
						deferred.fulfill();
					}, function () {
						displayLoop();
					});
				} else {
					displayLoop();
				}
			}, function () {
				displayLoop();
			});
		};
		displayLoop();
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#clickChangedByLink
	 * @methodOf ViewTestsPage.ViewChangeLogPage
	 * @description Clicks the button to trigger the create item flyout.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.clickChangedByLink = function () {
		return element.all(this.changedByLink).get(1).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#isChangedByFlyoutDisplayed
	 * @methodOf ViewTestsPage.ViewChangeLogPage
	 * @description Gets whether the create item flyout is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isChangedByFlyoutDisplayed = function () {
		return element(by.css('.user-profile-flyout')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#getTotalWorkspaceItems
	 * @propertyOf ViewTestsPage.ViewChangeLogPage
	 * @description Gets the total number of workspace items.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its text is retrieved.
	 */
	this.getTotalWorkspaceItems = function () {
		return element(by.binding('totalItemCount')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewChangeLogPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewChangeLogPage
	 * @description Returns a promise that will be resolved to 'true' if all events (necessary for workflow page) are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false' depending on the state of the event listeners.
	 */
	this.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var changeLogLoadDeferObj = $q.defer();
			promises.push(changeLogLoadDeferObj.promise);
			var changeLogLoadListenerId = eventService.listen('changeLog:*:done', function () {
				eventService.unlisten(changeLogLoadListenerId);
				changeLogLoadDeferObj.resolve();
			});

			// TODO: should have a listener for load:error to cover the scenario when there is some issue loading the data.

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ViewChangeLogPage, AbstractItemViewPage);

module.exports = new ViewChangeLogPage();
