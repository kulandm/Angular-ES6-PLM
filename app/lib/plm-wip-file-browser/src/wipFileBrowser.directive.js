'use strict';

/**
 * @ngdoc directive
 * @name Directives.wipFileBrowser
 * @restrict E
 *
 * @description This directive is a file browser to list WIP folders and files
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<wip-file-browser></wip-file-browser>
 *   </doc:source>
 * </doc:example>
 */
function WipFileBrowser($timeout) {
	return {
		restrict: 'E',
		replace: true,
		controller: 'WipFileBrowserController',
		controllerAs: 'wipFileBrowserCtrl',
		templateUrl: 'wipFileBrowser.html',
		bindToController: true,
		scope: {
			selectedFiles: '='
		},
		link: (scope, element, attrs) => {
			$timeout(() => {
				let containerHeight = document.querySelector('md-dialog-content').offsetHeight;
				let breadcrumbHeight = element[0].querySelector('.wip-breadcrumb').offsetHeight;
				let toolbarHeight = element[0].querySelector('.filebrowser-toolbar').offsetHeight;
				angular.element(document.querySelector('.filebrowser-container')).attr('style', 'height:' + (containerHeight - breadcrumbHeight - toolbarHeight) + 'px');
			}, 0);
		}
	};
}

WipFileBrowser.$inject = ['$timeout'];

export default WipFileBrowser;
