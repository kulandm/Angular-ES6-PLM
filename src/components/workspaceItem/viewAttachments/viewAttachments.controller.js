'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewAttachmentsController
 *
 * @description This controller responsible for affected items.
 * This controller will handle all affected items sub states (view, add, edit etc).
 *
 * ##Dependencies
 *
 */
class ViewAttachmentsController {
	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachmentsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewAttachmentsController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $stateParams, $state, ModelsManager, EventService, FlyoutService, NotificationService, PermissionService, NotificationTypes, PLMPermissions, _, UrnParser) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this._ = _;
		this.FlyoutService = FlyoutService;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.$stateParams = $stateParams;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#itemLink
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The resource id of the current item.
		 */
		this.itemLink = UrnParser.encode($stateParams.itemId);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The workspace id of the current item.
		 */
		this.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The item id of the current item.
		 */
		this.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#userId
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The current user id.
		 */
		this.userId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#userName
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The current user display name.
		 */
		this.userName;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The view attachments permission.
		 */
		this.viewPermission = PLMPermissions.VIEW_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The edit attachments permission.
		 */
		this.editPermission = PLMPermissions.EDIT_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The add attachments permission.
		 */
		this.addPermission = PLMPermissions.ADD_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#deletePermission
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description The delete attachments permission.
		 */
		this.deletePermission = PLMPermissions.DELETE_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#hasAddPermission
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description True, if the user has add attachments permission.
		 */
		this.hasAddPermission;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#hasEditPermission
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description True, if the user has edit attachments permission.
		 */
		this.hasEditPermission;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description Stores the user-defined date format.
		 *
		 * `date`: Date format, defaults to 'yyyy'.<br>
		 * `dateAndHour`: Date-plus-hour format, defaults to 'yyyy hh:mm a'.
		 */
		this.dateFormat = {
			date: 'yyyy',
			dateAndHour: 'yyyy hh:mm a'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#currentUserListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description Listener for current user.
		 */
		this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, UserObj) => {
			EventService.unlisten(this.currentUserListenerId);

			// Set user's information
			this.userId = UserObj.getId();
			this.userName = UserObj.getDisplayName();

			// Set user's date format
			this.dateFormat.date = UserObj.getDateFormat();
			this.dateFormat.dateAndHour = `${UserObj.getDateFormat()} hh:mm a`;
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description Listener for item object. Determines the workspace id.
		 * Also updates the user permissions.
		 */
		this.itemListenerId = EventService.listen(`itemInstance:${this.itemLink}:done`, (event, ItemObj) => {
			EventService.unlisten(this.itemListenerId);

			this.workspaceId = ItemObj.workspaceObj.getId();
			this.itemId = ItemObj.getId();

			PermissionService.checkPermissionByItem(ItemObj, this.addPermission, true, true).then((hasAddPermission) => {
				this.hasAddPermission = hasAddPermission;
			});

			PermissionService.checkPermissionByItem(ItemObj, this.editPermission, true, true).then((hasEditPermission) => {
				this.hasEditPermission = hasEditPermission;
			});

			// If user does not have view permissions, but hit the url manually,
			// redirect user back to the item details view
			PermissionService.checkPermissionByItem(ItemObj, this.viewPermission).then((hasViewPermission) => {
				if (!hasViewPermission) {
					// Since REST call is in CPDM repo, explicitly send the denied
					// error via EventService to trigger notification
					EventService.send('forbiddenAccess:permissionDenied');

					$state.go('details', {
						tab: 'details',
						view: $stateParams.view,
						mode: 'view',
						itemId: UrnParser.encode($stateParams.itemId)   // currently, detail state is not supporting Urn type
					});
				}
			});

			ModelsManager.getWorkspace(this.workspaceId);
		});

		ModelsManager.getItem(this.itemLink);
		ModelsManager.getCurrentUser();

		$scope.$on('destroy', () => {
			EventService.unlisten(this.currentUserListenerId);
			EventService.unlisten(this.itemListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachmentsController#showUserInfo
	 * @methodOf Controllers.workspaceItem.ViewAttachmentsController
	 * @description Displays user summary
	 *
	 * @param {Object} event Event object
	 * @param {String} userId User id for which the summary is needed.
	 */
	showUserInfo(event, userId) {
		this.FlyoutService.open({
			flyoutClass: 'user-profile-flyout',
			scope: this.$scope,
			anchorEl: angular.element(event.target),
			template: `<user-profile-summary user-id="${userId}"></user-profile-summary>`
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachmentsController#setSelectedRowInfo
	 * @methodOf Controllers.workspaceItem.ViewAttachmentsController
	 * @description Sets the data according to the selected row
	 *
	 * @param {Object} fileInfo File information (id, name, title and version)
	 * @param {Boolean} isRowSelected True, if row is selected
	 */
	setSelectedRowInfo(fileInfo, isRowSelected) {
		this.fileInfo = fileInfo;
		this.status = fileInfo && fileInfo.fileStatus;
		this.showUndoFlag = (fileInfo && fileInfo.fileStatus) === 'Checked OUT';
		this.showRowActions = isRowSelected;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachmentsController#showNotification
	 * @methodOf Controllers.workspaceItem.ViewAttachmentsController
	 * @description send event that results in notificaitons.
	 *
	 * @param {Array} responseList The array of success/failed upload responses.
	 * Each array item is an object containing the type of the notification and
	 * the message to display. There are four types of notification currently
	 * supported: 1 for Success, 2 for Error, 3 for Warning and 4 for Info.
	 */
	showNotification(responseList) {
		this._.each(responseList, response => {
			switch (response.type) {
				// Success
				case this.NotificationTypes.SUCCESS:
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						response.message
					);
					break;

				// Error
				case this.NotificationTypes.ERROR:
					this.NotificationService.addNotification(
						this.NotificationTypes.ERROR,
						response.message
					);
					break;

				default:
					break;
			}
		});

		this.NotificationService.showNotifications();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachmentsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewAttachmentsController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return this.$stateParams.mode === 'view';
	}
}

export default ViewAttachmentsController;
