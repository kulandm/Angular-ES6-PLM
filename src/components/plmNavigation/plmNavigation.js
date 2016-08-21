import PLMNavigationController from './plmNavigation.controller.js';
import VignettesModalController from './vignettesModal.controller.js';
import PLMNavigationDirective from './plmNavigation.directive.js';

angular.module(__moduleName, [
	// 'src/_base/UnderscoreService.js',
	// 'src/services/EventService.js'
])
.controller('PLMNavigationController', PLMNavigationController)
.controller('VignettesModalController', VignettesModalController)
.directive('plmNavigation', PLMNavigationDirective);
