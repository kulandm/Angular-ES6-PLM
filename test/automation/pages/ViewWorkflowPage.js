/**
 * @ngdoc object
 * @name ViewTestsPage.ViewWorkflowPage
 *
 * @description This page corresponds to the workspace workflow page.
 *
 * ##Dependencies
 *
 */
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var ItemHeader = require('../components/ItemHeader');

function ViewWorkflowPage() {

	ViewWorkflowPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkflowPage#route
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/8/items/workflow?tab=workflow&view=split&mode=view&itemId=8@2725';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkflowPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/item\/?\\d+@\\d+\/workflow');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkflowPage#urlContains
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'workflow';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkflowPage#workflowHeaderRow
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description Header row of the workflow items.
	 */
	this.workflowHeaderRow = element.all(by.css('#itemnav .ui-grid-render-container-body .ui-grid-header-cell'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkflowPage#workflowRows
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description Rows of the workflow items (does not include the header row).
	 */
	this.workflowRows = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkflowPage#workflowColumnResizer
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description Column resizer for the first resizable column.
	 */
	this.workflowColumnResizer = element.all(by.css('#itemnav .ui-grid-render-container-body .ui-grid-column-resizer')).first();

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#isWorkflowTableDisplayed
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description Checks whether the workflow items table is displayed.
	 *
	 * @returns {Object} A Promise for whether the workflow items table is displayed.
	 */
	this.isWorkflowTableDisplayed = function () {
		return element(by.css('#itemnav .ui-grid')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#isWorkflowColumnReorderable
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description Returns whether the workflow column header is draggable.
	 *
	 * @returns {Object} A Promise for the column reorderable.
	 */
	this.isWorkflowColumnReorderable = function () {
		return this.workflowHeaderRow.first().getAttribute('draggable');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#isWorkflowLinkToItem
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description Returns whether the workflow for the first item is a link.
	 *
	 * @returns {Object} A Promise for the workflow link's presence.
	 */
	this.isWorkflowLinkToItem = function () {
		return this.workflowRows.first().all(by
			.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'))
			.first().element(by.css('a[href]')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#getHeaderColumn
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description A particular column element from the table header.
	 *
	 * @param {Object} index The index of the column.
	 *
	 * @returns {Object} A Promise for the column element.
	 */
	this.getHeaderColumn = function (index) {
		return this.workflowHeaderRow.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#getWorkflowColumnWidth
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description The width of the first column.
	 *
	 * @returns {Object} A Promise for the column width.
	 */
	this.getWorkflowColumnWidth = function () {
		return this.getHeaderColumn(0).getCssValue('width');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#getSortingIndicatorClass
	 * @propertyOf ViewTestsPage.ViewWorkflowPage
	 * @description The list of classes applied to the sorting indicator for the workflow column.
	 *
	 * @returns {Object} A Promise for the class list for the workflow sorting indicator element.
	 */
	this.getSortingIndicatorClass = function () {
		return this.workflowHeaderRow.first().element(by.css('#itemnav .ui-grid-icon-up-dir')).getAttribute('class');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkflowPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewWorkflowPage
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

			var workflowLoadDeferObj = $q.defer();
			promises.push(workflowLoadDeferObj.promise);
			var workflowLoadListenerId = eventService.listen('workflow:*:done', function () {
				eventService.unlisten(workflowLoadListenerId);
				workflowLoadDeferObj.resolve();
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

util.inherits(ViewWorkflowPage, AbstractItemViewPage);

module.exports = new ViewWorkflowPage();
