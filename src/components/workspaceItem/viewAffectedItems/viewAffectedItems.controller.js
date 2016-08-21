'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewAffectedItemsController
 *
 * @description This controller responsible for affected items.
 * This controller will handle all affected items sub states (view, add, edit etc).
 *
 * ##Dependencies
 *
 */
class ViewAffectedItemsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $stateParams, $filter, $timeout, $mdDialog, $log, $q, _, ModelsManager,
	            WorkspaceTypes, EventService, FlyoutService, PLMPermissions, uiGridConstants, RESTWrapperService,
	            UrnParser, PermissionService, FieldTypes, SupportedFieldsService, NotificationService, NotificationTypes,
	            ValidationUtil, ManagedItemColumnIndex, FieldData, Workspace) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$filter = $filter;
		this.$timeout = $timeout;
		this.$mdDialog = $mdDialog;
		this.$log = $log;
		this.$q = $q;
		this._ = _;

		this.ModelsManager = ModelsManager;
		this.WorkspaceTypes = WorkspaceTypes;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.RESTWrapperService = RESTWrapperService;
		this.PermissionService = PermissionService;
		this.PLMPermissions = PLMPermissions;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.UrnParser = UrnParser;
		this.ValidationUtil = ValidationUtil;
		this.ManagedItemColumnIndex = ManagedItemColumnIndex;
		this.FieldTypes = FieldTypes;
		this.FieldData = FieldData;
		this.Workspace = new Workspace();

		// Listeners IDs
		this.itemListenerId;
		this.affectedItemsListenerId;
		this.affectedItemsMetaListenerId;
		this.linkableItemSaveListenerId;
		this.stateChangeListenerId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#isCurrentlySaving
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description This would be telling if the user is currently performing the save action
		 */
		this.isCurrentlySaving = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The workspace id of the current affected item.
		 */
		this.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#itemLink
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The item id of the current affected item.
		 */
		this.itemLink = UrnParser.encode($stateParams.itemId);

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#linkableItemsOptions
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description A map of values that need to be sent to the
		 * AddLinkableItemsController (hence attached to the $scope instead of
		 * `this`)
		 */
		$scope.linkableItemsOptions = {
			itemsType: 'affectedItems'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The view workflow items permission for the user.
		 */
		this.viewPermission = PLMPermissions.VIEW_WORKFLOW_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The add workflow items permission for the user.
		 */
		this.addPermission = PLMPermissions.ADD_WORKFLOW_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The edit workflow items permission for the user.
		 */
		this.editPermission = PLMPermissions.EDIT_WORKFLOW_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#deletePermission
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The delete workflow items permission for the user.
		 */
		this.deletePermission = PLMPermissions.DELETE_WORKFLOW_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#ItemObj
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The reference to the item object.
		 */
		this.ItemObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#AffectedItemsObj
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The reference to affected items object.
		 */
		this.AffectedItemsObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#AffectedItemsMetaObj
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The reference to affected items meta object.
		 */
		this.AffectedItemsMetaObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#selectedItems
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The array storing the self link of selected items.
		 */
		this.selectedItems = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#isBulkEditEnabled
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Boolean for showing/hiding bulk edit icon
		 */
		this.isBulkEditEnabled = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#tableColumns
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Stores the details of the table's default fields.
		 */
		this.tableColumns = [
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
				displayName: '#',
				field: 'rowId',
				sort: {
					direction: uiGridConstants.ASC,
					priority: 1
				},
				enableColumnResizing: false,
				type: 'number',
				width: '50'
			},
			{
				displayName: $rootScope.bundle.affectedItems.item,
				field: 'item',
				cellTemplate: 'linkTemplate',
				type: 'object'
			},
			{
				cellTemplate: 'editLifecycleCellTemplate',
				displayName: $rootScope.bundle.affectedItems.lifecycle,
				dataType: FieldTypes.PICKLIST,
				field: 'lifecycle',
				type: 'object',
				visible: false
			},
			{
				cellTemplate: 'editEffectivityCellTemplate',
				displayName: $rootScope.bundle.affectedItems.effectivity,
				dataType: FieldTypes.DATE,
				fieldMeta: {
					datePickerMinDate: new Date()
				},
				enableSorting: false,
				field: 'effectivity',
				visible: false
			},
			{
				displayName: $rootScope.bundle.affectedItems.from,
				field: 'from',
				visible: false,
				enableSorting: false
			},
			{
				displayName: $rootScope.bundle.affectedItems.to,
				dataType: FieldTypes.SINGLE_LINE_TEXT,
				fieldMeta: {
					fieldLength: 5
				},
				field: 'to',
				cellTemplate: 'editToCellTemplate',
				visible: false,
				enableSorting: false
			}
		];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#customColumns
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Stores the custom columns fields.
		 */
		this.customColumns = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Stores table data of the affected items.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#gridApiInterface
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The api interface of grid ui to control column
		 * visibility based on permissions.
		 */
		this.gridApiInterface;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#flyoutInstance
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description The current flyout instance.
		 */
		this.flyoutInstance;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#disableSelection
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description True, when row selection is disabled.
		 */
		this.disableSelection = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#hasAddPermission
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description True, when the item has add permission.
		 */
		this.hasAddPermission = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#hasActionPermission
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description True, when the item has add/edit/delete permissions.
		 */
		this.hasActionPermission = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#revisionControlledItems
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description List of revision controlled items.
		 * This will be used for bulk operations.
		 */
		this.revisionControlledItems = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#isRevisioningWorkspace
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description True, if the workspace is a revisioning workspace.
		 */
		this.isRevisioningWorkspace = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#isMetaDataLoaded
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description True, when table metadata and permissions are loaded. This check is important, we don't want to
		 * reload metadata over and over again.
		 */
		this.isMetaDataLoaded = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Listener for item object. Determines the workspace type
		 * to initialise the revisioning columns, if needed. And gets the
		 * affected item custom columns meta data.
		 */
		this.itemListenerId = EventService.listen(`itemInstance:${this.itemLink}:done`, (event, itemObj) => {
			this.ItemObj = itemObj;
			this.workspaceObj = this.ItemObj.workspaceObj;
			this.workspaceId = this.ItemObj.workspaceObj.getId();

			let workspaceTypeId = parseInt(itemObj.workspaceObj.getTypeId());

			// Determine if the workspace is a Revisioning Workspace
			this.isRevisioningWorkspace = workspaceTypeId === this.WorkspaceTypes.REVISIONING_WORKSPACE;

			this.$q.all([
				PermissionService.checkPermissionByItem(itemObj, this.deletePermission, true, true),
				PermissionService.checkPermissionByItem(itemObj, this.addPermission, true, true),
				PermissionService.checkPermissionByItem(itemObj, this.editPermission, true, true)
			]).then((permissions) => {
				this.hasAddPermission = permissions[1];
				// Determine if there is add, edit or delete permissions
				this.hasActionPermission = permissions[0] || permissions[1] || permissions[2];
				// Determine if there is edit or delete permissions
				this.disableSelection = !(permissions[0] || permissions[2]);
			});

			if (this.isMetaDataLoaded === false) {
				// If user does not have view permissions, but hit the url manually,
				// redirect user back to the item details view
				PermissionService.checkPermissionByItem(itemObj, this.viewPermission).then((hasViewPermission) => {
					if (!hasViewPermission) {
						// Given that there's no view permission, call the affected
						// items endpoint so that RESTWrapperService will catch the
						// necessary 403 error to send the permissionDenied event.
						ModelsManager.getAffectedItemsByLink(this.itemLink, itemObj.getAffectedItemsLink());

						$state.go('details', {
							tab: 'details',
							view: $stateParams.view,
							mode: 'view',
							itemId: UrnParser.encode($stateParams.itemId)
						});
					}
				});

				this.parseRevisioningColumns(this.workspaceObj);
				this.getRelatedWorkspaces(this.workspaceId);

				ModelsManager.getAffectedItemsMetaByLink(this.itemLink, this.ItemObj.getAffectedItemsMetaLink());
			} else {
				// Only update the item data when in view mode. Refreshing the data in edit mode is not a good idea because of
				// dirty state.
				if (this.isViewState()) {
					this.getAffectedItemsData();
				}
			}

			this.isMetaDataLoaded = true;
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#affectedItemsMetaListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Listener for affected item meta (custom column) object.
		 */
		this.affectedItemsMetaListenerId = EventService.listen(`affectedItemsMeta:${this.itemLink}:done`, (event, affectedItemsMetaObj) => {
			EventService.unlisten(this.affectedItemsMetaListenerId);

			this.AffectedItemsMetaObj = affectedItemsMetaObj;
			let affectedItemsMeta = this.AffectedItemsMetaObj.getFullList();

			let customColumnPromises = _.map(affectedItemsMeta, (field) => {
				return this.$q((resolve) => {
					let dataTypeId = parseInt(this.AffectedItemsMetaObj.getDataTypeId(field));
					// TODO Support field validations
					field.previewEnabled = dataTypeId === this.FieldTypes.PARAGRAPH;

					let customCol = {
						displayName: field.name,
						fieldMetadata: _.extend(field, {allowPlaceholderChange: true}),
						field: this.AffectedItemsMetaObj.getFieldId(field),
						dataType: this.AffectedItemsMetaObj.getDataTypeId(field),
						isPicklist: angular.isDefined(field.picklist) && field.picklist !== null,
						enableSorting: false,
						cellTemplate: dataTypeId === this.FieldTypes.PARAGRAPH ? 'editRTFTemplate' : 'editCustomColCellTemplate',
						headerCellTemplate: 'editCustomColHeaderTemplate',
						multiline: dataTypeId === this.FieldTypes.PARAGRAPH_WITHOUT_LINE_BREAKS || dataTypeId === this.FieldTypes.PARAGRAPH,
						isFieldUnsupported: SupportedFieldsService.isFieldUnsupported(this.AffectedItemsMetaObj.getDataTypeId(field))
					};

					this.tableColumns.push(customCol);
					this.customColumns.push(customCol);

					if (customCol.isPicklist) {
						this.Workspace.setPicklistHook(customCol).then(() => {
							resolve();
						});
					} else {
						resolve();
					}
				});
			});

			this.$q.all(customColumnPromises).then(() => {
				this.getAffectedItemsData().then(() => {
					// TODO: Remove this code
					if (!this.isViewState() && $stateParams.updatedItems && $stateParams.updatedItems.length) {
						// If state contains {@link #$stateParams.updatedItems}, it
						// indicates that we have moved to edit mode from bulk edit.
						// All items updated by bulk edit needs to be updated in the
						// edit mode so that user can persist the changes.
						// For details of bulk edit see {@link #triggerBulkEdit}.
						_.each($stateParams.updatedItems, (updatedAffectedItem) => {
							let tableRow = _.find(this.tableData, row =>
							row.id === updatedAffectedItem.getId());

							if (tableRow) {
								tableRow.lifecycle.value = updatedAffectedItem.getLifecycle();
								tableRow.effectivity.value = updatedAffectedItem.getEffectivity();
							}
						});
					}

					if (!this.isViewState()) {
						// This will activate the navigation guard.
						this.$scope.$emit('activateNavigationGuard', this);
					}
				});
			});
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#addLinkableItemsListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Listener for items that are selected in the add items
		 * flyout.
		 */
		this.addLinkableItemsListenerId = EventService.listen('linkableItems:added', (event, ...addedItems) => {
			this.associateAddedItems(addedItems).then(results => {
				if (_.every(results)) {
					EventService.send(`itemInstance:${this.itemLink}:associationComplete`);

					this.flyoutInstance.close();
				} else {
					this.flyoutInstance.cancel();
				}

				NotificationService.showNotifications();
			});
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#addRelatedBomItemsListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Listener for items that are selected in the add related
		 * BOM items modal.
		 */
		this.addRelatedBomItemsListenerId = EventService.listen('relatedBomItems:added', (event, ...addedItems) => {
			this.associateAddedItems(addedItems).then(results => {
				$mdDialog.hide();

				NotificationService.showNotifications();
				EventService.send(`itemInstance:${this.itemLink}:associationComplete`);
			});
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAffectedItemsController#linkableItemSaveListenerId
		 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
		 * @description Listens for items that have been successfully added to
		 * the table.
		 */
		this.linkableItemSaveListenerId = EventService.listen(`itemInstance:${this.itemLink}:associationComplete`, () => {
			this.getAffectedItemsData();
		}, true);

		ModelsManager.getItem(this.itemLink, !this.isViewState());

		$scope.$on('$destroy', () => {
			if (this.flyoutInstance) {
				// Close the flyout when moving to another view or when
				// pressing the browser's Back button
				this.flyoutInstance.cancel();
			}

			EventService.unlisten(this.itemListenerId);
			EventService.unlisten(this.affectedItemsListenerId);
			EventService.unlisten(this.affectedItemsMetaListenerId);
			EventService.unlisten(this.linkableItemSaveListenerId);
			EventService.unlisten(this.addLinkableItemsListenerId);
			EventService.unlisten(this.addRelatedBomItemsListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#getDirtyRows
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Get all dirty rows
	 *
	 * @return {Object} Array containing the dirty rows
	 */
	getDirtyRows() {
		return this._.filter(this.tableData, row => this.isTableRowDirty(row));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#isDirty
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description This function is required by plmNavigationGuard
	 *
	 * @return {Boolean} true if rows are dirty along with no save action has been triggered
	 */
	isDirty() {
		return (!!this.getDirtyRows().length && !this.isCurrentlySaving);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#getAffectedItemsData
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Gets affected items data.
	 *
	 * @return {Promise} A promise that will be resolved when all affected items
	 * are loaded to {@link #tableData}.
	 */
	getAffectedItemsData() {
		return this.$q((resolve) => {
			this.affectedItemsListenerId = this.EventService.listen(`affectedItems:${this.itemLink}:done`, (event, affectedItemsObj) => {
				this.EventService.unlisten(this.affectedItemsListenerId);

				this.AffectedItemsObj = affectedItemsObj;
				let affectedItems = this.AffectedItemsObj.getFullList();

				if (angular.isUndefined(affectedItems) || affectedItems.length === 0) {
					// Need to fire this to have the ui-grid resized properly
					// The order of rendering is the issue
					// TODO Maybe we can find a better solution
					this.$timeout(() => {
						window.dispatchEvent(new Event('resize'));
					}, 2000);

					return;
				}

				this.tableData = this._.map(affectedItems, (affectedItem, index) => {
					let row = this.createRowFromAffectedItemObj(affectedItem);
					row.rowId = index + 1;
					return row;
				});

				// Need to fire this to have the ui-grid resized properly
				// The order of rendering is the issue
				// TODO Maybe we can find a better solution
				this.$timeout(() => {
					window.dispatchEvent(new Event('resize'));
				}, 2000);

				resolve();
			});

			this.ModelsManager.getAffectedItemsByLink(this.itemLink, this.ItemObj.getAffectedItemsLink());
		});
	}

	/**
	 * @ngdoc property
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#toggleAllSelection
	 * @propertyOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Toggle all selection state of the grid.
	 *
	 * TODO Move this to a common location for reuse
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
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#parseRevisioningColumns
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Update visible state of revisioning columns.
	 *
	 * @param {Object} itemWSObj The workspace object of an item.
	 */
	parseRevisioningColumns(itemWSObj) {
		// Add the fields specific to revisioning workspaces
		// Note: Updating visible state performs better than adding columns,
		// as this method can now be called multiple times during the lifecycle
		// of this controller.
		if (itemWSObj.getTypeId() === this.WorkspaceTypes.REVISIONING_WORKSPACE.toString()) {
			this.tableColumns[this.ManagedItemColumnIndex.LIFECYCLE].visible = true;
			this.tableColumns[this.ManagedItemColumnIndex.EFFECTIVITY].visible = true;
			this.tableColumns[this.ManagedItemColumnIndex.FROM].visible = true;
			this.tableColumns[this.ManagedItemColumnIndex.TO].visible = true;
		} else {
			this.tableColumns[this.ManagedItemColumnIndex.LIFECYCLE].visible = false;
			this.tableColumns[this.ManagedItemColumnIndex.EFFECTIVITY].visible = false;
			this.tableColumns[this.ManagedItemColumnIndex.FROM].visible = false;
			this.tableColumns[this.ManagedItemColumnIndex.TO].visible = false;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#buildLifecycleField
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Creates a table row on the basis of affected item object.
	 *
	 * @param {Object} affectedItem An affected item data.
	 *
	 * @return {Object} SelectionFieldData model
	 */
	buildLifecycleField(affectedItem) {
		return this.FieldData.fromFieldData(this.FieldTypes.SELECTION, {
			urn: affectedItem.urn,
			metadata: {
				dataTypeId: this.FieldTypes.SELECTION
			},
			options: {},
			value: {
				link: affectedItem.targetTransition && affectedItem.targetTransition.link || null,
				title: affectedItem.targetTransition && affectedItem.targetTransition.title
					|| this.$rootScope.bundle.affectedItems.pleaseSelect
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#createRowFromAffectedItemObj
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Creates a table row on the basis of affected item object.
	 *
	 * @param {Object} affectedItemObj An instance of {@link Models#AffectedItem}.
	 *
	 * @return {Object} tableRow Row of affected item data.
	 */
	createRowFromAffectedItemObj(affectedItemObj) {
		/**
		 * Initialise some variables
		 */
		let affectedItemObjData = affectedItemObj.getObject();
		let tableRow = {}; // Holds data for one row in the table
		let itemUrn = affectedItemObjData.item.urn;
		let workspaceId = affectedItemObj.getWorkspaceId();
		let itemTitle = affectedItemObjData.item.version ?
			`${affectedItemObjData.item.title} ${affectedItemObjData.item.version}` :
			`${affectedItemObjData.item.title}`; // Add rev tag to item, if any

		/**
		 * Populate the default data
		 */
		tableRow.selection = {
			inlineMenu: false, // Holds the boolean value for displaying row-based inline menu. By default it is 'false'
			urn: affectedItemObjData.item.urn,
			title: affectedItemObjData.item.title
		};
		tableRow.id = affectedItemObj.getId();
		tableRow.affectedItemObj = affectedItemObj;
		tableRow.chkBox = {
			isSelected: false,
			chkBoxId: itemUrn
		};
		tableRow.item = {
			value: itemTitle,
			originalValue: itemTitle,
			href: this.$state.href('details', {
				workspaceId: workspaceId,
				tab: 'details',
				view: 'full',
				mode: 'view',
				itemId: this.UrnParser.encode(itemUrn)
			})
		};

		/**
		 * Populate the revisioning columns data
		 */
		if (affectedItemObjData.type === 'REVISION_CONTROLLED') {
			tableRow.isRevisionControlled = true;

			if (this.workspaceObj.getTypeId() === this.WorkspaceTypes.REVISIONING_WORKSPACE.toString()
				&& this.hasAddPermission) {

				// Check whether the item has view BOM permission
				this.PermissionService.hasPermissions([
					this.PLMPermissions.VIEW_ITEMS,
					this.PLMPermissions.VIEW_BOM
				], workspaceId).then((hasViewPermission) => {
					if ((!tableRow.lifecycle.value.title) ||
						(tableRow.lifecycle.value.title === this.$rootScope.bundle.affectedItems.pleaseSelect)) {
						tableRow.selection.inlineMenu = false;
					} else {
						tableRow.selection.inlineMenu = hasViewPermission;
						tableRow.selection.urn = this.UrnParser.encode(affectedItemObjData.item.urn);
					}
				});
			}

			/**
			 * Build the lifecycle field
			 */
			let itemId = affectedItemObj.getId();
			tableRow.lifecycle = this.buildLifecycleField(affectedItemObjData, itemId);
			tableRow.lifecycle.lifecycleChanged = () => {
				if (tableRow.lifecycle.value.link) {
					// Leave lifecycle value as it is if it's not found in list
					// of available transitions. This happens when an item has
					// been released and the available transitions change.
					tableRow.lifecycle.value = this._.clone(this._.find(tableRow.lifecycle.options.items,
						option => option.title === tableRow.lifecycle.value.title))
						|| tableRow.lifecycle.value;

					if (!tableRow.effectivity.value && tableRow.lifecycle.value.effectivityWritable) {
						// If effectivity is writable but has no value,
						// reset to its original value.
						tableRow.effectivity.value = tableRow.effectivity.originalValue;
					} else if (tableRow.lifecycle.value.effectivityWritable === false) {
						// If effectivity is not writable, set to null.
						tableRow.effectivity.value = null;
					}
				} else {
					// Set lifecycle value to 'Please Select'.
					tableRow.lifecycle.value = this._.clone(tableRow.lifecycle.options.items[0]);
				}

				// For 'To' to be editable, revision number generation must
				// be 'MANUAL', and flag for incrementRelease must be true
				let overrideTargetRevision = tableRow.lifecycle.value.overrideTargetRevision;
				let increaseRelease = tableRow.lifecycle.value.incrementRelease;
				let isToEditable = (overrideTargetRevision === 'MANUAL') && increaseRelease;
				if (overrideTargetRevision === 'MANUAL' && isToEditable === false && tableRow.to.value) {
					tableRow.to.value = null;
				}

				if (isToEditable !== tableRow.to.editable) {
					tableRow.to.editable = isToEditable;
					tableRow.to.fieldMetadata.validatorsMeta = [];

					if (tableRow.to.editable) {
						// Since server is not providing any validation info
						// for 'To' field, we are creating our own.
						tableRow.to.fieldMetadata.validatorsMeta.push({validatorName: 'required'});
						tableRow.to.fieldMetadata.validatorsMeta.push({
							validatorName: 'maxlength',
							variables: {
								maxlength: '5'
							}
						});
					}
				}
			};

			// Gets the list of available transitions for each affected item
			let affectedItemsTransitionsListenerId = this.EventService.listen(`affectedItemTransitions:${itemId}:done`, (event, data) => {
				this.EventService.unlisten(affectedItemsTransitionsListenerId);
				let options = [];
				// If response json is not an array then there is no available transition for a given state.
				if (_.isArray(data.json)) {
					options = this._.map(data.json, transition => {
						// Picklist expects 'title' and 'link' properties.
						transition.title = transition.name;
						transition.link = transition.__self__;

						return transition;
					});
				} else if (tableRow.lifecycle.value.link) {
					// If there is not available transition and lifecycle has a valid value, then add that value as a transition.
					options = [{
						title: tableRow.lifecycle.value.title,
						link: tableRow.lifecycle.value.link
					}];
				}

				// If there is no current target transition,
				// add 'Please Select' as one of the options
				if (!affectedItemObjData.targetTransition) {
					options.unshift({
						title: this.$rootScope.bundle.affectedItems.pleaseSelect
					});
				}

				tableRow.lifecycle.options.items = options;
				tableRow.lifecycle.lifecycleChanged();
			});

			this.ModelsManager.getAffectedItemsTransitions(itemId, affectedItemObjData.availableTransitions.substring(1));

			/**
			 * Build the effectivity field
			 */
			tableRow.effectivity = this.FieldData.fromFieldData(this.FieldTypes.DATE, {
				urn: affectedItemObjData.urn,
				metadata: {
					dataTypeId: this.FieldTypes.DATE
				},
				// Note: `null` implies 'On Release'
				value: affectedItemObjData.effectivityDate || null
			});
			tableRow.effectivity.placeholder = this.$rootScope.bundle.affectedItems.onRelease;

			/**
			 * Build the from/to fields
			 */
			tableRow.from = affectedItemObjData.fromRelease;

			tableRow.to = this.FieldData.fromFieldData(this.FieldTypes.SINGLE_LINE_TEXT, {
				value: affectedItemObjData.toRelease || '',
				metadata: {
					dataTypeId: this.FieldTypes.SINGLE_LINE_TEXT
				},
				fieldMetadata: _.extend(
					_.clone(this.tableColumns[this.ManagedItemColumnIndex.TO].fieldMeta),
					{
						validatorsMeta: [],
						allowPlaceholderChange: true
					}
				)
			});
		} else {
			// This is mainly done to avoid $eval errors when using
			// {@link Directives.clickOutsideElement}
			tableRow.to = {};
			tableRow.lifecycle = {};
			tableRow.effectivity = {};
		}

		/**
		 * Populate the custom columns data, if any
		 */
		let linkedFields = affectedItemObjData.linkedFields;
		if (angular.isArray(linkedFields) && !this._.isEmpty(linkedFields)) {
			this._.each(linkedFields, (linkedField) => {
				// Example fieldId: SINGLE_LINE
				let fieldId = affectedItemObj.getLinkedFieldId(linkedField);
				// Example dataTypeId: 4
				let dataTypeId = parseInt(affectedItemObj.getLinkedFieldDataTypeId(linkedField));
				// Get the current field (to get field meta)
				let currentField = this._.find(this.customColumns, col => fieldId === col.field);

				// If linkedField.value is an object, it is a picklist type
				if (fieldId && this._.isObject(linkedField.value)) {
					tableRow[fieldId] = this.FieldData.fromFieldData(dataTypeId, {
						link: affectedItemObj.getLinkedFieldLink(linkedField),
						metadata: {
							dataTypeId: dataTypeId
						},
						urn: affectedItemObj.getLinkedFieldUrn(linkedField),
						value: {
							link: linkedField.value.link || '',
							title: linkedField.value.title || ''
						},
						fieldMetadata: _.clone(currentField.fieldMetadata)
					});

					tableRow[fieldId].fieldMetadata.isRadioButtonInGrid = dataTypeId === this.FieldTypes.RADIO
						|| dataTypeId === this.FieldTypes.RADIO_LINKED;
					tableRow[fieldId].options = this._.clone(currentField.fieldMetadata.picklistPayload);
				} else if (fieldId) {
					let fieldVal = linkedField.value || '';

					// Get field precision, if available
					// (Only Float and Money have field precision)
					let fieldPrecision;
					if (dataTypeId === this.FieldTypes.FLOAT || dataTypeId === this.FieldTypes.MONEY_EXTENDED) {
						fieldPrecision = currentField.fieldMetadata.fieldPrecision;
					}

					// Get field length, if available
					// (Only Date, Paragraph & Checkbox do not have field length)
					let fieldLength;
					if (!(dataTypeId === this.FieldTypes.DATE
						|| dataTypeId === this.FieldTypes.PARAGRAPH
						|| dataTypeId === this.FieldTypes.CHECKBOX)) {
						fieldLength = currentField.fieldMetadata.fieldLength;
					}

					// Need to apply lineBreakFilter for paragraph to replace
					// '\n' with '<br>'
					if (dataTypeId === this.FieldTypes.PARAGRAPH) {
						fieldVal = this.$filter('lineBreakFilter')(fieldVal);
					}

					tableRow[fieldId] = this.FieldData.fromFieldData(dataTypeId, {
						metadata: {
							dataTypeId: dataTypeId,
							fieldPrecision: fieldPrecision,
							fieldLength: fieldLength
						},
						value: fieldVal,
						fieldMetadata: _.clone(currentField.fieldMetadata)
					});
				}
			});
		}

		// To enable editing for custom columns without data to begin with
		this._.each(this.customColumns, (col) => {
			let dataTypeId = parseInt(col.dataType);

			if (!tableRow[col.field] && col.isPicklist) {
				tableRow[col.field] = this.FieldData.fromFieldData(dataTypeId, {
					link: affectedItemObj.getLinkedFieldLink(col.fieldMetadata),
					metadata: {
						dataTypeId: dataTypeId
					},
					urn: '', // TODO Get field urn (unavailable in payload)
					value: '',
					fieldMetadata: _.clone(col.fieldMetadata)
				});

				tableRow[col.field].fieldMetadata.isRadioButtonInGrid = dataTypeId === this.FieldTypes.RADIO
					|| dataTypeId === this.FieldTypes.RADIO_LINKED;
				tableRow[col.field].options = this._.clone(col.fieldMetadata.picklistPayload);
			} else if (!tableRow[col.field] && !col.isPicklist) {
				tableRow[col.field] = this.FieldData.fromFieldData(dataTypeId, {
					metadata: {
						dataTypeId: dataTypeId
					},
					value: '',
					fieldMetadata: _.clone(col.fieldMetadata)
				});
				tableRow[col.field].fieldTypeId = col.field;
			}
		});

		return tableRow;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#selectRow
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Push the selected items into the selectedItems array.
	 *
	 * @param {Object} row A uiGrid "row" object.
	 *
	 * @return {Number} The number of selected items.
	 */
	selectRow(row) {
		let selfLink = row.entity.affectedItemObj.json.__self__;

		if (row.isSelected && !this._.contains(this.selectedItems, selfLink)) {
			this.selectedItems.push({
				link: selfLink,
				inlineMenu: row.entity.selection.inlineMenu,
				urn: row.entity.selection.urn,
				title: row.entity.selection.title,
				type: row.entity.affectedItemObj.json.type,
				affectedItemObj: row.entity.affectedItemObj
			});
		} else {
			this.selectedItems = this._.filter(this.selectedItems, obj => obj.link !== selfLink);
		}

		this.revisionControlledItems = this._.filter(this.selectedItems, obj => obj.type === 'REVISION_CONTROLLED');
		this.isBulkEditEnabled = this.revisionControlledItems.length > 1;

		return this.selectedItems.length;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerBulkEdit
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Responsible for opening the overlay for bulk edit.
	 */
	triggerBulkEdit() {
		let selectedAffectedItems = this._.map(this.revisionControlledItems, (selectedRow) => selectedRow.affectedItemObj);

		this.$mdDialog.show({
			templateUrl: 'build/components/workspaceItem/viewAffectedItems/bulkEdit.html',
			controller: 'BulkEditController',
			controllerAs: 'bulkEditCtrl',
			locals: {
				workspaceObj: this.workspaceObj,
				selectedItems: selectedAffectedItems
			}
		}).then((updatedAffectedItems) => {
			if (updatedAffectedItems && updatedAffectedItems.length > 0) {
				this.$state.go('affected-items', {
					tab: this.$stateParams.tab,
					view: this.$stateParams.view,
					mode: 'edit',
					itemId: this.$stateParams.itemId,
					updatedItems: updatedAffectedItems
				});
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerAddRelatedBomItems
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Trigger multi select flyout for add related BOM item.
	 */
	triggerAddRelatedBomItems(urn) {
		this.$mdDialog.show({
			templateUrl: 'build/components/workspaceItem/viewAffectedItems/addRelatedBom.html',
			controller: 'AddRelatedBomController',
			controllerAs: 'addRelatedBomCtrl',
			locals: {
				urn: urn
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#updateAffectedItemRow
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Updates the model data according to the modifications
	 * made in the table.
	 *
	 * @param {Object} tableRow Table row used to update affected item object.
	 * @param {Object} affectedItemObj Affected item object to be updated.
	 *
	 * @return {Object} A modified object.
	 */
	updateAffectedItemRow(tableRow, affectedItemObj) {

		// The later check is to determine if the 'to' is uneditable for a lifecycle where to was changed to empty value
		// and thereafter set the value of to the empty value
		if (tableRow.to.editable || (angular.isDefined(tableRow.to.isDirty) && tableRow.to.isDirty())) {
			affectedItemObj.setTo(tableRow.to.value);
		}

		if (angular.isDefined(tableRow.lifecycle)
			&& angular.isDefined(tableRow.lifecycle.value)) {
			affectedItemObj.setLifecycle(tableRow.lifecycle.value);
		}

		if (angular.isDefined(tableRow.effectivity)
			&& angular.isDefined(tableRow.effectivity.value)) {
			affectedItemObj.setEffectivity(tableRow.effectivity.value || null);
		}

		this._.each(this.customColumns, col => {
			let field = tableRow[col.field];
			if (angular.isDefined(field) && field.isDirty()) {
				affectedItemObj.setCustomColumnData(col.field, field, col);
			}
		});

		return affectedItemObj;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#isTableRowDirty
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description To check if a given table row has dirty state.
	 *
	 * @param {Object} tableRow Table row to check for dirty state.
	 *
	 * @return {Boolean} True, if the given table row is dirty.
	 */
	isTableRowDirty(tableRow) {
		if (this._.some(this.customColumns, col =>
			angular.isDefined(tableRow[col.field])
			&& angular.isDefined(tableRow[col.field].value)
			&& tableRow[col.field].isDirty())
		) {
			return true;
		}

		return (tableRow.to.editable && tableRow.to.isDirty())
			|| (angular.isDefined(tableRow.lifecycle)
				&& angular.isDefined(tableRow.lifecycle.value)
				&& tableRow.lifecycle.isDirty())
			|| (angular.isDefined(tableRow.effectivity)
				&& angular.isDefined(tableRow.effectivity.value)
				&& tableRow.effectivity.isDirty());
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#isTableRowInvalid
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description To check if a given table row has invalid state.
	 *
	 * @param {Object} tableRow Table row to check for invalid state.
	 *
	 * @return {Boolean} True, if the given table row is invalid.
	 */
	isTableRowInvalid(tableRow) {
		return !this.isViewState() &&
			(this.hasValidationErrors(tableRow) ||
			this._.some(this.customColumns, col => angular.isDefined(tableRow[col.field]) && (tableRow[col.field].serverError)));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#removeSelectedItems
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Initiates the process to remove selected items.
	 */
	removeSelectedItems() {
		let promises = this._.map(this.selectedItems, (selfLink) => {
			return this.$q((resolve, reject) => {
				let affectedItemRemoveListenerId = this.EventService.listen(`affectedItem:${selfLink.link.substring(selfLink.link.lastIndexOf('/') + 1)}:deleteDone`, (event, flag) => {
					this.EventService.unlisten(affectedItemRemoveListenerId);

					if (flag) {
						// Remove deleted row
						this.tableData = this._.filter(this.tableData, row => row.__self__ === selfLink.link);

						this.NotificationService.addNotification(
							this.NotificationTypes.SUCCESS,
							`${selfLink.title}${this.$rootScope.bundle.notification.singleRemove.success}`
						);
					} else {
						this.NotificationService.addNotification(
							this.NotificationTypes.ERROR,
							`${selfLink.title}${this.$rootScope.bundle.notification.failed}`
						);
					}

					resolve();
				});

				this.EventService.send(`affectedItem:${selfLink.link.substring(selfLink.link.lastIndexOf('/') + 1)}:deleteItem`, selfLink.link);
			});
		});

		this.$q.all(promises).then(() => {
			this.NotificationService.showNotifications();
			this.getAffectedItemsData();
			this.selectedItems = [];
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerDelete
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Triggered by clicking delete button.
	 * Deletes the selected items after confirmation.
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
			this.isBulkEditEnabled = false;
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#getAllFields
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Extract field objects from {@link #tableData}.
	 * Note: In this context, field means custom columns fields.
	 * We are not extracting lifecycle, effectivity and other default
	 * column fields because
	 * 1) server is not sending any validation errors point to any of them.
	 * 2) even if server would, it would be hard as there is no URNs for any of them.
	 *
	 * @returns {Array} List of custom fields of the table.
	 */
	getAllFields() {
		let fields = [];
		this._.each(this.tableData, (row) => {
			fields = fields.concat(this.getFields(row));
		});
		return fields;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#getFields
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Extract field objects from a single row of {@link #tableData}.
	 * Note: In this context, field means custom columns fields.
	 * We are not extracting lifecycle, effectivity and other default
	 * column fields because
	 * 1) server is not sending any validation errors point to any of them.
	 * 2) even if server would, it would be hard as there is no URNs for any of them.
	 *
	 * @param {Object} row Table row
	 *
	 * @returns {Array} List of custom fields of the a single row of table.
	 */
	getFields(row) {
		return this.customColumns.map(col => row[col.field]);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#pristineTableRow
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Updates the original values of all the editable or
	 * potentially editable properties of the table row object.
	 * This is done to accept modified values as pristine.
	 *
	 * @param {Object} row Table row
	 */
	pristineTableRow(row) {
		if (row) {
			// Update table row
			row.lifecycle.originalValue = row.lifecycle.value;
			row.effectivity.originalValue = row.effectivity.value;
			row.to.originalValue = row.to.value;

			this._.each(this.customColumns, (customColumn) => {
				row[customColumn.field].originalValue = row[customColumn.field].value;
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#hasInvalidItems
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Check for any client side errors. This function will not
	 * only check for any client side errors (by looking at `validationErrors`
	 * property of metadata), it will also update `hasClientSideErrors` property
	 * of the field. This property is associated with {@link Directives.CellStateIndicator}.
	 * By this approach, the client side validation only happens when you try to
	 * save the data (or wherever this method is used).
	 *
	 * @return {Boolean} True, if managed items contain at least one client side error.
	 */
	hasInvalidItems() {
		let invalidItems = false;
		this._.each(this.tableData, (tableRow) => {
			invalidItems |= this.hasValidationErrors(tableRow);
		});
		return !!invalidItems;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#hasValidationErrors
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Check for any client side errors on a given row object. This function will not
	 * only check for any client side errors (by looking at `validationErrors`
	 * property of metadata), it will also update `hasClientSideErrors` property
	 * of the field. This property is associated with {@link Directives.CellStateIndicator}.
	 * By this approach, the client side validation only happens when you try to
	 * save the data (or wherever this method is used).
	 *
	 * @params {Object} tableRow the row to check
	 *
	 * @return {Boolean} True, if managed items contain at least one client side error.
	 */
	hasValidationErrors(tableRow) {
		let hasValidationErrors = false;

		if (angular.isDefined(tableRow.to.fieldMetadata)) {
			tableRow.to.hasClientSideErrors = !!(tableRow.to.fieldMetadata.validationErrors
			&& tableRow.to.fieldMetadata.validationErrors.length);
		}

		hasValidationErrors |= tableRow.to.hasClientSideErrors;

		this._.each(this.customColumns, (col) => {
			tableRow[col.field].hasClientSideErrors = !!(tableRow[col.field].fieldMetadata.validationErrors
			&& tableRow[col.field].fieldMetadata.validationErrors.length);
			hasValidationErrors |= tableRow[col.field].hasClientSideErrors;
		});

		return !!hasValidationErrors;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description State change triggered by clicking save button.
	 *
	 * NOTE: name has to be triggerSave.
	 */
	triggerSave() {
		this.isCurrentlySaving = true;

		// Initialise some variables
		let saveCount = 0;
		let saveAttempts = 0;
		let modifiedItems = [];

		if (this.hasInvalidItems()) {
			// TODO Show notification.
			this.NotificationService.addNotification(
				this.NotificationTypes.ERROR,
				'Unable to save data due to validation errors'
			);

			this.NotificationService.showNotifications();
			return;
		}

		// Get all edited rows
		this._.each(this.tableData, (row) => {
			if (this.isTableRowDirty(row)) {
				modifiedItems.push(this.updateAffectedItemRow(row, row.affectedItemObj));
			}
		});

		// If no rows are actually edited, nothing is being saved.
		// Go back to view state by triggering cancel.
		if (modifiedItems.length === 0) {
			this.triggerCancel();
		} else {
			// TODO Check that required fields have been filled
			// i.e. 'To' column, using `to.editable`
			// Before calling the actual save?

			// Clear all fields before saving data.
			this.ValidationUtil.clearValidationErrors(this.getAllFields());

			this.$q.all(this._.map(modifiedItems, (item) => {
				this.EventService.send(`affectedItem:${item.getId()}:saveItem`, item);

				return new this.$q(resolve => {
					let affectedItemSaveListenerId = this.EventService.listen(`affectedItem:${item.getId()}:saveDone`, (event, flag, errorInfo) => {
						this.isCurrentlySaving = false;
						this.EventService.unlisten(affectedItemSaveListenerId);
						this.EventService.unlisten(affectedItemSaveConflictListenerId);

						saveAttempts++;

						// Find a table row that corresponds to the request.
						let tableRow = this._.find(this.tableData, row =>
							row.id === item.getId());

						if (flag) {
							saveCount++;
							this.NotificationService.addNotification(
								this.NotificationTypes.SUCCESS,
								`${item.getItemTitle()}${this.$rootScope.bundle.notification.singleEdit.success}`
							);
							this.pristineTableRow(tableRow);
						} else {
							this.isCurrentlySaving = false;
							this.NotificationService.addNotification(
								this.NotificationTypes.ERROR,
								`${item.getItemTitle()}${this.$rootScope.bundle.notification.singleEdit.failed}`
							);

							if (tableRow) {
								// Add validation errors
								this.ValidationUtil.mapValidationErrors(
									this.getFields(tableRow),
									errorInfo.data, {
										predicate: (field, validation) => {
											return validation.field.urn
												? field.fieldTypeId === validation.field.urn.split('.').pop()
												: false;
										}
									}
								);
							}
						}

						resolve();
					});

					let affectedItemSaveConflictListenerId = this.EventService.listen(`affectedItem:${item.getId()}:saveConflict`, (event) => {
						this.EventService.unlisten(affectedItemSaveListenerId);
						this.EventService.unlisten(affectedItemSaveConflictListenerId);

						saveAttempts++;

						let affectedItemListenerId = this.EventService.listen(`affectedItem:${item.getId()}:done`, (event, affectedItemObj) => {
							this.EventService.unlisten(affectedItemListenerId);

							let tableRowToUpdate = this._.find(this.tableData, row =>
								row.id === affectedItemObj.getId());

							if (tableRowToUpdate) {
								let tableRowToUpdateIndex = this._.indexOf(this.tableData, tableRowToUpdate);

								let updatedTableRow = this.createRowFromAffectedItemObj(affectedItemObj);
								updatedTableRow.rowId = tableRowToUpdate.rowId;
								this.tableData[tableRowToUpdateIndex] = updatedTableRow;

								// TODO
								// Tell user (visually) that a row is concurrently modified.
								// Since user can modify multiple rows,
								// what will happen if some of them are already modified by some other user?
								// Can we indicate this to user that for some of
								// the rows he needs to repeat the operation?
							} else {
								// This should not happen
								this.$log.error('Unable to find an affected item record to update.');
							}

							resolve();
						});

						this.ModelsManager.getAffectedItem(this.AffectedItemsObj, item.getId());
					});
				}).then(() => {
					// Once all edited rows have been saved, return to view state
					if (saveAttempts === this._.size(modifiedItems)) {
						let bulkNotificationMessage = '';

						if (saveAttempts === saveCount) {
							bulkNotificationMessage = this.$rootScope.bundle.notification.bulk.updateAllPassed;

							this.$state.go('affected-items', {
								tab: this.$stateParams.tab,
								view: this.$stateParams.view,
								mode: 'view',
								itemId: this.$stateParams.itemId
							});
						} else {
							bulkNotificationMessage = saveCount === 0 ?
								this.$rootScope.bundle.notification.bulk.updateAllFailed : this.$rootScope.bundle.notification.bulk.updateSomePassed;
						}

						this.NotificationService.showNotifications(null, bulkNotificationMessage);
					}
				});
			}));
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description State change triggered by clicking cancel button.
	 *
	 * NOTE: name has to be triggerCancel.
	 */
	triggerCancel() {
		this.$state.go('affected-items', {
			tab: this.$stateParams.tab,
			view: this.$stateParams.view,
			mode: 'view',
			itemId: this.$stateParams.itemId,
			updatedItems: []
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerEdit
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description State change triggered by clicking edit button.
	 *
	 * NOTE: name has to be triggerEdit.
	 */
	triggerEdit() {
		this.$state.go('affected-items', {
			tab: this.$stateParams.tab,
			view: this.$stateParams.view,
			mode: 'edit',
			itemId: this.$stateParams.itemId,
			updatedItems: []
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#hasActiveFlyout
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Check if flyout is active.
	 *
	 * @return {Boolean} True, if flyout is active.
	 */
	hasActiveFlyout() {
		return this.flyoutInstance && this.flyoutInstance.isActive() === true;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Trigger multi select flyout for add item.
	 *
	 * @param {Object} event Event object associated with the click event.
	 */
	triggerAdd(event) {
		let target = event.currentTarget;

		this.RESTWrapperService.allSettled(this.permittedWSPromises).then((results) => {
			let succeededPromises = this._.filter(results, result => result.success === true);

			let allowAddWorkspaces = this._.without(this._.map(succeededPromises, (successPromise) =>
				successPromise.value.canAdd ? successPromise.value.workspaceObj : null), null);

			let allowViewWorkspaces = this._.without(this._.map(succeededPromises, (successPromise) =>
				successPromise.value.canView ? successPromise.value.workspaceObj : null), null);

			this.flyoutInstance = this.FlyoutService.open({
				templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
				scope: this.$scope,
				anchorEl: angular.element(target),
				flyoutClass: 'add-item-flyout',
				placement: 'bottom-left',
				showArrow: true,
				backdropOption: 2,
				controller: 'AddLinkableItemsController',
				controllerAs: 'addLinkableItemsCtrl',
				disableDefaultZIndexAllocation: true,
				resolve: {
					relatedWorkspaces: () => {
						return allowViewWorkspaces;
					}
				}
			});

			this.flyoutInstance.closed.then((result) => {
				if (result && result.createItem === true) {
					let dialogScope = this.$scope.$new();
					dialogScope.ctrl = this;

					this.$mdDialog.show({
						scope: dialogScope,
						controller: 'CreateItemDialogController',
						controllerAs: 'createItemDialogCtrl',
						templateUrl: 'build/components/createItem/createItemDialog.html',
						resolve: {
							CurrentWorkspaceObj: () => {
								return this.workspaceObj;
							},
							AddWorkspaceList: () => {
								return allowAddWorkspaces;
							}
						}
					});
				}
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#getRelatedWorkspaces
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Build a promise list for workspaces related to affected
	 * items view of this item. The promise resolution will take permissions
	 * into consideration.
	 */
	getRelatedWorkspaces(workspaceId) {
		let relatedWorkspacesListenerId = this.EventService.listen(`relatedWorkspaces:${workspaceId}:done`, (event, RelatedWorkspacesObj) => {
			this.EventService.unlisten(relatedWorkspacesListenerId);

			let relatedWorkspaces = RelatedWorkspacesObj.getFullList();

			// Get the workspaces in which the user can add items
			this.permittedWSPromises = this._.map(relatedWorkspaces.workspaces, (workspace) => {
				let deferred = this.$q.defer();

				let relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
				let workspaceListenerId = this.EventService.listen(`workspaceInstance:${relatedWSId}:done`, (event, workspaceObj) => {
					this.EventService.unlisten(workspaceListenerId);
					this.EventService.unlisten(workspacePermissionErrorListenerId);

					let userPermissionsListenerId = this.EventService.listen(`userPermissions:${relatedWSId}~*:done`, (event, userPermissionsObj, workspaceId) => {
						this.EventService.unlisten(userPermissionsListenerId);

						if (userPermissionsObj.hasPermission(this.PLMPermissions.ADD_ITEMS) ||
							userPermissionsObj.hasPermission(this.PLMPermissions.VIEW_ITEMS)) {
							deferred.resolve({
								workspaceObj: workspaceObj,
								canAdd: userPermissionsObj.hasPermission(this.PLMPermissions.ADD_ITEMS),
								canView: userPermissionsObj.hasPermission(this.PLMPermissions.VIEW_ITEMS)
							});
						} else {
							deferred.reject();
						}
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
		});

		this.ModelsManager.getAffectedItemRelatedWorkspaces(workspaceId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#save
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Save newly created item.
	 *
	 * @param {Models.Item} createItem An instance of newly created object.
	 */
	save(createItem) {
		let linkableItemListenerId = this.EventService.listen(`itemInstance:${this.UrnParser.encode(createItem.json.urn)}:associationDone`, (event, flag) => {
			this.EventService.unlisten(linkableItemListenerId);

			if (flag) {
				this.EventService.send(`itemInstance:${this.itemLink}:associationComplete`);
			}
		});

		this.EventService.send(`itemInstance:${this.UrnParser.encode(createItem.json.urn)}:associateAffectedItem`,
			[this.ItemObj, createItem.json.__self__]);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#associateAddedItems
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Associate the items selected from a flyout or modal (e.g.
	 * Add Linkable Items flyout, Add Related BOM Items modal, etc).
	 *
	 * @param {Array} items The list of items selected.
	 */
	associateAddedItems(items) {
		return this.$q.all(this._.map(items, item => {
			let selectedItem = item.ref;

			this.EventService.send(`itemInstance:${selectedItem.getItemId()}:associateAffectedItem`, [
				this.ItemObj,
				selectedItem.getItemLink(),
				selectedItem.getItemTitle()
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
	 * @name Controllers.workspaceItem.ViewAffectedItemsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewAffectedItemsController
	 * @description Determine whether we're in view mode.
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.$stateParams.mode === 'view');
	}
}

export default ViewAffectedItemsController;
