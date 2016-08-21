/**
 * @ngdoc object
 * @name ViewTestsComponents.BulkEdit
 *
 * @description This component corresponds to the Bulk Edit function.
 *
 * ##Dependencies
 *
 */
var ViewAffectedItemsPage = require('../pages/ViewAffectedItemsPage');
var affectedItemsPage = new ViewAffectedItemsPage();

function BulkEdit() {
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BulkEdit#getLifecycleContainer
	 * @propertyOf ViewTestsComponents.BulkEdit
	 * @description Container for lifecycle states
	 *
	 * @returns {Object} Returns container for lifecycle states
	 */
	this.getLifecycleContainer = function () {
		return affectedItemsPage.bulkEditModal()
			.element(by.css('.lifecycle-transitions-container ul'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BulkEdit#lifecycleCurrentStates
	 * @propertyOf ViewTestsComponents.BulkEdit
	 * @description Current States of the Elements which has the lifecycle options
	 *
	 * @returns {Object} Returns current states of the elements having the lifecycle options
	 */
	this.lifecycleCurrentStates = function () {
		return this.getLifecycleContainer().all(by.css('li label'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BulkEdit#selectLifecycleTransition
	 * @propertyOf ViewTestsComponents.BulkEdit
	 * @description Choose one lifecycle in lifecycle transitions
	 *
	 * @param {Number} rowIndex the index of the row, start from 1.
	 * @param {Number} optionIndex the index of the options, start from 1.
	 *
	 * @returns {Object} A promise that resolves with the option is clicked
	 */
	this.selectLifecycleTransition = function (rowIndex, optionIndex) {
		var lifecycleTransitionsContainer = affectedItemsPage.bulkEditModal().all(by.css('.lifecycle-transitions-container ul li')).get(rowIndex);
		lifecycleTransitionsContainer.element(by.css('input.search')).click();
		return lifecycleTransitionsContainer.all(by.css('.item')).get(optionIndex).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.BulkEdit#setEffectivityOptionYes
	 * @methodOf ViewTestsComponents.BulkEdit
	 * @description a method to set the effectivity option to yes.
	 *
	 * @returns {Object} A promise that resolves with the effectivity option yes is clicked
	 */
	this.setEffectivityOptionYes = function () {
		return affectedItemsPage.getEffectivityOptionRadioGroup().all(by.css('.md-container')).get(1).click();
	};
}

module.exports = new BulkEdit();
