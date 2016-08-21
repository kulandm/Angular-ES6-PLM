'use strict';

/**
 * @ngdoc object
 * @name Controllers.ConfirmationDialogController
 *
 * @description This controller is attached to ConfirmationDialogController
 *
 * ##Dependencies
 *
 */

class ConfirmationDialogController {
	/*
	 * @ngdoc method
	 * @name Controllers.ConfirmationDialogController#constructor
	 * @methodOf Controllers.ConfirmationDialogController
	 * @description The class constructor.
	 */
	constructor($scope, $mdDialog) {
		this.$scope = $scope;
		this.$mdDialog = $mdDialog;

		/**
		 * @ngdoc property
		 * @name Controllers.ConfirmationDialogController#that
		 * @propertyOf Controllers.ConfirmationDialogController
		 * @description `private` Reference to this controller
		 *
		 */
		var that = this;
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.ConfirmationDialogController#confirm
	 * @methodOf Controllers.ConfirmationDialogController
	 * @description Hides dialog, and triggers a confirmation resolve, handled by the parent controller
	 *
	 */
	confirm() {
		this.$mdDialog.hide();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ConfirmationDialogController#confirm
	 * @methodOf Controllers.ConfirmationDialogController
	 * @description Hides dialog, and triggers a cancellation resolve, handled by the parent controller
	 *
	 */
	cancel() {
		this.$mdDialog.cancel();
	}
}

export default ConfirmationDialogController;
