'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewWorkflowController
 *
 * @description This controller corresponds to the Workflow
 * (Affected Item References) view.
 *
 * ##Dependencies
 *
 */
class ViewWorkflowController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowController#constructor
	 * @methodOf Controllers.workspaceItem.ViewWorkflowController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $location, $stateParams, ModelsManager, EventService, FlyoutService, PermissionService, PLMPermissions, UrnParser, uiGridConstants, _) {
		this.$scope = $scope;
		this.$state = $state;
		this.$location = $location;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.UrnParser = UrnParser;
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#itemLink
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description `private` The encoded link for the current item.
		 */
		this.itemLink = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#tableColumns
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description Stores table column header of workflow.
		 */
		this.tableColumns = [
			{
				displayName: $rootScope.bundle.workflow.workflow,
				field: 'itemDisplayName',
				sort: {
					direction: uiGridConstants.ASC,
					priority: 1
				},
				cellTemplate: 'linkTemplate',
				type: 'object',
				width: '30%'
			},
			{
				displayName: $rootScope.bundle.workflow.workspace,
				field: 'itemWorkspace',
				width: '10%'
			},
			{
				displayName: $rootScope.bundle.workflow.currentState,
				field: 'currentState',
				enableSorting: true,
				width: '10%'
			},
			{
				displayName: $rootScope.bundle.workflow.lastAction,
				field: 'lastAction',
				width: '10%'
			},
			{
				displayName: $rootScope.bundle.workflow.dateOfLastAction,
				field: 'dateOfLastAction',
				cellTemplate: 'dateTemplate',
				width: '10%'
			},
			{
				displayName: $rootScope.bundle.workflow.performedBy,
				field: 'performedBy.val',
				cellTemplate: 'performUserLinkTemplate',
				width: '10%'
			},
			{
				displayName: $rootScope.bundle.workflow.createdOn,
				field: 'createdOn',
				cellTemplate: 'dateTemplate',
				width: '10%'
			},
			{
				displayName: $rootScope.bundle.workflow.createdBy,
				field: 'createdBy.val',
				cellTemplate: 'createUserLinkTemplate',
				width: '10%'
			}
		];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description Stores table data of workflow.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#itemQuantity
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description Amount of items to fetch.
		 */
		this.itemQuantity = 100;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description The view workflow items permission for the user.
		 */
		this.viewPermission = PLMPermissions.VIEW_ASSOCIATED_WORKFLOW;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description Stores the date format.
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
		 * @name Controllers.workspaceItem.ViewWorkflowController#currentUserListenerId
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description `private` Listener for current user.
		 */
		this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, userObj) => {
			EventService.unlisten(this.currentUserListenerId);

			// Set user's date format
			this.dateFormat.date = userObj.getDateFormat();
			this.dateFormat.dateAndHour = `${userObj.getDateFormat()} hh:mm a`;
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description `private` Listener for current item.
		 */
		this.itemListenerId = EventService.listen(`itemInstance:${this.itemLink}:done`, (event, itemObj) => {
			// If user does not have view permissions, but hit the url manually,
			// redirect user back to the item details view
			PermissionService.checkPermissionByItem(itemObj, this.viewPermission).then((hasViewPermission) => {
				if (!hasViewPermission) {
					$state.go('details', {
						tab: 'details',
						view: $location.search().view,
						mode: 'view',
						itemId: $location.search().itemId
					});
				}
			});

			EventService.send(`workflow:${this.itemLink}:get`, itemObj.getWorkflowLink(), {});
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowController#workflowObjListenerId
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowController
		 * @description `private` Listener for workflow object.
		 */
		this.workflowObjListenerId = EventService.listen(`workflow:${this.itemLink}:done`, (event, workflowObj) => {
			EventService.unlisten(this.workflowObjListenerId);

			// Initial load, with the data that has been fetched already
			this.parseViewWorkflowItems(workflowObj.getFullList(), this.itemQuantity);
		});

		ModelsManager.getCurrentUser();
		ModelsManager.getItem(this.itemLink);

		// Unlistens to events when scope is destroyed
		$scope.$on('$destroy', () => {
			EventService.unlisten(this.itemListenerId);
			EventService.unlisten(this.currentUserListenerId);
			EventService.unlisten(this.workflowObjListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowController#parseViewWorkflowItems
	 * @methodOf Controllers.workspaceItem.ViewWorkflowController
	 * @description Parse fetched data into table rows.
	 *
	 * @param {Object} data			Workflow data as fetched from server.
	 * @param {Number} itemQuantity	Number of items to be displayed on a single page.
	 */
	parseViewWorkflowItems(data, itemQuantity) {
		this.tableData = [];
		if (angular.isArray(data)) {
			this._.each(data, (element, index) => {
				let itemResourceId = this.UrnParser.encode(element.item.urn);
				let itemWs = element.item.urn.split('.').reverse()[1];
				let row = {};

				row.itemDisplayName = {
					value: element.item.version ? `${element.item.title} ${element.item.version}` : `${element.item.title}`,
					href: this.$state.href('details', {
						workspaceId: itemWs,
						tab: 'details',
						view: 'full',
						mode: 'view',
						itemId: itemResourceId
					})
				};
				row.itemWorkspace = '';

				// If workflow state is null, there is no workflow history
				if (element['workflow-state'] !== null) {
					// Get userId for performedBy and createdBy
					let performUserId = (element['last-workflow-history'].user.link).split('users/')[1];
					let createUserId = (element['first-workflow-history'].user.link).split('users/')[1];

					row.currentState = element['workflow-state'].title;
					row.lastAction = element['last-workflow-history'].workflowTransition.title;
					row.dateOfLastAction = element['last-workflow-history'].created;
					row.performedBy = {
						userId: performUserId,
						val: element['last-workflow-history'].user.title
					};
					row.createdOn = element['first-workflow-history'].created;
					row.createdBy = {
						userId: createUserId,
						val: element['first-workflow-history'].user.title
					};
				}

				this.tableData.push(row);

				// Get the workspace info of each item
				let itemListenerId = this.EventService.listen(`itemInstance:${itemResourceId}:done`, (event, ItemObj) => {
					this.EventService.unlisten(itemListenerId);

					this.parseViewWorkflowItemsWorkspace(ItemObj.workspaceObj.getDisplayName(), index);
				});

				this.ModelsManager.getItem(itemResourceId);
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowController#parseViewWorkflowItemsWorkspace
	 * @methodOf Controllers.workspaceItem.ViewWorkflowController
	 * @description Parse fetched workspace data into table rows.
	 *
	 * @param {Object} name		Workspace name.
	 * @param {Number} index	Index of the table row.
	 */
	parseViewWorkflowItemsWorkspace(name, index) {
		this.tableData[index].itemWorkspace = name;
	}

	/**
	 * @ngdoc method
	 * @name Controller.workspaceItem.ViewWorkflowController#openFlyoutWindow
	 * @methodOf Controllers.workspaceItem.ViewWorkflowController
	 * @description Open flyout window based on the given event and user ID.
	 *
	 * @param {Object} event	The event object.
	 * @param {Number} userId	The user ID.
	 */
	openFlyoutWindow(event, userId) {
		this.FlyoutService.open({
			flyoutClass: 'user-profile-flyout',
			scope: this.$scope,
			anchorEl: angular.element(event.target),
			template: `<user-profile-summary user-id="${userId}"></user-profile-summary>`
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewWorkflowController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return this.$location.search().mode === 'view';
	}
}

export default ViewWorkflowController;
