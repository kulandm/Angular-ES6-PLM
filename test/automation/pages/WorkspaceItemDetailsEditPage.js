/**
 * @ngdoc object
 * @name ViewTestsPage.WorkspaceItemDetailsEditPage
 *
 * @description This page corresponds to the workspace item details edit page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var ItemHeader = require('../components/ItemHeader');
var CommandBar = require('../components/CommandBar');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');

function WorkspaceItemDetailsEditPage() {

	WorkspaceItemDetailsEditPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#route
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description The URL for a basic workspace page.
	 */
	this.route = '/' + browser.params.baseName +
		'/workspaces/8/items/itemDetails?view=split&tab=details&mode=edit&itemId=urn%60adsk,plm%60tenant,workspace,item%60' +
		browser.params.tenant + ',8,2725';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#editBtn
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description The Edit button.
	 */
	var editBtn = element(by.css('[aria-label="Edit"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#saveBtn
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description The Save button.
	 */
	var saveBtn = element(by.css('[aria-label="Save"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#cancelBtn
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description The Cancel button.
	 */
	var cancelBtn = element(by.css('[aria-label="Cancel"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#requiredField
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description A list of required fields.
	 */
	var requiredFields = element.all(by.css('td.field-label'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#isRequiredFieldIndicated
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description Checks if the a required field has the 'required' CSS class
	 *
	 * @returns {Boolean} True/false if the field has the 'required' CSS class
	 */
	this.getRequiredField = function (elemIndex) {
		return requiredFields.get(elemIndex);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#getEditBtn
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description Gets the edit button of the page.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getEditBtn = function () {
		return editBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#getSaveBtn
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description Gets the save button of the page.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getSaveBtn = function () {
		return saveBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#getCancelBtn
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description Gets the cancel button of the page.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getCancelBtn = function () {
		return cancelBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#changeRoute
	 * @propertyOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description Changes the route of the page to be able to navigate to this new route by running .go().
	 *
	 * @params {Number} wsId, the workspace ID.
	 * @params {Number} itemId, the item ID.
	 */
	this.changeRoute = (wsId, itemId) => {
		this.route = '/' + browser.params.baseName + '/workspaces/' + wsId +
			'/items/itemDetails?view=split&tab=details&mode=edit&itemId=urn%60adsk,plm%60tenant,workspace,item%60' +
			browser.params.tenant + ',' + wsId + ',' + itemId;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemDetailsEditPage#waitForEvents
	 * @methodOf ViewTestsPage.WorkspaceItemDetailsEditPage
	 * @description Returns a promise that will be resolved to 'true' if all events are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false' depending on the state of the event listeners.
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

util.inherits(WorkspaceItemDetailsEditPage, AbstractItemViewPage);

module.exports = new WorkspaceItemDetailsEditPage();
