import WipFileBrowserController from './wipFileBrowser.controller.js';
import WipFileBrowserDirective from './wipFileBrowser.directive.js';
import BreadcrumbDirective from './breadcrumb/breadcrumb.directive.js';
import FileSizeFilter from './fileSizeFilter.js';
import WipFileBrowserModel from './wipFileBrowser.model.js';
import WipSearchService from './wipSearch.service.js';

angular.module(__moduleName, [
	'com/autodesk/wipFileBrowser.model.js',
	'com/autodesk/wipSearch.service.js'
])
.controller('WipFileBrowserController', WipFileBrowserController)
.directive('wipFileBrowser', WipFileBrowserDirective)
.directive('breadcrumb', BreadcrumbDirective)
.filter('fileSizeFilter', FileSizeFilter)
.constant('EnvironmentTypes', {
	STAGING: 'wipqa',
	PROD: 'wipprod'
})
.run([
	'WipFileBrowserModel',
	function () {}
]);
