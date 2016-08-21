'use strict';

/**
 * @ngdoc directive
 * @name Directives.usersRadioSelector
 * @restrict E
 *
 * @description This directive is a radio button component that list available users and allow selection of one user.
 * - itemsList <span class="label">Object</span> An Object that contains the Users object
 * - selectedItem <span class="label">Object</span> Only one item can be selected
 * - selectedFirst <span class="label">Boolean</span> if True, moves 'selected' to top of the items array
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<users-selector
 * 			items-list="Object"
 * 			selected-item="Object"
.* 			selected-first="String"
 * 		></users-selector>
 *   </doc:source>
 * </doc:example>
 */
function usersRadioSelector() {
	return {
		restrict: 'E',
		replace: true,
		controller: 'UsersRadioSelectorController',
		controllerAs: 'usersRadioSelectorCtrl',
		templateUrl: 'usersRadioSelector.html',
		bindToController: true,
		scope: {
			itemsList: '=',
			selectedItem: '=',
			selectedFirst: '@'
		}
	};
}

usersRadioSelector.$inject = [];

export default usersRadioSelector;
