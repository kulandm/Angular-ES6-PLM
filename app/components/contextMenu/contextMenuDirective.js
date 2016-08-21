'use strict';

/**
 * @ngdoc directive
 * @name Directives.breadcrumb
 * @restrict E
 *
 * @description This directive is the PLM360 breadcrumb
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<div right-click="func" data="{}"/>
 *   </doc:source>
 * </doc:example>
 */
 angular.module('plm360.contextMenu', []).directive('rightClick', [
	'$parse',
	function ($parse) {
		return {
			restrict: 'A',
			scope: {
				data: '=',
				rightClick: '&'
			},
			compile: function (cElement, cAttrs) {
				return {
					post: function (scope, element, attrs) {
						var fn = scope.rightClick();
						element.bind('contextmenu', function () {
							var event = arguments[0];
							event.preventDefault();
							// fn(scope, {
							// 	data: scope.data,
							// 	$event: event
							// });
							fn(event, scope.data);
						});
					}
				};
			}
		};
	}
]);
