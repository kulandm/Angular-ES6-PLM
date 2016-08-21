'use strict';

angular.module('plm360.workspaceItem', [])

/**
 * @ngdoc object
 * @name Controllers.WorkspaceItemController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}. It represents an abstract state and contains nested views.
 *
 * ##Dependencies
 *
 */
.controller('WorkspaceItemController', [
	'$q',
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'$timeout',
	'ModelsManager',
	'EventService',
	'_',
	function ($q, $scope, $rootScope, $state, $stateParams, $timeout, ModelsManager, EventService, _) {

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceItemController#tabMapping
		 * @propertyOf Controllers.WorkspaceItemController
		 * @description `private` The mapping of icons and ids for the tabs
		 * The 'icon' is not being used in Galileo, but left here for legacy purposes in case we use them later
		 *
		 */
		var tabMapping = {
			itemDetails: { // Item Details
				icon: 'icon-Info',
				active: 'details',
				link: 'details'
			},
			linkedItems: { // Managed Items
				icon: 'icon-Connect',
				active: 'affected-items',
				link: 'affected-items'
			},
			gridDetails: { // Grid
				icon: 'icon-Tabular',
				active: 'item-grid',
				link: 'grid'
			},
			projectManagement: { // Project Management
				icon: 'icon-Sheets',
				active: 'project-management',
				link: 'project-management'
			},
			partAttachment: { // Attachments from CPDM
				icon: 'icon-Attach',
				active: 'attachments',
				link: 'attachments'
			},
			workflowActions: { // Workflow Actions
				icon: 'icon-a360-organization',
				active: 'workflow-map',
				link: 'workflow-map'
			},
            bomViewNested: { // Bill of Materials
                icon: 'icon-Heirarchy2',
                active: 'bom',
                link: 'bom'
            },
			// bomViewWhereUsed: { // Where Used NOT AVAILABLE
			// 	icon: 'icon-Heirarchy1',
			// 	active: 'where-used',
			// 	link: 'where-used-view'
			// },
			// sourcing: {
			// 	icon: 'icon-Library',
			// 	active: 'sourcing',
			// 	link: 'sourcing-view'
			// },
			// 'sourcingSuppliedItems': { // Supplied Items NOT AVAILABLE
			// 	icon: 'icon-CubeSectioned',
			// 	active: 'supplied-items',
			// 	link: 'supplied-items-view'
			// },
			relationship: { // Relationships
				icon: 'icon-Transfer',
				active: 'relationships',
				link: 'relationships'
			},
			linkedItemsReferences: { // Workflow
				icon: 'icon-History',
				active: 'workflow',
				link: 'workflow'
			},
			milestonesDetails: { // Milestones NOT AVAILABLE
				icon: 'icon-Tasks',
				active: 'milestones',
				link: 'milestone'
			},
			partHistory: { // Change Log
				icon: 'icon-TimeActivity',
				active: 'change-log',
				link: 'change-log'
			}
		};

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceItemController#workspaceId
		 * @propertyOf Controllers.WorkspaceItemController
		 * @description The workspace id of the current selected item.
		 *
		 */
		$scope.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceItemController#itemId
		 * @propertyOf Controllers.WorkspaceItemController
		 * @description The item id of the current selected item.
		 *
		 */
		$scope.itemId = $stateParams.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceItemController#tabList
		 * @propertyOf Controllers.WorkspaceItemController
		 * @description Stores parsed list of tabs for the current item
		 *
		 */
		$scope.tabList = [];

		/**
		 * @ngdoc method
		 * @name Controllers.WorkspaceItemController#getStateName
		 * @methodOf Controllers.WorkspaceItemController
		 * @description Gets the state name for the tab, with its params
		 *
		 */
		$scope.getStateName = function (tabLinkId) {
			var stateName;

			if ((tabLinkId === '') || angular.isUndefined(tabLinkId)) {
				stateName = 'dashboard';
			} else {
				stateName = tabLinkId + '({itemId: "' + $scope.itemId + '"})';
			}

			return stateName;
		};

		/**
		 * @ngdoc method
		 * @name Controllers.WorkspaceItemController#isStateActive
		 * @methodOf Controllers.WorkspaceItemController
		 * @description Checks which is the current active state
		 *
		 * @param {String} activeStateId The name of the active state passed by the view
		 * @param {String} stateViewId The name of the view state passed by the view
		 * @param {String} stateEditId The name of the edit state passed by the view
		 *
		 * @returns {Boolean} true/false If it's the current state
		 *
		 */
		$scope.isStateActive = function (activeStateId, stateViewId, stateEditId) {
			return ($state.includes(activeStateId) || $state.includes(stateViewId) || $state.includes(stateEditId)) ? true : false;
		};

		var itemListenerId = EventService.listen('itemInstance:' + $scope.itemId + ':done', function (event, itemObj) {
			EventService.unlisten(itemListenerId);
			$scope.workspaceId = itemObj.workspaceObj.getId();

			/**
			 * @ngdoc property
			 * @name Controllers.WorkspaceItemController#tabsListenerId
			 * @propertyOf Controllers.WorkspaceItemController
			 * @description `private` The listener for the loading of the tabs
			 *
			 */
			var tabsListenerId = EventService.listen('itemTabs:' + $scope.workspaceId + ':done', function (event, tabsObj) {
				EventService.unlisten(tabsListenerId);
				$scope.tabList = [];
				_.each(tabsObj.getFullList(), function (tab, tabIndex) {
					var actionNameStripped = tab.actionName.substr(1); // Strips out the slash from the action name

					// Searches for the tab in the mapping
					var foundTab = _.find(tabMapping, function (foundTab, foundTabEl) {
						return foundTabEl === actionNameStripped;
					});

					// If undefined, tab should not be displayed
					if (angular.isDefined(foundTab)) {
						// If name is null, the tab has not been customized
						var tabName = (tab.name === null) ? tab.key : tab.name;

						// Pushes the object that's a result of the content retrieved from the endpoint, and the local mapping
						$scope.tabList.push({
							name: tabName,
							id: actionNameStripped,
							active: foundTab.active,
							viewLink: foundTab.active + '-view',
							editLink: foundTab.active + '-edit',
							link: foundTab.link,
							icon: foundTab.icon
						});
					}
				});
			});
			// Gets tab list
			ModelsManager.getTabs($scope.workspaceId);
		});
		ModelsManager.getItem($scope.itemId);

		/**
		 * @ngdoc method
		 * @name Controllers.WorkspaceItemController#viewLoad
		 * @methodOf Controllers.WorkspaceItemController
		 * @description Called whenever a new view has been loaded (an item's "tab"), and broadcasts an event
		 *
		 */
		$scope.viewLoad = function () {
			EventService.send('viewLoad:done');
		};
	}
]);
