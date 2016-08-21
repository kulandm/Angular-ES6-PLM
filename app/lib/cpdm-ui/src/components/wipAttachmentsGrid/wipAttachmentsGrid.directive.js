/**
 * @ngdoc directive
 * @name Directives.wipAttachmentsGrid
 * @restrict E
 *
 * @description Directive definition for cpdm WIP attachments grid.
 *
 * It accepts the following attributes:
 * ####-workspaceId: <String> the id of the workspace
 * ####-itemId: <String> the id of the item
 * ####-date-format: <Object> the date format to be used by the grid data
 * ####-selected-items: <Set> the set of selected items of the grid.
 * ####-table-data: <Array> the list of items of the grid.
 * ####-is-item-locked: <Boolean> true, if the item is in locked state.
 * ####-add-permission: <Number> shows the user's permission to add.
 * ####-trigger-add: <Function> the function that open the file browser and trigger add.
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *      <wip-attachments-grid
 *          workspace-id="String"
 *          item-id="String"
 *          date-format="Object"
 *          selected-items="Set"
 *          table-data="Array"
 *          is-item-loaded="Boolean"
 *          is-item-locked="Boolean"
 *          add-permission="Number"
 *          trigger-add="Function">
 *      </wip-attachments-grid>
 *   </doc:source>
 * </doc:example>
 */
function wipAttachmentsGridDirective() {
	return {
		restrict: 'E',
		replace: true,
		controller: 'WipAttachmentsGridController',
		controllerAs: 'wipAttachmentsGridCtrl',
		bindToController: true,
		templateUrl: 'components/wipAttachmentsGrid/wipAttachmentsGrid.html',
		scope: {
			workspaceId: '@',
			itemId: '@',
			dateFormat: '=',
			selectedItems: '=',
			tableData: '=attachmentsData',
			isItemLocked: '=',
			isItemLoaded: '=',
			addPermission: '=',
			triggerAdd: '&'
		}
	};
}

export default wipAttachmentsGridDirective;
