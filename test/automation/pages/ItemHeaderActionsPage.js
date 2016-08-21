/**
 * @ngdoc object
 * @name ViewTestsPage.ItemHeaderActionsPage
 *
 * @description This page corresponds to the workspace item details view page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');

function ItemHeaderActionsPage() {

	ItemHeaderActionsPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeaderActionsPage#route
	 * @propertyOf ViewTestsPage.ItemHeaderActionsPage
	 * @description The URL of an item to go to
	 */
	this.route;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeaderActionsPage#unlockedRoute
	 * @propertyOf ViewTestsPage.ItemHeaderActionsPage
	 * @description The URL for an unlocked item from Change Orders workspace
	 */
	this.unlockedRoute = '/' + browser.params.baseName + '/workspaces/9/items/itemDetails?view=split&tab=details&mode=view&itemId=9@3295';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeaderActionsPage#lockedRoute
	 * @propertyOf ViewTestsPage.ItemHeaderActionsPage
	 * @description The URL for an locked item from Change Orders workspace
	 */
	this.lockedRoute = '/' + browser.params.baseName + '/workspaces/26/items/itemDetails?view=split&tab=details&mode=view&itemId=26@2860';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeaderActionsPage#urlRegex
	 * @propertyOf ViewTestsPage.ItemHeaderActionsPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/\@\/?\\d+\/details');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeaderActionsPage#urlContains
	 * @propertyOf ViewTestsPage.ItemHeaderActionsPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'details';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeaderActionsPage#setRouteToLockedItem
	 * @methodOf ViewTestsPage.ItemHeaderActionsPage
	 * @description Sets the route to go to.
	 *
	 * @param {Boolean} isLockedItem True, if route is to be set to a locked item
	 */
	this.setRouteToLockedItem = function (isLockedItem) {
		this.route = isLockedItem ? this.lockedRoute : this.unlockedRoute;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeaderActionsPage#getMenuButton
	 * @methodOf ViewTestsPage.ItemHeaderActionsPage
	 * @description Gets one of the action buttons in itemViewer.
	 *
	 * @param {String} label The aria-label of the button
	 *
	 * @returns {Object} A Promise that resolves when the button element is found.
	 */
	this.getMenuButton = function (label) {
		return element(by.css('.menu-buttons button[aria-label="' + label + '"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeaderActionsPage#waitForEvents
	 * @methodOf ViewTestsPage.ItemHeaderActionsPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false'
	 * depending on the state of the event listeners.
	 */
	this.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var currentUserDeferred = $q.defer();
			var currentUserListener = eventService.listen('currentUser:currentUser:done', function () {
				eventService.unlisten(currentUserListener);
				currentUserDeferred.resolve();
			});
			promises.push(currentUserDeferred.promise);

			var itemDetailsDeferred = $q.defer();
			promises.push(itemDetailsDeferred.promise);
			var itemDetailsListener = eventService.listen('itemInstance:*:done', function () {
				eventService.unlisten(itemDetailsListener);
				itemDetailsDeferred.resolve();
			});

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ItemHeaderActionsPage, AbstractItemViewPage);

module.exports = new ItemHeaderActionsPage();
