/**
 * @ngdoc object
 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage
 *
 * @description This page corresponds to the affected items edit page.
 * We need a separate page object as we are navigating to a different workspace
 * with the configured custom columns.
 *
 * ##Dependencies
 */
var q = require('q');
var util = require('util');
var EditAffectedItemsPage = require('./EditAffectedItemsPage');

function EditAffectedItemsCustomColumnsPage() {

	EditAffectedItemsCustomColumnsPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#route
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description The URL for this page
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/53/items/affectedItems?tab=affected-items&view=split&mode=edit&itemId=53@3293';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#urlRegex
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description The regular expression for this page's URL
	 */
	this.urlRegex = new RegExp('\/item\/\d+@\d+\/affectedItems');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#urlContains
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description The piece of substring that this page's URL should contain
	 */
	this.urlContains = 'affectedItems';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#headerCells
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Each cell in the header row
	 */
	this.headerCells = this.affectedItemsTable.all(by
		.repeater('col in colContainer.renderedColumns track by col.uid'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#getHeaderCell
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Gets specified cell in the header row
	 *
	 * @param {Number} col Index of the column
	 *
	 * @returns {Object} A Promise for a cell in the header row
	 */
	this.getHeaderCell = function (col) {
		return this.headerCells.get(col);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#itemRows
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Rows of the affected items (does not include the header row)
	 */
	this.itemRows = this.affectedItemsTable.all(by
		.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#getRow
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Gets specified row
	 *
	 * @param {Number} row Index of the row
	 *
	 * @returns {Object} A Promise for a row in the affected items table
	 */
	this.getRow = function (row) {
		return this.itemRows.get(row);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#getCell
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Gets specified cell in the given row
	 *
	 * @param {Number} row Index of the row
	 * @param {Number} col Index of the column
	 *
	 * @returns {Object} A Promise for a cell in the affected items table
	 */
	this.getCell = function (row, col) {
		return this.getRow(row).all(by
			.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'))
			.get(col);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#isAffectedItemsTableDisplayed
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Checks whether the affected items table is displayed
	 *
	 * @returns {Object} A Promise for whether the affected items table is displayed
	 */
	this.isAffectedItemsTableDisplayed = function () {
		return this.affectedItemsTable.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItemsCustomColumnsPage#isRadioFieldMenuDisplayed
	 * @propertyOf ViewTestsPage.EditAffectedItemsCustomColumnsPage
	 * @description Checks whether the radio field menu is displayed
	 *
	 * @param {Object} radioField The radio field cell
	 *
	 * @returns {Object} A Promise for whether the affected items radio field
	 * menu is displayed
	 */
	this.isRadioFieldMenuDisplayed = function (radioField) {
		return radioField.element(by.id('grid-radio-field')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.EditAffectedItemsCustomColumnsPage#getRadioButtons
	 * @propertyOf ViewTestsComponents.EditAffectedItemsCustomColumnsPage
	 * @description Gets the radio buttons in the radio field menu
	 *
	 * @param {Object} radioField The radio field cell
	 *
	 * @returns {Object} The options in the radio field
	 */
	this.getRadioButtons = function (radioField) {
		return radioField.all(by.css('md-radio-button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.EditAffectedItemsCustomColumnsPage#getRowStateIndicatorClasses
	 * @propertyOf ViewTestsComponents.EditAffectedItemsCustomColumnsPage
	 * @description Gets the row state indicator element for a given row
	 *
	 * @param {Number} row Index of the row
	 *
	 * @returns {Object} Classes of row state indicator element for a given row
	 */
	this.getRowStateIndicatorClasses = function (row) {
		return this.getCell(row, 0).element(by
			.css('row-state-indicator .indicator'))
			.getAttribute('class');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.EditAffectedItemsCustomColumnsPage#getCellStateIndicatorClasses
	 * @propertyOf ViewTestsComponents.EditAffectedItemsCustomColumnsPage
	 * @description Gets the cell state indicator element for a given row and column
	 *
	 * @param {Number} row Index of the row
	 * @param {Number} col Index of the column
	 *
	 * @returns {Object} Classes of cell state indicator element for a given row and column
	 */
	this.getCellStateIndicatorClasses = function (row, col) {
		return this.getCell(row, col).element(by
			.css('cell-state-indicator .cell-indicator'))
			.getAttribute('class');
	};
}

util.inherits(EditAffectedItemsCustomColumnsPage, EditAffectedItemsPage);

module.exports = new EditAffectedItemsCustomColumnsPage();
