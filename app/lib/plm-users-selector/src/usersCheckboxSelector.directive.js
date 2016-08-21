'use strict';

/**
 * @ngdoc directive
 * @name Directives.usersCheckboxSelector
 * @restrict E
 *
 * @description This directive is a Checkbox button component that list available users and allow selection of one user.
 * - itemsList <span class="label">Object</span> An Object that contains the Users object
 * - selectedItems <span class="label">Object</span> An Object that contains the selected Users object
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<users-selector
 * 			items-list="Object"
 * 			selected-items="Object"
 * 		></users-selector>
 *   </doc:source>
 * </doc:example>
 */
function usersCheckboxSelector() {
	return {
		restrict: 'E',
		replace: true,
		controller: 'UsersCheckboxSelectorController',
		controllerAs: 'usersCheckboxSelectorCtrl',
		templateUrl: 'usersCheckboxSelector.html',
		bindToController: true,
		scope: {
			itemsList: '=',
			selectedItems: '='
		}
	};
}

usersCheckboxSelector.$inject = [];

export default usersCheckboxSelector;
