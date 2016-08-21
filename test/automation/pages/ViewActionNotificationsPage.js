/**
 * @ngdoc object
 * @name ViewTestsPage.ViewActionNotificationsPage
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

function ViewActionNotificationsPage() {

	ViewActionNotificationsPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewActionNotificationsPage#route
	 * @propertyOf ViewTestsPage.ViewActionNotificationsPage
	 * @description URL for this page
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/45/items/action-notifiactions?tab=action-notifications-view&view=split&mode=view&itemId=45@2870';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewActionNotificationsPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewActionNotificationsPage
	 * @description The regular expression for this page's URL
	 */
	this.urlRegex = new RegExp('/item\/?\\d+@\\d+\/actionNotifications');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewActionNotificationsPage#urlContains
	 * @propertyOf ViewTestsPage.ViewActionNotificationsPage
	 * @description The piece of substring that this page's URL should contain
	 */
	this.urlContains = 'actionNotifications';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewActionNotificationsPage#getActionNotificationsCount
	 * @propertyOf ViewTestsPage.ViewActionNotificationsPage
	 * @description Gets the number of displayed action notifications.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its count is retrieved.
	 */
	this.getActionNotificationsCount = function () {
		return element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows')).count();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewActionNotificationsPage#addNotificationLink
	 * @propertyOf ViewTestsPage.ViewActionNotificationsPage
	 * @description This is the add action notification button.
	 */
	this.addNotificationLink = by.css('#transcluded-buttons a');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewActionNotificationsPage#isAddNotificationLink
	 * @methodOf ViewTestsPage.ViewActionNotificationsPage
	 * @description Gets whether the add notification button is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isAddNotificationLink = function () {
		var deferred = protractor.promise.defer();
		var that = this;
		var timer = (new Date()).getTime();
		var displayLoop = function () {
			if ((new Date()).getTime() - timer > 60000) {
				expect(false).to.equal(true);
				return;
			}
			element.all(that.addNotificationLink).then(function (elements) {
				if (elements.length) {
					elements[1].isDisplayed().then(function (isDisplayed) {
						deferred.fulfill(isDisplayed);
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
	 * @name ViewTestsPage.ViewActionNotificationsPage#clickAddNotificationLink
	 * @methodOf ViewTestsPage.ViewActionNotificationsPage
	 * @description Clicks the button to trigger the add notification dialog.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.clickAddNotificationLink = function () {
		return element.all(this.addNotificationLink).get(1).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewActionNotificationsPage#isAddNotificationDialogDisplayed
	 * @methodOf ViewTestsPage.ViewActionNotificationsPage
	 * @description Gets whether the add notification dialog is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isAddNotificationDialogDisplayed = function () {
		return element(by.css('md-dialog')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewActionNotificationsPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewActionNotificationsPage
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

			var actionNotificationLoadDeferObj = $q.defer();
			promises.push(actionNotificationLoadDeferObj.promise);
			var actionNotificationLoadListenerId = eventService.listen('actionNotification:*:done', function () {
				eventService.unlisten(actionNotificationLoadListenerId);
				actionNotificationLoadDeferObj.resolve();
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

util.inherits(ViewActionNotificationsPage, AbstractItemViewPage);

module.exports = new ViewActionNotificationsPage();
