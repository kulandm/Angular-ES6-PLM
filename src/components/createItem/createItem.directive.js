'use strict';

/**
 * @ngdoc directive
 * @name Directives.createItem
 * @retrict E
 *
 * @description This directive is used to create a workspace item.
 * - formFields <span class="label">Object</span> The fields displayed on the dialog
 * - filter <span class="label">Object</span> Function to filter the type of fields
 * - unsupportedFields <span class="label">Object</span> TO BE REMOVED
 * - selectedWorkspace <span class="label">Object</span> The current workspace context
 * - workspacesList <span class="label">Array</span> List of workspaces for which the create item will be allowed
 * - createType <span class="label">String</span> The type of create
 * - waiting <span class="label">Boolean</span> If the data is in the process of being POSTed to the backend
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 * 	<doc:source>
 * 		<create-item
 * 			form-fields="Object"
 * 			filter="Object"
 * 			unsupported-fields="Object"
 * 			selected-workspace="Object"
 * 			workspacesList="Array"
 * 			create-type="String"
 * 			waiting="Boolean">
 * 		</create-item>
 * 	</doc:source>
 * </doc:example>
 */
function CreateItemDirective() {
	let directive = {
		restrict: 'E',
		replace: true,
		controller: 'CreateItemController',
		controllerAs: 'createItemCtrl',
		templateUrl: 'build/components/createItem/createItem.html',
		scope: {
			formFields: '=',
			filter: '=',
			unsupportedFields: '=',
			selectedWorkspace: '=',
			workspacesList: '=',
			createType: '=',
			waiting: '=',
			workspaceUrn: '=',
			classificationId: '='
		}
	};

	return directive;
}

export default CreateItemDirective;
