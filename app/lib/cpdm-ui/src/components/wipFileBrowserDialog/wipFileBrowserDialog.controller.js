'use strict';

/**
 * @ngdoc object
 * @name Controllers.WipFileBrowserDialogController
 *
 * @description This controller is responsible for fetching the data for WIP
 * attachments.
 */
class WipFileBrowserDialogController {

	/*
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserDialogController#constructor
	 * @methodOf Controllers.WipFileBrowserDialogController
	 * @description The class constructor
	 */
	constructor($rootScope, $mdDialog, $q, Attachment, LocalizationService, EventService, NotificationService, NotificationTypes, workspaceId, itemId, itemUrn) {
		this.$mdDialog = $mdDialog;
		this.$q = $q;
		this.Attachment = Attachment;
		this.EventService = EventService;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.workspaceId = workspaceId;
		this.itemId = itemId;
		this.itemUrn = itemUrn;

		/**
		 * @ngdoc property
		 * @name Controllers.WipFileBrowserDialogController#selectedFiles
		 * @propertyOf Controllers.WipFileBrowserDialogController
		 * @description Stores list of selected files.
		 */
		this.selectedFiles = new Set();

		LocalizationService.init().then(() => {
			this.$rootScope = $rootScope;
		});
	}

	/*
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserDialogController#triggerAdd
	 * @methodOf Controllers.WipFileBrowserDialogController
	 * @description Adds selected files from WIP file browser to attachments tab
	 */
	triggerAdd() {
		this.$q.all(_.map([...this.selectedFiles], file => {
			return this.Attachment
				.addAttachment(file, this.workspaceId, this.itemId, this.itemUrn)
				.then(() => {
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${file.title}${this.$rootScope.bundle.notification.singleAdd.success}`
					);
				}, () => {
					this.NotificationService.addNotification(
						this.NotificationTypes.ERROR,
						`${file.title}${this.$rootScope.bundle.notification.singleAdd.failed}`
					);
				});
		})).then(() => {
			this.$mdDialog.hide();
		});
	}

	/*
	 * @ngdoc method
	 * @name Controllers.WipFileBrowserDialogController#closeDialog
	 * @methodOf Controllers.WipFileBrowserDialogController
	 * @description Closes the dialog
	 */
	closeDialog() {
		this.$mdDialog.cancel();
	}
}

export default WipFileBrowserDialogController;
