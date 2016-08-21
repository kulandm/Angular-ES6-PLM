'use strict';

angular.module('plm360.workspaceItemSuppliedItems', [])

/**
 * @ngdoc object
 * @name Controllers.workspaceItemSuppliedItemsController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/SuppliedItems.
 *
 * ##Dependencies
 *
 */
.controller('WorkspaceItemSuppliedItemsController', [
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
		 * @name Controllers.workspaceItemSuppliedItemsController#firstTimePageLoad
		 * @propertyOf Controllers.workspaceItemSuppliedItemsController
		 * @description `private` To avoid convert string in objects when the page is loaded for first time.  {@link Controllers.workspaceItemSuppliedItemsController#updateContent}
		 */
		var firstTimePageLoad = null;

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemSuppliedItemsController#init
		 * @methodOf Controllers.workspaceItemSuppliedItemsController
		 * @description Initialization function
		 */
		$scope.init = function () {

			firstTimePageLoad = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#tableColumns
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description Stores table column header
			 */
			$scope.tableColumns = [];

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#tableData
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description Stores table data of the change log
			 */
			$scope.tableData = [];

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#workspaceIcon
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description The class name for the icon of this workspace
			 */
			$scope.workspaceIcon = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#isItemPinned
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description A boolean var that controls if this item was pinned to the dashboard
			 */
			$scope.isItemPinned = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#dateFormat
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description Stores the date format
			 */
			$scope.dateFormat = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#dateAndHourFormat
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description Stores the date format, plus hour format
			 */
			$scope.dateAndHourFormat = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#context
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description The context for attaching handler for infinite scrolling
			 */
			$scope.context = angular.element($window);

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#pageNumber
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description The page to fetch data from
			 */
			$scope.pageNumber = 1;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#itemQuantity
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
			 * @description Amount of items to fetch
			 */
			$scope.itemQuantity = 100;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSuppliedItemsController#endOfList
			 * @propertyOf Controllers.workspaceItemSuppliedItemsController
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
					displayName: LocalizationData.suppliedItems.suppliedItem,
					field: 'itemDisplayName',
					enableColumnSorting: true,
					cellRenderer: 'suppliedItemsLinkRenderer',
					width: 20
				},
				{
					displayName: LocalizationData.suppliedItems.supplierPartNumber,
					field: 'supplierPartNumber',
					enableColumnSorting: true,
					width: 20
				},
				{
					displayName: LocalizationData.suppliedItems.manufacturer,
					field: 'manufacturer',
					enableColumnSorting: true,
					width: 20
				},
				{
					displayName: LocalizationData.suppliedItems.manufacturerPartNumber,
					field: 'manufacturerPartNumber',
					enableColumnSorting: true,
					width: 20
				},
				{
					displayName: LocalizationData.suppliedItems.comments,
					field: 'comments',
					width: 20
				}
			];
			// initial load, with the data that has been fetched already
			$scope.parseWorkspaceItemSuppliedItemsItems(ChangeLogObj.getFullList(), $scope.itemQuantity);

		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemSuppliedItemsController#applySort
		 * @methodOf Controllers.workspaceItemSuppliedItemsController
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
		 * @name Controllers.workspaceItemSuppliedItemsController#parseWorkspaceItemSuppliedItemsItems
		 * @methodOf Controllers.workspaceItemSuppliedItemsController
		 * @description Parse fetch data into table rows
		 *
		 * @param {Object} data change log data as fetched from server.
		 * @param {Number} itemQuantity number of items to be displayed on a single page.
		 */
		$scope.parseWorkspaceItemSuppliedItemsItems = function (data, itemQuantity) {
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
						itemDisplayName: {
							userId: element.userId,
							val: element.userDisplayName,
							link: function ($event) {
								// $scope.openFlyoutWindow($event, this.userId);
							}
						},
						supplierPartNumber: element.userId,
						manufacturer: element.action,
						manufacturerPartNumber: element.userId,
						comments: $filter('UTC')(element.timestamp)
					});
				});
			}
		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemSuppliedItemsController#doScroll
		 * @methodOf Controllers.workspaceItemSuppliedItemsController
		 * @description Scroll event handler for infinite scrolling
		 */
		$scope.doScroll = function () {
			if ($scope.endOfList) {
				return;
			}
			$scope.pageNumber++;

			// TODO: USE PROPER METHOD FOR SuppliedItems
			// ModelsManager.getChangeLog($scope.workspaceId, $scope.itemId, $scope.sortingOrder, $scope.sortingColumn, $scope.pageNumber, $scope.itemQuantity).then(function (data) {
			// 	$scope.parseWorkspaceItemChangeLogItems(data.getFullList(), $scope.itemQuantity);
			// });
		};
	}
]);
