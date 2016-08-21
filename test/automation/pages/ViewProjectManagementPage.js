/**
 * @ngdoc object
 * @name ViewTestsPage.ViewProjectManagementPage
 *
 * @description This page corresponds to the project management page.
 *
 * ##Dependencies
 *
 */
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');

function ViewProjectManagementPage() {

	ViewProjectManagementPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#route
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/1/items/project-management?tab=project-management&view=split&mode=view&itemId=1@2849';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/project-management');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#urlContains
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'project-management';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#tableData
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description This is the list of sections divs.
	 */
	this.tableData = element(by.css('#itemnav .ui-grid'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#tableHeaderFields
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description This is the list of sections divs.
	 */
	this.tableHeaderFields = $$('#itemnav .ui-grid-render-container-body .ui-grid-header-cell-row .ui-grid-cell-contents');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#ganttHeaderFields
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description This is the gantt chart headers.
	 */
	this.ganttHeaderFields = element(by.css('#itemnav .gantt-scrollable-header'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#ganttChartHeader
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description This is the gantt chart header values.
	 */
	this.ganttChartHeader = $$('#itemnav .gantt-scrollable-header .gantt-column-header');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#tableRows
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description The list of rows in the tableData component.
	 */
	this.tableRows = $$('#itemnav .gantt-side-content .ui-grid-render-container-body .ui-grid-row');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#tableRowExpanders
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description The elements that are used to expand/collapse a row
	 */
	this.tableRowExpanders = $$('#itemnav .project-item-expander a');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewProjectManagementPage#granularityDropdownValue
	 * @propertyOf ViewTestsPage.ViewProjectManagementPage
	 * @description This is the granularity drop-down value
	 */
	this.granularityDropdownValue = $$('#itemnav #transcluded-buttons .gantt-scale');

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewProjectManagementPage#isTableDataDisplayed
	 * @methodOf ViewTestsPage.ViewProjectManagementPage
	 * @description Gets whether the section body of the given section is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isTableDataDisplayed = function () {
		return this.tableData.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewProjectManagementPage#isGanttChartDisplayed
	 * @methodOf ViewTestsPage.ViewProjectManagementPage
	 * @description Gets whether the gantt chart is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isGanttChartDisplayed = function () {
		return this.ganttHeaderFields.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewProjectManagementPage#isGranularityDropdownDisplayed
	 * @methodOf ViewTestsPage.ViewProjectManagementPage
	 * @description Gets whether the granularity drop-down is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isGranularityDropdownDisplayed = function () {
		return element(by.css('#itemnav #transcluded-buttons .gantt-scale')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewProjectManagementPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewProjectManagementPage
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

			var projectItemsDeferred = $q.defer();
			promises.push(projectItemsDeferred.promise);
			var projectItemsListener = eventService.listen('projectItems:*:done', function () {
				eventService.unlisten(projectItemsListener);
				projectItemsDeferred.resolve();
			});

			console.log('I made you some promises', promises);
			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ViewProjectManagementPage, AbstractItemViewPage);

module.exports = new ViewProjectManagementPage();
