/**
 * @ngdoc object
 * @name ViewTestsComponents.ItemMenu
 *
 * @description This component corresponds to the item menu.
 *
 * ##Dependencies
 *
 */
function ItemMenu() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemMenu#itemMenu
	 * @propertyOf ViewTestsComponents.ItemMenu
	 * @description `private` WebElement for item menu.
	 */
	var itemMenu = element(by.css('#item-tabs'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemMenu#isItemMenuDisplayed
	 * @propertyOf ViewTestsComponents.ItemMenu
	 * @description Gets whether the item menu is displayed.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its display value is retrieved.
	 */
	this.isItemMenuDisplayed = function () {
		return element(by.css('#itemnav .df-tab-menu')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemMenu#getItemMenuTabs
	 * @propertyOf ViewTestsComponents.ItemMenu
	 * @description Gets the tabs on the item menu.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getItemMenuTabs = function () {
		return element.all(by.css('#itemnav .df-tab-menu li'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemMenu#getActiveTab
	 * @propertyOf ViewTestsComponents.ItemMenu
	 * @description Gets the current active menu tab.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getActiveTab = function () {
		return element(by.css('#itemnav  .df-tab-menu li.df-tab-menu-active'));
	};
}

module.exports = new ItemMenu();