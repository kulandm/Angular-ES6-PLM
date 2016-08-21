'use strict';

/**
 * @ngdoc object
 * @name ViewTestsComponents.FilteredPicklistField
 *
 * @description This component corresponds to a filtered picklist field.
 *
 */
function FilteredPicklistField() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FilteredPicklistField#fplFields
	 * @propertyOf ViewTestsComponents.fplFields
	 * @description `private` WebElement for filtered picklists collection present in the page.
	 */
	var fplFields = element.all(by.tagName('filtered-picklist-field'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getFplFields
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the collection of fpls in the page.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getFplFields = function () {
		return fplFields;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getFplFields
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the collection of fpls in the page.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getFplCount = function () {
		return fplFields.count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getFplFields
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the collection of fpls in the page.
	 *
	 * @params {Number} The index of the FPLs collection.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getFplByIndex = function (index) {
		return fplFields.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getDropdown
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the dropdown component from the FPL.
	 *
	 * @params {Object} A specific FPL element
	 *
	 * @returns {Object} A promise that resolves when the element is found..
	 */
	this.getDropdown = function (fpl) {
		return fpl.element(by.css('.ui.fluid.search.selection.single.dropdown'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getDropdown
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the dropdown component from the FPL.
	 *
	 * @params {Object} A specific FPL element
	 *
	 * @returns {Object} A promise that resolves when the element is found..
	 */
	this.getClearBtn = function (fpl) {
		return fpl.element(by.tagName('button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getViewText
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the dropdown component from the FPL.
	 *
	 * @params {Object} A specific FPL element
	 *
	 * @returns {Object} A promise that resolves when the element is found, returning the text that contains.
	 */
	this.getViewText = function (fpl) {
		return fpl.element(by.css('.text-truncation')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getViewHrefText
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the dropdown component from the FPL.
	 *
	 * @params {Object} A specific FPL element
	 *
	 * @returns {Object} A promise that resolves when the element is found, returning the text that contains the link.
	 */
	this.getViewHrefText = function (fpl) {
		return fpl.element(by.css('.href-truncation')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getViewHrefText
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the dropdown component from the FPL.
	 *
	 * @params {Object} A specific FPL element
	 *
	 * @returns {Object} A promise that resolves when the element is found, returning the text that contains the link.
	 */
	this.getEditText = function (fpl) {
		return this.getDropdown(fpl).element(by.css('.text.ng-binding')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getDropdownOptions
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets the options collection from the dropdown.
	 *
	 * @params {Object} A specific FPL element
	 *
	 * @returns {Object} A promise that resolves when the element is found, returning the options collection.
	 */
	this.getDropdownOptions = function (fpl) {
		return this.getDropdown(fpl).element(by.css('.menu.transition.visible')).all(by.css('.item'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.FilteredPicklistField#getDropdownOptionByIndex
	 * @propertyOf ViewTestsPage.FilteredPicklistField
	 * @description Gets a specific option from the dropdown options list.
	 *
	 * @params {Object} A specific FPL element
	 * @params {Number} The index of the array
	 *
	 * @returns {Object} A promise that resolves when the element is found, returning the required option by its index.
	 */
	this.getDropdownOptionByIndex = function (fpl, index) {
		return this.getDropdownOptions(fpl).get(index);
	};
}

module.exports = new FilteredPicklistField();