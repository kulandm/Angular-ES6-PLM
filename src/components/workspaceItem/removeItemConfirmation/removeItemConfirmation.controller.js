'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.RemoveItemConfirmationController
 *
 * @description This controller responsible for custom remove confirmation dialog
 *
 * ##Dependencies
 *
 */
class RemoveItemConfirmationController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.RemoveItemConfirmationController#constructor
	 * @methodOf Controllers.workspaceItem.RemoveItemConfirmationController
	 * @description The class constructor.
	 */
	constructor($scope, $mdDialog, itemCount) {
		this.itemCount = itemCount;
		this.$mdDialog = $mdDialog;
		this.$scope = $scope;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.RemoveItemConfirmationController#confirm
	 * @methodOf Controllers.workspaceItem.RemoveItemConfirmationController
	 * @description confirmation of removal
	 *
	 */
	confirm() {
		this.$mdDialog.hide();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.RemoveItemConfirmationController#confirm
	 * @methodOf Controllers.workspaceItem.RemoveItemConfirmationController
	 * @description cancel the process of removal.
	 *
	 */
	cancel() {
		this.$mdDialog.cancel();
	}
}

export default RemoveItemConfirmationController;
