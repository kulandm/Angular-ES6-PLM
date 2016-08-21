'use strict';

/**
 * @ngdoc directive
 * @name Directives.adjustMaxHeight
 * @restrict A
 *
 * @description The main purpose of this directive is to have a single place that contains logic to adjust max height of the element on
 * the basis of another element. For example, this directive can be used with Main Menu directive to adjust and constraint the max height of
 * the context menu according to the document height. This directive does not have isolated scope as it would prevent its usage on the element that
 * contain another isolated directive. It will not create a child scope instead relay on the current scope and expects few key properties to be there
 * to make things work. Please see the documentation of properties for details.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *        <div adjust-max-height="" update="doScroll" context="window"/>
 *   </doc:source>
 * </doc:example>
 */
/* global plm360 */
plm360.directive('adjustMaxHeight', [
	'$window',
	'$position',
	function ($window, $position) {

		/**
		 * @ngdoc method
		 * @name Directives.adjustMaxHeight#reCalculateMaxHeight
		 * @methodOf Directives.adjustMaxHeight
		 * @description Re calculate max height of the given element.
		 *
		 * @param {Object} elementToAdjust The element for which the max-height needs to be calculated.
		 * @param {Number} height The height to be used for calculation.
		 * @param {Number} percentage The desired percentage to which the element's max-height should be confined. Can have value from 0.0 - 1.0.
		 * @param {Object} parentTopEl The parent element of elementToAdjust. Used to calculate the top position.
		 */
		function reCalculateMaxHeight(elementToAdjust, height, percentage, parentTopEl) {
			var newHeight = height * percentage;
			var positionTop;
			if (angular.isDefined(parentTopEl)) {
				positionTop = $position.offset(parentTopEl).top;
			} else {
				positionTop = $position.offset(elementToAdjust).top;
			}
			var maxMenuHeight;

			// Max height should also take into consideration the position of element.
			if (newHeight > positionTop) {
				maxMenuHeight = newHeight - positionTop;
			} else {
				maxMenuHeight = 0;
			}

			elementToAdjust[0].style.maxHeight = Math.ceil(maxMenuHeight) + 'px';
			elementToAdjust[0].style.overflow = 'auto';
		}

		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element, attrs) {

				/**
				 * @ngdoc property
				 * @name Directives.adjustMaxHeight#heightContextEl
				 * @propertyOf Directives.adjustMaxHeight
				 * @description An optional property of type 'Angular.Element' that if given will be used as a main context for max height calculation.
				 * Note: If this property is not available then by default window wrapper object will be used.
				 */

				/**
				 * @ngdoc property
				 * @name Directives.adjustMaxHeight#percentage
				 * @propertyOf Directives.adjustMaxHeight
				 * @description An optional property of type 'Number' that if given will be used in max height calculate to confined the elements max-height based on the percentage.
				 * Note: If this property is not available then by default 0.9 (or 90% of the context element height) will be used.
				 */

				/**
				 * @ngdoc method
				 * @name Directives.adjustMaxHeight#onMaxHeightAdjustment
				 * @methodOf Directives.adjustMaxHeight
				 * @description An optional method that can be defined on scope.<br>
				 * This method will be called every time the recalculation is performed.
				 */

				var elementToWatch = angular.isDefined(scope.heightContextEl) ? scope.heightContextEl : angular.element($window);
				var percentage = scope.percentage || 0.90;

				/**
				 * Trigger re-calculation on resize event.
				 */
				elementToWatch.bind('resize', function () {
					reCalculateMaxHeight(element, getHeight(), percentage, scope.parentEl);
					if (scope.onMaxHeightAdjustment) {
						scope.onMaxHeightAdjustment(element);
					}
				});

				/**
				 * Trigger re-calculation on demand by updating the 'triggerMaxHeightAdjustment' attribute.
				 */
				attrs.$observe('triggerMaxHeightAdjustment', function () {
					reCalculateMaxHeight(element, getHeight(), percentage, scope.parentEl);
					if (scope.onMaxHeightAdjustment) {
						scope.onMaxHeightAdjustment(element);
					}
				});

				/**
				 * @ngdoc method
				 * @name Directives.adjustMaxHeight#getHeight
				 * @methodOf Directives.adjustMaxHeight
				 * @description `private` Returns the height of the context element.
				 *
				 * @returns {Number} Height of the context element.
				 */
				function getHeight() {
					var docHeight = angular.isDefined(document.height) ?
						document.height : document.body.offsetHeight;
					return angular.isDefined(scope.heightContextEl) ?
						scope.heightContextEl.prop('offsetHeight') : docHeight;
				}

				scope.$on('$destroy', function () {
					elementToWatch.unbind('resize');
				});
			}
		};
	}
]);
