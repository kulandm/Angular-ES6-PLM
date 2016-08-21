import FusionHeaderController from 'com/autodesk/components/fusionHeader/fusionHeader.controller.js';
import HelpMenuController from 'com/autodesk/components/fusionHeader/helpMenu.controller.js';
import UserDropdownController from 'com/autodesk/components/fusionHeader/userDropdown.controller.js';

/**
 * @ngdoc overview
 * @name Components.fusionHeader
 *
 * @description Temporary component wrapper for fusion header
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<fusion-header />
 *   </doc:source>
 * </doc:example>
 */
angular.module(__moduleName, [])
.component('fusionHeader', {
    templateUrl: 'build/components/fusionHeader/fusionHeader.html',
    controller: FusionHeaderController,
    controllerAs: 'fusionHeaderCtrl'
})
.component('userDropdown', {
    templateUrl: 'build/components/fusionHeader/userDropdown.html',
    controller: UserDropdownController,
    controllerAs: 'userDropdownCtrl'
})
.controller('HelpMenuController', HelpMenuController);
