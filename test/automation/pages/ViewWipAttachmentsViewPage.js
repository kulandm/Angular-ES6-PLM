/**
 * @ngdoc object
 * @name ViewTestsPage.ViewWipAttachmentsViewPage
 *
 * @description This page corresponds to the wip attachment view / tab of the
 * workspace item.
 *
 * ##Dependencies
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');

function ViewWipAttachmentsViewPage() {

	ViewWipAttachmentsViewPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#route
	 * @propertyOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/22/items/attachments?tab=attachments&view=split&mode=view&itemId=22@2896';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('\/item\/\d+@\d+\/attachments');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#urlContains
	 * @propertyOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'attachments';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getColumnHeaders
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the column headers.
	 *
	 * @returns {Object} An element that represents the attachments header cells.
	 */
	this.getColumnHeaders = function () {
		return element.all(by
			.css('#itemnav .ui-grid-render-container-body .ui-grid-header-viewport .ui-grid-header-cell'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getEditBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Edit Button.
	 *
	 * @returns {Object} The Edit Button
	 */
	this.getEditBtn = function () {
		return element(by.css('.md-button[aria-label="Edit"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getAddBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Add Button.
	 *
	 * @returns {Object} The Add Button
	 */
	this.getAddBtn = function () {
		return element(by.css('#transcluded-buttons .md-button[aria-label="Add"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getSaveBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Save Button.
	 *
	 * @returns {Object} The Save Button
	 */
	this.getSaveBtn = function () {
		return element(by.css('.md-button[aria-label="Save"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getCancelBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Cancel Button.
	 *
	 * @returns {Object} The Cancel Button
	 */
	this.getCancelBtn = function () {
		return element(by.css('.md-button[aria-label="Cancel"]'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getRemoveBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Remove Button.
	 *
	 * @returns {Object} The Remove Button
	 */
	this.getRemoveBtn = function () {
		return element(by.css('.md-button[aria-label="Remove"]'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getDeleteButton
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Delete Button.
	 *
	 * @returns {Object} The Remove Button
	 */
	this.getDeleteButton = function () {
		return element(by.css('.delete-button'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getActionsBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the Actions Button.
	 *
	 * @returns {Object} The Actions Button
	 */
	this.getActionsBtn = function () {
		return element(by.css('#actions-button'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getAttachmentsTable
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns table element
	 *
	 * @returns {Object} table element.
	 */
	this.getAttachmentsTable = function () {
		return this.getTable(element(by.css('#itemnav')));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTable
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns table element
	 *
	 * @params {Object} parentEl : the element whose dom tree will be traversed to find the table element.
	 *
	 * @returns {Object} table element.
	 */
	this.getTable = function (parentEl) {
		return parentEl.element(by.css('.ui-grid-render-container-body'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getHeaderCells
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns table header cell list
	 *
	 * @params {Object} tableEl : table element to be used to get header cells.
	 *
	 * @returns {Object[]} header cells
	 */
	this.getHeaderCells = function (tableEl) {
		return tableEl.element(by.css('.ui-grid-header-cell-row'))
			.all(by.repeater('col in colContainer.renderedColumns track by col.uid'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableRows
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns table rows
	 *
	 * @params {Object} tableEl : table element to be used to get rows.
	 *
	 * @returns {Object[]} rows
	 */
	this.getTableRows = function (tableEl) {
		return tableEl.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableCells
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns row's cells
	 *
	 * @params {Object} rowEl : row element to be used to get cells.
	 *
	 * @returns {Object[]} cells
	 */
	this.getTableCells = function (rowEl) {
		return rowEl.all(by.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableCheckbox
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns row's checkbox
	 *
	 * @params {Object} rowEl : row element to be used to get cells.
	 *
	 * @returns {Object} checkbox
	 */
	this.getTableCheckbox = function (rowEl) {
		return this.getTableCells(rowEl).get(1).element(by.css('input[type="checkbox"]'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getInlineMenuBtn
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns row's inline menu button
	 *
	 * @params {Object} row Row element to be used to get inline menu button
	 *
	 * @returns {Object} Inline menu button
	 */
	this.getInlineMenuBtn = function (row) {
		return row.element(by.css('.inline-actions'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getDropdown
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the dropdown menu
	 *
	 * @params {Object} parent Parent element to be used to get dropdown menu
	 *
	 * @returns {Object} Inline menu
	 */
	this.getDropdown = function (parent) {
		return parent.element(by.css('.dropdown-widget-wrapper'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getDropdownOption
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the corresponding button in dropdown menu
	 *
	 * @params {Object} parent Parent element to be used to get dropdown menu
	 * @params {Number} index the index number of the opration button in the dropdown menu
	 *
	 * @returns {Object} button in the dropdown menu
	 */
	this.getDropdownOption = function (parent, index) {
		return this.getDropdown(parent).all(by.css('li')).get(index);
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getPinningPolicy
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the pinning policy cell
	 *
	 * @params {Object} row Row element to be used to get pinning policy
	 *
	 * @returns {Object} Pinning policy element
	 */
	this.getPinningPolicy = function (row) {
		return this.getTableCells(row).get(3).element(by.css('.ui-grid-cell-contents > div'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getPinningPolicyDropdownIcon
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the pinning policy cell's dropdown icon
	 *
	 * @params {Object} row Row element to be used to get pinning policy
	 *
	 * @returns {Object} Pinning policy dropdown icon element
	 */
	this.getPinningPolicyDropdownIcon = function (row) {
		return this.getTableCells(row).get(3).element(by.css('.ui-grid-cell-contents')).element(by.css('.dropdown.icon'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableCellDropdown
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the selection menu in the table cell
	 *
	 * @params {Object} row Row element to be used to get the table cell
	 * @params {Number} index the index of that cell in the row (start from 1)
	 *
	 * @returns {Object} Dropdown menu in table cell
	 */
	this.getTableCellDropdown = function (row, index) {
		return this.getTableCells(row).get(index).element(by.css('.menu'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableCellDropdownOptions
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns all the options in the table cell
	 *
	 * @params {Object} row Row element to be used to get the table cell
	 * @params {Number} index The index of that cell in the row (start from 1)
	 *
	 * @returns {Object} All options in the dropdown menu
	 */
	this.getTableCellDropdownOptions = function (row, index) {
		return this.getTableCellDropdown(row, index).all(
			by.repeater('field in fieldData.options.items'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableCellDropdownOption
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the option in selection menu
	 *
	 * @params {Object} row Row element to be used to get the cell
	 * @params {Number} index The index of that cell in the row (start from 1)
	 * @params {Number} option The option number of the option in the dropdown menu
	 *
	 * @returns {Object} An option inside dropdown menu
	 */
	this.getTableCellDropdownOption = function (row, index, option) {
		return this.getTableCellDropdownOptions(row, index).get(option);
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getTableCellDirty
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns dirty state of cell
	 *
	 * @params {Object} row Row element to be used to get the table cell
	 * @params {Number} index the index of that cell in the row (start from 1)
	 *
	 * @returns {String} the table cell is dirty or not, 'true' or 'false'
	 */
	this.getTableCellDirty = function (row, index) {
		return this.getTableCells(row).get(index)
			.element(by.css('.ui-grid-cell-contents cell-state-indicator'))
			.getAttribute('is-dirty');
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getPinningPolicyTooltip
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns the pinning policy tooltip
	 *
	 * @params {Number} index The index of which tooltip to get
	 *
	 * @returns {Object} Pinning policy tooltip element
	 */
	this.getPinningPolicyTooltip = function (index) {
		return element.all(by.css('.tooltip-content')).get(index);
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getPinningPolicyTooltipRow
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Returns rows in pinning policy tooltip
	 *
	 * @params {Number} index The index of which tooltip to get
	 *
	 * @returns {Object} Pinning policy tooltip rows element
	 */
	this.getPinningPolicyTooltipRow = function (index) {
		return this.getPinningPolicyTooltip(index)
			.all(by.xpath('./div')).get(1)
			.all(by.css('div'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getAttachmentCount
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description Find the number of attachments that are in the attachment file
	 *
	 * @returns {Object} A promise returns the number of attachments in the attachment tab when resolve
	 */
	this.getAttachmentCount = function () {
		return this.getAttachmentsTable().all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index')).count();
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getZeroDocGraphic
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description get the zero-doc graphic element
	 *
	 * @returns {Object} A promise returns zero-doc graphic when resolve
	 */
	this.getZeroDocGraphic = function () {
		return element(by.css('.zero-doc-container'));
	};

	/**
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#getAddBtnInZeroDocGraphic
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
	 * @description get the add button in the zero-doc container
	 *
	 * @returns {Object} A promise returns add button inside zero-doc container when resolve
	 */
	this.getAddBtnInZeroDocGraphic = function () {
		return element(by.css('.zero-doc-container .add-button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWipAttachmentsViewPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewWipAttachmentsViewPage
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

util.inherits(ViewWipAttachmentsViewPage, GenericPage);

module.exports = new ViewWipAttachmentsViewPage();
