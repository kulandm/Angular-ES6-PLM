'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewProjectManagementController
 *
 * @description This controller corresponds to the project management tab.
 *
 * ##Dependencies
 */
class ViewProjectManagementController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#constructor
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $stateParams, $location, $compile, $document, $filter, $timeout, $window, ModelsManager, EventService, PermissionService, uiGridConstants, PLMPermissions, FlyoutService, _) {
		this.$scope = $scope;
		this.$state = $state;
		this.$timeout = $timeout;
		this.$location = $location;
		this._ = _;
		this.ModelsManager = ModelsManager;
		this.PermissionService = PermissionService;
		this.FlyoutService = FlyoutService;
		this.EventService = EventService;

		// Listener IDs for the data we need
		let itemListenerId;
		let currentUserListenerId;
		let linkedItemsListenerId;
		let projectItemsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#resizerCounter
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description A counter limiting how many retries we use to resize the grid/chart properly
		 * this is needed since the initialization happens asynchronously between template include and controller initialization
		 */
		this.resizerCounter = 0;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#ganttChartData
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description An array that Stores gantt chart taks.
		 */
		this.ganttChartData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#ganttChartScale
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description A string that Stores gantt chart scale data, default is 'year'.
		 */
		this.ganttChartScale = 'year';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#ganttChartAvailableScales
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description An array that Stores gantt chart scales.
		 */
		this.ganttChartAvailableScales = ['day', 'week', 'month', 'quarter', 'year'];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#projectData
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description {Object} Stores the data retrieved from the endpoint
		 */
		this.projectData = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#jsPlumbConnectionConfig
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description Configuration options for the connections displayed
		 * when a task has predecessors.
		 */
		this.jsPlumbConnectionConfig = {
			anchors: ['Left', 'Right'],
			connector: ['Flowchart', {stub: 30, gap: 0, alwaysRespectStubs: true, midpoint: 0.4}],
			endpoint: 'Blank',
			overlays: [
				['Arrow', {width: 8, length: 5, location: 1}]
			],
			paintStyle: {strokeStyle: 'black', lineWidth: 1.1, dashstyle: '3'}
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description The view project management items permission for the user
		 *
		 */
		this.viewPermission = PLMPermissions.VIEW_PROJECT_MANAGEMENT;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description The add project management items permission for the user
		 *
		 */
		this.addPermission = PLMPermissions.ADD_PROJECT_ITEM;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description The edit project management items permission for the user
		 *
		 */
		this.editPermission = PLMPermissions.EDIT_PROJECT_ITEM;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#deletePermission
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description The delete project management items permission for the user
		 *
		 */
		this.deletePermission = PLMPermissions.DELETE_PROJECT_ITEM;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#isDataAvailable
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description {Boolean} checks for data retrieved from the endpoint
		 *
		 */
		this.isDataAvailable = true;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#linkableItemsOptions
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description A map of values that need to be sent to the
		 * AddLinkableItemsController (hence attached to the $scope instead of
		 * `this`)
		 */
		$scope.linkableItemsOptions = {
			itemsType: 'projectItems',
			associationEvent: 'associateProjectItem'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description Stores table column header and rows for the tableData.
		 */
		this.tableData = {
			columns: [
				{
					displayName: '#',
					field: 'rowId',
					width: '7%'
				},
				{
					displayName: '',
					field: 'itemType',
					cellTemplate: 'itemTypeTemplate',
					width: '5%'
				},
				{
					displayName: $rootScope.bundle.projectManagement.item,
					field: 'title',
					cellTemplate: 'itemLinkTemplate',
					footerCellClass: 'project-summary-title',
					aggregationType: () => $rootScope.bundle.projectManagement.summary
				},
				{
					displayName: $rootScope.bundle.projectManagement.start,
					field: 'startDate',
					cellTemplate: 'dateTemplate',
					footerCellTemplate: 'footerDateTemplate',
					aggregationType: () => this.projectData ? this.projectData.startDate : '',
					width: '10%'
				},
				{
					displayName: $rootScope.bundle.projectManagement.end,
					field: 'endDate',
					cellTemplate: 'dateTemplate',
					footerCellTemplate: 'footerDateTemplate',
					aggregationType: () => this.projectData ? this.projectData.endDate : '',
					width: '10%'
				},
				{
					displayName: $rootScope.bundle.projectManagement.duration,
					field: 'duration',
					cellTemplate: 'durationTemplate',
					footerCellTemplate: 'footerDurationTemplate',
					aggregationType: () => this.projectData ? parseInt(this.projectData.duration) : '',
					width: '10%'
				},
				{
					displayName: $rootScope.bundle.projectManagement.pre,
					field: 'pre',
					cellTemplate: 'predecessorTemplate',
					width: '5%'
				},
				{
					displayName: $rootScope.bundle.projectManagement.status,
					field: 'status',
					cellTemplate: 'statusTemplate',
					width: '15%'
				},
				{
					displayName: $rootScope.bundle.projectManagement.complete,
					field: 'progress',
					cellTemplate: 'percentCompleteTemplate',
					footerCellTemplate: 'footerPercentCompleteTemplate',
					aggregationType: () => this.projectData ? this.projectData.progress : '',
					width: '10%'
				}
			],
			rows: []
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description Stores the date format.
		 */
		this.dateFormat = 'yyyy';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#dateAndHourFormat
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description Stores the date plus hour format.
		 */
		this.dateAndHourFormat = 'hh:mm a';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewProjectManagementController#flyoutInstance
		 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
		 *
		 * @description reference of add item flyout instance.
		 */
		this.flyoutInstance = null;

		// Listen once for the user's profile (we need the date format)
		currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, UserObj) => {
			EventService.unlisten(currentUserListenerId);

			// Set user's date format
			this.dateFormat = UserObj.getDateFormat();
			this.dateAndHourFormat = `${UserObj.getDateFormat()} hh:mm a`;
		});

		// Listen for project items data
		projectItemsListenerId = EventService.listen(`projectItems:${$location.search().itemId}:done`, (event, projectItemsObj) => {
			this.projectData = projectItemsObj.getFullList();
			this.tableData.rows = this.parseData(projectItemsObj.getFullList().projectItems);
			this.convertNodesToGanttRows(this.tableData.rows);
			this.calculateGranularity();

			this.isDataAvailable = this.tableData.rows.length > 0;
		});

		// Listen for item, hence user permissions
		itemListenerId = EventService.listen(`itemInstance:${$location.search().itemId}:done`, (event, itemObj) => {
			EventService.unlisten(itemListenerId);

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
		});

		// Listen for an item being added using 'Add linked items'
		linkedItemsListenerId = EventService.listen('itemInstance:*:associationComplete', function () {
			ModelsManager.getProjectItems($location.search().itemId);
		});

		// Get the data for the first load
		ModelsManager.getCurrentUser();
		ModelsManager.getProjectItems($location.search().itemId);
		ModelsManager.getItem($location.search().itemId);

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItem.ViewProjectManagementController#registerApi
		 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description register the events associated with the gantt chart.
		 *
		 * @param {Object} api object associated with the gantt plugin.
		 *
		 */
		this.registerApi = (api) => {
			$scope.viewProjectManagementCtrl = this;

			api.directives.on.new($scope, (directiveName, directiveScope, directiveEl) => {
				if (directiveName === 'ganttSideContent') {
					let ifElement = angular.element('<div/>');
					angular.element(ifElement).addClass('side-element');

					let treeTableContainer = angular.element('<table-data/>');
					angular.element(treeTableContainer).attr('columns', 'viewProjectManagementCtrl.tableData.columns');
					angular.element(treeTableContainer).attr('rows', 'viewProjectManagementCtrl.tableData.rows');
					angular.element(treeTableContainer).attr('column-footer', '');
					angular.element(treeTableContainer).attr('tree-view', '');
					angular.element(ifElement).append(treeTableContainer);

					directiveEl.append($compile(ifElement)($scope));
				}

				// Redraw the predecessors when the gantt task is re-rendered
				if (directiveName === 'ganttTask') {
					$timeout(() => {
						jsPlumb.repaintEverything();
						this.drawPredecessors();
					}, 0);
				}

				this.resizerCounter = 0;
			});

			api.core.on.rendered($scope, () => {
				// The element to which the connection nodes created by jsPlumb will be attached.
				// NOTE: jsPlumb's nodes have absolute positioning.
				// NOTE: This must be set after the gantt chart has rendered (since it uses .gantt-body)
				let jsPlumbContainerElement = document.querySelector('.gantt-body');

				jsPlumb.bind('ready', () => {
					jsPlumb.setContainer(jsPlumbContainerElement);
				});

				// Redraw the predecessors when the gantt task is not re-rendered but scale changes
				api.columns.on.generate($scope, (columns, headers) => {
					jsPlumb.repaintEverything();
					this.drawPredecessors();
				});

				this.resizerCounter = 0;
			});
		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItem.ViewProjectManagementController#getColumnWidth
		 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
		 * @description calculates the column width for gantt chart based on scale.
		 *
		 * @param {String} scale for the gantt chart.
		 *
		 * @return {Integer} to set the value for column width.
		 */
		this.getColumnWidth = function (scale) {
			if (scale.match(/.*?week.*?/)) {
				return 60;
			}

			if (scale.match(/.*?month.*?/)) {
				return 100;
			}

			if (scale.match(/.*?quarter.*?/)) {
				return 100;
			}

			if (scale.match(/.*?year.*?/)) {
				return 120;
			}

			return 40;
		};

		$scope.$on('destroy', () => {
			if (this.flyoutInstance) {
				// Close the flyout when moving to another view or when
				// pressing the browser's Back button
				this.flyoutInstance.cancel();
			}
			jsPlumb.detachEveryConnection(); // Just in case
			EventService.unlisten(linkedItemsListenerId);
			EventService.unlisten(projectItemsListenerId);
			EventService.unlisten(itemListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#convertNodesToGanttRows
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Modifies the project items such that they can be displayed
	 * in the table.
	 */
	convertNodesToGanttRows(projectItems) {
		this.ganttChartData = this._.map(projectItems, function (item, index) {
			let taskId = item.__self__ ? item.__self__.match(/\d+$/)[0] : ''; // for predecessors
			return {
				title: item.title,
				tasks: [
					{
						name: item.type ? `${item.progress}%` : '',
						tooltips: item.startDate === item.endDate,
						classes: item.type ? [`project-item-status-tinted-${item.statusFlag.toLowerCase()} project-item-type-${item.itemType.toLowerCase()}`, `task-${taskId}`] : 'project-item-type-wfm-tinted project-item-type-wfm-default',
						from: new Date(item.startDate),
						to: new Date(item.endDate),
						progress: {
							color: true, // a bit of a hack to avoid !important in the class
							percent: `${item.progress}`,
							classes: item.type ? [`project-item-type-${item.itemType.toLowerCase()} project-item-status-${(item.statusFlag && item.statusFlag.toLowerCase())}`] : ''
						}
					}
				]
			};
		});

		this.$timeout(() => {
			this.resizeGridHeight();
		}, 100);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#resizeGridHeight
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Rezize the height of grid header and viewport
	 */
	resizeGridHeight() {
		let sideElement = document.querySelectorAll('#itemnav .ui-grid');
		let ganttBody = document.querySelectorAll('#itemnav .gantt-scrollable');
		let ganttHeader = document.querySelectorAll('#itemnav .gantt-header');
		let gridHeader = document.querySelectorAll('#itemnav .ui-grid-render-container-body .ui-grid-header-canvas');

		if (sideElement[0] && ganttBody[0] && ganttHeader[0] && gridHeader[0]) {
			angular.element(sideElement[0]).css({
				height: (ganttBody[0].clientHeight + ganttHeader[0].clientHeight) + 'px'
			});

			// The grid header height should be re-calculated if the gantt chart header height changes
			angular.element(gridHeader[0]).css({
				height: (ganttHeader[0].clientHeight - 1) + 'px'
			});
			this.resizerCounter++;
			if (this.resizerCounter < 10) {
				this.$timeout(() => {
					this.resizeGridHeight();
				}, 100);
			}
		} else {
			this.$timeout(() => {
				this.resizeGridHeight();
			}, 1000);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#calculateGranularity
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Calculates the granularity of gantt chart based on the maximum duration
	 */
	calculateGranularity() {
		let duration = this.projectData.duration;
		if (duration <= 12) {
			this.ganttChartScale = 'day';
		} else if (duration <= 90) {
			this.ganttChartScale = 'week';
		} else if (duration <= 365) {
			this.ganttChartScale = 'month';
		} else if (duration <= 1095) {
			this.ganttChartScale = 'quarter';
		} else {
			this.ganttChartScale = 'year';
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#parseData
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Modifies the project items such that they can be displayed
	 * in the table.
	 */
	parseData(projectItems, treeLevel = 0) {
		// Add row ID for all items. We need to do this first because the 'pre'
		// field needs the row IDs to be present
		if (treeLevel === 0) {
			this._.each(projectItems, (item, index) => {
				item.rowId = index + 1;
			});
		}

		return this._.map(projectItems, (item, index) => {
			item.$$treeLevel = treeLevel;

			// Add itemType for items which has type defined
			if (item.type) {
				item.itemType = item.type.title;
			}

			// Add href for items whose descriptors are links
			if (item.item) {
				let [, workspaceId, itemId] = item.item.link.match(/(\d+)\/items\/(\d+)$/);
				item.href = this.$state.href('details', {
					workspaceId: workspaceId,
					tab: 'details',
					view: 'full',
					mode: 'view',
					itemId: `${workspaceId}@${itemId}`
				});
			}

			// Convert duration to a number
			item.duration = parseInt(item.duration);

			// Map predecessors to row IDs (if present)
			if (treeLevel === 0) {
				item.pre = this._.map(item.predecessors, (predecessor) => {
					return projectItems.find((item) => {
						return item.__self__ === predecessor.link;
					}).rowId;
				});
			}

			// Sort predecessors in descending order
			item.pre = this._.sortBy(item.pre).reverse();

			item.isExpandable = item.type && (item.type.title === 'WFP' || item.type.title === 'WFM');
			item.isCollapsed = true;

			return item;
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#expandRow
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Trigger row expansion
	 *
	 * @param {Object} row The row that should be expanded
	 * @param {Object} grid The grid object (to which the row belongs)
	 *
	 */
	expandRow(row, grid) {
		grid.api.treeBase.expandRow(row);
		this.onRowExpanded(row);
		row.entity.isCollapsed = false;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#collapseRow
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Trigger row collapsing.
	 *
	 * @param {Object} row The row that should be collapsed.
	 * @param {Object} grid The grid object (to which the row belongs)
	 *
	 */
	collapseRow(row, grid) {
		grid.api.treeBase.collapseRow(row);
		row.entity.isCollapsed = true;

		let parentNodeIndex = row.grid.rows.indexOf(row);
		let childNodes = this._.find(this._.rest(row.grid.rows, parentNodeIndex + 1), nodeObj =>
			nodeObj.treeLevel <= row.grid.rows[parentNodeIndex].treeLevel);
		let lastChildNodeIndex = this._.lastIndexOf(row.grid.rows, childNodes);

		// condition to check if there are no more rows
		if (lastChildNodeIndex === -1) {
			this.tableData.rows.splice(parentNodeIndex + 1, this._.rest(row.grid.rows, parentNodeIndex).length);
		} else {
			this.tableData.rows.splice(parentNodeIndex + 1, lastChildNodeIndex - (parentNodeIndex + 1));
		}

		this.convertNodesToGanttRows(this.tableData.rows);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#onRowExpanded
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Triggered when a row is expanded
	 *
	 * @param {Object} row The row that was expanded.
	 *
	 */
	onRowExpanded(row) {
		// Fetch children for WFP items (if they haven't been fetched already)
		if (row.entity.type.title === 'WFP' || row.entity.type.title === 'WFM') {

			// Get item's ID (`workspaceId@itemId`)
			let matches = row.entity.item.link.match(/(\d+)\/items\/(\d+)$/);
			let id = `${matches[1]}@${matches[2]}`;

			// Fetch the item
			let itemsListenerId = this.EventService.listen(`projectItems:${id}:done`, (event, projectItemsObj) => {
				this.EventService.unlisten(itemsListenerId);

				let items = this.parseData(projectItemsObj.getFullList().projectItems, row.entity.$$treeLevel + 1);

				// Add rows into the table (must be spliced in after their
				// parent)
				let parentRowIndex = row.grid.rows.indexOf(row);
				let tableRows = this.tableData.rows;
				tableRows.splice(parentRowIndex + 1, 0, ...items);
				this.convertNodesToGanttRows(tableRows);
				this.tableData.rows = tableRows;

				this.resizeGridHeight();
			});

			this.ModelsManager.getProjectItems(id, row.entity.type.title === 'WFM');

			row.entity.areChildrenFetched = true;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#hasActiveFlyout
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description return true if add flyout is active.
	 *
	 * @return {Boolean} true, if add flyout is active.
	 */
	hasActiveFlyout() {
		return this.flyoutInstance && this.flyoutInstance.isActive() === true;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Trigger multi select flyout display state.
	 *
	 * @param {Object} event Event object associated with the click event.
	 *
	 */
	triggerAdd(event) {
		let target = event.currentTarget;

		this.flyoutInstance = this.FlyoutService.open({
			templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
			anchorEl: angular.element(target),
			flyoutClass: 'add-item-flyout',
			placement: 'bottom-left',
			showArrow: true,
			backdropOption: 2,
			controller: 'AddLinkableItemsController',
			controllerAs: 'addLinkableItemsCtrl',
			scope: this.$scope
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#drawPredecessors
	 * @propertyOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description `private` Draws the connections using jsPlumb to connect tasks to their predecessors.
	 */
	drawPredecessors() {
		jsPlumb.detachEveryConnection();

		this._.each(this.tableData.rows, (projectItem) => {
			let taskId = projectItem.__self__ ? projectItem.__self__.match(/\d+$/)[0] : '';
			this._.each(projectItem.predecessors, (predecessor) => {
				jsPlumb.connect({
					source: document.querySelector(`.task-${taskId}`),
					target: document.querySelector(`.task-${predecessor.title}`)
				}, this.jsPlumbConnectionConfig);
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewProjectManagementController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewProjectManagementController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.$location.search().mode === 'view');
	}
}

export default ViewProjectManagementController;
