'use strict';

/**
 * @ngdoc directive
 * @name Directives.fileread
 * @restrict A
 *
 * @description This directive can read file......(?)
 *
 * ##Dependencies
 * - Requires {@link Services/Services.AuthenticationService}
 * - Requires {@link Services/Services.TokenService}
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *       <div fileread="myfilename"/>
 *   </doc:source>
 * </doc:example>
 */
/* global plm360 */
plm360.directive('fileread', ['$compile', '_', function () {
	return {
		scope: {
			fileread: '='
		},
		link: function link(scope, element, attributes) {
			element.bind('change', function (changeEvent) {
				scope.$apply(function () {
					scope.fileread = changeEvent.target.files[0];
					// or all selected files:
					// scope.fileread = changeEvent.target.files;
				});
			});
		}
	};
}]);
//# sourceMappingURL=FileReadDirective.js.map
