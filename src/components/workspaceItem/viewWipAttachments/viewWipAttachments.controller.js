'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewWipAttachmentsController
 *
 * @description View Controller for WIP enabled attachments view
 */
class ViewWipAttachmentsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description The class constructor.
	 */
	constructor($scope, $state, $stateParams, $window, App, EventService, FileOverviewService, ModelsManager,
	            PermissionService, PLMPermissions, RESTWrapperService, WipApiService, UrnParser, $mdDialog) {
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$window = $window;
		this.EventService = EventService;
		this.FileOverviewService = FileOverviewService;
		this.WipApiService = WipApiService;
		this.$mdDialog = $mdDialog;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#itemLink
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The resource id of the current item.
		 */
		this.itemLink = UrnParser.encode($stateParams.itemId);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#itemUrn
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The item urn (not encoded).
		 */
		this.itemUrn = $stateParams.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The workspace id of the current item.
		 */
		this.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The item id of the current item.
		 */
		this.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The view attachments permission.
		 */
		this.viewPermission = PLMPermissions.VIEW_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The add attachments permission.
		 */
		this.addPermission = PLMPermissions.ADD_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The edit attachments permission.
		 */
		this.editPermission = PLMPermissions.EDIT_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#deletePermission
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The delete attachments permission.
		 */
		this.deletePermission = PLMPermissions.DELETE_ATTACHMENTS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#selectedFiles
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The selected WIP attachments.
		 */
		this.selectedFiles = new Set();

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
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
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#attachmentsData
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description The reference of attachment grid's data. This property is binded with grid directive.
		 */
		this.attachmentsData = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#isItemLocked
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description True, if the current item is locked.
		 */
		this.isItemLocked;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#isItemLoaded
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description True, if the attached items are loaded.
		 */
		this.isItemLoaded;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachmentsController#currentUserListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAttachmentsController
		 * @description Listener for current user.
		 */
		this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, UserObj) => {
			EventService.unlisten(this.currentUserListenerId);

			// Set user's date format
			this.dateFormat.date = UserObj.getDateFormat();
			this.dateFormat.dateAndHour = `${UserObj.getDateFormat()} hh:mm a`;
		});

		ModelsManager.getCurrentUser();

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWipAttachmentsController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
		 * @description Listener for item object. Determines the workspace id.
		 * Also updates the user permissions.
		 */
		this.itemListenerId = EventService.listen(`itemInstance:${this.itemLink}:done`, (event, ItemObj) => {
			this.workspaceId = ItemObj.workspaceObj.getId();
			this.itemId = ItemObj.getId();
			this.isItemLocked = ItemObj.isLocked();

			// If user does not have view permissions, but hit the url manually,
			// redirect user back to the item details view
			PermissionService.checkPermissionByItem(ItemObj, this.viewPermission).then(hasViewPermission => {
				if (!hasViewPermission) {
					// Since REST call is in CPDM repo, explicitly send the denied
					// error via EventService to trigger notification
					EventService.send('forbiddenAccess:permissionDenied');

					$state.go('details', {
						tab: 'details',
						view: $stateParams.view,
						mode: 'view',
						itemId: UrnParser.encode($stateParams.itemId) // currently, detail state is not supporting Urn type
					});
				}
			});

			ModelsManager.getWorkspace(this.workspaceId);
		});

		ModelsManager.getItem(this.itemLink);

		// Set up the FileOverviewService
		RESTWrapperService.get(new App().hubs.link).then(response => {
			FileOverviewService.setHost(response.items[0].links.link.href);
		});

		// Set up the WipApiService
		RESTWrapperService.get(new App().wipBase.link).then(response => {
			WipApiService.setHost(response.value);
		});

		$scope.$on('$destroy', () => {
			EventService.unlisten(this.currentUserListenerId);
			EventService.unlisten(this.itemListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#triggerEdit
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description State change triggered by clicking edit button.
	 *
	 * NOTE: name has to be triggerEdit.
	 */
	triggerEdit() {
		this.$state.go('attachments', {
			tab: this.$stateParams.tab,
			view: this.$stateParams.view,
			mode: 'edit',
			itemId: this.$stateParams.itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description State change triggered by clicking save button.
	 *
	 * NOTE: name has to be triggerSave.
	 */
	triggerSave() {
		this.EventService.send(`wipAttachment:${this.itemId}:save`);

		let saveDoneListener = this.EventService.listen(`wipAttachment:${this.itemId}:saveDone`, () => {
			this.EventService.unlisten(saveDoneListener);

			this.$state.go('attachments', {
				tab: this.$stateParams.tab,
				view: this.$stateParams.view,
				mode: 'view',
				itemId: this.$stateParams.itemId
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description State change triggered by clicking cancel button.
	 *
	 * NOTE: name has to be triggerCancel.
	 */
	triggerCancel() {
		this.$state.go('attachments', {
			tab: this.$stateParams.tab,
			view: this.$stateParams.view,
			mode: 'view',
			itemId: this.$stateParams.itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#triggerDownload
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description Send an event to CPDM to trigger file download.
	 */
	triggerDownload() {
		this.EventService.send(`wipAttachment:${this.itemId}:download`);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#setSelectedFiles
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description Sets the selected files
	 *
	 * @oaram {Object} file The selected file
	 */
	setSelectedFiles(file) {
		this.selectedFiles.has(file) ?
			this.selectedFiles.delete(file) :
			this.selectedFiles.add(file);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return this.$stateParams.mode === 'view';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#triggerFileBrowserDialog
	 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description Triggers a dialog for WIP file browser.
	 */
	triggerFileBrowserDialog() {
		this.$mdDialog.show({
			templateUrl: 'components/wipFileBrowserDialog/wipFileBrowserDialog.html',
			controller: 'WipFileBrowserDialogController as wipFileBrowserDialogCtrl',
			locals: {
				workspaceId: this.workspaceId,
				itemId: this.itemId,
				itemUrn: this.itemUrn
			}
		}).then(() => {
			this.EventService.send(`wipAttachment:${this.itemId}:add`);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWipAttachmentsController#triggerRemove
	 * @propertyOf Controllers.workspaceItem.ViewWipAttachmentsController
	 * @description Trigger a broadcast remove event
	 */
	triggerRemove() {
		this.EventService.send(`wipAttachment:${this.itemId}:remove`);
	}
}

export default ViewWipAttachmentsController;
