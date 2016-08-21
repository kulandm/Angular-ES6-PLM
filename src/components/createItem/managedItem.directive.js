/**
 * @ngdoc directive
 * @name Directives.managedItem
 * @retrict E
 *
 * @description This directive is render fields related to the managed item in the context of in-contextual create.
 *
 * - managedItemForm <span class="label">Object</span> The object contain information of all the field to be rendered
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 * 	<doc:source>
 * 		<managed-item
 * 			managed-item-form="Object">
 * 		</managed-item>
 * 	</doc:source>
 * </doc:example>
 */
function ManagedItemDirective() {
	let directive = {
		restrict: 'E',
		replace: true,
		controller: 'ManagedItemController',
		controllerAs: 'managedItemCtrl',
		bindToController: true,
		templateUrl: 'build/components/createItem/managedItem.html',
		scope: {
			managedItemForm: '='
		}
	};

	return directive;
}

export default ManagedItemDirective;
