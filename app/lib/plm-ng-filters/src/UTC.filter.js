'use strict';

/**
 * @ngdoc filter
 * @name Filters.UTC
 * @description Return UTC value of given date
 *
 * @param {Date} val The date object to be converted
 *
 * @returns {Date} The date object in UTC value
 *
 * @example
 * <doc:example>
 * 		<doc:source>
 *
 * 		</doc:source>
 * </doc:example>
 */
export default function (val) {
	if (!angular.isDefined(val)) {
		return '';
	}
	var date = new Date(val);

	// catch IE/Safari-specific date conversion issues
	if (isNaN(date.getTime())) {
		var splitDate = val.split(/\D/);
		date = new Date(Date.UTC(splitDate[0], --splitDate[1] || '',
			splitDate[2] || '', splitDate[3] || '', splitDate[4] || '',
			splitDate[5] || '', splitDate[6] || ''));
	}

	return date.toISOString();
};
