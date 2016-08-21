'use strict';

/**
 * @ngdoc directive
 * @name Directives.clickOutsideElement
 * @restrict A
 *
 * @description This directive is to trigger event when clicking outside the specific element or fields
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *	<doc:source>
 *		<div click-outside-element ="expression" focus-property="object"></div>
 *	</doc:source>
 * </doc:example>
 */
/* global plm360 */
plm360.directive('clickOutsideElement', ['$rootScope', '$document', function ($rootScope, $document) {
	return {
		restrict: 'A',
		link: function link(scope, elem, attrs) {
			// watch for any changes to focus property. If an element gets the focus, then broadcast 'focus-acquired' event.
			// this way all other elements decorated with this directive knows it.
			if (attrs.focusProperty) {
				scope.$watch(attrs.focusProperty, function (newValue) {
					if (newValue === true) {
						$rootScope.$broadcast('focus-acquired', scope.$id);
					}
				});
			}

			scope.$on('focus-acquired', function (event, scopeId) {
				// if you are not the one with that has the focus then evaluate the 'clickOutsideElement' expression.
				if (scopeId !== scope.$id) {
					clickOutside();
				}
			});

			elem.bind('click', function (e) {
				// Note: This is the main reason, we needed to amend the logic to find click outside the element.
				e.stopPropagation();
			});

			/**
    * @ngdoc method
    * @name Directives.clickOutsideElement#clickOutside
    * @methodOf Directives.clickOutsideElement
    * @description apply given expression asynchronously.
    *
    */
			var clickOutside = function clickOutside() {
				scope.$applyAsync(attrs.clickOutsideElement);
			};

			$document.bind('click', clickOutside);

			scope.$on('$destroy', function () {
				$document.unbind('click', clickOutside);
			});
		}
	};
}]);
//# sourceMappingURL=ClickOutsideElementDirective.js.map
