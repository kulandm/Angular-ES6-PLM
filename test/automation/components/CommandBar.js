var Q = require('q');
/**
 * @ngdoc object
 * @name ViewTestsComponents.CommandBar
 *
 * @description This component corresponds to the command bar.
 *
 * ##Dependencies
 */
function CommandBar() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CommandBar#commandBar
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description `private` WebElement for command bar.
	 */
	var commandBar = element(by.css('#command-bar'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CommandBar#commandBarControlButtons
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description `private` WebElement for control buttons
	 * (the ones standard across all tabs).
	 */
	var commandBarControlButtons = element.all(by
		.css('#command-bar #control-data .md-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CommandBar#commandBarTranscludedButtonsSelector
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description `private` transcluded buttons selector
	 */
	var commandBarTranscludedButtonsSelector = by.css('#command-bar #transcluded-buttons .md-button');

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CommandBar#commandBarTranscludedButtons
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description `private` WebElement for transcluded buttons
	 * (the ones inserted by each view).
	 */
	var commandBarTranscludedButtons = element.all(by
		.css('#command-bar #transcluded-buttons .md-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CommandBar#commandBarViewButtons
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description `private` WebElement for the control view button.
	 */
	var commandBarViewButtons = element.all(by
		.css('#command-bar #control-view .md-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getCommandBar
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Gets the command bar.
	 *
	 * @returns {Object}  A promise that resolves when the Command bar is found.
	 */
	this.getCommandBar = function () {
		return commandBar;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getCommandBarText
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Gets the command bar text indicating number of elements selected.
	 *
	 * @returns {String}  Returns the Text displayed in the command bar.
	 */
	this.getCommandBarText = function () {
		return element(by.css('.command-bar-text')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#isCommandBarDisplayed
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Gets whether the command bar is displayed.
	 *
	 * @returns {Object} A promise that resolves when the element is found
	 * and its display value is retrieved.
	 */
	this.isCommandBarDisplayed = function () {
		return commandBar.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#isTranscludedBtnsDisplayed
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Gets whether all the transcluded buttons are displayed.
	 *
	 * @param {Number} count The total number of buttons.
	 *
	 * @returns {Boolean} True, if all elements are displayed.
	 */
	this.isTranscludedBtnsDisplayed = function (count) {
		var promises = [];
		for (var i = 0; i < count; i++) {
			promises.push(element.all(commandBarTranscludedButtonsSelector).get(i).isDisplayed());
		}
		return Q.all(promises);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#isUserProfileSummaryDisplayed
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Gets whether the user profile summary is displayed.
	 *
	 * @returns {Object} A promise that resolves when the element is found
	 * and its display value is retrieved.
	 */
	this.isUserProfileSummaryDisplayed = function () {
		return element(by.css('.user-profile-summary')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getControlButton
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns one control button.
	 *
	 * @param {Number} index The index of the button.
	 *
	 * @returns {Object} The list of control buttons
	 */
	this.getControlButton = function (index) {
		return commandBarControlButtons.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getTranscludedButton
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns one transcluded button.
	 *
	 * @param {Number} index The index of the button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getTranscludedButton = function (index) {
		return element.all(commandBarTranscludedButtonsSelector).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getTranscludedButtonByLabel
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns one transcluded button.
	 *
	 * @param {String} label The label of the button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getTranscludedButtonByLabel = function (label) {
		return element(by.css('#command-bar #transcluded-buttons .md-button[aria-label="' + label + '"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getTranscludedButtonCount
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns the count promise of number of transcluded buttons.
	 *
	 * @returns {Object} A promise that resolves with the count of transcluded buttons.
	 */
	this.getTranscludedButtonCount = function () {
		return element.all(commandBarTranscludedButtonsSelector).count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getViewButton
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns one view button.
	 *
	 * @param {Number} index The index of the button.
	 *
	 * @returns {Object} The list of control buttons
	 */
	this.getViewButton = function (index) {
		return commandBarViewButtons.get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#isContextualCreateButtonDisplayed
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Gets whether the contextual create button is displayed.
	 *
	 * @returns {Object} A promise that resolves with the display state of the element.
	 */
	this.isContextualCreateButtonDisplayed = function () {
		return element(by.css('.contextual-create-btn')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getAddButton
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns the add button
	 *
	 * @returns {Object} The Add button
	 */
	this.getAddButton = function () {
		return element(by.css('.md-button[aria-label="Add"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CommandBar#getRemoveButton
	 * @propertyOf ViewTestsComponents.CommandBar
	 * @description Returns the remove button
	 *
	 * @returns {Object} The Remove button
	 */
	this.getRemoveButton = function () {
		return element(by.css('.md-button[aria-label="Remove"]'));
	};
}

module.exports = new CommandBar();
