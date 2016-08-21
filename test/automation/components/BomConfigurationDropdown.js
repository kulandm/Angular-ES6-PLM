/**
 * @ngdoc object
 * @name ViewTestsComponents.BomConfigurationDropdown
 *
 * @description This component corresponds configuration dropdown in the Bom View
 *
 * ##Dependencies
 *
 */

function BomConfigurationDropdown(anchor) {

	function isElementDisplayed() {
		return this.locator.isDisplayed();
	}

	function clickElement() {
		return this.locator.click();
	}

	var dropdown = this;

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown
	 * @description The locator for the dropdown itself
	 */
	dropdown.locator = element(by.css('#configuration-dropdown-widget > .dropdown-widget-wrapper'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#locator
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown
	 * @description Convinience function to open the dropdown
	 */
	dropdown.open = function () {
		dropdown.anchor.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown
	 * @description Checks if the dropdown is displayed
	 */
	dropdown.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#save
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown
	 * @description Saves the dropdown's configurations by clicking the save button
	 */
	dropdown.save = function () {
		dropdown.saveButton.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#cancel
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown
	 * @description Closes the dropdown by clicking the cancel button
	 */
	dropdown.cancel = function () {
		dropdown.cancelButton.click();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#anchor
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown
	 * @description The button which when clicked opens the dropdown
	 */
	dropdown.anchor = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#anchor.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.anchor
	 * @description The locator for the anchor element
	 */
	dropdown.anchor.locator = anchor;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#anchor.click
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.anchor
	 * @description Opens the dropdown by clicking the anchor element
	 */
	dropdown.anchor.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown
	 * @description Object which encapsulates the effectivity date picker component contianer
	 */
	dropdown.effectivityDatepicker = {};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.setToEarliestDate
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker
	 * @description Uses the datepicker to set the current effectivity date to the earliest date
	 */
	dropdown.effectivityDatepicker.setToEarliestDate = function () {
		this.picker.open();
		this.picker.chooseEarliestDate();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.setToLatestDate
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker
	 * @description Uses the datepicker to set the current effectivity date to the earliest date
	 */
	dropdown.effectivityDatepicker.setToLatestDate = function () {
		this.picker.open();
		this.picker.chooseLatestDate();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.button
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker
	 * @description The button which opens the datepicker component
	 */
	dropdown.effectivityDatepicker.button = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker
	 * @description The locator which opens the datepicker component
	 */
	dropdown.effectivityDatepicker.button.locator = dropdown.locator.element(by.css('.bias-fieldset-date .choose-date'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.button.setToEarliestDate
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.button
	 * @description Clicks the datepicker button to open the datepicker
	 */
	dropdown.effectivityDatepicker.button.click = clickElement;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.button.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.button
	 * @description Checks if the datepicker button is visible
	 */
	dropdown.effectivityDatepicker.button.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.picker
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker
	 * @description The datepicker component
	 */
	dropdown.effectivityDatepicker.picker = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.picker.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.picker
	 * @description The locator for the datepicker component
	 */
	dropdown.effectivityDatepicker.picker.locator = dropdown.locator.element(by.css('.bias-fieldset-date .dropdown-menu'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.picker.open
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.picker
	 * @description Convinience method to open the datepicker
	 */
	dropdown.effectivityDatepicker.picker.open = function () {
		return dropdown.effectivityDatepicker.button.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.picker.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.picker
	 * @description Checks if the datepicker is visible
	 */
	dropdown.effectivityDatepicker.picker.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.picker.chooseEarliestDate
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.picker
	 * @description Using the open datepicker, selects the earliest available date (while staying in the same year range)
	 *	Pre-2020, this is January 28, 2001
	 */
	dropdown.effectivityDatepicker.picker.chooseEarliestDate = function () {
		var table = this.locator.element(by.css('table'));
		var header = table.element(by.css('thead tr:first-child th:nth-child(2) button'));
		var firstDayCell = table.element(by.css('tbody tr:first-child td:nth-child(2) button'));
		var firstMonthCell = table.element(by.css('tbody tr:first-child td:nth-child(2) button'));
		var firstYearCell = table.element(by.css('tbody tr:first-child td:first-child button'));

		header.click(); // to month chooser
		header.click(); // to year chooser
		firstYearCell.click(); // select 2001
		firstMonthCell.click(); // select January
		firstDayCell.click(); // select 31 (December 31, 2000)
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#effectivityDatepicker.picker.chooseLatestDate
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.effectivityDatepicker.picker
	 * @description Using the open datepicker, selects the latest available date (while staying in the same year range)
	 *	Pre-2020, this is January 11, 2020
	 */
	dropdown.effectivityDatepicker.picker.chooseLatestDate = function () {
		var table = this.locator.element(by.css('table'));
		var header = table.element(by.css('thead tr:first-child th:nth-child(2) button'));
		var lastDayCell = table.element(by.css('tbody tr:last-child td:last-child button'));
		var lastMonthCell = table.element(by.css('tbody tr:last-child td:last-child button'));
		var lastYearCell = table.element(by.css('tbody tr:last-child td:nth-last-child(2) button'));

		header.click(); // to month chooser
		header.click(); // to year chooser
		lastYearCell.click(); // select 2020
		lastMonthCell.click(); // select December
		lastDayCell.click(); // select 9 (January 09, 2021)
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown
	 * @description An Object encapsulating the bias selection dropdown
	 */
	dropdown.biasDropdown = {};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.setSelectedBias
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown
	 * @description Sets the selected bias to the selected revision using the bias dropdown
	 */
	dropdown.biasDropdown.setSelectedBias = function (revision) {
		this.dropdown.open();
		this.dropdown.selectBias(revision);
		this.dropdown.waitForClose();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.button
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown
	 * @description The button which opens the bias dropdown
	 */
	dropdown.biasDropdown.button = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.button.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.button
	 * @description The locator for the button which opens the bias dropdown
	 */
	dropdown.biasDropdown.button.locator = dropdown.locator.element(by.css('#bias-dropdown-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.button.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.button
	 * @description Checks if the button to open the bias dropdown is visible
	 */
	dropdown.biasDropdown.button.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.button.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.button
	 * @description Clicks the button to open the bias dropdown
	 */
	dropdown.biasDropdown.button.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown
	 * @description The dropdown for selecting a revision bias
	 */
	dropdown.biasDropdown.dropdown = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.dropdown
	 * @description The locator for the bias dropdown
	 */
	dropdown.biasDropdown.dropdown.locator = dropdown.locator.element(by.css('#bias-dropdown-widget'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.dropdown
	 * @description Checks if the bias dropdown is open and visible
	 */
	dropdown.biasDropdown.dropdown.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown.open
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.dropdown
	 * @description Convinience method to open the bias dropdown
	 */
	dropdown.biasDropdown.dropdown.open = function () {
		return dropdown.biasDropdown.button.click();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown.configurationOrder
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.dropdown
	 * @description The order in which the revisions appear in the bias dropdown
	 */
	dropdown.biasDropdown.dropdown.configurationOrder = {
		release: 1,
		working: 2,
		changeOrder: 3,
		allChangeOrder: 4
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown.selectBias
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.dropdown
	 * @description Selects the specified revision from the open bias dropdown
	 */
	dropdown.biasDropdown.dropdown.selectBias = function (revision) {
		var link = this.locator.element(by.css('li:nth-child(' + this.configurationOrder[revision].toString() + ')'));
		browser.actions().mouseMove(link);
		link.element(by.css('a')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#biasDropdown.dropdown.waitForClose
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.biasDropdown.dropdown
	 * @description Waits for the bias dropdown to close after choosing a option, since it hangs around for a bit
	 */
	dropdown.biasDropdown.dropdown.waitForClose = function () {
		var internalList = this.locator.element(by.css('#bias-dropdown-widget ul'));
		browser.wait(
			function () {
				return internalList.isDisplayed().then(function (displayed) {
					return !displayed;
				});
			},
			3000,
			'Bias dropdown did not close quickly enough'
		);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#saveButton
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown
	 * @description The button to save the configuration
	 */
	dropdown.saveButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#saveButton.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.saveButton
	 * @description The locator for the save button
	 */
	dropdown.saveButton.locator = dropdown.locator.element(by.css('#configuration-save'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#saveButton.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.saveButton
	 * @description Checks if the save button is visible
	 */
	dropdown.saveButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#saveButton.click
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.saveButton
	 * @description Clicks the save button to save the configuration and close the dialog
	 */
	dropdown.saveButton.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#cancelButton
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown
	 * @description The button to close the dropdown without saving the changes
	 */
	dropdown.cancelButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.BomConfigurationDropdown#cancelButton.locator
	 * @propertyOf ViewTestsComponents.BomConfigurationDropdown.cancelButton
	 * @description The locator for the cancel button
	 */
	dropdown.cancelButton.locator = dropdown.locator.element(by.css('#configuration-cancel'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#cancelButton.isDisplayed
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.cancelButton
	 * @description Checks if the cancel button is visible
	 */
	dropdown.cancelButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BomConfigurationDropdown#cancelButton.click
	 * @methodOf ViewTestsComponents.BomConfigurationDropdown.cancelButton
	 * @description Clicks the cancel button
	 */
	dropdown.cancelButton.click = clickElement;
}

module.exports = BomConfigurationDropdown;
