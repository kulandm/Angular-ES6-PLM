/**
 * @ngdoc object
 * @name ViewTestsPage.EditAffectedItems
 *
 * @description This page corresponds to the affected items edit page.
 *
 * ##Dependencies
 */
var q = require('q');
var util = require('util');
var ItemHeader = require('../components/ItemHeader');
var AffectedItemsViewPage = require('./ViewAffectedItemsPage');

function EditAffectedItems() {

	EditAffectedItems.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItems#route
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description The URL for this page.
	 *
	 * TODO Something is wrong with hitting the URL with '/edit' directly
	 * hence the roundabout way to click the 'Edit' button (but this affects
	 * the initialisation state of CommandBar).
	 * This is a common behaviour across all views as of now.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/9/items/affectedItems?tab=affected-items&view=split&mode=edit&itemId=9@2902';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#changeRoute
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Change the route of current page.
	 * After change we can call go() to navigate to the new item.
	 *
	 * @param {String} newID The string of wsID@dmsID
	 * @param {String} workspaceId The id of the workspace to go to.
	 */
	this.changeRoute = function (workspaceId, newID) {
		this.route = '/' + browser.params.baseName + '/workspaces/' + workspaceId + '/items/affectedItems?tab=affected-items&view=split&mode=edit&itemId=' + workspaceId + '@' + newID;
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItems#urlRegex
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('\/item\/\d+@\d+\/affectedItems');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItems#urlContains
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'affectedItems';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getRowCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first index cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 * @param {Integer} colNum : the column number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getRowCell = function (rowNum, colNum) {
		return this.affectedItemsRows.get(rowNum).all(by.css('#itemnav .ui-grid-cell')).get(colNum);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getIndexCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first index cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getIndexCell = function (rowNum) {
		return this.getRowCell(rowNum, 0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first lifecycle cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getLifecycleCell = function (rowNum) {
		return element.all(by.css('.edit-lifecycle'))
		.get(rowNum);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleEditCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first lifecycle editable cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getLifecycleEditCell = function (rowNum) {
		return element.all(by.css('.edit-lifecycle')).get(rowNum);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycle
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first lifecycle.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its text value is retrieved.
	 */
	this.getLifecycle = function (rowNum) {
		return this.getLifecycleCell(rowNum).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleEditBtn
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the buttons of the first lifecycle cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getLifecycleEditBtn = function (rowNum) {
		return this.getLifecycleCell(rowNum).element(by.css('#itemnav .edit-link-container'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleUndoBtn
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the undo button of the lifecycle cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getLifecycleUndoBtn = function (rowNum) {
		return this.getLifecycleCell(rowNum).element(by.css('#itemnav a span.md-undo'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleDropdown
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the dropdown of the first lifecycle cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getLifecycleDropdown = function (rowNum) {
		this.getLifecycleEditCell(rowNum).click();
		return this.getLifecycleCell(rowNum).element(by.tagName('search'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleDropdownOptions
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the dropdown options of the first lifecycle cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getLifecycleDropdownOptions = function (rowNum) {
		return this.getLifecycleDropdown(rowNum).all(by.tagName('option'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#isLifecycleEditable
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Checks whether the first lifecycle cell is editable.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its present value is retrieved.
	 */
	this.isLifecycleEditable = function (rowNum) {
		return this.getLifecycleEditCell(rowNum).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getEffectivityCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first effectivity cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getEffectivityCell = function (rowNum) {
		return this.getRowCell(rowNum, 5);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getEffectivityEditCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first effectivity editable cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getEffectivityEditCell = function (rowNum) {
		return this.getEffectivityCell(rowNum).element(by.css('#itemnav .field-editable'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getEffectivityEditBtn
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the buttons of the first effectivity cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getEffectivityEditBtn = function (rowNum) {
		return this.getEffectivityCell(rowNum).element(by.css('#itemnav .md-edit.field-action-btn-edit'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getEffectivityDatepicker
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the datepicker of the first effectivity cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getEffectivityDatepicker = function (rowNum) {
		return this.getEffectivityCell(rowNum).element(by.css('#itemnav .datepicker'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getEffectivityCalendar
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the actual calendar in the datepicker of the first effectivity cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getEffectivityCalendar = function (rowNum) {
		return this.getEffectivityDatepicker(rowNum).all(by.css('#itemnav ul.dropdown-menu li')).get(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#isEffectivityEditable
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Checks whether the effectivity cell is editable.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.isEffectivityEditable = function (rowNum) {
		return this.getEffectivityEditCell(rowNum).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#editLifeCycle
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Edit the life cycle
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.editLifeCycle = function (rowNum) {
		return element.all(by.xpath('//div[@ng-if="grid.appScope.affectedItemsCtrl.edit"]')).get(rowNum).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#selectLifeCycle
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Select the life cycle
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 * @param {String} lifeCycle : the life cycle to choose
	 *
	 * @returns {Object} A Promise that resolves when the option selected.
	 */
	this.selectLifeCycle = function (rowNum, lifeCycle) {
		this.txtToMatch = lifeCycle;
		return this.getLifecycleDropdown(rowNum)
			.element(by.cssContainingText('option', lifeCycle)).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#editEffectivity
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Edit the Effectivity
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element clicked.
	 */
	this.editEffectivity = function (rowNum) {
		return this.getEffectivityEditCell(rowNum).click();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditAffectedItems#dataPickerBtn
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description The button to open date picker for current edit row
	 */
	this.dataPickerBtn = element(by.css('#itemnav .choose-date'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#openDatePicker
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description open the date picker to select for Effectivity
	 *
	 * @returns {Object} A Promise that resolves when the element clicked.
	 */
	this.openDatePicker = function () {
		return this.dataPickerBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#selectToday
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description select current day for the effectivity date
	 *
	 */
	this.selectToday = function () {
		this.dataPickerBtn.click().then(function () {
			element(by.css('.text-info')).click(); // current date will be bold displayed, by the class of the span
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getParagraphCell
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the first paragraph cell.
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getParagraphCell = function (rowNum) {
		return element.all(by.css('.custom-column-cell .md-menu'))
		.get(rowNum);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#isRichTextFieldPresent
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the rich text field present value.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its present value is retrieved.
	 */
	this.isRichTextFieldPresent = function () {
		return element(by.css('rich-text-field')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getMenuBackDrop
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description Gets the back drop of md-menu.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getMenuBackDrop = function () {
		return element.all(by.css('.md-menu-backdrop')).get(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#save
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description save the edit.
	 *
	 * @returns {Object} A Promise that resolves when the element clicked.
	 */
	this.save = function () {
		var saveBtn = element(by.xpath('//*[@id="command-bar"]//*[span[text()="Save"]]'));
		return saveBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleDropdown
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description The lifecycle dropdown
	 *
	 * @returns A Promise that resolves when the element is found.
	 */
	this.getLifecycleDropdown = function () {
		return element(by.css('.selection.single.dropdown'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getLifecycleOption
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description The lifecycle dropdownoption
	 *
	 * @param {number} optionToSelect The option to select
	 * @returns A Promise that resolves when the element is found.
	 */
	this.getLifecycleOption = function (optionToSelect) {
		return element.all(by.repeater('field in fieldData.options.items')).get(optionToSelect);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#changeRowLifecycle
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description change the lifecycle of a row item
	 *
	 * @param {Integer} rowNum : the row number, start from 0
	 * @param {Integer} lifecycleOptionIndex : the index number of Lifecycle Options
	 *
	 * @return A Promise that resolves when the lifecycle element is clicked.
	 */
	this.changeRowLifecycle = function (rowNum, lifecycleOptionIndex) {
		this.getLifecycleEditCell(rowNum).click();
		this.getLifecycleDropdown().click();
		browser.waitForAngular(); // Waits for the picklist options to load
		return element.all(by.repeater('field in fieldData.options.items')).get(lifecycleOptionIndex).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#openDatePickerByClickEffectivity
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description click the effectivity cell to open the datepicker
	 * TODO: fix incorrect implementation. Clicks should be backed by wait or EC
	 */
	/* this.openDatePickerByClickEffectivity = function () {
		element(by.css('.datepicker .form-control')).click();
		element(by.css('.md-event-note')).click();
	}; */

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#selectDayBefore
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description select a day before today in Effectivity cell
	 * TODO: fix incorrect implementation. What will happen if current date is first of month
	 */
	/* this.selectDayBefore = function () {
	 	element.all(by.xpath('//td[@aria-disabled="true"]')).get(0).click();
	}; */

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#selectTomorrow
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description select tomorrow in Effectivity cell
	 * TODO fix incorrect implementation. What will happen if current date is last of month
	 */
	/* this.selectTomorrow = function () {
		element(by.css('.datepicker .form-control')).all(by.xpath('//td[@aria-disabled="false"]')).get(1).click();
	}; */

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#isDatePickerPresent
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description return the datePicker is present or not
	 *
	 * @returns {Boolean} the datePicker is present or not
	 */
	this.isDatePickerPresent = function () {
		return element(by.css('.datepicker .form-control')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditAffectedItems#getDatePickerDate
	 * @propertyOf ViewTestsPage.EditAffectedItems
	 * @description get the Date picked in the datePicker
	 *
	 * @returns {String} A text of the date being picked
	 */
	this.getDatePickerDate = function () {
		return element(by.css('.datepicker .form-control')).getAttribute('value');
	};
}

util.inherits(EditAffectedItems, AffectedItemsViewPage);

module.exports = EditAffectedItems;
