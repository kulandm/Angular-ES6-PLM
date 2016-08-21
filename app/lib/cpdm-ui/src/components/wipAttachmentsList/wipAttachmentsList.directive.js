/**
 * @ngdoc directive
 * @name Directives.wipAttachmentsList
 * @restrict E
 *
 * @description Directive definition for cpdm WIP attachments list.
 *
 * It accepts the following attributes:
 * ####-workspaceId: <String> the id of the workspace
 * ####-itemId: <String> the id of the item
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *      <wip-attachments-list
 *          workspace-id="String"
 *          item-id="String">
 *      </wip-attachments-list>
 *   </doc:source>
 * </doc:example>
 */
function wipAttachmentsListDirective() {
	return {
		restrict: 'E',
		replace: true,
		controller: 'WipAttachmentsListController',
		controllerAs: 'wipAttachmentsListCtrl',
		bindToController: true,
		templateUrl: 'components/wipAttachmentsList/wipAttachmentsList.html',
		scope: {
			workspaceId: '=',
			itemId: '='
		}
	};
}

export default wipAttachmentsListDirective;
