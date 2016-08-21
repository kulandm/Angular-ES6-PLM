/**
 * @ngdoc object
 * @name ViewTestsPage.ViewWipAttachmentsEditPage
 *
 * @description This page corresponds to the wip attachment edit / tab of the
 * workspace item.
 *
 * ##Dependencies
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');

function ViewWipAttachmentsEditPage() {

	ViewWipAttachmentsEditPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWipAttachmentsEditPage#route
	 * @propertyOf ViewTestsPage.ViewWipAttachmentsEditPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/22/items/attachments?tab=attachments&view=split&mode=edit&itemId=22@2896';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWipAttachmentsEditPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewWipAttachmentsEditPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('\/item\/\d+@\d+\/attachments');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWipAttachmentsEditPage#urlContains
	 * @propertyOf ViewTestsPage.ViewWipAttachmentsEditPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'attachments';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsEditPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewWipAttachmentsEditPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events (necessary for main dashboard page) are complete.
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

			var itemsDeferred = $q.defer();
			promises.push(itemsDeferred.promise);
			var itemsListener = eventService.listen('itemInstance:*:done', function () {
				eventService.unlisten(itemsListener);
				itemsDeferred.resolve();
			});

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ViewWipAttachmentsEditPage, GenericPage);

module.exports = new ViewWipAttachmentsEditPage();
