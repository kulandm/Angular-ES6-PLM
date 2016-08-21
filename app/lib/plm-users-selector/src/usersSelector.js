import UsersRadioSelectorController from './usersRadioSelector.controller.js';
import UsersCheckboxSelectorController from './usersCheckboxSelector.controller.js';
import usersRadioSelector from './usersRadioSelector.directive.js';
import usersCheckboxSelector from './usersCheckboxSelector.directive.js';

angular.module(__moduleName, [])
	.controller('UsersRadioSelectorController', UsersRadioSelectorController)
	.controller('UsersCheckboxSelectorController', UsersCheckboxSelectorController)
	.directive('usersRadioSelector', usersRadioSelector)
	.directive('usersCheckboxSelector', usersCheckboxSelector);
