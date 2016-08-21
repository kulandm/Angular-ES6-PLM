'use strict';

/**
 * @ngdoc object
 * @name Controllers.WipAttachmentsDeleteDialogController
 *
 * @description This controller is responsible for handling the delete functionality for attachments.
 */
class WipAttachmentsDeleteDialogController {

	/*
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsDeleteDialogController#constructor
	 * @methodOf Controllers.WipAttachmentsDeleteDialogController
	 * @description The class constructor
	 */
	constructor($rootScope, $mdDialog, EventService, totalItemsSelected) {
		this.$mdDialog = $mdDialog;
	
		this.EventService = EventService;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsDeleteDialogController#totalItemsSelected
		 * @propertyOf Controllers.WipAttachmentsDeleteDialogController
		 * @description Count of the total attachments selected
		 */
		this.totalItemsSelected = totalItemsSelected;
	}

	/*
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsDeleteDialogController#closeDialog
	 * @methodOf Controllers.WipAttachmentsDeleteDialogController
	 * @description Closes the dialog
	 */
	closeDialog() {
		this.$mdDialog.cancel();
	}

	/*
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsDeleteDialogController#proceedToDelete
	 * @methodOf Controllers.WipAttachmentsDeleteDialogController
	 * @description Proceeds for deletion and closes the dialog
	 */
	proceedToDelete() {
		this.$mdDialog.hide();
	}
}

export default WipAttachmentsDeleteDialogController;
