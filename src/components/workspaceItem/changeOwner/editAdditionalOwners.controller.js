'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.EditAdditionalOwnersController
 *
 * @description This controller is used for controlling the behavior of editAdditionalOwners.html
 *
 * ##Dependencies
 *
 */
class EditAdditionalOwnersController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.EditAdditionalOwnersController#constructor
	 * @methodOf Controllers.workspaceItem.EditAdditionalOwnersController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $mdDialog, RESTWrapperService, App, ownershipObj, OWNER_TYPE, NotificationService, NotificationTypes, _) {
		this.$mdDialog = $mdDialog;
		this.$rootScope = $rootScope;
		this.owners = ownershipObj.getFullList().ownership.owners;
		this.RESTWrapperService = RESTWrapperService;
		this.Ownership = ownershipObj;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		let app = new App();
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.EditAdditionalOwnersController#originalUsers
		 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
		 * @description users part of the original additional users
		 */
		this.originalUsers = this.owners.filter(item => item.ownerType === OWNER_TYPE.ADDITIONAL_USER);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.EditAdditionalOwnersController#originalGroups
		 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
		 * @description groups part of the original additional groups
		 */
		this.originalGroups = this.owners.filter(item => item.ownerType === OWNER_TYPE.ADDITIONAL_GROUP);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.EditAdditionalOwnersController#selectedUsers
		 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
		 * @description users that are currently selected
		 */
		this.selectedUsers = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.EditAdditionalOwnersController#selectedGroups
		 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
		 * @description groups that are currently selected
		 */
		this.selectedGroups = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.EditAdditionalOwnersController#modified
		 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
		 * @description true if there is a difference between the orginal and selected users and groups
		 */
		this.modified = false;

		$scope.$watchGroup([(this, (selectedUsers) => this.selectedUsers.length).bind(this)
							, (this, (selectedGroups) => this.selectedGroups.length).bind(this)]
							, (() => {
			let originalUsers = _.pluck(this.originalUsers, 'detailsLink');
			let selectedUsers = _.pluck(this.selectedUsers, '__self__');
			let originalGroups = _.pluck(this.originalGroups, 'detailsLink');
			let selectedGroups = _.pluck(this.selectedGroups, '__self__');

			this.modified = _.difference(originalUsers, selectedUsers).length > 0 || _.difference(selectedUsers, originalUsers).length > 0 || _.difference(originalGroups, selectedGroups).length > 0 || _.difference(selectedGroups, originalGroups).length > 0;
		}).bind(this));

		RESTWrapperService.get(app.getUserLink(''), [], {
			limit: 1000, // not expecting more than 1000 users
			offset: 0,
			mappedOnly: false
		}, {}, {
			Accept: 'application/vnd.autodesk.plm.users.bulk+json'
		}).then(users => {
			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.EditAdditionalOwnersController#users
			 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
			 * @description available users that the user can add as additional owners
			 */
			this.users = users.items;

			this.selectedUsers = this.users.filter(item =>
				this.originalUsers.findIndex(user => user.detailsLink === item.__self__) !== -1
			);
		});

		RESTWrapperService.get(app.getGroupsLinkV3()).then(groupsObj => {
			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.EditAdditionalOwnersController#groups
			 * @propertyOf Controllers.workspaceItem.EditAdditionalOwnersController
			 * @description available groups that the user can add as additional owners
			 */
			this.groups = groupsObj.groups.map(group => {
				group.displayName = group.shortName;
				return group;
			});

			this.selectedGroups = this.groups.filter(item =>
				this.originalGroups.findIndex(group => group.detailsLink === item.__self__) !== -1
			);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.EditAdditionalOwnersController#triggerSave
	 * @methodOf Controllers.workspaceItem.EditAdditionalOwnersController
	 * @description triggers a save to update values of current owners.
	 *
	 */
	triggerSave() {
		this.Ownership.editAdditionalOwners(this.owners, this.selectedUsers, this.selectedGroups).then(() => {
			this.NotificationService.addNotification(
				this.NotificationTypes.SUCCESS,
				`${this.$rootScope.bundle.notification.changedAdditionalOwners.success}`
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
	 * @name Controllers.workspaceItem.EditAdditionalOwnersController#closeDialog
	 * @methodOf Controllers.workspaceItem.EditAdditionalOwnersController
	 * @description closes the change owner dialog
	 *
	 */
	closeDialog() {
		this.$mdDialog.cancel();
	}
}

export default EditAdditionalOwnersController;