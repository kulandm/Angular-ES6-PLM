'use strict';

/**
 * @ngdoc filter
 * @name Filters.listBySectionFilter
 * @description Filters the list of fields that belong to each sector
 *
 * @param {Array} sectionList list of sections to be filtered
 * @param {integer} sectionId id on which the filtering is performed. Note: passing -1 returns the unfiltered list.
 *
 * @returns {Array} The filtered sections
 *
 */
export default function (sectionList, sectionId) {
	var parsedItems = {};
	parsedItems = _.filter(sectionList, function (section) {
		return ((sectionId === -1) ? true : section.id === sectionId); // returns all the options, minus the selected one
	});
	return parsedItems;
};
