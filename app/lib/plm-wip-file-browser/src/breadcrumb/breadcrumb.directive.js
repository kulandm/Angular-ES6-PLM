'use strict';

/**
 * @ngdoc directive
 * @name Directives.breadcrumb
 * @restrict E
 *
 * @description This directive is a breadcrumb to list browsed folders
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<breadcrumb data=[Array]></breadcrumb>
 *   </doc:source>
 * </doc:example>
 */
function Breadcrumb() {
	return {
		restrict: 'E',
		templateUrl: 'breadcrumb/breadcrumb.html',
		scope: {
			breadcrumbs: '=data',
			browseFolder: '&',
			cancelSearch: '&'
		},
		controller: ['$scope', function($scope) {
			$scope.updateBreadcrumb = function(folderObj) {

				$scope.cancelSearch();
				// Update the Folder/File list
				$scope.browseFolder(folderObj);

				// Update Breadcrumb
				if (folderObj) {
					let objIndex = $scope.breadcrumbs.indexOf(folderObj.folderObj);
					$scope.breadcrumbs.splice(objIndex + 1, $scope.breadcrumbs.length - (objIndex + 1));
				} else {
					$scope.breadcrumbs = [];
				}
			}
		}]
	};
}

Breadcrumb.$inject = [];

export default Breadcrumb;