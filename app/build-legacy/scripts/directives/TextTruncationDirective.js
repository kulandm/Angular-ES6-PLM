'use strict';

/**
 * @ngdoc directive
 * @name Directives.textTruncation
 * @restrict A
 *
 * @description This directive handles truncating of text and displaying of truncated text
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *		<div text-truncation></div>
 *   </doc:source>
 * </doc:example>
 */
/* global plm360 */
plm360.directive('textTruncation', ['$compile', '$rootScope', '$location', '$route', '$timeout', '$q', function ($compile, $rootScope, $location, $route, $timeout, $q) {
	return {
		restrict: 'A',
		transclude: true,
		scope: {},
		templateUrl: 'partials/textTruncation.html',
		link: function link(scope, element, attrs) {
			angular.element(element).addClass('text-truncation');

			/**
   * @ngdoc property
   * @name Directives.textTruncation#displayFullText
   * @propertyOf Directives.textTruncation
   * @description Flag for whether full text is displayed
   */
			scope.displayFullText = false;

			/**
   * @ngdoc property
   * @name Directives.textTruncation#pendingDisplayFullText
   * @propertyOf Directives.textTruncation
   * @description Flag for whether full text is pending to change display status
   */
			scope.pendingDisplayFullText = false;

			/**
   * @ngdoc method
   * @name Directives.textTruncation#controlFullTextDisplay
   * @methodOf Directives.textTruncation
   * @description Controls showing/hiding of the full text
   *
   * @param {Object} value FILL IN
   * @param {Object} delay FILL IN
   */
			scope.controlFullTextDisplay = function (value, delay) {
				scope.pendingDisplayFullText = value;
				$timeout(function () {
					if (scope.pendingDisplayFullText !== scope.displayFullText) {
						// scope.displayFullText = value;
					}
				}, delay);
			};
		}
	};
}]);
//# sourceMappingURL=TextTruncationDirective.js.map
