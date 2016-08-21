'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.AddActionNotificationsController
 *
 * @description This controller is responsible for managing the model dialog container of create workspace item.
 *
 *  TODO: replace scope with controller attributes.
 */

class AddActionNotificationsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#constructor
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description The class constructor.
	 */
	constructor($scope, $location, $rootScope, $mdDialog, RelatedWorkspacesObj, EventService, ModelsManager, $stateParams, _, $q) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$mdDialog = $mdDialog;
		this.EventService = EventService;
		this.ModelsManager = ModelsManager;
		this.$stateParams = $stateParams;
		this._ = _;
		this.$q = $q;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddActionNotificationsController#that
		 * @propertyOf Controllers.workspaceItem.AddActionNotificationsController
		 * @description `private` Reference to this controller.
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddActionNotificationsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.AddActionNotificationsController
		 * @description The workspace id of the current selected item.
		 */
		this.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddActionNotificationsController#itemId
		 * @propertyOf Controllers.workspaceItem.AddActionNotificationsController
		 * @description The item id of the current selected item.
		 */
		this.itemId = $location.search().itemId;

		this.availableEventType = [
			{name: $rootScope.bundle.actionNotifications.state},
			{name: $rootScope.bundle.actionNotifications.transition}
		];
		this.availableTransitions = null;
		this.availableStates = null;
		this.availableGroups = null;
		this.availableUsers = null;
		this.selectedEventType = $rootScope.bundle.actionNotifications.transition;
		this.selectedTransition = null;
		this.selectedState = null;
		this.selectedGroups = [];
		this.selectedUsers = [];

		// call to get list of users, groups, states and transitions
		this.getGroups();
		this.getWorkflowStates();
		this.getWorkflowTransitions();

		ModelsManager.getItem(this.itemId);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddActionNotificationsController#actionNotificationList
		 * @propertyOf Controllers.workspaceItem.AddActionNotificationsController
		 * @description The list of the current selected action notification.
		 */
		this.actionNotificationList = {};
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#getGroups
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description `private` Get all the available groups
	 */
	getGroups() {
		let availableGroupsListenerId = this.EventService.listen('availableGroups:done', (event, data) => {
			this.EventService.unlisten(availableGroupsListenerId);
			this.availableGroups = data.json.elements;
		});
		this.ModelsManager.getGroups();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#getUsers
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description `private` Get all the available users
	 */
	getUsers() {
		let availableUsersListenerId = this.EventService.listen(`user:${this.workspaceId}:done`, (event, data) => {
			this.EventService.unlisten(availableUsersListenerId);
			this.availableUsers = data.json.elements;
		});
		this.ModelsManager.getUsers(this.workspaceId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#getWorkflowStates
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description `private` Get all the available states
	 */
	getWorkflowStates() {
		var itemListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, ItemObj) => {
			this.EventService.unlisten(itemListenerId);
			this.ItemObj = ItemObj;
			this.workspaceId = ItemObj.workspaceObj.getId();

			let availableStatesListenerId = this.EventService.listen(`itemState:${this.workspaceId}:done`, (event, data) => {
				this.EventService.unlisten(availableStatesListenerId);
				this.availableStates = [];
				_.each(data.json, (state, index) => {
					this.availableStates.push({
						name: state.name,
						id: state.__self__.substr(state.__self__.lastIndexOf('/') + 1)
					});
				});
			});
			this.ModelsManager.getWorkflowStates(this.workspaceId);

			this.getUsers();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#getWorkflowTransitions
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description `private` Get all the available transitions
	 */
	getWorkflowTransitions() {
		var itemListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, ItemObj) => {
			this.EventService.unlisten(itemListenerId);
			this.workspaceId = ItemObj.workspaceObj.getId();

			let availableTransitionsListenerId = this.EventService.listen(`itemTransitions:${this.workspaceId}:done`, (event, data) => {
				this.EventService.unlisten(availableTransitionsListenerId);
				this.availableTransitions = [];
				_.each(data.transitions, (transition, index) => {
					this.availableTransitions.push({
						name: transition.name,
						id: transition.__self__.substr(transition.__self__.lastIndexOf('/') + 1)
					});
				});
			});
			this.ModelsManager.getWorkflowTransitions(this.workspaceId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#eventTypeChanged
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description `private` Set selected transition and state to null while toggling between states
	 */
	eventTypeChanged() {
		this.selectedTransition = null;
		this.selectedState = null;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#close
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description close create action Notification dialog
	 */
	close() {
		this.$mdDialog.hide();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddActionNotificationsController#saveAndClose
	 * @methodOf Controllers.workspaceItem.AddActionNotificationsController
	 * @description Save newly created action Notification.
	 *
	 * @param {Object} createdItem an object representing the data of newly created action notification.
	 *
	 */
	saveAndClose() {
		this.actionNotificationList = {
			type: this.selectedEventType,
			'workflow-transition': this.selectedTransition,
			'workflow-state': this.selectedState,
			users: this.selectedUsers,
			groups: this.selectedGroups,
			item: this.ItemObj.json.id
		};

		var actionNotificationListenerId = this.EventService.listen(`itemInstance:${this.itemId}:actionNotificationDone`, (event, flag) => {
			this.EventService.unlisten(actionNotificationListenerId);
			this.$mdDialog.hide();
			if (flag) {
				this.EventService.send(`itemInstance:${this.itemId}:actionNotificationComplete`);
			}
		});

		this.EventService.send(`itemInstance:${this.itemId}:actionNotificationItem`, [this.ItemObj, this.actionNotificationList]);
	}
}

export default AddActionNotificationsController;
