import DropdownWidgetController from './dropdown.controller.js';
import DropdownDirective from './dropdown.directive.js';

angular.module(__moduleName, [

])
.controller('DropdownWidgetController', DropdownWidgetController)
.directive('dropdownWidget', DropdownDirective.directiveFactory);
