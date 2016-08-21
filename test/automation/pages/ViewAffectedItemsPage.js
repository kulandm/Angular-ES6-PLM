/**
 * @ngdoc object
 * @name ViewTestsPage.ViewAffectedItemsPage
 *
 * @description This page corresponds to the affected items page.
 *
 * ##Dependencies
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');

function ViewAffectedItemsPage() {

	ViewAffectedItemsPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#route
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/9/items/affectedItems?tab=affected-items&view=split&mode=view&itemId=9@2902';

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
		this.route = '/' + browser.params.baseName + '/workspaces/' + workspaceId + '/items/affectedItems?tab=affected-items&view=split&mode=view&itemId=' + workspaceId + '@' + newID;
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('\/item\/\d+@\d+\/affectedItems');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#urlContains
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'affectedItems';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#affectedItemsTable
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The affected items table (does not include the header row
	 * or the multiselect column).
	 */
	this.affectedItemsTable = element(by.css('#itemnav .ui-grid-render-container-body'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#cellsInHeaderRow
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Each cell in the header row of the affected items table.
	 */
	this.cellsInHeaderRow = this.affectedItemsTable.element(by.css('#itemnav .ui-grid-header-cell-row'))
		.all(by.repeater('col in colContainer.renderedColumns track by col.uid'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#affectedItemsRows
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Rows of the affected items (does not include the header row).
	 */
	this.affectedItemsRows = this.affectedItemsTable.all(by
		.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#cellsInFirstRow
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Each cell in the first row of the affected items table.
	 */
	this.cellsInFirstRow = this.affectedItemsRows.first().all(by
		.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#columnResizer
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Column resizer for the '#' column (first resizable column).
	 */
	this.columnResizer = element.all(by.css('#itemnav .ui-grid-column-resizer')).first();

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAffectedItemsPage#getSelectedBomItemsInfo
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get the header which displays number of items selected.
	 */
	this.getSelectedBomItemsInfo = element(by.css('.add-relatedBOM-dialog .headline small'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#editBtn
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The edit affected item button.
	 */
	this.editBtn = element(by.css('[aria-label="Edit"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#saveBtn
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The save affected item button.
	 */
	this.saveBtn = element(by.css('[aria-label="Save"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#cancelBtn
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The cancel affected item button.
	 */
	this.cancelBtn = element(by.css('[aria-label="Cancel"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#removeBtn
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The remove affected item button.
	 */
	this.removeBtn = element(by.css('[aria-label="Remove"]'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getRowCell
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get cells of a row
	 *
	 * @param {Number} rowNumber: The row number for which the cells are needed.
	 *
	 * @returns {Object} A list of cells of a row.
	 */
	this.getRowCell = function (rowNumber) {
		return this.affectedItemsRows.get(rowNumber).all(by
			.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#isAffectedItemsTableDisplayed
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Checks whether the affected items table is displayed.
	 *
	 * @returns {Object} A Promise for whether the affected items table is displayed.
	 */
	this.isAffectedItemsTableDisplayed = function () {
		return this.affectedItemsTable.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#isInlineActionsBtnDisplayed
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Checks whether the inline action button is displayed.
	 *
	 * @param {Integer} index : the index of the row starting from 0
	 *
	 * @returns {Object} A Promise for whether the inline action button is displayed.
	 */
	this.isInlineActionsBtnDisplayed = function (index) {
		return this.getRowCell(index).get(1).element(by.css('.inline-actions')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getInlineActionsBtn
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the inline action button of the first lifecycle cell.
	 *
	 * @param {Integer} index : the number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getInlineActionsBtn = function (index) {
		return element.all(by.css('.inline-actions')).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getAddBOMBtn
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the add related BOM button.
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getAddBOMBtn = function () {
		return element(by.css('md-menu-content .md-button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getSearchBtn
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the Search button in the Add related BOM modal window.
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getSearchBtn = function () {
		return element(by.css(
			'.add-relatedBOM-dialog [ng-click="addRelatedBomCtrl.searchRelatedBom()"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getAddSelectedBomItemButton
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the Add button in the add related BOM modal.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getAddSelectedBomItemButton = function () {
		return element(by.css(
			'.add-relatedBOM-dialog button[ng-click="addRelatedBomCtrl.add()"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getHeaderCheckBox
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the Checkbox in the table header of BOM modal window.
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getHeaderCheckBox = function () {
		return element.all(by.css('.add-relatedBOM-dialog .header-cell input')).get(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getBomItemCheckBox
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the Checkbox in the BOM modal window including header checkbox.
	 *
	 * @param {Number} index : index of the row, starting with 0 for header checkbox
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getBomItemCheckBox = function (index) {
		return element.all(by.css('.add-relatedBOM-dialog .checkbox-column input')).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getModalCancelBtn
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the Cancel button in the Add related BOM modal window.
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getModalCancelBtn = function () {
		return element.all(by.css('.add-relatedBOM-dialog [ng-click="addRelatedBomCtrl.cancel()"]')).first();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getColumnWidth
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The width of the '#' column.
	 *
	 * @param {Number} index : index of the column
	 *
	 * @returns {Object} A Promise for the column width.
	 */
	this.getColumnWidth = function (index) {
		return this.cellsInHeaderRow.get(index).getCssValue('width');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getFirstColumnWidth
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The width of the '#' column.
	 *
	 * @returns {Object} A Promise for the column width.
	 */
	this.getFirstColumnWidth = function () {
		return this.cellsInHeaderRow.first().getCssValue('width');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getHeaderCellClasses
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Gets the classes for a header cell.
	 *
	 * @returns {Object} A promise for the list of classes for a header cell.
	 */
	this.getHeaderCellClasses = function (index) {
		return this.cellsInHeaderRow.get(index).all(by
			.css('#itemnav .ui-grid-cell-contents span, #itemnav .ui-grid-cell-contents span i'))
			.last().getAttribute('class');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#isItemDescriptorLinkToItem
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Returns whether the item descriptor for the first item is a link.
	 *
	 * @returns {Object} A Promise for the item descriptor link's presence.
	 */
	this.isItemDescriptorLinkToItem = function () {
		return this.cellsInFirstRow.get(3).element(by.css('a[href]')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#openAddBOMModal
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Opens the add BOM items modal.
	 *
	 * @returns {Object} A Promise for the element when the click is completed.
	 */
	this.openAddBOMModal = function () {
		return element(by.css('.add-relatedBOM-dialog')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#bulkEditButton
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Shows up when bulk edit is enabled
	 *
	 * @returns {Object} Bulk edit element
	 */
	this.bulkEditButton = function () {
		return element(by.css('.bulk-edit-button'));
	};

	/**
	 * @name ViewTestsPage.ViewAffectedItemsPage#getRowSelectionButtons
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description returns a list of row selection buttons.
	 *
	 * @returns {ElementArrayFinder} a wrapper on array of row selection buttons for each row of affected items.
	 */
	this.getRowSelectionButtons = function () {
		// Note: Unable to find the selection column using repeater locator,
		// this seems like a bug. The column added by ui-grid is not detected
		// by protractor (even after some delay).
		return element.all(by.css('#itemnav .checkbox-column input'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
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

			var affectedItemsDeferred = $q.defer();
			promises.push(affectedItemsDeferred.promise);
			var affectedItemsListener = eventService.listen('affectedItems:*:done', function () {
				eventService.unlisten(affectedItemsListener);
				affectedItemsDeferred.resolve();
			});

			var affectedItemsMetaDeferred = $q.defer();
			promises.push(affectedItemsMetaDeferred.promise);
			var affectedItemsMetaListener = eventService.listen('affectedItemsMeta:*:done', function () {
				eventService.unlisten(affectedItemsMetaListener);
				affectedItemsMetaDeferred.resolve();
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
	 * @name ViewTestsPage.ViewAffectedItemsPage#getFromCell
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get the value of the "From" revision number
	 *
	 * @param {Integer} rowNum The row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getFromCell = function (rowNum) {
		return this.affectedItemsTable
			.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'))
			.get(rowNum)
			.all(by.css('.ui-grid-cell'))
			.get(6);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getToCell
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get the value of the "To" revision number
	 *
	 * @param {Integer} rowNum The row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getToCell = function (rowNum) {
		return this.affectedItemsTable
			.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'))
			.get(rowNum)
			.all(by.css('.ui-grid-cell'))
			.get(7);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#assertItemExist
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Assert an item is in the list
	 *
	 * @param {String} itemName The name of the item to check.
	 *
	 */
	this.assertItemExist = function (itemName) {
		var affectedItem = element(by.xpath('//div[contains(@class, "ui-grid-row")][.//a[@title="' + itemName + '"]]'));
		browser.wait(function () {
			return affectedItem.isPresent();
		}, 3000, 'Failed: expected item do not exist in the list.');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#openItem
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Open the linked item
	 *
	 * @param {Integer} rowNum The row number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.openItem = function (rowNum) {
		return this.affectedItemsTable
			.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'))
			.get(rowNum)
			.element(by.css('.ui-grid-cell a'))
			.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#goEdit
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Enter edit mode
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.goEdit = function () {
		return this.editBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getSaveBtn
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description get save button
	 *
	 *@returns {Object} A Promise that resolves when the element is found.
	 */
	this.getSaveBtn = function () {
		return this.saveBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#goSave
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Save from Edit mode
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.goSave = function () {		
		return this.saveBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#goCancel
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Cancel or exit from Edit mode
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.goCancel = function () {
		return this.cancelBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#triggerLeave
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Cancel or exit from Edit mode by confirming to exit from the navigation guard
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.triggerLeave = function () {
		return element(by.css('[ng-click="navGuardCtrl.confirmExit(\'YES\')"]')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getLeaveButton
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Leave button of the navigation guard
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getLeaveButton = function () {
		return element(by.css('[ng-click="navGuardCtrl.confirmExit(\'YES\')"]'));
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#goRemove
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Remove an item
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.goRemove = function () {
		return this.removeBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#goRemoveConfirm
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Confirm the removal of an item
	 *
	 * @returns {Object} A Promise that resolves when the element is clicked.
	 */
	this.goRemoveConfirm = function () {
		var EC = protractor.ExpectedConditions;
		var confirmBtn = this.getRemoveDialog()
			.element(by.css('[aria-label="Confirm"]'));

		browser.wait(EC.elementToBeClickable(confirmBtn), 5000);
		return confirmBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getRemoveDialog
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description The remove confirmation dialog
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getRemoveDialog = function () {
		return element(by.css('.remove-item-dialog'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getChildrenOption
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get the value of the "Children" radio group
	 *
	 * @param {Integer} index The number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getChildrenOption = function (index) {
		return element(by.css('.add-relatedBOM-dialog')).all(by.repeater('option in addRelatedBomCtrl.childrenOptions'))
			.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getParentsOption
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get the value of the "Parent" radio group
	 *
	 * @param {Integer} index The number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getParentsOption = function (index) {
		return element(by.css('.add-relatedBOM-dialog')).all(by.repeater('option in addRelatedBomCtrl.parentsOptions'))
			.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getFilterOption
	 * @propertyOf ViewTestsPage.ViewAffectedItemsPage
	 * @description Get the value of the "Filter" radio group
	 *
	 * @param {Integer} index The number, start from 0
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getFilterOption = function (index) {
		return element(by.css('.add-relatedBOM-dialog')).all(by.repeater('option in addRelatedBomCtrl.itemsFilterOptions'))
			.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ViewAffectedItemsPage#getRelatedBomItems
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Returns the rows representing the BOM items
	 *
	 * @returns {Object} A promise that resolves with the rows for the BOM items
	 */
	this.getRelatedBomItems = function () {
		return element(by.css('.add-relatedBOM-dialog'))
			.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#addLabel
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The add affected item button.
	 */
	this.addLabel = element(by.css('[aria-label="Add"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#searchBoxInput
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The search box to find a specified item to add.
	 */
	this.searchBoxInput = element(by.css('.add-item-search input[type="text"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#searchCheckbox
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The checkbox for the item searched.
	 */
	this.searchCheckbox = element(by.css('md-checkbox'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#selectAllCheckbox
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description The checkbox for selecting all added Affected Items.
	 */
	this.selectAllCheckbox = element(by.css('[ng-click="grid.appScope.affectedItemsCtrl.toggleAllSelection()"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#searchSubmitSelection
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Submit button.
	 */
	this.searchSubmitSelection = element(by.css('[ng-click="addLinkableItemsCtrl.submitSelection()"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#cancelSelection
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Cancel button in the flyout.
	 */
	this.cancelSelection = element(by.css('button[ng-click="addLinkableItemsCtrl.cancelSelection()"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ViewAffectedItemsPage#addAffectedItemFlyout
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Flyout window when click add affected item button.
	 */
	this.addAffectedItemFlyout = element(by.css('.flyout-content'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ViewAffectedItemsPage#getRowStateIndicator
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description get the row state indicator element for a given row.
	 *
	 * @param {Number} rowIndex the index of the row.
	 *
	 * @returns {Object} the row state indicator element for a given row
	 */
	this.getRowStateIndicator = function (rowIndex) {
		return this.getRowCell(rowIndex).get(0).element(by.css('row-state-indicator .indicator'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ViewAffectedItemsPage#getCellStateIndicator
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description get the cell state indicator element for a given row and column
	 *
	 * @param {Number} rowIndex the index of the row.
	 * @param {Number} colIndex the index of the column.
	 *
	 * @returns {Object} the cell state indicator element for a given row and column
	 */
	this.getCellStateIndicator = function (rowIndex, colIndex) {
		return this.getRowCell(rowIndex).get(colIndex).element(by.css('cell-state-indicator .cell-indicator'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ViewAffectedItemsPage#getLifecycleText
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Text inside lifecycleCell
	 *
	 * @param {Number} rowIndex the index of the row.
	 *
	 * @returns {String}  Returns the Text inside lifecycleCell
	 */
	this.getLifecycleText = function (rowIndex) {
		return element.all(by.css('.edit-lifecycle')).get(rowIndex).getText();
	};

	// TODO: move these functions to separate component. 'BulkEdit'.
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ViewAffectedItemsPage#lifecycleOption
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Element which has the lifecycle options
	 *
	 * @returns {Object}  Returns the element having the lifecycle options
	 */
	this.lifecycleOption = function () {
		return this.bulkEditModal().all(by.css('.lifecycle-transitions-container ul li')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ViewAffectedItemsPage#getTransitions
	 * @propertyOf ViewTestsComponents.ViewAffectedItemsPage
	 * @description Elements having the available transitions
	 *
	 * @returns {Object}  Returns the elements having the available transitions
	 */
	this.getTransitions = function () {
		return this.bulkEditModal().all(by.css('.menu.transition .item'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#bulkEditButton
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description It is the bulk edit modal window
	 *
	 * @returns {Object} Bulk edit element
	 */
	this.bulkEditModal = function () {
		return element(by.css('.bulk-edit-dialog'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#bulkEditModalHeading
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description It is the heading of the bulk edit modal window
	 *
	 * @returns {Object} Bulk edit heading element
	 */
	this.bulkEditModalHeading = function () {
		return this.bulkEditModal().element(by.css('h2'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#bulkEditModalSubHeading
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description It is the sub-heading of the bulk edit modal window
	 *
	 * @returns {Object} Bulk edit sub heading element
	 */
	this.bulkEditModalSubHeading = function () {
		return this.bulkEditModal().element(by.css('h4'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getEffectivityOptionRadioGroup
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get the effectivity option (yes or no) radio group of bulk edit dialog.
	 *
	 * @returns {Object} effectivity option radio group element.
	 */
	this.getEffectivityOptionRadioGroup = function () {
		return this.bulkEditModal().element(by.css('.effectivity-options'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getEffectivityDateField
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get the effectivity date field of bulk edit dialog.
	 *
	 * @returns {Object} effectivity date element.
	 */
	this.getEffectivityDateField = function () {
		return this.bulkEditModal().element(by.css('.effectivity-date'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getEffectivityOptions
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get the effectivity options radio button of bulk edit dialog.
	 *
	 * @returns {Object} effectivity options radio button element
	 */
	this.getEffectivityOptions = function () {
		return this.getEffectivityOptionRadioGroup().all(by.css('md-radio-button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getBulkEditDialogCloseElement
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get the close button of bulk edit dialog.
	 *
	 * @returns {Object} close button element
	 */
	this.getBulkEditDialogCloseElement = function () {
		return this.bulkEditModal().element(by.css('.close-bulk-edit'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#getBulkEditDialogUpdateButton
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get the update button of bulk edit dialog.
	 *
	 * @returns {Object} update button element
	 */
	this.getBulkEditDialogUpdateButton = function () {
		return this.bulkEditModal().element(by.css('.bulk-edit-footer .md-primary'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#openDatepickerButton
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get the open button of the datepicker
	 *
	 */
	this.openDatepickerButton = function () {
		return element(by.css('.md-datepicker-expand-triangle'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#dateToClick
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get date element to click
	 *
	 */
	this.dateToClick = function () {
		return element(by.css('.md-calendar-date.md-calendar-date-today'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#datepickerInput
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get datepicker input element
	 *
	 */
	this.datepickerInput = function () {
		return element(by.css('.form-control.ng-valid'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#chooseDateButton
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get datepicker choose date button
	 *
	 */
	this.chooseDateButton = function () {
		return element(by.css('.choose-date'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAffectedItemsPage#dateToBeClicked
	 * @methodOf ViewTestsPage.ViewAffectedItemsPage
	 * @description a method to get date to be clicked
	 *
	 */
	this.dateToBeClicked = function () {
		return element(by.css('.btn.btn-default.btn-sm.active'));
	};
}

util.inherits(ViewAffectedItemsPage, AbstractItemViewPage);

module.exports = ViewAffectedItemsPage;
