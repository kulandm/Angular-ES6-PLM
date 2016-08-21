'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewActionNotificationsController
 *
 * @description This controller corresponds to /workspaces/{workspaceId}/{itemId}/actionNotifications.
 *
 * ##Dependencies
 *
 */

const LOCATION = new WeakMap();

class ViewActionNotificationsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description The class constructor.
	 */
	constructor($scope, $window, $state, $stateParams, $location, $filter, $rootScope, $mdDialog, ModelsManager, EventService, PLMPermissions, uiGridConstants, _, $q) {
		this.$scope = $scope;
		this.$window = $window;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$location = $location;
		this.$filter = $filter;
		this.$rootScope = $rootScope;
		this.$mdDialog = $mdDialog;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.PLMPermissions = PLMPermissions;
		this._ = _;
		this.$q = $q;

		LOCATION.set(this, $location);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#that
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description `private` Reference to this controller.
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The item id of the current selected item.
		 */
		this.itemId = $location.search().itemId;

		// listeners
		var actionNotificationsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#addStateName
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The name of the add state for this tab
		 */
		this.addStateName = 'action-notifications-view';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#editStateName
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The name of the edit state for this tab
		 */
		this.editState = 'action-notifications-edit';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#viewStateName
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The name of the view state for this tab
		 */
		this.viewStateName = 'action-notifications-view';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The add workflow items permission for the user
		 *
		 */
		this.addPermission = PLMPermissions.ADD_WORKFLOW_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The edit workflow items permission for the user
		 *
		 */
		this.editPermission = PLMPermissions.EDIT_WORKFLOW_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#edit
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description A boolean val that controls if the user is in view or editing mode, to render form elements
		 * This needs to be cleaned up
		 */
		this.edit = (LOCATION.get(this).search().mode === 'edit');

		// EXPERIMENTAL CODE - LISTEN FOR CHANGE ROUTES AND SET THE EDITING PARAMETERS ACCORDINGLY
		this.EventService.listen('state:change:done', () => {
			// STILL HAVE TO INVESTIGATE $state.params vs $stateParams
			this.edit = (LOCATION.get(this).search().mode === 'edit');
			this.init();
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#tableColumns
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description Stores table column header
		 */
		this.tableColumns = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description Stores table data of the change log
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#customVars
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The object that will be binded to TDW and hence available on renderers, used with table fields.
		 */
		this.customVars = {
			availableEventType: [
				{name: $rootScope.bundle.actionNotifications.state},
				{name: $rootScope.bundle.actionNotifications.transition}
			],
			availableTransitions: null,
			availableStates: null,
			availableGroups: null,
			availableUsers: null
		};

		ModelsManager.getItem(this.itemId);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#actionNotificationList
		 * @propertyOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description The list of the current selected action notification.
		 */
		this.actionNotificationList = {};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#init
		 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description Initialization function
		 */
		this.init = function () {

			// setup table header
			this.tableColumns = [
				{
					displayName: '#',
					field: 'rowId',
					enableSorting: true,
					suppressRemoveSort: true,
					width: '5%'
				},
				{
					displayName: $rootScope.bundle.actionNotifications.eventType,
					field: 'eventType',
					sort: {
						direction: uiGridConstants.ASC,
						priority: 1
					},
					width: '15%',
					cellTemplate: 'eventTypeRenderer'
				},
				{
					displayName: $rootScope.bundle.actionNotifications.notificationEvent,
					field: 'notificationEvent',
					sort: {
						direction: uiGridConstants.ASC,
						priority: 1
					},
					width: '15%',
					cellTemplate: 'notificationEventRenderer'
				},
				{
					displayName: $rootScope.bundle.actionNotifications.groupToNotify,
					field: 'groupToNotify',
					sort: {
						direction: uiGridConstants.ASC,
						priority: 1
					},
					width: '30%',
					cellTemplate: 'groupsRenderer'
				},
				{
					displayName: $rootScope.bundle.actionNotifications.userToNotify,
					field: 'userToNotify',
					sort: {
						direction: uiGridConstants.ASC,
						priority: 1
					},
					width: '30%',
					cellTemplate: 'usersRenderer'
				},
				{
					displayName: '',
					field: 'deleteActionNotification',
					enableSorting: false,
					cellTemplate: 'actionNotificationDeleteBtnRenderer',
					width: '5%'
				}
			];

			actionNotificationsListenerId = EventService.listen('actionNotification:' + $stateParams.itemId + ':done', function (event, ActionNotificationsObj) {
				// initial load, with the data that has been fetched already
				that.parseViewActionNotificationsItems(ActionNotificationsObj.getFullList());
			});

			ModelsManager.getActionNotifications($stateParams.workspaceId, $stateParams.itemId);

			// call to get list of users, groups, states and transitions
			this.getGroups();
			this.getWorkflowStates();
			this.getWorkflowTransitions();
		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItem.ViewActionNotificationsController#parseViewActionNotificationsItems
		 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
		 * @description Parse fetch data into table rows
		 *
		 * @param {Object} data action notification data as fetched from server.
		 */
		this.parseViewActionNotificationsItems = function (data) {
			if (angular.isDefined(data)) {
				// iterates through each action notification item
				_.each(data, function (element, index) {
					$q.all({
						notificationIdPromise: element.getNotificationId(),
						eventTypePromise: element.getEventType(),
						notificationEventPromise: element.getNotificationEvent(),
						notificationGroupsPromise: element.getNotificationGroups(),
						notificationUsersPromise: element.getNotificationUsers()
					}).then(function (promises) {
						that.tableData[index] = {
							rowId: promises.notificationIdPromise,
							eventType: {
								selected: {
									name: promises.eventTypePromise
								},
								eventTypeChanged: (selectedEventType) => {
									that.tableData[index].notificationEvent.eventType = selectedEventType;
								},
								isEdit: that.edit
							},
							notificationEvent: {
								selected: {
									name: promises.notificationEventPromise.name,
									id: promises.notificationEventPromise.id
								},
								isEdit: that.edit,
								eventType: promises.eventTypePromise
							},
							groupToNotify: {
								selected: {
									name: promises.notificationGroupsPromise
								},
								isEdit: that.edit,
								isOptionSelected: (optionName) => {
									if (_.contains(promises.notificationGroupsPromise, optionName)) {
										return 'selected';
									}
								}
							},
							userToNotify: {
								selected: {
									name: promises.notificationUsersPromise
								},
								isEdit: that.edit,
								isOptionSelected: (optionName) => {
									if (_.contains(promises.notificationUsersPromise, optionName)) {
										return 'selected';
									}
								}
							},
							deleteActionNotification: {
								ref: element,
								link: function (event) {
									this.ref.deleteActionNotification().then(function () {
										that.EventService.send(`itemInstance:${that.itemId}:actionNotificationComplete`);
									});
								}
							}
						};
					});
				});
			}
		};

		// Listen for items that have been successfully added to the table, and reload the model
		this.actionNotificationSaveListenerId = this.EventService.listen(`itemInstance:${this.itemId}:actionNotificationComplete`, () => {
			that.tableData = [];
			ModelsManager.getActionNotifications($scope.workspaceId, $scope.itemId, $scope.sortingOrder, $scope.sortingColumn);
		}, true);

		$scope.$on('$destroy', function () {
			EventService.unlisten(actionNotificationsListenerId);
			EventService.unlisten(that.actionNotificationSaveListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#getGroups
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description `private` Get all the available groups
	 */
	getGroups() {
		let availableGroupsListenerId = this.EventService.listen('availableGroups:done', (event, data) => {
			this.EventService.unlisten(availableGroupsListenerId);
			this.customVars.availableGroups = data.json.elements;
		});
		this.ModelsManager.getGroups();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#getUsers
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description `private` Get all the available users
	 */
	getUsers() {
		let availableUsersListenerId = this.EventService.listen(`user:${this.workspaceId}:done`, (event, data) => {
			this.EventService.unlisten(availableUsersListenerId);
			this.customVars.availableUsers = data.json.elements;
		});
		this.ModelsManager.getUsers(this.workspaceId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#getWorkflowStates
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description `private` Get all the available states
	 */
	getWorkflowStates() {
		var itemListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, ItemObj) => {
			this.EventService.unlisten(itemListenerId);
			this.ItemObj = ItemObj;
			this.workspaceId = ItemObj.workspaceObj.getId();
			let availableStatesListenerId = this.EventService.listen(`itemState:${this.workspaceId}:done`, (event, data) => {
				this.EventService.unlisten(availableStatesListenerId);
				this.customVars.availableStates = [];
				_.each(data.json, (state, index) => {
					this.customVars.availableStates.push({
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
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#getWorkflowTransitions
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description `private` Get all the available transitions
	 */
	getWorkflowTransitions() {
		var itemListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, ItemObj) => {
			this.EventService.unlisten(itemListenerId);
			this.workspaceId = ItemObj.workspaceObj.getId();
			let availableTransitionsListenerId = this.EventService.listen(`itemTransitions:${this.workspaceId}:done`, (event, data) => {
				this.EventService.unlisten(availableTransitionsListenerId);
				this.customVars.availableTransitions = [];
				_.each(data.transitions, (transition, index) => {
					this.customVars.availableTransitions.push({
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
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description Triggered by clicking cancel button - NOTE: name has to be triggerCancel
	 *
	 */
	triggerCancel() {
		LOCATION.get(this).search({
			tab: LOCATION.get(this).search().tab,
			view: LOCATION.get(this).search().view,
			mode: 'view',
			itemId: LOCATION.get(this).search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#triggerEdit
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description Triggered by clicking edit button - goes to the EDIT state
	 *
	 */
	triggerEdit() {
		LOCATION.get(this).search({
			tab: LOCATION.get(this).search().tab,
			view: LOCATION.get(this).search().view,
			mode: 'edit',
			itemId: LOCATION.get(this).search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#isTableRowDirty
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description true, if a given table row has dirty state.
	 *
	 * @param {Object} tableRow the table row to check for dirty state
	 *
	 * @return {Boolean} true, if the given table row is dirty.
	 *
	 */
	isTableRowDirty(tableRow) {
		var propertyList = [];

		if (angular.isDefined(tableRow.lifecycle)) {
			propertyList.push(tableRow.lifecycle);
		}

		if (angular.isDefined(tableRow.effectivity)) {
			propertyList.push(tableRow.effectivity);
		}

		return _.some(propertyList, function (property) {
			return !_.isEqual(property.originalValue, property.value);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description Triggered by clicking save button - saves the edited notification
	 *
	 */
	triggerSave() {
		var saveCount = 0;
		var updateCount = 0;
		var modifiedItems = [];
		// TODO Need to revisit this after PUT implemented in Backend - Currently this one throws error and cannot save
		this._.each(this.tableData, (tableRow, index) => {
			this.actionNotificationList = {
				type: tableRow.eventType.selected.name,
				'workflow-state': tableRow.notificationEvent.selected.id,
				users: tableRow.userToNotify.selected,
				groups: tableRow.groupToNotify.selected,
				item: this.ItemObj.json.id
			};
			this.EventService.send(`itemInstance:${this.itemId}:actionNotificationItem`, [this.ItemObj, this.actionNotificationList]);
			var actionNotificationListenerId = this.EventService.listen(`itemInstance:${this.itemId}:actionNotificationDone`, (event, flag) => {
				this.EventService.unlisten(actionNotificationListenerId);
				if (flag) {
					this.triggerCancel();
					this.EventService.send(`itemInstance:${this.itemId}:actionNotificationComplete`);
				}
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description Opens quick create modal.
	 */
	triggerAdd(event) {

		this.$mdDialog.show({
			controller: 'AddActionNotificationsController',
			templateUrl: 'build/components/workspaceItem/viewActionNotifications/addActionNotifications.html',
			controllerAs: 'addActionNotificationsCtrl',
			resolve: {
				RelatedWorkspacesObj: () => {
					return this.relatedWorkspacesObj;
				}
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewActionNotificationsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewActionNotificationsController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (LOCATION.get(this).search().mode === 'view');
	}
}

export default ViewActionNotificationsController;
