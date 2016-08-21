'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewRelationshipsController
 *
 * @description This controller corresponds to the relationships view.
 */
class ViewRelationshipsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description The class constructor.
	 */
	constructor(_, $location, $mdDialog, $rootScope, $scope, $state, $timeout, $q, EventService, FlyoutService, ModelsManager, PermissionService, UrnParser, PLMPermissions, NotificationService, NotificationTypes, uiGridConstants, FieldTypes) {
		this._ = _;
		this.$location = $location;
		this.$mdDialog = $mdDialog;
		this.$scope = $scope;
		this.$state = $state;
		this.$timeout = $timeout;
		this.$q = $q;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.ModelsManager = ModelsManager;
		this.UrnParser = UrnParser;
		this.PLMPermissions = PLMPermissions;
		this.FieldTypes = FieldTypes;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Listener for item object.
		 */
		let itemListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#relatedItemsListenerId
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Listener for the list of related items.
		 */
		let relatedItemsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#linkedItemsListenerId
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Listener for linked items being saved.
		 */
		let linkedItemsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#addLinkableItemsListenerId
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Listener for the items selected by the user from the
		 * Add items flyout.
		 */
		let addLinkableItemsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#directions
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Direction types received from and sent to the server.
		 */
		this.directions = {
			BI_DIRECTIONAL: 'Bi-Directional',
			UNI_DIRECTIONAL: 'Uni-Directional'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The workspace id of the current item.
		 */
		this.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The actual id of the current item.
		 */
		this.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#viewStateName
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The name of the view state for this tab.
		 */
		this.viewState = 'relationships';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#edit
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description A boolean val that controls if the user is in view or
		 * editing mode, to render form elements.
		 */
		this.edit = (this.$location.search().mode === 'edit');

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The add permission for this view.
		 */
		this.addPermission = PLMPermissions.ADD_RELATIONSHIPS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The edit permission for this view.
		 */
		this.editPermission = PLMPermissions.EDIT_RELATIONSHIPS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The view permission for this view.
		 */
		this.viewPermission = PLMPermissions.VIEW_RELATIONSHIPS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#deletePermission
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The delete permission for this view.
		 */
		this.deletePermission = PLMPermissions.DELETE_RELATIONSHIPS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#hasEditPermission
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Whether the user has the edit permission.
		 */
		this.hasEditPermission;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#hasActionPermission
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description true, when the item has Add-Edit-Delete work-flow permission.
		 */
		this.hasActionPermission = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#disableSelection
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description true, when row selection is disabled.
		 */
		this.disableSelection = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#RelatedItemsObj
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The reference of {@link Models#RelatedItems} associated with this view.
		 */
		this.RelatedItemsObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#selectedRelationships
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The list of selected relationships.
		 */
		this.selectedRelationships = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#bundle
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The localization bundle.
		 */
		this.bundle = $rootScope.bundle;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description Stores table column header, and rows, for the
		 * tableData component.
		 */
		this.tableData = {
			columns: [
				{
					field: 'indicator',
					displayName: '',
					cellTemplate: 'indicatorTemplate',
					enableColumnResizing: false,
					width: '5',
					enableSorting: false
				},
				{
					field: 'selection',
					headerCellTemplate: 'checkboxHeaderTemplate',
					cellTemplate: 'checkboxTemplate',
					enableColumnResizing: false,
					width: '50'
				},
				{
					displayName: $rootScope.bundle.relationships.item,
					field: 'item.title',
					cellTemplate: 'linkRenderer'
				},
				{
					displayName: $rootScope.bundle.relationships.workspace,
					field: 'workspace.title'
				},
				{
					displayName: $rootScope.bundle.relationships.currentState,
					field: 'state.title'
				},
				{
					displayName: $rootScope.bundle.relationships.directionType,
					field: 'directionField',
					cellTemplate: 'editableCellTemplate_direction',
					dataType: FieldTypes.PICKLIST,
					fieldMeta: {}
				},
				{
					displayName: $rootScope.bundle.relationships.description,
					field: 'descriptionField',
					cellTemplate: 'editableCellTemplate',
					dataType: FieldTypes.SINGLE_LINE_TEXT,
					fieldMeta: {
						fieldLength: 150
					}
				}
			],
			rows: []
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#gridApiInterface
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The api interface of grid ui to control column visibility based on permissions.
		 */
		this.gridApiInterface;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#flyoutInstance
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 *
		 * @description reference of add item flyout instance.
		 */
		this.flyoutInstance = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#linkableItemsOptions
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description A map of values that need to be sent to the
		 * AddLinkableItemsController (hence attached to the $scope instead of
		 * `this`).
		 */
		$scope.linkableItemsOptions = {
			itemsType: 'relationshipItems'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewRelationshipsController#addedItems
		 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
		 * @description The items that have been added by the user using the
		 * Add flyout (used to list in the table in the edit mode so that user
		 * can modify them before actually adding)
		 */
		this.addedItems = [];

		itemListenerId = EventService.listen(`itemInstance:${$location.search().itemId}:done`, (event, itemObj) => {
			EventService.unlisten(itemListenerId);
			this.itemId = itemObj.getId();
			this.workspaceId = itemObj.workspaceObj.getId();
			this.getRelatedWorkspaces(this.workspaceId);

			PermissionService.checkPermissionByItem(itemObj, this.editPermission, true, true).then(hasEditPermission => {
				this.hasEditPermission = hasEditPermission;
				ModelsManager.getRelatedItems($location.search().itemId);
			});

			this.$q.all(
				[PermissionService.checkPermissionByItem(itemObj, this.deletePermission, true, true),
				PermissionService.checkPermissionByItem(itemObj, this.addPermission, true, true),
				PermissionService.checkPermissionByItem(itemObj, this.editPermission, true, true)])
				.then((permissions) => {
					// Determine if there is add, edit or delete permissions
					this.hasActionPermission = permissions[0] || permissions[1] || permissions[2];
					// Disable the checkboxes if there is no edit or delete permissions
					this.disableSelection = !(permissions[0] || permissions[2]);
			});

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

		relatedItemsListenerId = EventService.listen(`relatedItems:${$location.search().itemId}:done`, (event, relatedItemsObj) => {
			this.RelatedItemsObj = relatedItemsObj;

			if (this.isEditState() && this.$state.params.addedItems && this.$state.params.addedItems.length) {
				let addedItemRefs = this._.pluck(this.$state.params.addedItems, 'ref');

				let parsedAddedItems = this.parseRelatedItems(addedItemRefs, true);
				let parsedExistingItems = this.parseRelatedItems(relatedItemsObj.getFullList());

				this.tableData.rows = parsedAddedItems.concat(parsedExistingItems);
			} else {
				this.tableData.rows = this.parseRelatedItems(relatedItemsObj.getFullList());
			}

			// need to fire this to have the ui-grid resized properly
			// the order of rendering is the issue
			// TODO: maybe we can find a better solution
			this.$timeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 2000);
		});

		// Go to the hybrid add/edit state when the user selects linkable items
		// for adding
		addLinkableItemsListenerId = EventService.listen('linkableItems:added', (event, ...addedItems) => {
			this.$state.go(this.viewState, {
				addedItems: addedItems,
				tab: this.$location.search().tab,
				view: this.$location.search().view,
				mode: 'edit',
				itemId: this.$location.search().itemId
			});
		});

		// Get all the [latest] related items again when any linkable items are
		// added
		linkedItemsListenerId = EventService.listen('itemInstance:*:associationComplete', function () {
			ModelsManager.getRelatedItems($location.search().itemId);
		});

		ModelsManager.getItem($location.search().itemId);

		$scope.$on('$destroy', () => {
			if (this.flyoutInstance) {
				// Close the flyout when moving to another view or when
				// pressing the browser's Back button
				this.flyoutInstance.cancel();
			}
			EventService.unlisten(relatedItemsListenerId);
			EventService.unlisten(addLinkableItemsListenerId);
			EventService.unlisten(linkedItemsListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#parseRelatedItems
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description create table data from {@link Models#RelatedItems} instance
	 *
	 * @param {Object} relatedItemsObj instance of {@link Models#RelatedItems}
	 * @param {Boolean} isNewlyAdded whether the items have just been added
	 * (but not saved yet)
	 */
	parseRelatedItems(relatedItems, isNewlyAdded) {
		return this._.map(relatedItems, relatedItem => {
			let result = relatedItem.json;
			let itemLink = this.UrnParser.encode(result.item.urn);
			let itemWs = result.item.urn.split('.').reverse()[1];

			if (isNewlyAdded) {
				result.associateItem = {
					itemId: this.itemId,
					workspaceId: this.workspaceId
				};
			}

			result.item.href = this.$state.href('details', {
				workspaceId: itemWs,
				tab: 'details',
				view: 'full',
				mode: 'view',
				itemId: itemLink
			});

			result.isNewlyAdded = isNewlyAdded;

			result.descriptionField = {
				value: result.description || '',
				originalValue: result.description || ''
			};

			let directionOption = [{
				title: this.bundle.relationships.biDirectional,
				link: this.directions.BI_DIRECTIONAL
			}, {
				title: this.bundle.relationships.uniDirectional,
				link: this.directions.UNI_DIRECTIONAL
			}];

			let selectedDirection = result.direction && result.direction.type === this.directions.UNI_DIRECTIONAL ?
				directionOption[1] : directionOption[0];

			result.directionField = {
				value: this._.clone(selectedDirection),
				originalValue: this._.clone(selectedDirection),
				options: {
					items: directionOption
				}
			};

			return result;
		}, this);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#getRelatedWorkspaces
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Get the workspaces related to this item.
	 */
	getRelatedWorkspaces(workspaceId) {
		let relatedWorkspacesListenerId = this.EventService.listen(`relatedWorkspaces:${workspaceId}:done`, (event, relatedWorkspacesObj) => {
			this.EventService.unlisten(relatedWorkspacesListenerId);

			let relatedWorkspaces = relatedWorkspacesObj.getFullList();

			// Get the workspaces in which the user can add items
			this.permittedWSPromises = this._.map(relatedWorkspaces.workspaces, workspace => {
				return new Promise(resolve => {
					let relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
					let workspaceListenerId = this.EventService.listen(`workspaceInstance:${relatedWSId}:done`, (event, workspaceObj) => {
						this.EventService.unlisten(workspaceListenerId);
						this.EventService.unlisten(workspacePermissionErrorListenerId);

						let userPermissionsListenerId = this.EventService.listen(`userPermissions:${relatedWSId}~*:done`, (event, userPermissionsObj, workspaceId) => {
							this.EventService.unlisten(userPermissionsListenerId);

							if (userPermissionsObj.hasPermission(this.PLMPermissions.ADD_ITEMS) ||
								userPermissionsObj.hasPermission(this.PLMPermissions.VIEW_ITEMS)) {
								resolve({
									workspaceObj: workspaceObj,
									canAdd: userPermissionsObj.hasPermission(this.PLMPermissions.ADD_ITEMS),
									canView: userPermissionsObj.hasPermission(this.PLMPermissions.VIEW_ITEMS)
								});
							} else {
								resolve(false);
							}
						});
					});

					let workspacePermissionErrorListenerId = this.EventService.listen('workspaceInstance:' + relatedWSId + ':permissionError', (event) => {
						this.EventService.unlisten(workspaceListenerId);
						this.EventService.unlisten(workspacePermissionErrorListenerId);

						resolve(false);
					});

					this.ModelsManager.getWorkspace(relatedWSId);
				});
			});
		});

		this.ModelsManager.getRelationshipRelatedWorkspaces(workspaceId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#triggerEdit
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Triggered by clicking edit button - goes to the EDIT state.
	 */
	triggerEdit() {
		this.$state.go(this.viewState, {
			tab: this.$location.search().tab,
			view: this.$location.search().view,
			mode: 'edit',
			itemId: this.$location.search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#selectRow
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Push the selected items in to the selectedRelationships array.
	 */
	selectRow(row) {
		if (row.isSelected && !this._.contains(this.selectedRelationships, row.entity.__self__)) {
			this.selectedRelationships.push({
				__self__: row.entity.__self__,
				title: row.entity.item.title,
				urn: row.entity.item.urn
			});
		} else {
			this.selectedRelationships = this._.reject(this.selectedRelationships,
				item => item.__self__ === row.entity.__self__);
		}

		return this.selectedRelationships.length;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#triggerDelete
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Triggered by clicking delete button - deletes the selected
	 * items after confirmation.
	 */
	triggerDelete() {
		this.$mdDialog.show({
			templateUrl: 'build/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.html',
			controller: 'RemoveItemConfirmationController',
			controllerAs: 'removeItemCtrl',
			locals: {
				itemCount: this.selectedRelationships.length
			}
		}).then(() => {
			this.removeSelectedItems();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Triggered by clicking save button - NOTE: name has to be
	 * triggerSave.
	 */
	triggerSave() {
		// Set the value to true, as to block all form elements from editing
		this._.each(this.tableData.rows, (row) => {
			row.waiting = true;
		});

		this.EventService.send(`relatedItems:${this.$location.search().itemId}:save`,
			[this.RelatedItemsObj, this.tableData.rows]);

		let relatedItemsSaveListenerId = this.EventService.listen(`relatedItems:${this.$location.search().itemId}:saveDone`, (event, ...results) => {
			this.EventService.unlisten(relatedItemsSaveListenerId);

			this._.each(this.tableData.rows, (row) => {
				row.waiting = false;
			});

			this._.each(results, result => {
				if (result.isSaved && result.isAdded) {
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${result.title}${this.bundle.notification.singleAdd.success}`
					);
				} else if (result.isSaved) {
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${result.title}${this.bundle.notification.singleEdit.success}`
					);
				} else {
					this.NotificationService.addNotification(
						this.NotificationTypes.ERROR,
						`${result.title}${this.bundle.notification.singleEdit.failed}`
					);
				}
			});

			// Only go back to view mode is every item saved successfully
			if (this._.every(this._.pluck(results, 'isSaved'))) {
				this.NotificationService.showNotifications(null, this.bundle.notification.bulk.updateAllPassed);

				this.$state.go(this.viewState, {
					tab: this.$location.search().tab,
					view: this.$location.search().view,
					mode: 'view',
					itemId: this.$location.search().itemId
				});
			} else if (this._.some(this._.pluck(results, 'isSaved'))) {
				this.NotificationService.showNotifications(null, this.bundle.notification.bulk.updateAllPassed);
			} else {
				this.NotificationService.showNotifications(null, this.bundle.notification.bulk.updateAllFailed);
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Triggered by clicking cancel button - NOTE: name has to be
	 * triggerCancel.
	 */
	triggerCancel() {
		this.$state.go(this.viewState, {
			tab: this.$location.search().tab,
			view: this.$location.search().view,
			mode: 'view',
			itemId: this.$location.search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#removeSelectedItems
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Initiates the process to delete the selected items.
	 */
	removeSelectedItems() {
		let promises = this._.map(this.selectedRelationships, (relationship, index) => {
			let selfLink = relationship.__self__.substring(relationship.__self__.lastIndexOf('/') + 1);

			return this.$q((resolve, reject) => {
				let relatedItemSaveListenerId = this.EventService.listen(`relatedItem:${selfLink}:deleteDone`, (event, flag) => {
					this.EventService.unlisten(relatedItemSaveListenerId);

					if (flag) {
						this.NotificationService.addNotification(
							this.NotificationTypes.SUCCESS,
							`${relationship.title}${this.bundle.notification.singleRemove.success}`
						);
					} else {
						this.NotificationService.addNotification(
							this.NotificationTypes.ERROR,
							`${relationship.title}${this.bundle.notification.failed}`
						);
					}

					resolve();
				});

				this.EventService.send(`relatedItem:${selfLink}:deleteItem`, relationship.__self__);
			});
		});

		this.$q.all(promises).then(() => {
			this.ModelsManager.getRelatedItems(this.$location.search().itemId);
			this.selectedRelationships = [];
			this.NotificationService.showNotifications();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#hasActiveFlyout
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description return true if add flyout is active.
	 *
	 * @return {Boolean} true, if add flyout is active.
	 */
	hasActiveFlyout() {
		return this.flyoutInstance && this.flyoutInstance.isActive() === true;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Trigger multi select flyout display state.
	 *
	 * @param {Object} event Event object associated with the click event.
	 */
	triggerAdd(event) {
		let target = event.currentTarget;

		return Promise.all(this.permittedWSPromises).then(this._.filter).then(results => {
			// Get the related workspaces for which the user has 'View items'
			// permission - these are the ones that they can pick from the
			// workspace filter dropdown in the Add flyout
			let allowViewWorkspaces = this._.filter(this._.map(results, result => {
				return result.canView ? result.workspaceObj : null;
			}));

			this.flyoutInstance = this.FlyoutService.open({
				templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
				anchorEl: angular.element(target),
				flyoutClass: 'add-item-flyout',
				placement: 'bottom-left',
				showArrow: true,
				backdropOption: 2,
				controller: 'AddLinkableItemsController',
				controllerAs: 'addLinkableItemsCtrl',
				disableDefaultZIndexAllocation: true,
				scope: this.$scope,
				resolve: {
					relatedWorkspaces: () => allowViewWorkspaces
				}
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return this.$location.search().mode === 'view';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#isEditState
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description Determine whether we're in the edit mode
	 *
	 * @return {Boolean} true if we are in the edit mode
	 */
	isEditState() {
		return this.$location.search().mode === 'edit';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#isTableRowDirty
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description To check if a given table row has dirty state.
	 *
	 * @param {Object} tableRow Table row to check for dirty state.
	 *
	 * @return {Boolean} True, if the given table row is dirty.
	 */
	isTableRowDirty(tableRow) {
		let propertyList = [];

		propertyList.push(tableRow.descriptionField);
		propertyList.push({value: tableRow.directionField.value.link, originalValue: tableRow.directionField.originalValue.link});

		return tableRow.isNewlyAdded || this._.some(propertyList, (property) => !this._.isEqual(property.originalValue, property.value));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewRelationshipsController#isTableRowInvalid
	 * @methodOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description To check if a given table row has invalid state
	 *
	 * @param {Object} tableRow Table row to check for invalid state.
	 *
	 * @return {Boolean} True, if the given table row is invalid.
	 */
	isTableRowInvalid(tableRow) {
		// TODO: is there a need to add more properties for checking invalid state.
		return !!tableRow.descriptionField.serverError;
	}

	/**
	 * @ngdoc property
	 * @name Controllers.workspaceItem.ViewRelationshipsController#toggleAllSelection
	 * @propertyOf Controllers.workspaceItem.ViewRelationshipsController
	 * @description toggle all selection state of the grid.
	 *
	 * TODO: move this to a common location for reuse
	 */
	toggleAllSelection() {
		this.gridApiInterface.selection.selectAll = !this.gridApiInterface.selection.selectAll;

		if (this.gridApiInterface.selection.selectAll) {
			this.gridApiInterface.selection.selectAllRows();
		} else {
			this.gridApiInterface.selection.clearSelectedRows();
		}
	}
}

export default ViewRelationshipsController;
