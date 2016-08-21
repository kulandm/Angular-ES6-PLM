/**
 * @ngdoc object
 * @name ViewTestsComponents.BomAttachedItemFlyout
 *
 * @description This component corresponds to the flyout for attached items on BOM tab.
 *
 * ##Dependencies
 *
 */
function BomAttachedItemFlyout() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getAttachedItemsFlyout
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the attachment item flyout
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getAttachedItemsFlyout = function () {
		return element(by.css('.view-attached-items-flyout-content'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getAttachedItemsHeader
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the Item header
	 *
	 * @returns {Promise} A promise that resolves when the text is found
	 */
	this.getAttachedItemsHeader = function () {
		return element.all(by.css('.view-attached-items-header > div')).first().getText();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getActionMenu
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the dropdown menu at the header
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getActionMenu = function () {
		return element(by.id('view-attached-items-menu'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getDropDownWidget
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the dropdown from the menu at the header
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getDropDownWidget = function () {
		return this.getAttachedItemsFlyout().element(by.css('.dropdown-widget-wrapper'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getAttachedItemsList
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the list of attached items
	 *
	 * @returns {Promise} A promise that resolves when the elements are found
	 */
	this.getAttachedItemsList = function () {
		return this.getAttachedItemsFlyout().all(by.css('md-list-item'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getFirstItem
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the first item in the list
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getFirstItem = function () {
		return this.getAttachedItemsList().first();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getFirstItemInfoText
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the item info text
	 *
	 * @returns {Promise} A promise that resolves when the text is found
	 */
	this.getFirstItemInfoText = function (index) {
		return this.getFirstItem().all(by.css('.attachment-info p')).get(index).getText();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getDescriptorOfFirstItem
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the item descriptor of the first item
	 *
	 * @returns {Promise} A promise that resolves when the text is found
	 */
	this.getDescriptorOfFirstItem = function () {
		return this.getFirstItemInfoText(0);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getVersionOfFirstItem
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the version number first item
	 *
	 * @returns {Promise} A promise that resolves when the text is found
	 */
	this.getVersionOfFirstItem = function () {
		return this.getFirstItemInfoText(1);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getTypeOfFirstItem
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the file type of the first item
	 *
	 * @returns {Promise} A promise that resolves when the text is found
	 */
	this.getTypeOfFirstItem = function () {
		return this.getFirstItemInfoText(2);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getActionsButtons
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the action buttons
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getActionsButtons = function () {
		return element.all(by.css('.wip-file-actions-icon'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getCloseFlyoutButton
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the close buttons
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getCloseFlyoutButton = function () {
		return this.getAttachedItemsFlyout().element(by.css('button[aria-label="Close"]'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomAttachedItemFlyout#getFlyoutBackdrop
	 * @propertyOf ViewTestsComponents.BomAttachedItemFlyout
	 * @description get the backdrop of the flyout
	 *
	 * @returns {Promise} A promise that resolves when the element is found
	 */
	this.getFlyoutBackdrop = function () {
		return element(by.css('.flyout-backdrop'));
	};
}

module.exports = new BomAttachedItemFlyout();
