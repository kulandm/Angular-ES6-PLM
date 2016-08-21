'use strict';

/**
 * @ngdoc filter
 * @name fileSizeFilter
 * @description It should return a file size that should be a readable size and unit
 *
 * @param {size} Numbers to bytes i.e; size which is passed to the filter
 * @param {precision} Number of deciaml places to which the precision should be
 *
 * @returns {string} The size of the file in either 'bytes', 'kB', 'MB', 'GB', 'TB'
 */
function fileSizeFilter() {
	return function (size, precision) {
		if (isNaN(size)) {
			return '';
		}

		if (isNaN(parseFloat(size)) || !isFinite(size) ||
			(size === 0) || (size < 1024)) {
			return '-';
		}

		// Check if precision is undefined, null, 0, NAN, empty string, negative
		if (!precision || precision < 0) {
			precision = 1;
		}

		var units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
		var number = Math.floor(Math.log(size) / Math.log(1024));

		return (size / Math.pow(1024, Math.floor(number)))
			.toFixed(precision) + ' ' + units[number];
	};
}