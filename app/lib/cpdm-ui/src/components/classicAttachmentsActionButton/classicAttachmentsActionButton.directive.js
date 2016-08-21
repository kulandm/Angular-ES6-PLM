/**
 * @ngdoc directive
 * @name Directives.ClassicAttachmentsActionButton
 * @restrict E
 *
 * @description This directive is a wrapper for action buttons for Attachments.
 * It accepts the following attributes:
 * - type: <String> A string that accepts the following values:<br>
 * 'upload': Indicates that an upload attachment action is required.<br>
 * 'download': Indicates that a download attachment action is required.<br>
 * 'delete': Indicates that an attachment is to be deleted.<br>
 * 'checkout': Indicates that an attachment is to be checked out.<br>
 * 'moreActions': Indicates that the dropdown should be triggered to display
 * more actions for the user to select and perform.
 * - permitted: <Boolean> True, if current user has the permissions
 * for this button component.
 * - workspaceId: <String> The id of the workspace.
 * - itemId: <String> The id of the item.
 * - itemUrn: <String> The urn of the item.
 * - fileInfo: <Object> Contains file id, name, status, title and version.
 * - actionStatus: <Function> The function that can be called on parent scope
 * with following parameters:<br>
 * 'type': <Number> The type of the action status. Its value should only be:
 * 1 for success, 2 for Error, 3 for Warning, and 4 for Info.<br>
 * 'message': <String> The status message.<br>
 * 'refreshData': <Boolean> True, to trigger refresh of attachment's data.
 *
 * (This directive is used in CommandBar of ViewAttachments in PLMSinglePage.)
 */
class ClassicAttachmentsActionButtonDirective {
	/*
	 * @ngdoc method
	 * @name Directives.ClassicAttachmentsActionButton#constructor
	 * @methodOf Directives.ClassicAttachmentsActionButton
	 * @description The class constructor.
	 */
	constructor() {
		this.restrict = 'E';
		this.replace = true;
		this.bindToController = true;
		this.controller = 'ClassicAttachmentsActionButtonController';
		this.controllerAs = 'classicAttachmentsActionButtonCtrl';
		this.templateUrl = 'components/classicAttachmentsActionButton/classicAttachmentsActionButton.html';
		this.scope = {
			type: '@',
			permitted: '=',
			workspaceId: '=',
			itemId: '=',
			itemUrn: '=',
			fileInfo: '=',
			actionStatus: '&'
		};
	}

	static directiveFactory() {
		ClassicAttachmentsActionButtonDirective.instance = new ClassicAttachmentsActionButtonDirective();
		return ClassicAttachmentsActionButtonDirective.instance;
	}
}

export default ClassicAttachmentsActionButtonDirective;
