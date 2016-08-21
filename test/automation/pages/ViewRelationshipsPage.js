/**
 * @ngdoc object
 * @name ViewTestsPage.ViewRelationshipsPage
 *
 * @description Page object for relationships
 *
 * ##Dependencies
 *
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var CommandBar = require('../components/CommandBar');

function ViewRelationshipsPage() {

	ViewRelationshipsPage.super_.call(this);

	this.workspace = 47;
	this.itemId = 2694;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewRelationshipsPage#route
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description URL for this page
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/47/items/relationships?tab=relationships&view=split&mode=view&itemId=47@2694';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewRelationshipsPage#urlContains
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description The piece of substring that this page's URL should contain
	 */
	this.urlContains = 'relationships';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewRelationshipsPage#tableData
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description This is the list of sections divs.
	 */
	this.tableData = element(by.css('#itemnav .ui-grid'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewRelationshipsPage#tableHeaderFields
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description This is the list of sections divs.
	 */
	this.tableHeaderFields = $$('#itemnav .ui-grid-header-cell-row .ui-grid-cell-contents');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#isTableDataDisplayed
	 * @methodOf ViewTestsPage.ViewRelationshipsPage
	 * @description Gets whether the section body of the given section is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and
	 * its display value is retrieved.
	 */
	this.isTableDataDisplayed = function () {
		return this.tableData.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewRelationshipsPage
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

			var permissionsDeferred = $q.defer();
			var permissionsListener = eventService.listen('userPermissions:*:done', function () {
				eventService.unlisten(permissionsListener);
				permissionsDeferred.resolve();
			});
			promises.push(permissionsDeferred.promise);

			var itemsDeferred = $q.defer();
			promises.push(itemsDeferred.promise);
			var itemsListener = eventService.listen('relatedItems:*:done', function () {
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

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#sortRelatedItems
	 * @methodOf ViewTestsPage.ViewRelationshipsPage
	 * @description Clicks the header of the table to sort.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.sortRelatedItems = function () {
		return element.all(by.css('#itemnav .ui-grid-header-cell-row sortable')).first().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#getRelatedItemsCount
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description Gets the number of displayed related items.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its count is retrieved.
	 */
	this.getRelatedItemsCount = function () {
		return element.all(by.repeater('(rowRenderer, row) in rowContainer')).count();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewRelationshipsPage#relatedItemsFirstItem
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description This is the first td of the first row.
	 */
	this.relatedItemsFirstItem = element.all(by.css('#itemnav .ui-grid-viewport .ui-grid-row .ui-grid-cell a')).first();

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#getFirstRelatedItemText
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description Gets the content of the first td of the first row.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its text is retrieved.
	 */
	this.getFirstRelatedItemText = function () {
		return this.relatedItemsFirstItem.getText();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewRelationshipsPage#removeLink
	 * @propertyOf ViewTestsPage.ViewRelationshipsPage
	 * @description This is the create item button.
	 */
	this.removeLink = by.css('#itemnav #transcluded-buttons dropdown-widget ul li a');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#clickRemoveLink
	 * @methodOf ViewTestsPage.ViewRelationshipsPage
	 * @description Clicks the button to trigger the create item flyout.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.clickRemoveLink = function () {
		return element.all(this.removeLink).get(1).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewRelationshipsPage#isRemoveConfirmationDialogDisplayed
	 * @methodOf ViewTestsPage.ViewRelationshipsPage
	 * @description Gets whether the remove confirmation dialog is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isRemoveConfirmationDialogDisplayed = function () {
		return element(by.css('.remove-confirmation-dialog')).isDisplayed();
	};
}

util.inherits(ViewRelationshipsPage, GenericPage);

module.exports = new ViewRelationshipsPage();
