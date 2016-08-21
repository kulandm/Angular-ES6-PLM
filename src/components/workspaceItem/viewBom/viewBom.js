import ViewBomController from './viewBom.controller.js';
import BomConfigurationDropdownController from './bomConfigurationDropdown.controller.js';
import BomConfigurationDropdownDirective from './bomConfigurationDropdown.directive.js';
import BomMessageService from './BomMessageService.js';
import BomItemNumberDirecTive from './bomItemNumber.directive.js';
import BomDataControllerFactory from 'com/autodesk/components/workspaceItem/viewBom/bomDataController.js';
angular.module(__moduleName, [
])
.controller('ViewBomController', ViewBomController)
.controller('BomConfigurationDropdownController', BomConfigurationDropdownController)
.directive('bomConfigurationDropdown', BomConfigurationDropdownDirective)
.directive('bomItemNumber', BomItemNumberDirecTive)
.factory('BomDataController', BomDataControllerFactory)
.service('BomMessageService', BomMessageService);
