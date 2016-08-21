'use strict';

/**
 * @ngdoc object
 * @name Controllers.ClassicAttachmentsGridController
 *
 * @description This controller is responsible for fetching the data from the
 * classic v1 rest endpoint. It also structures the ui-grid in which the
 * attachment data would be displayed.
 *
 */
class ClassicAttachmentsGridController {

	/*
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsGridController#constructor
	 * @methodOf Controllers.ClassicAttachmentsGridController
	 * @description The class constructor
	 */
	constructor($scope, $rootScope, cpdmAttachmentsService, LocalizationService) {
		// Setting options for the grid
		$scope.gridOptions = {
			enableRowHeaderSelection: false,
			enableRowSelection: true,
			enableSorting: false,
			multiSelect: false,
			noUnselect: false, // Allows user to unselect the selected row
			showTreeExpandNoChildren: false,
			showTreeRowHeader: false
		};

		$scope.gridOptions.onRegisterApi = function (gridApi, core) {
			$scope.gridApi = gridApi;

			// Fetch the value of the status on row selection
			$scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
				if (row.entity.isCollapsed || row.entity.isExpandable) {
					row.isSelected = false;
				} else {
					$scope.selectedRowInfo({
						fileInfo: {
							fileId: row.entity.fileID,
							fileName: row.entity.fileName,
							fileStatus: row.entity.status,
							fileTitle: row.entity.resourceName,
							fileVersion: row.entity.fileVersion,
							fileCheckoutOutBy: row.entity.checkOutUserID,
							folderId: row.entity.folderId,
							folderName: row.entity.folderName
						},
						isRowSelected: row.isSelected
					});
				}
			});

			// Manage the visibilty of checkin, checkout and undo button when grid is repainted
			$scope.gridApi.core.on.rowsRendered($scope, function () {
				$scope.selectedRowInfo({
					isRowSelected: false
				});
			});
		};

		$scope.$watchGroup(['workspaceId', 'itemId'], function (value) {
			// Check if both workspaceId and itemId have been touched
			if (value[0] && value[1]) {
				getAttachments(value[0], value[1]);

				// Listen for refresh event. This is useful, when we need to
				// refresh the attachment list after any update operation.
				$rootScope.$on('attachment:' + $scope.itemId + ':refresh', function () {
					getAttachments($scope.workspaceId, $scope.itemId);
				});
			}
		});

		/**
		 * @ngdoc method
		 * @name Controllers.ClassicAttachmentsGridController#toggleExpansion
		 * @methodOf Controllers.ClassicAttachmentsGridController
		 * @description Toggle the expansion/collapsing for folder rows
		 *
		 * @param {Object} row The row to toggle
		 * @param {Object} grid The ui-grid object
		 */
		$scope.toggleExpansion = function (row, grid) {
			if (row.entity.isCollapsed) {
				grid.api.treeBase.expandRow(row);
				row.entity.isCollapsed = false;
			} else {
				grid.api.treeBase.collapseRow(row);
				row.entity.isCollapsed = true;
			}
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ClassicAttachmentsGridController#getAttachments
		 * @methodOf Controllers.ClassicAttachmentsGridController
		 * @description `private` Get attachments using cpdmAttachmentsService
		 *
		 * @param {String} workspaceId The workspace id
		 * @param {String} userId The id of the user
		 *
		 * @return {Object} A promise that resolves with a list of all the attachments
		 */
		var getAttachments = function (workspaceId, itemId) {
			return cpdmAttachmentsService.getAttachments(workspaceId, itemId).then(function (attachmentList) {

				// Group the attachments by folder (or no folder)
				var attachmentsByFolder = _.groupBy(attachmentList, function (item) {
					return item.file.folderName || '0';
				});

				var attachments = [];
				var rowCounter = 0;

				_.each(attachmentsByFolder, function (folderItems, folderName) {
					// Tree level for folder
					if (folderName !== '0') {
						attachments.push({
							folderName: folderName,
							$$treeLevel: 0,
							isExpandable: true,
							isCollapsed: true
						});
					}

					_.each(folderItems, function (item) {
						item = item.file;

						item.rowId = ++rowCounter;
						item.status = item.fileStatus.status.trim();
						item.description = item.description;

						// Use substring to get the extension (e.g. return .txt
						// if the file name is abc.autodesk.plm.cpdm.txt).
						// Also check that there is an extension, otherwise
						// defaults to an empty string
						var fileName = item.fileName;
						var extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
						item.fileType = fileName === extension ? '' : extension;

						// Use the fileType as file icon
						item.icon = item.fileType;

						// Get the displayName based upon the checkin and
						// checkout status
						var isCheckedOut = item.fileStatus.status.trim() === 'Checked OUT';
						item.displayName = {
							userId: isCheckedOut ? item.checkOutUserID : item.createdUserID,
							displayName: isCheckedOut ? item.checkOutDisplayName : item.createdDisplayName
						};

						// Get the correct timestamp as per the checked-in and
						// checked-out status
						item.timeStamp = isCheckedOut ? item.checkOutTimeStamp : item.timeStamp;

						// Set the respective treeLevel for attachments
						// with/without folders
						if (folderName === '0') {
							item.$$treeLevel = 0;
							item.isExpandable = false;
						} else {
							item.$$treeLevel = 1;
						}

						attachments.push(item);
					});
				});

				$scope.gridOptions.data = attachments;
				cpdmAttachmentsService.setAttachmentsTitleList(attachments);
			});
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ClassicAttachmentsGridController#triggerUserProfileFlyout
		 * @methodOf Controllers.ClassicAttachmentsGridController
		 * @description click handler for user info column
		 *
		 * @param {Object} event Event object associated with the click
		 * @param {String} userId The id of the user
		 */
		$scope.triggerUserProfileFlyout = function (event, userId) {
			if ($scope.showUserInfo) {
				$scope.showUserInfo({
					event: event,
					userId: userId
				});
			}
		};

		LocalizationService.init().then(() => {
			$scope.gridOptions.columnDefs = [
				{
					field: 'rowId',
					displayName: '#',
					width: '75'
				},
				{
					field: 'icon',
					displayName: $rootScope.bundle.attachmentsGrid.title,
					cellTemplate: 'iconTemplate'
				},
				{
					field: 'fileName',
					displayName: $rootScope.bundle.attachmentsGrid.name
				},
				{
					field: 'status',
					displayName: $rootScope.bundle.attachmentsGrid.status,
					cellTemplate: 'statusTemplate'
				},
				{
					field: 'fileVersion',
					displayName: $rootScope.bundle.attachmentsGrid.version
				},
				{
					field: 'fileType',
					displayName: $rootScope.bundle.attachmentsGrid.type
				},
				{
					field: 'fileSize',
					displayName: $rootScope.bundle.attachmentsGrid.size,
					cellFilter: 'fileSizeFilter'
				},
				{
					field: 'timeStamp',
					displayName: $rootScope.bundle.attachmentsGrid.lastActivity,
					cellFilter: 'date: "medium"'
				},
				{
					field: 'displayName',
					displayName: $rootScope.bundle.attachmentsGrid.performedBy,
					cellTemplate: 'userLinkTemplate'
				},
				{
					field: 'description',
					displayName: $rootScope.bundle.attachmentsGrid.description
				}
			];
		});
	}
}

export default ClassicAttachmentsGridController;
