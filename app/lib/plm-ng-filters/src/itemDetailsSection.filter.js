'use strict';

/**
 * @ngdoc filter
 * @name Filters.itemDetailsSectionFilter
 * @description Filters the fields by the section they belong to
 *
 * @param {Array} items The full list of fields for this item
 * @param {Array} section The IDs of the fields that belong to the section
 *
 * @returns {Array} The new, filtered array with the fields that belong to the supplied section
 *
 */
export default function (items, section) {
	var parsedItems = {};
	var itemsArray = [];

	try {
		_.each(items, function (value, i) {
			_.each(section, function (val, key) {
				if (value.fieldType === section[key].toString()) {
					itemsArray.push(value);
				}
			});
		});
	} catch (e) {
		console.log(e);
	}
	return itemsArray;
};
