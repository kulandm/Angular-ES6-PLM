'use strict';

/**
 * @ngdoc object
 * @name Filters.lineBreakFilter
 *
 * @description This Filter replaces '\n' with <br> tag
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *     <div renderedHTML | lineBreakFilter />
 *   </doc:source>
 * </doc:example>
 */

export default (input) => {
	return input ? input.replace(/\r?\n/g, '<br>') : '';
};
