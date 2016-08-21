'use strict';

/**
 * @ngdoc filter
 * @name Filters.convertLineBreaks
 * @description Convert '\n' to a '<br>'
 * THIS FILE IS NOT BEING USED, AND CAN POTENTIALLY BE DELETED
 *
 * @param {String} html The string to search for \n
 *
 * @returns {String} The HTML with replaced line breaks
 *
 * @example
 * <doc:example>
 * 		<doc:source>
 *
 * 		</doc:source>
 * </doc:example>
 */
export default function (html, type) {
	if (angular.isDefined(html)) {
		if (type === 'PARAGRAPH') {
			return html.replace(/\n/g, '<br>');
		} else {
			return html;
		}
	} else {
		return null;
	}
};
