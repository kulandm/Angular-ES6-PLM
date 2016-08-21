'use strict';

/**
 * @ngdoc filter
 * @name Filters.availableOptions
 * @description Return all available options
 *
 * @param {Array} optionsArr The options
 * @param {integer} selectedOptionId The selected option
 *
 * @returns {Array} The available options
 *
 */
export default function (optionsArr, selectedOptionId) {
	var parsedItems = [];
	parsedItems = _.filter(optionsArr, function (option) {
		return (option.id !== selectedOptionId); // returns all the options, minus the selected one
	});
	return parsedItems;
};
