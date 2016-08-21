'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewChangeLogController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/changelog.
 *
 * ##Dependencies
 *
 */
class ViewChangeLogController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewChangeLogController#constructor
	 * @methodOf Controllers.workspaceItem.ViewChangeLogController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $stateParams, $location, $filter, $window, $timeout, ModelsManager, EventService, FlyoutService, PermissionService, PLMPermissions, uiGridConstants, _) {
		this.$scope = $scope;
		this.$filter = $filter;
		this.$timeout = $timeout;
		this.$location = $location;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#that
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description `private` Reference to this controller.
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#bundle
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description `private` Assigns the rootScope's bundle (with localization) to this controller's bundle.
		 */
		this.bundle = $rootScope.bundle;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description `private` The current workspace ID.
		 */
		this.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description `private` The current item ID.
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description Stores table column header, and rows, for the tableData
		 */
		this.tableData = {
			columns: [
				{
					displayName: that.bundle.text.dateTime,
					field: 'timestamp',
					enableSorting: true,
					suppressRemoveSort: true,
					sort: {
						direction: uiGridConstants.DESC,
						priority: 1
					},
					cellTemplate: 'changeLogDateRenderer',
					width: '20%'
				},
				{
					displayName: that.bundle.text.changedBy,
					field: 'userDisplayName',
					enableSorting: true,
					suppressRemoveSort: true,
					cellTemplate: 'changeLogUserLinkRenderer',
					width: '20%'
				},
				{
					displayName: that.bundle.text.action,
					field: 'action',
					enableSorting: false,
					width: '20%'
				},
				{
					displayName: that.bundle.text.description,
					field: 'description',
					enableSorting: false,
					cellTemplate: 'descriptionRenderer',
					width: '40%'
				}
			],
			rows: []
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description The view changelog items permission for the user.
		 */
		this.viewPermission = PLMPermissions.VIEW_CHANGE_LOG;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#pageNumber
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description The page to fetch data from.
		 */
		this.pageNumber = 0;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#itemQuantity
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description Amount of items to fetch.
		 */
		this.itemQuantity = 100;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description Stores the date format.
		 */
		this.dateFormat = 'yyyy';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#dateAndHourFormat
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description Stores the date plus hour format.
		 */
		this.dateAndHourFormat = 'hh:mm a';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#currentOrder
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description The initial (or current) sorting order
		 */
		this.currentOrder = 'desc';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#currentColumnId
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description The initial (or current) column id that the data is sorted by
		 */
		this.currentColumnId = 'timestamp';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description `private` Listener for current item.
		 */
		this.itemListenerId = EventService.listen(`itemInstance:${this.itemId}:done`, (event, itemObj) => {
			EventService.unlisten(this.itemListenerId);

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

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewChangeLogController#currentUserListenerId
		 * @propertyOf Controllers.workspaceItem.ViewChangeLogController
		 * @description `private` Listener for current user.
		 */
		this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, UserObj) => {
			EventService.unlisten(this.currentUserListenerId);

			// Set user's date format
			this.dateFormat = UserObj.getDateFormat();
			this.dateAndHourFormat = `${UserObj.getDateFormat()} hh:mm:ss a`;
		}, true);

		ModelsManager.getCurrentUser();
		ModelsManager.getItem(this.itemId);

		// This is the first call, to populate the change log in an initial load
		this.getChangeLogData(this.currentOrder, this.currentColumnId).then(() => {}).catch(() => {});

		// Unlistens to events when scope is destroyed
		$scope.$on('$destroy', () => {
			EventService.unlisten(this.itemListenerId);
			EventService.unlisten(this.currentUserListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewChangeLogController#getChangeLogData
	 * @methodOf Controllers.workspaceItem.ViewChangeLogController
	 * @description Fetches more data for the change log table (this is binded to the tableData widget)
	 *
	 * @param {String} order Order to retrieve data from the server - accepts "asc" or "desc"
	 * @param {String} columnId The id of the column to retrieve the data ordered by
	 *
	 * @returns {Object/Boolean} Promise, that resolves to false if there's nothing else to load, or it's in the middle of the loading process (otherwise should return true)
	 */
	getChangeLogData(order, columnId) {
		// Only reset the data in case the user is changing the sort order, otherwise append it to the list (for infinite scrolling)
		if ((order !== this.currentOrder) || (columnId !== this.currentColumnId)) {

			// Assigns the new vars locally
			this.currentOrder = order;
			this.currentColumnId = columnId;

			this.pageNumber = 1;

			// Resets the data
			this.tableData.rows = [];

		} else {
			++this.pageNumber;
		}

		return new Promise((resolve, reject) => {
			this.ModelsManager.getChangeLog(this.workspaceId, this.itemId, order, columnId, this.pageNumber, this.itemQuantity);
			let changeLogListenerId = this.EventService.listen(`changeLog:${this.itemId}:done`, (event, ChangeLogObj) => {
				this.EventService.unlisten(changeLogListenerId);

				// Iterate through each changelog item
				_.each(ChangeLogObj.getFullList().elements, (element, elementIndex) => {
					// Stores the description (one or more, HTML, or plain text)
					let description = '';

					// The html element holding the cell's content
					let htmlStr = angular.element('<span />');

					if (angular.isDefined(element.description) && element.description !== null) {
						description = element.description;
					}

					// If the list of records has elements
					if (_.isArray(element.records) && element.records.length > 0) {
						if (angular.isDefined(element.records[0]) && element.records[0].rowId !== 0) {
							htmlStr.append(`Row ${element.records[0].rowId}:`);
							htmlStr.append('<br>');
						}

						// Hold the list of elements
						let uList = angular.element('<ul />');

						// Iterate through the records when multiple edits were performed in a batch
						_.each(element.records, (record, i) => {
							let oldValue = (record.oldValue !== '') ? record.oldValue : this.bundle.changeLog.noValue;
							let newValue = (record.newValue !== null) ? record.newValue : '';

							let listItem = angular.element('<li />');
							let labelItem = angular.element('<span />');
							labelItem.addClass('changelog-item-label');
							if (angular.isDefined(record.fieldName) && record.fieldName !== null) {
								labelItem.append(`${record.fieldName}:&nbsp;`);
							}
							listItem.append(labelItem);

							if ((record.oldValue !== null) && (record.oldValue !== ' - ') && (oldValue !== newValue)) {
								let oldValueHTML = angular.element('<span />');
								oldValueHTML.addClass('changelog-old-value');
								oldValueHTML.text(oldValue);

								listItem.append(oldValueHTML);
								listItem.append('&nbsp; \u21d2 &nbsp;');
								// listItem.append(' \u21d2 ');

							}

							let newValueHTML = angular.element('<span />');
							newValueHTML.addClass('changelog-new-value');
							newValueHTML.text(newValue);

							listItem.append(newValueHTML);

							uList.append(listItem);
						});

						// The html object that will be added to the description
						htmlStr.append(uList);

						description += htmlStr[0].outerHTML;
					}

					// Localized action name
					let actionName = this.bundle.item.action.short.name[element.action.toLowerCase()];
					element.action = (actionName) ? actionName : element.action;

					this.tableData.rows.push({
						timestamp: {
							val: this.$filter('UTC')(element.timestamp),
							dateFormat: this.dateAndHourFormat
						},
						userDisplayName: {
							userId: element.userId,
							val: element.userDisplayName
							// link: `grid.appScope.openFlyoutWindow($event, '${element.userId}')`
						},
						action: element.action,
						description: description
					});
				});

				// Checks if the retrieved set is smaller than the default item quantity (i.e. checks if it's at the last page)
				if (_.size(ChangeLogObj.getFullList().elements) < this.itemQuantity) {
					reject();
				} else {
					resolve();
				}

				// need to fire this to have the ui-grid resized properly
				// the order of rendering is the issue
				// TODO: maybe we can find a better solution
				this.$timeout(() => {
					window.dispatchEvent(new Event('resize'));
				}, 2000);
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewChangeLogController#openFlyoutWindow
	 * @methodOf Controllers.workspaceItem.ViewChangeLogController
	 * @description Open flyout window based on the given event and user ID.
	 *
	 * @param {Object} event the event object.
	 * @param {Number} userId The user ID
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
	 * @name Controllers.workspaceItem.ViewChangeLogController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewChangeLogController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.$location.search().mode === 'view');
	}
}

export default ViewChangeLogController;
