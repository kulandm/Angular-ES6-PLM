'use strict';

angular.module('plm360.workspaceItemSourcing', [])

/**
 * @ngdoc object
 * @name Controllers.workspaceItemSourcingController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/Sourcing.
 *
 * ##Dependencies
 *
 */
.controller('WorkspaceItemSourcingController', [
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
	'_',
	function ($scope, $window, $stateParams, $location, $filter, LocalizationData, ModelsManager, ChangeLogObj, UserObj, FlyoutService, _) {

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItemSourcingController#firstTimePageLoad
		 * @propertyOf Controllers.workspaceItemSourcingController
		 * @description `private` To avoid convert string in objects when the page is loaded for first time.  {@link Controllers.workspaceItemSourcingController#updateContent}
		 */
		var firstTimePageLoad = null;

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemSourcingController#init
		 * @methodOf Controllers.workspaceItemSourcingController
		 * @description Initialization function
		 */
		$scope.init = function () {

			firstTimePageLoad = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#tableColumns
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Stores table column header
			 */
			$scope.tableColumns = [];

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#tableData
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Stores table data of the change log
			 */
			$scope.tableData = [];

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#workspaceIcon
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description The class name for the icon of this workspace
			 */
			$scope.workspaceIcon = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#isItemPinned
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description A boolean var that controls if this item was pinned to the dashboard
			 */
			$scope.isItemPinned = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#dateFormat
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Stores the date format
			 */
			$scope.dateFormat = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#dateAndHourFormat
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Stores the date format, plus hour format
			 */
			$scope.dateAndHourFormat = null;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#context
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description The context for attaching handler for infinite scrolling
			 */
			$scope.context = angular.element($window);

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#pageNumber
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description The page to fetch data from
			 */
			$scope.pageNumber = 1;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#itemQuantity
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Amount of items to fetch
			 */
			$scope.itemQuantity = 100;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#endOfList
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description A flag holding whether we've reached the end of all items in the workspace
			 */
			$scope.endOfList = false;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#sortingColumn
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Current column that is being used to sort data by
			 */
			$scope.sortingColumn;

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItemSourcingController#sortingColumn
			 * @propertyOf Controllers.workspaceItemSourcingController
			 * @description Current order of the sorting
			 */
			$scope.sortingOrder;

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
					displayName: LocalizationData.sourcing.supplier,
					field: 'supplierInfo',
					cellRenderer: 'sourcingSupplierRenderer',
					disableSort: true,
					width: 35
				},
				{
					displayName: LocalizationData.sourcing.quotes,
					field: 'supplierQuotes',
					cellRenderer: 'sourcingQuotesRenderer',
					disableSort: true,
					width: 65
				}
			];

			// setup inner table header
			$scope.innerTableColumns = [
				{
					displayName: LocalizationData.sourcing.min,
					field: 'min',
					width: 12
				},
				{
					displayName: LocalizationData.sourcing.max,
					field: 'max',
					width: 12
				},
				{
					displayName: LocalizationData.sourcing.leadTime,
					field: 'leadTime',
					width: 26
				},
				{
					displayName: LocalizationData.sourcing.unitCost,
					field: 'unitCost',
					width: 20
				},
				{
					displayName: LocalizationData.sourcing.comments,
					field: 'comments',
					width: 20
				},
				{
					displayName: LocalizationData.sourcing.useAsDefault,
					field: 'useAsDefault',
					cellRenderer: 'sourcingUseAsDefaultRenderer',
					width: 20
				}
			];

			// initial load, with the data that has been fetched already
			$scope.parseWorkspaceItemSourcingItems(ChangeLogObj.getFullList(), $scope.itemQuantity);

		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemSourcingController#parseWorkspaceItemSourcingItems
		 * @methodOf Controllers.workspaceItemSourcingController
		 * @description Parse fetch data into table rows
		 *
		 * @param {Object} data change log data as fetched from server.
		 * @param {Number} itemQuantity number of items to be displayed on a single page.
		 */
		$scope.parseWorkspaceItemSourcingItems = function (data, itemQuantity) {
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
						supplierInfo: {
							supplier: {
								key: LocalizationData.sourcing.supplier,
								val: element.userDisplayName
							},
							state: {
								key: LocalizationData.sourcing.state,
								val: element.action
							},
							supplierPartNumber: {
								key: LocalizationData.sourcing.supplierPartNumber,
								val: element.userId
							},
							manufacturer: {
								key: LocalizationData.sourcing.manufacturer,
								val: element.userDisplayName
							},
							manufacturerPartNumber: {
								key: LocalizationData.sourcing.manufacturerPartNumber,
								val: element.userId
							},
							comment: {
								key: LocalizationData.sourcing.comment,
								val: $filter('UTC')(element.timestamp)
							}
						},
						supplierQuotes: {
							columns: $scope.innerTableColumns,
							data: [{
								min: (index + 1) * Math.random(),
								max: (index + 1) * Math.random(),
								leadTime: (index + 1) * Math.random(),
								unitCost: (index + 1) * Math.random(),
								comments: $filter('UTC')(element.timestamp),
								useAsDefault: true
							}]
						}
					});
				});
			}
		};

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItemSourcingController#doScroll
		 * @methodOf Controllers.workspaceItemSourcingController
		 * @description Scroll event handler for infinite scrolling
		 */
		$scope.doScroll = function () {
			if ($scope.endOfList) {
				return;
			}
			$scope.pageNumber++;

			// TODO: USE PROPER METHOD FOR Sourcing
			// ModelsManager.getChangeLog($scope.workspaceId, $scope.itemId, $scope.sortingOrder, $scope.sortingColumn, $scope.pageNumber, $scope.itemQuantity).then(function (data) {
			// 	$scope.parseWorkspaceItemChangeLogItems(data.getFullList(), $scope.itemQuantity);
			// });
		};
	}
]);
