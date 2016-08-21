'use strict';

/**
 * @ngdoc filter
 * @name Filters.truncateFieldValue
 * @description Truncates a field value's name in case it's too long, according to the supplied length
 * THIS FILE IS NOT BEING USED, AND CAN POTENTIALLY BE DELETED
 *
 * @param {String} 	value 			The value to check for length of sections to be filtered
 * @param {Integer} 	length 			The max allowed length
 * @param {Boolean} 	enabled 			An override, necessary when the user has clicked a link to view the entire string, therefore disabling the filter/check
 *
 * @returns {String} 				the truncated string
 *
 */
export default function (value, length, enabled) {
	// only runs the filter if user hasn't expanded to view the full string
	if (enabled) {
		if (angular.isDefined(length) && angular.isDefined(value) && value !== null) {
			return value.substring(0, length);
		}
	}
	return value;
};
