import BomPath from 'com/autodesk/models/bomTable/bomPath.model.js';
import BomChangeListTypes from 'com/autodesk/models/bomEdit/bomChangeListTypes.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewBomController
 *
 * @description View Controller for Bom View
 */
class ViewBomController {

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#constructor
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description The class constructor.
	 * Creates handles to all the required services and top level view models
	 */
	constructor($q, $rootScope, $scope, $templateCache, $compile, $state, $stateParams, $timeout, $filter, $mdMenu, $location, _, FieldTypes, RESTWrapperService, FlyoutService, PLMPermissions, ModelsManager, EventService, BiasService, BomMessageService, moment, RelatedWorkspaces, ValidationUtil, NotificationService, NotificationTypes, BomDataController, BomExporter, LocalUserStorageService) {

		this.$q = $q;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$compile = $compile;
		this.$state = $state;
		this.$timeout = $timeout;
		this.$filter = $filter;
		this.$location = $location;
		this.$stateParams = $stateParams;
		this.FieldTypes = FieldTypes;
		this._ = _;
		this.RESTWrapperService = RESTWrapperService;
		this.FlyoutService = FlyoutService;
		this.PLMPermissions = PLMPermissions;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.BiasService = BiasService;
		this.BomMessageService = BomMessageService;
		this.moment = moment;
		this.RelatedWorkspaces = RelatedWorkspaces;
		this.$templateCache = $templateCache;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.ValidationUtil = ValidationUtil;
		this.BomDataController = BomDataController;
		this.BomExporter = BomExporter;
		this.LocalUserStorageService = LocalUserStorageService;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#tableDataApi
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 *
		 * @description Table Data Component's exposed API. Bound to from the view
		 * Note: Cannot be used before the view has had time to bind with the view
		 */
		this.tableDataApi = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#bundle
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 *
		 * @description Localization Bundle
		 */
		this.bundle = $rootScope.bundle;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 *
		 * @description Item Id for the current workspace item
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description The view bom items permission for the user.
		 */
		this.viewPermission = PLMPermissions.VIEW_BOM;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#bomApiDateFormat
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Stores the date format pulled from user configuration.
		 */
		this.bomApiDateFormat = 'YYYY-MM-DD';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#userDefinedDateFormat
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Stores the date format pulled from user configuration.
		 */
		this.userDefinedDateFormat = 'MM/DD/YYYY';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#uiPermissions
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Permissions that control ui behavior
		 */
		this.uiPermissions = this.buildBomUIPermissions();

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#isEditBomButtonVisible
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Check if the 'Edit' button should be displayed
		 */
		this.isEditBomButtonVisible = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#isEditBomButtonDisabled
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Check if the 'Edit' button should be disabled
		 */
		this.isEditBomButtonDisabled = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#isAddBomButtonVisible
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Check if the 'Add to BOM' button should be displayed
		 */
		this.isAddBomButtonVisible = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#isAddBomButtonDisabled
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Check if the 'Add to BOM' button should be disabled
		 */
		this.isAddBomButtonDisabled = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#initComplete
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Boolean to track if we expanded the topline on init
		 */
		this.initComplete = false;

		this.$scope.linkableItemsOptions = {
			itemsType: 'bomItems'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#currentMode
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Handle to store the current view mode
		 */
		this.currentMode = this.$location.search().mode;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#viewState
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Handle to store the current view mode
		 */
		this.viewState = 'bom';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#userPermissionObj
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 *
		 * @description Handle to store user permissions for workspace
		 */
		this.userPermissionsObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#addFlyout
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 *
		 * @description the flyout instance for the add to bom
		 */
		this.addFlyout = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#viewAttachedItemsFlyout
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 *
		 * @description the flyout instance for the view attached items flyout
		 */
		this.viewAttachedItemsFlyout = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#isWipAttachmentEnabled
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Check if the attachment flyout should be enabled
		 */
		this.isWipAttachmentEnabled = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#bomDataController
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description The controller for the bom data models
		 */
		this.bomDataController = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewBomController#gridApiListener
		 * @propertyOf Controllers.workspaceItem.ViewBomController
		 * @description Handle to a function that will unwatch the current watcher
		 */
		this.gridApiListener = this.$scope.$watch((scope) => {
			return (this.tableDataApi);
		}, (oldVal, newVal) => {
			if (oldVal !== newVal && this.tableDataApi !== null) {
				// Events to perform on each row rendering
				this.setTableEventHandlers();

				// Clear the watch for the api once bound
				this.gridApiListener();
			}
		});

		// Unlistens to events when scope is destroyed
		this.$scope.$on('$destroy', () => {
			// TODO: Remove listeners
			this.gridApiListener();

			if (this.addFlyout) {
				this.addFlyout.cancel();
			}

			if (this.viewAttachedItemsFlyout) {
				this.viewAttachedItemsFlyout.cancel();
			}
		});

		// Call to init the view
		this.init();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#init
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Initalizes the view
	 *	Steps:
	 *		Load the current user's information
	 *		Load the current user's permissions for this workspace
	 *		Load the related workspaces
	 *		Load the enabled features
	 *		Initialize the Bom
	 *			Once the Bom has initialized,
	 *			determine the permissions for the current configured root item
	 */
	init() {
		let workspaceId = this.$stateParams.workspaceId;

		this.loadUser();
		this.loadUserPermissions(workspaceId);
		this.populateRelatedWorkspaces(workspaceId);
		this.loadEnabledFeatures();

		this.bomDataController = new this.BomDataController(this.itemId);
		this.bomDataController.init().then((changedRootId) => {
			this.respondToBomLoad(changedRootId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#loadEnabledFeatures
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Determines which features are currently enabled
	 */
	loadEnabledFeatures() {
		let enabledFeaturesListenerId = this.EventService.listen('enabledFeatures:*:done', (event, EnabledFeatures) => {
			this.EventService.unlisten(enabledFeaturesListenerId);
			this.isWipAttachmentEnabled = this._.find(EnabledFeatures.getDisplayableData().data, item => item.title === 'wip.attachment') ? true : false;
		});
		this.ModelsManager.getEnabledFeatures();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#loadUser
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Loads the current user in order to get their date format
	 */
	loadUser() {
		let userListenerId = this.EventService.listen('currentUser:currentUser:done', (event, UserObj) => {
			this.EventService.unlisten(userListenerId);

			this.userDefinedDateFormat = UserObj.getDateFormat().toUpperCase();
		});

		this.ModelsManager.getCurrentUser();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#loadUserPermissions
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Loads the permissions associated with the current user
	 */
	loadUserPermissions(workspaceId) {
		let userPermissionsListenerId = this.EventService.listen(`userPermissions:${workspaceId}~*:done`, (event, userPermissionsObj) => {
			this.EventService.unlisten(userPermissionsListenerId);
			this.userPermissionsObj = userPermissionsObj;

			// If user does not have view permissions, but hit the url
			// manually, redirect user back to the item details view
			if (!(userPermissionsObj.hasPermission(this.viewPermission))) {
				this.$state.go('details', {
					tab: 'details',
					view: this.$location.search().view,
					mode: 'view',
					itemId: this.$location.search().itemId
				});
			}

			this.uiPermissions = this.buildBomUIPermissions(userPermissionsObj, this.itemObj);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#buildBomUIPermissions
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Bulds a set of permissions for the BOM UI
	 *	calculated from a permissions object and a root item
	 *	If either no permissiosn object is provided or not itemObj is available,
	 *		returns all permissions enabled
	 *
	 * @param {UserPermissions} userPermissions A user's permissions
	 * @param {Item} itemObj A root item
	 * @returns {Object} An object with the following properties:
	 *	addButtonVisibile {Boolean} determines if the add button is visible
	 *  editButtonVisibile {Boolean} determines if edit button is visible
	 *	removeButtonVisibile {Boolean} determines if the remove button is visible
	 *	editDisabled {Boolean} determines if all edit buttons should be disabled
	 */
	buildBomUIPermissions(userPermissions, itemObj) {
		// Default UI permissions
		let uiPermissions = {
			addButtonVisibile: true,
			editButtonVisibile: true,
			removeButtonVisibile: true,
			editDisabled: false
		};

		if (userPermissions && itemObj) {
			let hasAddBomPermission = userPermissions.hasPermission(this.PLMPermissions.ADD_BOM);
			let hasEditBomPermission = userPermissions.hasPermission(this.PLMPermissions.EDIT_BOM);
			let hasDeleteBomPermission = userPermissions.hasPermission(this.PLMPermissions.DELETE_BOM);

			let hasOverrideLockPermission = userPermissions.hasPermission(this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS);
			let hasOverrideRevisionPermission = userPermissions.hasPermission(this.PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS);

			let isItemLocked = itemObj.isLocked();
			let isItemReleased = itemObj.isReleased();

			uiPermissions.addButtonVisibile = hasAddBomPermission;
			uiPermissions.editButtonVisibile = hasAddBomPermission || hasEditBomPermission || hasDeleteBomPermission;
			uiPermissions.removeButtonVisibile = hasDeleteBomPermission;

			if (hasOverrideRevisionPermission) {
				uiPermissions.editDisabled = false;
			} else {
				uiPermissions.editDisabled = isItemReleased || (isItemLocked && !hasOverrideLockPermission);
			}
		}

		return uiPermissions;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getGraph
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Returns the current graph
	 *
	 * @returns {BomGraph} the current graph
	 */
	getGraph() {
		return this.bomDataController.getGraph();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getTable
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Returns the current table
	 *
	 * @returns {BomTable} the current table
	 */
	getTable() {
		return this.bomDataController.getTable();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getConfigurationStateMachine
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Returns the current configuration state machine
	 *
	 * @returns {BomConfigurationStateMachine} the current configuration state machine
	 */
	getConfigurationStateMachine() {
		return this.bomDataController.getConfigurationStateMachine();
	}

	/**
     * @ngdoc method
     * @name Controllers.workspaceItem.ViewBomController#getViewDefs
     * @methodOf Controllers.workspaceItem.ViewBomController
     * @description Returns all the view definitions
     *
     * @returns {viewDefinitions} the view definitions instance
     */
	getViewDefs() {
		return this.bomDataController.getViewDefs();
	}

	/**
     * @ngdoc method
     * @name Controllers.workspaceItem.ViewBomController#getCurrentViewDef
     * @methodOf Controllers.workspaceItem.ViewBomController
     * @description Returns the currently selected view definitions
     *
     * @returns {viewDefinition} the currently selected view definition
     */
	getCurrentViewDef() {
		return this.bomDataController.getCurrentViewDef();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#loadBom
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Loads the bom
	 */
	loadBom() {
		this.initComplete = false;
		this.bomDataController.initBom().then((rootChanged) => {
			this.respondToBomLoad(rootChanged);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#respondToBomLoad
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Responds to the loading of the bom
	 *		If the root item is configured to a new item, update the item header
	 *		Also build the uiPermissions
	 */
	respondToBomLoad(changedRootId) {
		if (changedRootId) {
			this.EventService.send('itemViewer:setNewItem', changedRootId);
		}
		this.uiPermissions = this.buildBomUIPermissions(this.userPermissionsObj, this.bomDataController.getItemObj());
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#reloadCurrentBom
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Reloads the current bom to get fresh data
	 */
	reloadCurrentBom() {
		this.getConfigurationStateMachine().shouldRefresh();
		this.loadBom();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#formatDate
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Reformats the date object from its current format to the new format.
	 * @param {Date} Date object to format
	 * @param {String} representing the current format of the Date Object
	 * @param {String} string representing the desired format of the output Object
	 * @returns {String} A representing the desired formatted date
	 */
	formatDate(date, newFormat, currentFormat) {
		return this.moment(date, currentFormat).format(newFormat);
	}

	/**
	 * @name Controllers.workspaceItem.ViewBomController#setTableEventHandlers
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Manage events to execute on row rendering
	 */
	setTableEventHandlers() {
		this.tableDataApi.core.on.rowsRendered(this.$scope, (gridObj) => {
			this.expandToplineOnInit();
		}, this);
	}

	/**
	 * @name Controllers.workspaceItem.ViewBomController#expandToplineOnInit
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 *
	 * @description Handles expanding the topline if we haven't done so already
	 */
	expandToplineOnInit() {
		if (this.initComplete === false && this.tableDataApi.grid.renderContainers.body.visibleRowCache.length > 0) {
			this.initComplete = true;
			this.expandRow(this.tableDataApi.grid.renderContainers.body.visibleRowCache[0]).then(() => {
				this.EventService.send(this.BomMessageService.getTopLineExpandedMessage(this.initComplete), this.itemId);
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#expandRow
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Trigger row expansion
	 *
	 * @param {Object} row The row that should be expanded
	 *
	 */
	expandRow(row) {
	    let deferred = this.$q.defer();

	    row.grid.api.treeBase.expandRow(row);
	    row.entity.isCollapsed = false;

	    if (!this.bomDataController.shouldUseBulkLoader()) {
	        if (!row.entity.hasFetchedChildren) {
	            row.entity.hasFetchedChildren = true;
	            this.bomDataController.populateChildrenAndOutputToTable(row.entity).then(() => {
	                deferred.resolve();
	            });
	        } else {
	            deferred.resolve();
	        }
	    } else {
			deferred.resolve();
		}

	    return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#collapseRow
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Trigger row collapsing.
	 *
	 * @param {Object} row The row that should be collapsed.
	 *
	 */
	collapseRow(row) {
		row.grid.api.treeBase.collapseRow(row);
		row.entity.isCollapsed = true;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#changeView
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Trigger changing the view
	 *
	 * @param {Object} view the view being selected
	 *
	 */
	changeView(view) {
		// If its the current view, dont bother updating the page
		if (view.id !== this.getConfigurationStateMachine().viewDefId) {
			// Not the view we are on, lets update our config and local storage and refresh the bom
			this.getConfigurationStateMachine().viewChanged(view.id);

			if (this.LocalUserStorageService.canUseLocalStorage()) {
				this.LocalUserStorageService.set(this.getViewDefs().buildViewStorageKey(this.$stateParams.workspaceId.toString()), view.id);
			}

			this.loadBom();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#changeBias
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Trigger changing the view with updated bias settings.
	 *
	 * @param {Object} config the new configuration
	 *	config: {
	 *		effectiveDate: Date()
	 *		bias: bias
	 *	}
	 *
	 */
	changeBomConfiguration(config) {
		// bomConfigurationDropdown returns date in some format we don't control
		//	so we need to convert back to a friendly string
		let effectiveDate = this.formatDate(config.effectiveDate, this.bomApiDateFormat);

		if (effectiveDate !== this.getConfigurationStateMachine().getEffectiveDate() || config.bias !== this.getConfigurationStateMachine().revisionBias) {
			this.getConfigurationStateMachine().configurationChanged(effectiveDate, config.bias);
			this.loadBom();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getViewTitle
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Trigger row collapsing.
	 *
	 * @return {String} Title of the current BOM view
	 */
	getViewTitle() {
		return (this.getCurrentViewDef()) ? this.getCurrentViewDef().getTitle() : '';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getViewDate
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Obtain and format the date stored in the configuration
	 *
	 * @return {String} Formatted date or localized 'Today' text
	 */
	getViewDate() {
		let date = this.getConfigurationStateMachine().effectiveDate;
		if (date !== null) {
			// Check if date is today
			let isToday = date.isSame(this.moment(), 'day');

			if (isToday) {
				return this.bundle.bom.header.today;
			} else {
				return this.formatDate(date, this.userDefinedDateFormat);
			}
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getViewBias
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Obtain the localized text of the current bias set through user configuration
	 *
	 * @return {String} Name of the revision bias configuration
	 */
	getViewBias() {
		if (this.getConfigurationStateMachine().revisionBias !== null) {
			return this.BiasService.getBiasName(this.getConfigurationStateMachine().revisionBias);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#getTooltipText
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Craft the title to be displayed in the tooltip of the header of the section.
	 *
	 * @return {String} Text of the tooltip
	 */
	getTooltipText() {
		return `${this.getViewTitle()} as of ${this.getViewDate()} using the ${this.getViewBias()} configuration`;
	}

	/**
	 * @name Controllers.workspaceItem.ViewBomController#populateRelatedWorkspaces
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Build a promise list for workspaces related to affected
	 * items view of this item. The promise resolution will take permissions
	 * into consideration.
	 */
	populateRelatedWorkspaces(workspaceId) {
		let relatedWorkspacesListenerId = this.EventService.listen(`relatedWorkspaces:${workspaceId}:done`, (event, relatedWorkspacesObj) => {
			this.EventService.unlisten(relatedWorkspacesListenerId);

			let relatedWorkspaces = relatedWorkspacesObj.getFullList();

			// Get the workspaces in which the user can add items
			this.permittedWSPromises = this._.map(relatedWorkspaces.workspaces, workspace => {
				return new Promise((resolve, reject) => {
					let relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);

					let workspaceListenerId;
					let workspacePermissionErrorListenerId;

					workspaceListenerId = this.EventService.listen(`workspaceInstance:${relatedWSId}:done`, (event, workspaceObj) => {
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
								reject();
							}
						});
					});
					workspacePermissionErrorListenerId = this.EventService.listen(`workspaceInstance:${relatedWSId}:permissionError`, (event) => {
						this.EventService.unlisten(workspaceListenerId);
						this.EventService.unlisten(workspacePermissionErrorListenerId);

						reject();
					});
					this.ModelsManager.getWorkspace(relatedWSId);
				});
			});
		});
		this.ModelsManager.getBomRelatedWorkspaces(workspaceId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#enterEditMode
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Takes the bom into edit mode and activates the navigation guard.
	 *	If the revisions column is present,
	 *		we request the loading of the alternative revisions
	 */
	enterEditMode() {
		if (this.currentMode !== 'edit') {
			this.currentMode = 'edit';

			// This will activate the navigation guard.
			this.$scope.$emit('activateNavigationGuard', this);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#loadEditableItemRevisions
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Load the revisions for an item child
	 *	Exclude the working and unreleased revision,
	 *		since we don't let you see those when editing
	 * @param {BomTableRow} row the row to load revisions for
	 */
	loadEditableItemRevisions(row) {
		this.bomDataController.loadItemRevisions(row, ['UNRELEASED', 'WORKING']);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#enterViewMode
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Take the bom to view state
	 */
	enterViewMode() {
		if (this.currentMode !== 'view') {
			this.currentMode = 'view';
			this.$state.go('bom', {
				tab: this.$location.search().tab,
				view: this.$location.search().view,
				mode: this.currentMode,
				itemId: this.$location.search().itemId
			});
		}

		this.reloadCurrentBom();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#triggerAdd
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Triggered by clicking add button - opens add flyout and populates list
	 */
	triggerAdd(event) {
		let target = event.currentTarget;

		this.RESTWrapperService.allSettled(this.permittedWSPromises).then(promises => {
			let succeededPromises = this._.filter(promises, promise => promise.success);

			// Get the related workspaces for which the user has 'View items'
			// permission - these are the ones that they can pick from the
			// workspace filter dropdown in the Add flyout
			let allowViewWorkspaces = this._.filter(this._.map(succeededPromises, promise => {
				return promise.value.canView ? promise.value.workspaceObj : null;
			}));

			this.addFlyout = this.FlyoutService.open({
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

			this.listenForAdds();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#viewAttachments
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Triggered by clicking attachment icon - opens view attached flyout and populates list
	 */
	viewAttachments(event, fieldObj) {
		let target = event.currentTarget;

		this.viewAttachedItemsFlyout = this.FlyoutService.open({
			templateUrl: 'build/components/workspaceItem/viewAttachedItems/viewAttachedItems.html',
			anchorEl: angular.element(target),
			flyoutClass: 'view-attached-items-flyout',
			showArrow: true,
			backdropOption: 1,
			controller: 'ViewAttachedItemsController',
			controllerAs: 'viewAttachedItemsCtrl',
			disableDefaultZIndexAllocation: false,
			scope: this.$scope,
			resolve: {
				attachmentsObj: () => fieldObj
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#listenForAdds
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Listens for the flyout to send an add request
	 */
	listenForAdds() {
		let addedItemsListenerId = this.EventService.listen('linkableItems:added', (event, ...addedItems) => {
			this.EventService.unlisten(addedItemsListenerId);

			this.enterEditMode();
			this.getTable().queueAdds(addedItems, this.getCurrentViewDef());
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#triggerRemove
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Marks all selected rows for removal and enters edit mode
	 */
	triggerRemove() {
		this.enterEditMode();
		this.getTable().queueSelectedRowsForRemoval();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#saveChanges
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Gets and prepares the changes that need to be persisted,
	 *		requests that they be saved, and listens for their responses
	 */
	saveChanges() {
		let changes = this.prepareChanges();

		if (changes.length > 0) {
			this.listenForChangeResponses(changes);
			this.listenForSaveCompletion();

			changes.forEach((change) => {
				this.persistChange(change);
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#prepareChanges
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Processes the changes from the bom table's changeTracker
	 *		and adds any extra properties that are needed to their payloads
	 *
	 * @returns {Array} a list of objects describing a change for each edge
	 */
	prepareChanges() {
		let changeMap = this.getTable().changeTracker.getMinimalLists();

		let changes = [];
		changeMap.forEach((change, edgeId) => {
			// If the change is an edit, it needs the link to the edge
			if (change.changeType === BomChangeListTypes.EDIT) {
				let edge = this.getGraph().getEdge(edgeId);
				change.payload.__self__ = edge.link;
				changes.push(change);
			} else if (change.changeType === BomChangeListTypes.REMOVE) {
				let edge = this.getGraph().getEdge(edgeId);
				change.payload.__self__ = edge.link;
				changes.push(change);
			} else {
				changes.push(change);
			}
		});

		return changes;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#listenForChangeResponses
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Listen for changes to succeed or fail
	 *		when all have completed, sends a message
	 */
	listenForChangeResponses(changes) {
		let successfulChanges = [];
		let failedChanges = [];

		changes.forEach((change) => {
			let successMessage = this.BomMessageService.getBomChangeSuccessMessage(change.changeType, change.edgeId);
			let failureMessage = this.BomMessageService.getBomChangeFailureMessage(change.changeType, change.edgeId);
			let saveCompletedMessage = this.BomMessageService.getBomSaveCompletedMessage();

			let messageReturned = () => {
				this.EventService.unlisten(changeSuccessListenerId);
				this.EventService.unlisten(changeFailureListenerId);

				checkAllSaveResponsesCompleted();
			};

			let checkAllSaveResponsesCompleted = () => {
				if (successfulChanges.length + failedChanges.length === changes.length) {
					let changes = {
						successes: successfulChanges,
						failures: failedChanges
					};
					this.EventService.send(saveCompletedMessage, changes);
				}
			};

			let changeSuccessListenerId = this.EventService.listen(successMessage, (event) => {
				this.addChangeNotification(change, this.NotificationTypes.SUCCESS);
				successfulChanges.push(change);
				messageReturned();
			});

			let changeFailureListenerId = this.EventService.listen(failureMessage, (event, errorResponse) => {
				change.addErrors(errorResponse);
				this.addChangeNotification(change, this.NotificationTypes.ERROR);
				failedChanges.push(change);
				messageReturned();
			});
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#listenForSaveCompletion
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Listen for all changes to succeed or fail
	 */
	listenForSaveCompletion() {
		let saveCompletedMessage = this.BomMessageService.getBomSaveCompletedMessage();
		let saveCompletedMessageId = this.EventService.listen(saveCompletedMessage, (event, changes) => {
			this.EventService.unlisten(saveCompletedMessageId);

			// show the the notifications before going to reapply the changes if there are failed changes
			this.NotificationService.showNotifications();

			if (changes.failures.length > 0) {
				changes.failures.forEach((change) => {
					// For edits, wait until the row is loaded again before applying the change
					if (change.changeType === BomChangeListTypes.EDIT || change.changeType === BomChangeListTypes.REMOVE) {
						this.handleFailedChangeToRowOnLoad(change);
					}
					if (change.changeType === BomChangeListTypes.ADD) {
						this.handleFailedAdd(change);
					}
				});

				// Reinit the bom with data from servers
				this.reloadCurrentBom();
			} else {
				this.enterViewMode();
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#handleFailedChangeToRowOnLoad
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Listen for a row to be added, then apply the change to that row
	 * @param {Object} change A compiled change to reapply
	 */
	handleFailedChangeToRowOnLoad(change) {
		// Currenly we assume that the change will effect a row that is the immediate child of the root
		let rowAddedMessage = this.BomMessageService.getBomRowAddedMessage(BomPath.EmptyPath().WithSucceedingEdge(change.edgeId));
		let appliedListenerId = this.EventService.listen(rowAddedMessage, (event) => {
			this.EventService.unlisten(appliedListenerId);
			this.getTable().reapplyChange(change);
			this.getTable().consumeErrors(this.getCurrentViewDef(), change.edgeId, change.getErrors());
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#handleFailedAdd
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description When an add to the bom fails then the bom will remain in edit mode, and the changes will be reapplied to it.
	 * @param {Object} change A compiled add change to reapply
	 */
	handleFailedAdd(change) {
		// Before we can re-add the failed items to the table properly we need to wait until the top line finished expansion
		let bomInitCompleteListenerId = this.EventService.listen(this.BomMessageService.getTopLineExpandedMessage(true), (event) => {
			this.EventService.unlisten(bomInitCompleteListenerId);
			this.getTable().reapplyChange(change);
			this.getTable().consumeErrors(this.getCurrentViewDef(), change.edgeId, change.getErrors());
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#persistChange
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Sends a set of changes out to be persisted
	 */
	persistChange(change) {
		let changeMessage = this.BomMessageService.getBomChangeSendMessage(change.changeType, change.edgeId);
		let args = [];
		if (change.changeType === BomChangeListTypes.EDIT) {
			args = [change.payload];
		} else if (change.changeType === BomChangeListTypes.ADD) {
			let configuration = this.getConfigurationStateMachine().getFullConfiguration();
			configuration.rootItem = this.bomDataController.getItemObj().getId();
			args = [this.bomDataController.getItemObj().getBomNestedLink(), change.payload, configuration];
		} else if (change.changeType === BomChangeListTypes.REMOVE) {
			args = [change.payload];
		}

		this.EventService.send(changeMessage, ...args);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Triggered by clicking cancel button - NOTE: name has to be
	 * triggerCancel.
	 */
	triggerCancel() {
		this.enterViewMode();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Triggered by clicking save button - NOTE: name has to be
	 * triggerSave.
	 */
	triggerSave() {
		this.saveChanges();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Determine whether we're in view mode
	 *
	 * @returns {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.currentMode === 'view');
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#isEditState
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Determine whether we're in edit mode
	 *
	 * @returns {Boolean} true if we are in view mode
	 */
	isEditState() {
		return (this.currentMode === 'edit');
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#shouldBomRowBeDisabled
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Determine whether or not the row should be disabled
	 *
	 * @returns {Boolean} true if the itemDepth is not 1
	 */
	shouldBomRowBeDisabled(itemDepth) {
		return (itemDepth !== 1);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#sCellEditable
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Determine whether or not a cell is editable
	 *
	 * @returns {Boolean} true if the cell is on top level row and is an edge field
	 */
	isCellEditable(tableRow, cellData) {
		if (tableRow.depth !== 1 || this.isRowMarkedForRemoval(tableRow)) {
			return false;
		}

		if (cellData.getFieldId() === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
			return true;
		}

		// To be removed once filtered picklists can be edited
		if (cellData.typeId === this.FieldTypes.PICKLIST_FILTERED) {
			return false;
		}

		let field = this.getCurrentViewDef().getField(cellData.getFieldId());

		if (tableRow.isNewlyAdded) {
			return field.isEditableOnCreate();
		} else {
			return field.isAlwaysEditable();
		}
	}

	/**
	 * @name Controllers.workspaceItem.ViewBomController#openMenu
	 * @propertyOf Controllers.workspaceItem.ViewBomController
	 * @description Open md-menu and add event listener to menu-backdrop
	 */
	openMenu($mdOpenMenu, ev, edgeId, COL_FIELD) {
		$mdOpenMenu(ev);

		// Add click event listener to material menu-backdrop to update changes to the bom table
		// because of the  delay in opening menu-backdrop, we need hackish delay here
		this.$timeout(() => {
			let menuBackdrop = angular.element(document.querySelector('.md-menu-backdrop'));
			menuBackdrop[0].addEventListener('click', () => {
				this.getTable().handleEdit(edgeId, COL_FIELD);
			});
		}, 1000);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#addChangeNotification
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description adds a notification to be displayed by creating appropriate
	 *              message for the status of the operation.
	 * @param {Object} the change for which the notification is being added
	 * @param {Object} type of the notification (success, failure);
	 */
	addChangeNotification(change, notificationType) {
		let changedItemTitle;
		if (change.changeType === BomChangeListTypes.ADD) {
			changedItemTitle = change.payload.item.title;
		} else {
			let node = this.getGraph().getNodeForEdge(change.edgeId);
			changedItemTitle = node.item.title;
		}

		let key = (notificationType === this.NotificationTypes.ERROR) ? 'failed' : notificationType;
		if (change.changeType === BomChangeListTypes.ADD) {
			var {[key] : notificationContent} = this.bundle.notification.singleAdd;
		} else if (change.changeType === BomChangeListTypes.EDIT) {
			var {[key] : notificationContent} = this.bundle.notification.singleEdit;
		} else if (change.changeType === BomChangeListTypes.REMOVE) {
			var {[key] : notificationContent} = this.bundle.notification.singleRemove;
		} else {
			var notificationContent = 'unknown';
		}

		let notificationMessage = `${changedItemTitle}${notificationContent}`;

		this.NotificationService.addNotification(notificationType, notificationMessage);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#isDirty
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description This method will be used by PLMNavigationGuard to determine
	 * whether or not to raise warning for navigation events.
	 *
	 * @return {Boolean} true if the bom is in edit mode and has pending changes.
	 */
	isDirty() {
		let hasPendingChange = this.getTable().changeTracker.hasPendingChanges();

		return this.isEditState() && hasPendingChange;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#isRowMarkedForRemoval
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Tells us whehter or not a the `tableRow` has been marked for
	 * removal.
	 *
	 * @param {object} representing a table row.
	 *
	 * @returns {Boolean} true if the row is is marked to be removed.
	 */
	isRowMarkedForRemoval(tableRow) {
		let isBeingRemoved = this.getTable().getRowEditState(tableRow).changeType === BomChangeListTypes.REMOVE;

		return isBeingRemoved;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#isNewlyAddedRow
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Tells us whether or not the `tableRow` is a newly added one.
	 *
	 * @param {Object} representing a bom table row.
	 *
	 * @return {Boolean} True if the row is newly added.
	 */
	isNewlyAddedRow(tableRow) {
		return tableRow.isNewlyAdded;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewBomController#exportBom
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description Export the bom of the current item
	 *	TODO: Load the Full Bom to export
	 */
	exportBom() {
		let configuration = {
			viewTitle: this.getCurrentViewDef().getTitle(),
			date: this.getConfigurationStateMachine().getEffectiveDate(),
			bias: this.getConfigurationStateMachine().getRevisionBias()
		};

		this.BomExporter.exportBom(this.getTable(), this.bomDataController.getItemObj(), configuration);
	}
}
export default ViewBomController;
