'use strict';

angular.module('plm360.workspaceItemWhereUsed', [])

/**
 * @ngdoc object
 * @name Controllers.workspaceItemWhereUsedController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/WhereUsed.
 *
 * ##Dependencies
 *
 */
.controller('WorkspaceItemWhereUsedController', [
	'$scope',
	'$window',
	'$stateParams',
	'$location',
	'$filter',
	'LocalizationData',
	'ModelsManager',
	'ChangeLogObj',
	'UserObj',
	'FlyoutService',
	'ClientSortService',
	'_',
	function ($scope, $window, $stateParams, $location, $filter, LocalizationData, ModelsManager, ChangeLogObj, UserObj, FlyoutService, ClientSortService, _) {

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItemWhereUsedController#firstTimePageLoad
		 * @propertyOf Controllers.workspaceItemWhereUsedController
		 * @description `private` To avoid convert string in objects when the page is loaded for first time.  {@link Controllers.workspaceItemWhereUsedController#updateContent}
		 */
		var firstTimePageLoad = null;

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemWhereUsedController#init
		 * @methodOf Controllers.workspaceItemWhereUsedController
		 * @description Initialization function
		 */
		$scope.init = function () {

			firstTimePageLoad = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#tableColumns
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description Stores table column header
			 */
			$scope.tableColumns = [];

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#tableData
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description Stores table data of the change log
			 */
			$scope.tableData = [];

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#workspaceIcon
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description The class name for the icon of this workspace
			 */
			$scope.workspaceIcon = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#isItemPinned
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description A boolean var that controls if this item was pinned to the dashboard
			 */
			$scope.isItemPinned = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#dateFormat
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description Stores the date format
			 */
			$scope.dateFormat = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#dateAndHourFormat
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description Stores the date format, plus hour format
			 */
			$scope.dateAndHourFormat = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#context
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description The context for attaching handler for infinite scrolling
			 */
			$scope.context = angular.element($window);

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#pageNumber
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description The page to fetch data from
			 */
			$scope.pageNumber = 1;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#itemQuantity
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description Amount of items to fetch
			 */
			$scope.itemQuantity = 100;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemWhereUsedController#endOfList
			 * @propertyOf Controllers.workspaceItemWhereUsedController
			 * @description A flag holding whether we've reached the end of all items in the workspace
			 */
			$scope.endOfList = false;

			if (angular.isDefined($stateParams.editItem)) {
				$scope.editItem = true;
			} else {
				$scope.editItem = false;
			}

			// the date/date + hour format of the user
			$scope.dateFormat = UserObj.getDateFormat();
			$scope.dateAndHourFormat = UserObj.getDateFormat() + ' hh:mm a';

			// setup table header
			$scope.tableColumns = [
				{
					displayName: '#',
					field: 'rowId',
					enableColumnSorting: true,
					width: 30
				},
				{
					displayName: LocalizationData.whereUsed.item,
					field: 'itemDisplayName',
					enableColumnSorting: true,
					cellRenderer: 'whereUsedLinkRenderer',
					width: 40
				},
				{
					displayName: LocalizationData.whereUsed.lifecycle,
					field: 'lifecycle',
					width: 10
				},
				{
					displayName: LocalizationData.whereUsed.quantity,
					field: 'quantity',
					width: 10
				},
				{
					displayName: LocalizationData.whereUsed.units,
					field: 'units',
					enableColumnSorting: true,
					width: 10
				}
			];
			// initial load, with the data that has been fetched already
			$scope.parseWorkspaceItemWhereUsedItems(ChangeLogObj.getFullList(), $scope.itemQuantity);

		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemWhereUsedController#applySort
		 * @methodOf Controllers.workspaceItemWhereUsedController
		 * @description Initiates request for single column sorting.
		 *
		 * @param {String} column	The ID of the column on which to sort - should match <code>columns.field</code>.
		 * @param {String} order	The sort order - can either be 'asc' or 'desc'.
		 */
		$scope.applySort = function (column, order) {
			$scope.tableData = ClientSortService.sort(
				{
					tableHeaders: $scope.tableColumns,
					tableData: $scope.tableData
				},
				{
					columnToSort: column,
					sortOrder: order
				}
			);
		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemWhereUsedController#parseWorkspaceItemWhereUsedItems
		 * @methodOf Controllers.workspaceItemWhereUsedController
		 * @description Parse fetch data into table rows
		 *
		 * @param {Object} data change log data as fetched from server.
		 * @param {Number} itemQuantity number of items to be displayed on a single page.
		 */
		$scope.parseWorkspaceItemWhereUsedItems = function (data, itemQuantity) {
			if (angular.isDefined(data)) {
				$scope.totalItemCount = data.totalRecords || 0;

				if (_.size(data.elements) < itemQuantity) {
					$scope.endOfList = true;
				}

				// iterates through each change log item
				_.each(data.elements, function (element, index) {

					// assembles the table data
					$scope.tableData.push({
						// TODO: need to revisit date adjustment
						rowId: index + 1,
						itemDisplayName: {
							userId: element.userId,
							val: element.userDisplayName,
							link: function ($event) {
								// $scope.openFlyoutWindow($event, this.userId);
							}
						},
						lifecycle: element.action,
						quantity: index * Math.random(),
						units: index * Math.random()
					});
				});
			}
		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemWhereUsedController#doScroll
		 * @methodOf Controllers.workspaceItemWhereUsedController
		 * @description Scroll event handler for infinite scrolling
		 */
		$scope.doScroll = function () {
			if ($scope.endOfList) {
				return;
			}
			$scope.pageNumber++;

			// TODO: USE PROPER METHOD FOR WhereUsed
			// ModelsManager.getChangeLog($scope.workspaceId, $scope.itemId, $scope.sortingOrder, $scope.sortingColumn, $scope.pageNumber, $scope.itemQuantity).then(function (data) {
			// 	$scope.parseWorkspaceItemChangeLogItems(data.getFullList(), $scope.itemQuantity);
			// });
		};
	}
]);
