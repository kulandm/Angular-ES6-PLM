/**
 * @ngdoc object
 * @name ViewTestsPage.AddItemPage
 *
 * @description This page corresponds to the workspace item details view page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');

function AddItemPage() {

	AddItemPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#route
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a basic item page containing a matrix
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/62/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#routeWithoutRequiredFields
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a basic item page that doesn't contain any required fields (Supplier Types workspace)
	 */
	this.routeWithoutRequiredFields = '/' + browser.params.baseName + '/workspaces/50/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#routeWithPicklists
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a workspace that contains a bunch of picklists (Audits)
	 */
	this.routeWithPicklists = '/' + browser.params.baseName + '/workspaces/22/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#routeWithPicklistsWithSearch
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a workspace that contains a bunch of picklists with search
	 */
	this.routeWithPicklistsWithSearch = '/' + browser.params.baseName + '/workspaces/65/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#routeWithSpecialFields
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a workspace that contains a bunch of picklists (Equipment)
	 */
	this.routeWithSpecialFields = '/' + browser.params.baseName + '/workspaces/45/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#routeWithUOMPicklist
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a workspace that contains Picklist as UOM
	 */
	this.routeWithUOMPicklist = '/' + browser.params.baseName + '/workspaces/8/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#routeWithDerivedFields
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The URL for a workspace that contains a Pivot PL and derived fields
	 */
	this.routeWithDerivedFields = '/' + browser.params.baseName + '/workspaces/66/addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#urlRegex
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/\@\/?\\d+\/addItem');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#urlContains
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'addItem';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.AddItemPage#sections
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description This is the list of sections divs.
	 * NOTE: There is some overlap between the tests for sections in this page and the ones in MainDashboardPage
	 */
	this.sections = element.all(by.css('.section-wrapper'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isSectionBodyDisplayed
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets whether the section body of the given section is displayed.
	 * NOTE: There is some overlap between the tests for sections in this page and the ones in MainDashboardPage
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isSectionBodyDisplayed = function (index) {
		return this.sections.get(index || 0).element(by.css('.transcluded-content-wrapper')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#gotoWorkspaceWithMatrix
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page containing a matrix (for testing item create)
	 */
	this.gotoWorkspaceWithMatrix = function () {
		browser.get(this.routeWithMatrix + (this.routeWithMatrix.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#goToWorkspaceWithoutRequiredFields
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page without required fields (for testing item create)
	 */
	this.goToWorkspaceWithoutRequiredFields = function () {
		browser.get(this.routeWithoutRequiredFields + (this.routeWithoutRequiredFields.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#gotoWorkspaceWithPicklists
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page without required fields (for testing item create)
	 */
	this.gotoWorkspaceWithPicklists = function () {
		browser.get(this.routeWithPicklists + (this.routeWithPicklists.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#gotoWorkspaceWithPicklistsWithSearch
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page without required fields (for testing item create)
	 */
	this.gotoWorkspaceWithPicklistsWithSearch = function () {
		browser.get(this.routeWithPicklistsWithSearch + (this.routeWithPicklistsWithSearch.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#gotoWorkspaceWithSpecialFields
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page without required fields (for testing item create)
	 */
	this.gotoWorkspaceWithSpecialFields = function () {
		browser.get(this.routeWithSpecialFields + (this.routeWithSpecialFields.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#gotoWorkspaceWithUOMPicklist
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page with UOM Picklist (Items & Boms)
	 */
	this.gotoWorkspaceWithUOMPicklist = function () {
		browser.get(this.routeWithUOMPicklist + (this.routeWithUOMPicklist.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#gotoWorkspaceWithDerivedFields
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Goes to the page with derived fields (Test Derived Fields)
	 */
	this.gotoWorkspaceWithDerivedFields = function () {
		browser.get(this.routeWithDerivedFields + (this.routeWithDerivedFields.indexOf('?') > -1 ? '&' : '?') + 'noAnimations');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isWorkspaceItemsDisplayed
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets whether the list of workspace items is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isWorkspaceItemsDisplayed = function () {
		return this.workspaceItems.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isWorkspaceNameDisplayed
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets whether the workspace name is displayed
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.isWorkspaceNameDisplayed = function () {
		return element(by.css('#plm-header h1')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isMatrixDisplayed
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets whether the matrix is displayed
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.isMatrixDisplayed = function (index) {
		return this.getMatrix(index).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getWorkspaceName
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the workspace name.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its text is retrieved.
	 */
	this.getWorkspaceName = function () {
		return element(by.css('#plm-header h1')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getMatrix
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets whether the workspace name is displayed
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.getMatrix = function (index) {
		return element.all(by.css('.full-create-item-matrix')).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getMatrixColumnHeaderText
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets the text inside a specific column header
	 * Important: 0 is always empty
	 *
	 * @param {Integer} colIndex The index of the column
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.getMatrixColumnHeaderText = function (matrixIndex, colIndex) {
		return this.getMatrix(matrixIndex).all(by.tagName('th')).get(colIndex).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getMatrixRowLabelText
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets the label of a specific row
	 *
	 * @param {Integer} rowIndex The index of the row
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.getMatrixRowLabelText = function (matrixIndex, rowIndex) {
		return this.getMatrix(matrixIndex).all(by.css('tbody tr')).get(rowIndex).all(by.tagName('td')).get(0).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getMatrixCellHtml
	 * @methodOf ViewTestsPage.AddItemPage
	 * @description Gets a particular cell from a matrix in the page
	 *
	 * @param {Integer} colIndex The index of the column
	 * @param {Integer} rowIndex The index of the row
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.getMatrixCell = (matrixIndex, colIndex, rowIndex) => {
		return this.getMatrix(matrixIndex).all(by.repeater('(rowIndex, row) in field.definition.rowNames')).get(rowIndex).all(by.repeater('(columnIndex, column) in field.definition.columnNames')).get(colIndex);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getSaveButton
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the SAVE button for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getSaveButton = function () {
		return CommandBar.getControlButton(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getCancelButton
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the SAVE button for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getCancelButton = function () {
		return CommandBar.getControlButton(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isCancelDialogDisplayed
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Checks if the cancel dialog is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isCancelDialogDisplayed = function () {
		return element(by.css('.confirmation-dialog')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getDialogCancelButton
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the cancel button from the confirmation/cancel dialog
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getDialogCancelButton = function () {
		return element(by.css('.confirmation-dialog')).all(by.tagName('button')).get(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getDialogOkButton
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the cancel button from the confirmation/cancel dialog
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getDialogOkButton = function () {
		return element(by.css('.confirmation-dialog')).all(by.tagName('button')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getOpenCalendarButton
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the small calendar button from the datepicker widget
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getOpenCalendarButton = function () {
		return element.all(by.css('.choose-date')).get(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getRadioButtonPicklistOption
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Selects the first date available in the datepicker (should be 12/31/2000)
	 * This code was shamelessly stolen from Blue Team's work on BOM tests
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.selectFirstDateInCalendar = function () {
		var table = element.all(by.css('.dropdown-menu table')).get(0);
		var header = table.element(by.css('thead tr:first-child th:nth-child(2) button'));
		var firstDayCell = table.element(by.css('tbody tr:first-child td:nth-child(2) button'));
		var firstMonthCell = table.element(by.css('tbody tr:first-child td:nth-child(2) button'));
		var firstYearCell = table.element(by.css('tbody tr:first-child td:first-child button'));

		header.click();
		header.click();
		firstYearCell.click();
		firstMonthCell.click();
		firstDayCell.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getDateInputValue
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets the date input element's value
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getDateInputValue = function () {
		return element(by.css('.datepicker-external input')).getAttribute('value');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getFilteredPicklistDropdown
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets a specific filtered picklist based on its name
	 *
	 * @param {String} name The name of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getFilteredPicklistDropdown = function (fplName) {
		return element(by.namePattern('div', 'urn.*\.' + fplName + '$'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#selectFilteredPicklistDropdownOption
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets a value inside the filtered picklist
	 *
	 * @param {String} name The name of the picklist
	 * @param {Integer} index The index of the option
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.selectFilteredPicklistDropdownOption = function (fplName, index) {
		var filteredPicklistDropdown = this.getFilteredPicklistDropdown(fplName);
		browser.sleep(1000);
		return filteredPicklistDropdown.all(by.repeater('option in fieldData.options.items track by $index')).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#getFilteredPicklistDropdownOptionSelectedValue
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Gets a value selected in the filtered picklist
	 *
	 * @param {String} name The name of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getFilteredPicklistDropdownOptionSelectedValue = function (fplName) {
		var filteredPicklistDropdown = this.getFilteredPicklistDropdown(fplName);
		return filteredPicklistDropdown.all(by.css('.label')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isSaveButtonDisplayed
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Checks if the SAVE button is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isSaveButtonDisplayed = function () {
		return CommandBar.getControlButton(0).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isCancelButtonDisplayed
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Checks if the CANCEL button is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isCancelButtonDisplayed = function () {
		return CommandBar.getControlButton(1).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#isCancelButtonDisplayed
	 * @propertyOf ViewTestsPage.AddItemPage
	 * @description Checks if the CANCEL button is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isCancelButtonDisplayed = function () {
		return CommandBar.getControlButton(1).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.AddItemPage#waitForEvents
	 * @methodOf ViewTestsPage.AddItemPage
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

			// var itemDetailsDeferred = $q.defer();
			// promises.push(itemDetailsDeferred.promise);
			// var itemDetailsListener = eventService.listen('itemInstance:*:done', function () {
			// 	eventService.unlisten(itemDetailsListener);
			// 	itemDetailsDeferred.resolve();
			// });

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(AddItemPage, GenericPage);
module.exports = new AddItemPage();
