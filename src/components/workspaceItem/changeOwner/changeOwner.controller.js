'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ChangeOwnerController
 *
 * @description This controller is used for controlling the behavior of changeOwner.html
 *
 * ##Dependencies
 *
 */
class ChangeOwnerController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ChangeOwnerController#constructor
	 * @methodOf Controllers.workspaceItem.ChangeOwnerController
	 * @description The class constructor.
	 */
	constructor($rootScope, $mdDialog, RESTWrapperService, App, NotificationService, NotificationTypes, ownershipObj) {
		this.$mdDialog = $mdDialog;
		this.$rootScope = $rootScope;
		this.owners = ownershipObj.getFullList().ownership.owners;
		this.RESTWrapperService = RESTWrapperService;
		this.Ownership = ownershipObj;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		let app = new App();

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ChangeOwnerController#isNotifyingOwnerByEmail
		 * @propertyOf Controllers.workspaceItem.ChangeOwnerController
		 * @description true if on save send email to new owner
		 */
		this.isNotifyingOwnerByEmail = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ChangeOwnerController#selectedOwner
		 * @propertyOf Controllers.workspaceItem.ChangeOwnerController
		 * @description the owner that is selected.
		 */
		this.selectedOwner = {};

		RESTWrapperService.get(app.getUserLink(''), [], {
			limit: 1000, // not expecting more than 1000 users
			offset: 0,
			mappedOnly: false
		}, {}, {
			Accept: 'application/vnd.autodesk.plm.users.bulk+json'
		}).then(users => {
			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.ChangeOwnerController#users
			 * @propertyOf Controllers.workspaceItem.ChangeOwnerController
			 * @description a promise that resolves to the available users.
			 */
			this.users = users.items;

			this.selectedOwner = users.items.find(item =>
				item.__self__ === this.owners[0].detailsLink
			);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ChangeOwnerController#triggerSave
	 * @methodOf Controllers.workspaceItem.ChangeOwnerController
	 * @description triggers a save to update values of current owners.
	 *
	 */
	triggerSave() {
		this.Ownership.replaceOwner(this.owners, this.selectedOwner, this.isNotifyingOwnerByEmail).then(() => {
			this.NotificationService.addNotification(
				this.NotificationTypes.SUCCESS,
				`${this.$rootScope.bundle.notification.changedOwner.success}`
			);
		}, () => {
			this.NotificationService.addNotification(
				this.NotificationTypes.ERROR,
				`${this.$rootScope.bundle.notification.failureInOperation}`
			);
		}).then(() => {
			this.$mdDialog.hide();
			this.NotificationService.showNotifications();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ChangeOwnerController#closeDialog
	 * @methodOf Controllers.workspaceItem.ChangeOwnerController
	 * @description closes the change owner dialog
	 *
	 */
	closeDialog() {
		this.$mdDialog.cancel();
	}
}

export default ChangeOwnerController;