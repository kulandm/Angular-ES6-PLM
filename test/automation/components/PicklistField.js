'use strict';

/**
 * @ngdoc object
 * @name ViewTestsComponents.PicklistField
 *
 * @description This component corresponds to a picklist,
 * which includes the single-select and multi-select pick list widgets
 * (except for filtered, which have their own component)
 *
 */
function PicklistField() {

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#fillInput
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Fills an input field slowly, for Chrome compatibility
	 * (More info at https://github.com/angular/protractor/issues/698)
	 * It fullfills the promise once the text typed in the input matches the passed string
	 *
	 * @returns promise that when it is resolved, returns the text in the input
	 */
	this.fillInput = function (input, str) {
		var deferred = protractor.promise.defer();
		
		str.split('').forEach(function (char) {
			browser.sleep(200); // 200 should be enough between each key press
			input.sendKeys(char);
		});
		var inputChars = input.getAttribute('value');
		expect(inputChars).to.eventually.contain(str).then(function (typedStr) {
			deferred.fulfill(typedStr);
		});
		
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getRadioButtonPicklistOption
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets a particular radio option from a particular picklist
	 *
	 * @param {Integer} indexPicklist The index of the picklist in the page
	 * @param {Integer} indexRadio The index of the radio button
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getRadioButtonPicklistOption = function (indexPicklist, indexRadio) {
		var radioButtonPl = element.all(by.tagName('radio-field')).get(indexPicklist);
		return radioButtonPl.all(by.css('.field-radio-item')).get(indexRadio);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getPicklistDropdown
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets a specific single-select/multi-select picklist dropdown from the page
	 *
	 * @param {String} id The id of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getPicklistDropdown = function (id) {
		return element(by.id(id));
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getGenericPicklistByIndex
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets a specific pick list in the page
	 *
	 * @param {String} index The index of the pick list in the page (usually in VIEW mdoe)
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getGenericPicklistByIndex = function (index) {
		return element.all(by.tagName('generic-picklist-field')).get(index);
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getSearchInputField
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets the input field of a particular picklist to perform search
	 *
	 * @param {String} id The id of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getSearchInputField = function (id) {
		return element(by.css('#' + id + ' .search'));
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getClearButton
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets the input field of a particular picklist to perform search
	 *
	 * @param {String} id The id of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getClearButton = function (id) {
		return element(by.css('.clear-' + id));
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#selectPicklistDropdownOption
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets a value inside the picklist
	 *
	 * @param {String} id The id of the picklist
	 * @param {Integer} index The index of the option
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.selectPicklistDropdownOption = function (id, index) {
		var picklistDropdown = this.getPicklistDropdown(id);
		browser.sleep(2000); // Timeout necessary because of throttling of requests
		return picklistDropdown.all(by.css('.item')).get(index);
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getPicklistDropdownSelectedValue
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets the selected value of a specific single-select picklist
	 *
	 * @param {String} id The id of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getPicklistDropdownSelectedValue = function (id) {
		var picklistDropdown = this.getPicklistDropdown(id);
		return picklistDropdown.all(by.css('.text')).getText();
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getMultiSelectPicklistDropdownSelectedValue
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets the selected value of a specific single-select picklist
	 *
	 * @param {String} id The id of the picklist
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getMultiSelectPicklistDropdownSelectedValue = function (id) {
		var multiSelectPicklistDropdown = this.getPicklistDropdown(id);
		return multiSelectPicklistDropdown.all(by.css('.label')).getText();
	};
	
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.PicklistField#getResultsNotification
	 * @propertyOf ViewTestsComponents.PicklistField
	 * @description Gets the notification for # of results inside the picklist flyout
	 *
	 * @returns {Object} The element
	 */
	this.getResultsNotification = function () {
		return element(by.css('.header.alertCount'));
	};
}

module.exports = new PicklistField();