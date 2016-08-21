'use strict';

/**
 * @ngdoc directive
 * @name Directives.plmHeader
 * @restrict E
 *
 * @description The application's header
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<app-header />
 *   </doc:source>
 * </doc:example>
 */

angular.module('plm360.plmHeader').directive('plmHeader', [
	function () {
		return {
			restrict: 'E',
			replace: true,
			controller: 'PLMHeaderController',
			scope: {},
			templateUrl: 'components/plmHeader/plmHeader.html'
		};
	}
]);
