import ItemViewerController from './itemViewer.controller.js';
import ItemViewerDirective from './itemViewer.directive.js';

angular.module(__moduleName, [
	// 'com/autodesk/_base/UnderscoreService.js',
	// 'com/autodesk/services/EventService.js'
])
.controller('ItemViewerController', ItemViewerController)
.directive('itemViewer', ItemViewerDirective);