/**
 * @ngdoc object
 * @name ViewTestsPage.ViewMilestonesPage
 *
 * @description Page object for milestones
 *
 * ##Dependencies
 *
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var CommandBar = require('../components/CommandBar');

function ViewMilestonesPage() {

	ViewMilestonesPage.super_.call(this);

	this.workspace = 47;
	this.itemId = 2948;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewMilestonesPage#route
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description URL for this page
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/47/items/milestones?tab=milestones&view=split&mode=view&itemId=47@2948';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewMilestonesPage#urlContains
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description The piece of substring that this page's URL should contain
	 */
	this.urlContains = 'milestones';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewMilestonesPage#tableData
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description This is the list of sections divs.
	 */
	this.tableData = element(by.css('#itemnav .ui-grid'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewMilestonesPage#tableHeaderFields
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description This is the list of sections divs.
	 */
	this.tableHeaderFields = $$('#itemnav .ui-grid-header-cell-row .ui-grid-cell-contents');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#isTableDataDisplayed
	 * @methodOf ViewTestsPage.ViewMilestonesPage
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
	 * @name ViewTestsPage.ViewMilestonesPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewMilestonesPage
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

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#sortRelatedItems
	 * @methodOf ViewTestsPage.ViewMilestonesPage
	 * @description Clicks the header of the table to sort.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.sortRelatedItems = function () {
		return element.all(by.css('#itemnav .ui-grid-header-cell-row sortable')).first().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#getRelatedItemsCount
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description Gets the number of displayed related items.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its count is retrieved.
	 */
	this.getRelatedItemsCount = function () {
		return element.all(by.repeater('(rowRenderer, row) in rowContainer')).count();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewMilestonesPage#relatedItemsFirstItem
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description This is the first td of the first row.
	 */
	this.relatedItemsFirstItem = element.all(by.css('#itemnav .ui-grid-viewport .ui-grid-row .ui-grid-cell a')).first();

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#getFirstRelatedItemText
	 * @propertyOf ViewTestsPage.ViewMilestonesPage
	 * @description Gets the content of the first td of the first row.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its text is retrieved.
	 */
	this.getFirstRelatedItemText = function () {
		return this.relatedItemsFirstItem.getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#countDoneForTransition
	 * @methodOf ViewTestsPage.ViewMilestonesPage
	 * @description Return the number of item checked
	 *
	 * @returns {Object} A Promise with the number of elements with '.md.md-lg.md-done' css class
	 */
	this.countDoneForTransition = function (row) {
		return element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index')).get(row+2).all(by.css('.md.md-lg.md-done')).count();
	};
	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#countTransitionedItems
	 * @methodOf ViewTestsPage.ViewMilestonesPage
	 * @description Return the number of item checked
	 *
	 * @returns {Object} A Promise with the number of elements with '.md.md-lg.md-done' css class in the status column
	 */
	this.countTransitionedItems = function () {
		return this.tableData.all(by.css('.md.md-lg.md-done')).count();
	};
	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewMilestonesPage#countNotTransitionedItems
	 * @methodOf ViewTestsPage.ViewMilestonesPage
	 * @description Return the number of item on schedule
	 *
	 * @returns {Object} A Promise with the number of elements with '.md.md-lg.md-schedule' css class in the status column
	 */
	this.countNotTransitionedItems = function () {
		return this.tableData.all(by.css('.md.md-lg.md-schedule')).count();
	};
}

util.inherits(ViewMilestonesPage, GenericPage);

module.exports = ViewMilestonesPage;
