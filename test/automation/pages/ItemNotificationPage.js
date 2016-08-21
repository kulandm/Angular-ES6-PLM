/**
 * @ngdoc object
 * @name ViewTestsPage.ItemNotificationPage
 *
 * @description This page corresponds to the workspace item details view page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');

function ItemNotificationPage() {

	ItemNotificationPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemNotificationPage#route
	 * @propertyOf ViewTestsPage.ItemNotificationPage
	 * @description The URL for a basic item page (from Items and BOMs workspace)
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/45/items/itemDetails?view=split&tab=details&mode=view&itemId=45@2867';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemNotificationPage#urlRegex
	 * @propertyOf ViewTestsPage.ItemNotificationPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/\@\/?\\d+\/details');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemNotificationPage#urlContains
	 * @propertyOf ViewTestsPage.ItemNotificationPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'details';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemNotificationPage#getMenuButton
	 * @methodOf ViewTestsPage.ItemNotificationPage
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
	 * @name ViewTestsPage.ItemNotificationPage#waitForEvents
	 * @methodOf ViewTestsPage.ItemNotificationPage
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

util.inherits(ItemNotificationPage, AbstractItemViewPage);

module.exports = new ItemNotificationPage();
