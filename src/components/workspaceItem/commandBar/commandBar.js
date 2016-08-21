import CommandBarController from './commandBar.controller.js';
import CommandBarDirective from './commandBar.directive.js';

angular.module(__moduleName, [
	// 'src/_base/UnderscoreService.js',
	// 'src/services/EventService.js'
])
.controller('CommandBarController', CommandBarController)
.directive('commandBar', CommandBarDirective);
