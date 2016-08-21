/**
 * @ngdoc object
 * @name ViewTestsPage.ViewDetailsWithImageViewPage
 *
 * @description This page corresponds to the workspace item details view page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');

function ViewDetailsWithImageViewPage() {

	ViewDetailsWithImageViewPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewDetailsWithImageViewPage#route
	 * @propertyOf ViewTestsPage.ViewDetailsWithImageViewPage
	 * @description The URL for a basic item page (from Items and BOMs workspace)
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/47/items/itemDetails?tab=details&view=split&mode=view&itemId=47@2694';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewDetailsWithImageViewPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewDetailsWithImageViewPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/\@\/?\\d+\/itemDetails');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewDetailsWithImageViewPage#urlContains
	 * @propertyOf ViewTestsPage.ViewDetailsWithImageViewPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'itemDetails';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsWithImageViewPage#getImageSource
	 * @propertyOf ViewTestsPage.ViewDetailsWithImageViewPage
	 * @description Returns a string representing the source of the file
	 *
	 * @returns {String} The string for the image src
	 */
	this.getImageSource = function () {
		return element(by.css('#itemnav .image-field-wrapper img')).getAttribute('src');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsWithImageViewPage#isImageDisplayed
	 * @propertyOf ViewTestsPage.ViewDetailsWithImageViewPage
	 * @description Returns a true/false depending on the image tag being displayed
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isImageDisplayed = function () {
		return element(by.css('#itemnav .image-field-wrapper img')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsWithImageViewPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewDetailsWithImageViewPage
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

util.inherits(ViewDetailsWithImageViewPage, AbstractItemViewPage);
module.exports = new ViewDetailsWithImageViewPage();
