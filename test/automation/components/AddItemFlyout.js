/**
 * @ngdoc object
 * @name ViewTestsComponents.AddItemFlyout
 *
 * @description This component corresponds to the popup for add item on several tab pages.
 *
 * ##Dependencies
 *
 */
var CommandBar = require('./CommandBar');

function AddItemFlyout() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AddItemFlyout#addItemsList
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Items that are listed in the Add Items flyout.
	 */
	this.addItemsList = element.all(by
		.repeater('item in addLinkableItemsCtrl.listData'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AddItemFlyout#addItemFlyoutInfo
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Info about the number of items.
	 */
	this.addItemFlyoutInfo = element(by.css('.add-item-flyout-info'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AddItemFlyout#addItemSelectedInfo
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Info about the number of items selected.
	 */
	this.addItemSelectedInfo = element(by.css('.add-item-flyout-sticky'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AddItemFlyout#disabledItemInfo
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Info about a disabled item.
	 */
	this.disabledItemInfo = element(by.css('.managed-by-tooltip .flyout-content'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AddItemFlyout#enabledCheckboxes
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Enabled checkboxes in the flyout.
	 */
	this.enabledCheckboxes = element.all(by.css('md-checkbox[aria-disabled="false"]'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AddItemFlyout#workspaceList
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Workspaces that are listed in the Add Items flyout.
	 */
	this.workspaceList = element.all(by.css('.linkable-workspace-option'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#selectItem
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Select the item in the list on the flyout
	 *
	 * @param {String} itemName The displayed name of the item
	 */
	this.selectItem = function (itemName) {
		// The container for the list items
		var itemList = element(by.css('.add-item-flyout .flyout-content .item-list'));
		var itemRow = itemList.element(by.cssContainingText('li', itemName));
		var checkbox = itemRow.element(by.css('md-checkbox'));

		browser.wait(function () {
			return checkbox.isPresent();
		}, 5000, 'wait for item failed');

		checkbox.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#add
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Click Add button on the flyout to add selected items to
	 * parent view and close the flyout
	 */
	this.add = function () {
		var addBtn = element(by
			.xpath('//*[@ng-click="addLinkableItemsCtrl.submitSelection()"]'));

		addBtn.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#isAddItemFlyoutDisplayed
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Checks whether the add items flyout displayed.
	 *
	 * @returns {Object} A Promise for whether the affected items table is displayed.
	 */
	this.isAddItemFlyoutDisplayed = function () {
		return element(by.css('.add-item-flyout-content')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#isAddItemFlyoutPresent
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Checks whether the add items flyout is present on the page.
	 *
	 * @returns {Object} A Promise for whether the affected items table is present.
	 */
	this.isAddItemFlyoutPresent = function () {
		return element(by.css('.add-item-flyout-content')).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#isDisabledItemTooltipDisplayed
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description Checks whether the message box of disabled item is displayed.
	 *
	 * @returns {Object} A Promise for whether the message box is displayed.
	 */
	this.isDisabledItemTooltipDisplayed = function () {
		return element(by.css('.managed-by-tooltip')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#getAddItemFlyoutBtns
	 * @propertyOf ViewTestsComponents.AddItemFlyout
	 * @description The buttons in the footer of the add existing item flyout.
	 *
	 * @param {Object} btnText The text of the button.
	 *
	 * @returns {Object} A Promise when the elements are found.
	 */
	this.getAddItemFlyoutBtns = function (btnText) {
		// Quick create is disabled for 10.0 release
		/* var buttonIndices = {
			Create: 0,
			Cancel: 1,
			Add: 2
		}; */

		var buttonIndices = {
			Cancel: 0,
			Add: 1
		};

		return element.all(by.css('.add-item-flyout-footer button'))
			.get(buttonIndices[btnText]);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#openAddItemsFlyout
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Opens the add existing items flyout.
	 *
	 * @returns {Object} A Promise for the element when the click is completed.
	 */
	this.openAddItemsFlyout = function () {
		return CommandBar.getTranscludedButtonByLabel('Add').click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#closeAddItemsFlyout
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Closes the add existing items flyout.
	 *
	 * @returns {Object} A Promise for the element when the click is completed.
	 */
	this.closeAddItemsFlyout = function () {
		return this.getAddItemFlyoutBtns('Cancel').click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#openDisabledItemTooltip
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Opens the disabled item info tooltip.
	 *
	 * @returns {Object} A Promise for the element when the click is completed.
	 */
	this.openDisabledItemTooltip = function () {
		return element(by.css('.flyout-content .md-help')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#closeDisabledItemTooltip
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Closes the disabled item info tooltip.
	 *
	 * @returns {Object} A Promise for the element when the click is completed.
	 */
	this.closeDisabledItemTooltip = function () {
		return element(by.css('.flyout-content .md-close')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#addItemsListCheckbox
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Returns a particular checkbox from the list.
	 *
	 * @param {Number} index Index of the checkbox (starting from 0).
	 *
	 * @returns {Object} A Promise for the element.
	 */
	this.addItemsListCheckbox = function (index) {
		return this.addItemsList.get(index).element(by.model('item.selected'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#addItemsSearchBy
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Searches the Add Items list by the specified query.
	 *
	 * @param {String} query Search query.
	 */
	this.addItemsSearchBy = function (query) {
		element(by.model('typedVal')).sendKeys(query);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#clearSearch
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Clears the search.
	 */
	this.clearSearch = function () {
		return element(by.css('.add-item-search .zmdi-close')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#getWorkspaceSelectorElement
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description get workspace selector element.
	 */
	this.getWorkspaceSelectorElement = function () {
		return element(by.css('.add-item-search md-select'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AddItemFlyout#changeWorkspaceFilter
	 * @methodOf ViewTestsComponents.AddItemFlyout
	 * @description Filter by workspace.
	 */
	this.changeWorkspaceFilter = function () {
		this.getWorkspaceSelectorElement().click();
		var options = element.all(by.css('.linkable-workspace-option'));

		return options.get(1).click();
	};
}

module.exports = new AddItemFlyout();
