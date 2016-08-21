'use strict';

/**
 * @ngdoc filter
 * @name Filters.selectedOption
 * @description Return all available options
 *
 * @param {Array} optionsArr The options
 * @param {integer} selectedOptionId The selected option
 *
 * @returns {string} The display text of the selected option
 *
 */
export default function (optionsArr, selectedOptionId) {
	try {
		var selectedItem = _.find(optionsArr, function (option) {
			return option.id === selectedOptionId; // returns the item that has the same id as the selected one
		});
		return selectedItem.label;
	} catch (e) {}
};
