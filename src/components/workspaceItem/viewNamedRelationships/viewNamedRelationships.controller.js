'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewNamedRelationshipsController
 *
 * @description View Controller for Dynamic Linked View
 */
class ViewNamedRelationshipsController {

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 *
	 * @description The class constructor.app.
	 * Creates handles to all the required services and top level view models
	 */
	constructor($location, $mdDialog, $q, $rootScope, $scope, $state, $stateParams, $timeout, _, EventService, FlyoutService, ModelsManager, NotificationService, NotificationTypes) {
		this.$location = $location;
		this.$mdDialog = $mdDialog;
		this.$q = $q;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this._ = _;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.ModelsManager = ModelsManager;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.$timeout = $timeout;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The current workspace ID.
		 */
		this.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The encoded link for the current item.
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#item
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The current item object
		 */
		this.item;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#addFlyout
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The add flyout instance
		 */
		this.addFlyout;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#namedRelationshipId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The id for this named relationship
		 */
		this.namedRelationshipId = $location.search().relationshipKey;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#viewState
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The name of the view state for this tab.
		 */
		this.viewState = 'named-relationships';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#linkableItemsOptions
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description A map of values that need to be sent to the
		 * AddLinkableItemsController (hence attached to the $scope instead of
		 * `this`)
		 */
		$scope.linkableItemsOptions = {
			itemsType: `namedRelationshipItems~${this.$location.search().relationshipKey}`
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#tableColumns
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description Stores table column header of named relationships.
		 */
		this.tableColumns = [
			{
				field: 'selection',
				headerCellTemplate: 'checkboxHeaderTemplate',
				cellTemplate: 'checkboxTemplate',
				enableColumnResizing: false,
				width: '50'
			},
			{
				displayName: $rootScope.bundle.namedRelationships.item,
				field: 'linkedItemDescriptor',
				cellTemplate: 'namedRelationshipsLinkTemplate'
			}
		];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description Stores table data of named relationships.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#gridApiInterface
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The api interface of grid ui to control column
		 * visibility based on permissions.
		 */
		this.gridApiInterface;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#selectedItems
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description The array storing the self link of selected items.
		 */
		this.selectedItems = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#addLinkableItemsListenerId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description Listener for items that are selected in the add items
		 * flyout
		 */
		this.addLinkableItemsListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#linkableItemSaveListenerId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description Listens for items that have been successfully added so
		 * they can be displayed in the table
		 */
		this.linkableItemSaveListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description Listener for item object.
		 */
		this.itemListenerId = EventService.listen(`itemInstance:${this.itemId}:done`, (event, item) => {
			EventService.unlisten(this.itemListenerId);

			this.item = item;
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#namedRelationshipsObjListenerId
		 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
		 * @description Listener for named relationships object.
		 */
		this.namedRelationshipsObjListenerId = EventService.listen(`namedRelations:${this.itemId}~${this.$location.search().relationshipKey}:done`, (event, namedRelationshipsItems) => {
			// Initial load, with the data that has been fetched already
			this.parseNamedRelationshipsItems(namedRelationshipsItems);
		});

		this.registerAddLinkableItemsListeners();

		this.ModelsManager.getItem(this.itemId, !this.isViewState());
		this.ModelsManager.getNamedRelationships(this.itemId, this.$location.search().relationshipKey);

		// Unlistens to events when scope is destroyed
		this.$scope.$on('$destroy', () => {
			if (this.hasActiveFlyout()) {
				this.addFlyout.cancel();
			}

			this.EventService.unlisten(this.itemListenerId);
			this.EventService.unlisten(this.namedRelationshipsObjListenerId);
			this.EventService.unlisten(this.addLinkableItemsListenerId);
			this.EventService.unlisten(this.linkableItemSaveListenerId);
		});
	}

	/**
	 * @ngdoc property
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#registerAddLinkableItemsListeners
	 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Registers the listeners related to adding linkable items
	 * from the Add flyout
	 */
	registerAddLinkableItemsListeners() {
		this.addLinkableItemsListenerId = this.EventService.listen('linkableItems:added', (event, ...addedItems) => {
			this.associateAddedItems(addedItems).then(results => {
				if (this._.every(results)) {
					this.EventService.send(`itemInstance:${this.itemId}:associationComplete`);

					this.addFlyout.close();
				} else {
					this.addFlyout.cancel();
				}

				this.NotificationService.showNotifications();
			});
		});

		this.linkableItemSaveListenerId = this.EventService.listen(`itemInstance:${this.itemId}:associationComplete`, () => {
			this.ModelsManager.getNamedRelationships(this.itemId, this.$location.search().relationshipKey);
		}, true);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#associateAddedItems
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Associate the items selected from a flyout or modal (e.g.
	 * Add Linkable Items flyout, Add Related BOM Items modal, etc)
	 *
	 * @param {Array} items The list of items selected.
	 *
	 * @return {Promise} A promise over a list of promises resolving to
	 * booleans representing whether or not the association succeeded
	 */
	associateAddedItems(items) {
		return this.$q.all(this._.map(items, item => {
			let selectedItem = item.ref;

			this.EventService.send(`itemInstance:${selectedItem.getItemId()}:associateNamedRelationshipItem`, [
				this.item,
				selectedItem.getItemLink(),
				selectedItem.getItemTitle(),
				this.namedRelationshipId
			]);

			return this.$q(resolve => {
				let associateItemsListener = this.EventService.listen(`itemInstance:${selectedItem.getItemId()}:associationDone`, (event, isSaved) => {
					this.EventService.unlisten(associateItemsListener);

					if (isSaved) {
						this.NotificationService.addNotification(
							this.NotificationTypes.SUCCESS,
							`${selectedItem.getItemTitle()}${this.$rootScope.bundle.notification.singleAdd.success}`
						);
					} else {
						this.NotificationService.addNotification(
							this.NotificationTypes.ERROR,
							`${selectedItem.getItemTitle()}${this.$rootScope.bundle.notification.failed}`
						);
					}

					resolve(isSaved);
				});
			});
		}));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#getPermittedRelatedWorkspaces
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Get the related workspaces
	 * TODO check permissions
	 * TODO move this stuff out to a service or the RelatedWorkspaces model
	 */
	getPermittedRelatedWorkspaces() {
		return this.$q(resolve => {
			let relatedWorkspacesListenerId = this.EventService.listen(`relatedWorkspaces:${this.workspaceId}:done`, (event, RelatedWorkspacesObj) => {
				this.EventService.unlisten(relatedWorkspacesListenerId);

				let relatedWorkspaces = RelatedWorkspacesObj.getFullList();

				// Get the workspaces in which the user can add items
				this.permittedWSPromises = this._.map(relatedWorkspaces.workspaces, (workspace) => {
					let deferred = this.$q.defer();

					let relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
					let workspaceListenerId = this.EventService.listen(`workspaceInstance:${relatedWSId}:done`, (event, workspaceObj) => {
						this.EventService.unlisten(workspaceListenerId);
						this.EventService.unlisten(workspacePermissionErrorListenerId);

						deferred.resolve({
							workspaceObj: workspaceObj
						});
					});

					let workspacePermissionErrorListenerId = this.EventService.listen(`workspaceInstance:${relatedWSId}:permissionError`, (event) => {
						this.EventService.unlisten(workspaceListenerId);
						this.EventService.unlisten(workspacePermissionErrorListenerId);

						deferred.reject();
					});

					this.ModelsManager.getWorkspace(relatedWSId);
					return deferred.promise;
				});

				resolve(this.permittedWSPromises);
			});

			this.ModelsManager.getNamedRelationshipRelatedWorkspaces(this.workspaceId, this.namedRelationshipId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Trigger the flyout for adding items
	 *
	 * @param {Object} event The event object
	 */
	triggerAdd(event) {
		this.getPermittedRelatedWorkspaces().then(workspaces => {
			this.addFlyout = this.FlyoutService.open({
				templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
				scope: this.$scope,
				anchorEl: angular.element(event.target),
				flyoutClass: 'add-item-flyout',
				placement: 'bottom-left',
				showArrow: true,
				backdropOption: 2,
				controller: 'AddLinkableItemsController',
				controllerAs: 'addLinkableItemsCtrl',
				disableDefaultZIndexAllocation: true,
				resolve: {
					relatedWorkspaces: () => this.$q.all(workspaces)
						.then(workspaces => workspaces.map(workspace => workspace.workspaceObj))
				}
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#hasActiveFlyout
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description return true if add flyout is active.
	 *
	 * @return {Boolean} true, if add flyout is active.
	 */
	hasActiveFlyout() {
		return this.addFlyout && this.addFlyout.isActive();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#parseNamedRelationshipsItems
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Parse fetched data into table rows.
	 *
	 * @param {Object} namedRelationshipsItems NamedRelationshipsItems Obj
	 * contains an array of NamedRelationshipsItem fetched from server.
	 */
	parseNamedRelationshipsItems(namedRelationshipsItems) {
		this.tableData = this._.map(namedRelationshipsItems.getFullList(), (item, index) => {
			return {
				namedRelationshipsObj: item,
				selection: {
					inlineMenu: false, // Holds the boolean value for displaying row-based inline menu.
					urn: item.getItemUrn(),
					title: item.getItemTitle()
				},
				chkBox: {
					isSelected: false,
					chkBoxId: item.getResourceId()
				},
				linkedItemDescriptor: {
					value: item.getItemDescriptorValue(),
					// TODO Add WorkspaceId into link
					href: this.$state.href('details', {
						tab: 'details',
						view: 'full',
						mode: 'view',
						itemId: item.getResourceId()
					})
				}
			};
		});

		// need to fire this to have the ui-grid resized properly
		// the order of rendering is the issue
		// TODO: maybe we can find a better solution
		this.$timeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 2000);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return this.$location.search().mode === 'view';
	}

	/**
	 * @ngdoc property
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#toggleAllSelection
	 * @propertyOf Controllers.workspaceItem.ViewNamedRelationshipsController
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

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#selectRow
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Push the selected items into the selectedItems array.
	 *
	 * @param {Object} row A uiGrid "row" object.
	 *
	 * @return {Number} The number of selected items.
	 */
	selectRow(row) {
		let selfLink = row.entity.namedRelationshipsObj.json.__self__;

		if (row.isSelected) {
			this.selectedItems.push({
				link: selfLink,
				inlineMenu: row.entity.selection.inlineMenu,
				urn: row.entity.selection.urn,
				title: row.entity.selection.title,
				namedRelationshipsObj: row.entity.namedRelationshipsObj
			});
		} else {
			this.selectedItems = this._.filter(this.selectedItems, (obj) => {
				return obj.link !== selfLink;
			});
		}

		return this.selectedItems.length;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#removeSelectedItems
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Initiates the process to remove selected items.
	 */
	removeSelectedItems() {
		let promises = this._.map(this.selectedItems, (item) => {
			return this.$q((resolve, reject) => {
				let eventServiceIdentifier = `namedRelationshipsItem:${item.link.substring(item.link.lastIndexOf('/') + 1)}~${this.$location.search().relationshipKey}`;
				let namedRelationshipsRemoveListenerId = this.EventService.listen(`${eventServiceIdentifier}:deleteDone`, (event, flag) => {
					this.EventService.unlisten(namedRelationshipsRemoveListenerId);

					if (flag) {
						// Remove deleted row
						this.tableData = this._.filter(this.tableData, row => row.__self__ === item.link);

						this.NotificationService.addNotification(
							this.NotificationTypes.SUCCESS,
							`${item.title}${this.$rootScope.bundle.notification.singleRemove.success}`
						);
					} else {
						this.NotificationService.addNotification(
							this.NotificationTypes.ERROR,
							`${item.title}${this.$rootScope.bundle.notification.failed}`
						);
					}

					resolve();
				});

				this.EventService.send(`${eventServiceIdentifier}:deleteItem`, item.link);
			});
		});

		this.$q.all(promises).then(() => {
			this.tableData = [];
			this.ModelsManager.getNamedRelationships(this.itemId, this.$location.search().relationshipKey);
			this.selectedItems = [];
			this.NotificationService.showNotifications();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewNamedRelationshipsController#triggerDelete
	 * @methodOf Controllers.workspaceItem.ViewNamedRelationshipsController
	 * @description Triggered by clicking delete button - deletes the selected items after confirmation
	 *
	 */
	triggerDelete() {
		this.$mdDialog.show({
			templateUrl: 'build/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.html',
			controller: 'RemoveItemConfirmationController',
			controllerAs: 'removeItemCtrl',
			locals: {
				itemCount: this.selectedItems.length
			}
		}).then(() => {
			this.removeSelectedItems();
		});
	}

}

export default ViewNamedRelationshipsController;
