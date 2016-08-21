/**
 * @ngdoc object
 * @name Controllers.ItemViewerController
 *
 * @description This controller is attached to ItemViewerDirective
 * There are 4 parameters configuring how this should behave:
 * tab: this determines which tab to display.  Because we want to make sure we don't break existing stateProvider configs, we're using either the 'workspace-item-'+active or link in TABMAPPING, this needs revisiting
 * view: split|full.  This determines the size of the viewer, whether it's partial or full width
 * mode: view|edit|add|etc.  This really is a mode for individual tabs, and mostly are read and set by the individual tabs
 * itemId: this is the urn of an item, equivalent to the itemId we had in the other state (/item/itemUrn/*)
 *
 * ##Dependencies
 *
 */

/**
 * @ngdoc property
 * @name Controllers.ItemViewerController#TABMAPPING
 * @propertyOf Controllers.ItemViewerController
 * @description `private` The mapping of icons and ids for the tabs
 * The 'icon' is not being used in Galileo, but left here for legacy purposes
 * in case we use them later
 */
const TABMAPPING = {
	itemDetails: { // Item Details
		icon: 'icon-Info',
		active: 'details',
		link: 'details'
	},
	linkedItems: { // Managed Items
		icon: 'icon-Connect',
		active: 'affected-items',
		link: 'affected-items'
	},
	gridDetails: { // Grid
		icon: 'icon-Tabular',
		active: 'grid',
		link: 'grid'
	},
	projectManagement: { // Project Management
		icon: 'icon-Sheets',
		active: 'project-management',
		link: 'project-management'
	},
	partAttachment: { // Attachments from CPDM
		icon: 'icon-Attach',
		active: 'attachments',
		link: 'attachments'
	},
	workflowActions: { // Workflow Actions
		icon: 'icon-a360-organization',
		active: 'workflow-map',
		link: 'workflow-map'
	},
    bomViewNested: { // Bill of Materials
        icon: 'icon-Heirarchy2',
        active: 'bom',
        link: 'bom'
    },
	// bomViewWhereUsed: { // Where Used NOT AVAILABLE
	// 	icon: 'icon-Heirarchy1',
	// 	active: 'where-used',
	// 	link: 'where-used-view'
	// },
	// sourcing: {
	// 	icon: 'icon-Library',
	// 	active: 'sourcing',
	// 	link: 'sourcing-view'
	// },
	// 'sourcingSuppliedItems': { // Supplied Items NOT AVAILABLE
	// 	icon: 'icon-CubeSectioned',
	// 	active: 'supplied-items',
	// 	link: 'supplied-items-view'
	// },
	relationship: { // Relationships
		icon: 'icon-Transfer',
		active: 'relationships',
		link: 'relationships'
	},
	linkedItemsReferences: { // Workflow
		icon: 'icon-History',
		active: 'workflow',
		link: 'workflow'
	},
	milestonesDetails: { // Milestones NOT AVAILABLE
		icon: 'icon-Tasks',
		active: 'milestones',
		link: 'milestones'
	},
	partHistory: { // Change Log
		icon: 'icon-TimeActivity',
		active: 'change-log',
		link: 'change-log'
	},
	namedRelationshipsTab: { // Named Relationships
		active: 'named-relationships',
		link: 'named-relationships'
	}
};

class ItemViewerController {

	/*
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#constructor
	 * @methodOf Controllers.ItemViewerController
	 * @description The class constructor
	 */
	constructor($scope, $rootScope, $state, $stateParams, $location, $timeout, $compile, $controller, $q, LocalizationService, ModelsManager, EventService, FlyoutService, NotificationService, NotificationTypes, WorkspaceTypes, PLMPermissions, UrnParser, $mdSidenav, $mdComponentRegistry, _, PermissionService, $mdDialog, CreateTypes, TabActionNameTypes, $filter) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$location = $location;
		this.$timeout = $timeout;
		this.$compile = $compile;
		this.$mdSidenav = $mdSidenav;
		this.$mdDialog = $mdDialog;
		this.$mdComponentRegistry = $mdComponentRegistry;
		this.$controller = $controller;
		this.$q = $q;
        this.$filter = $filter;
		this._ = _;
		this.LocalizationService = LocalizationService;
		this.PLMPermissions = PLMPermissions;
		this.PermissionService = PermissionService;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.NotificationService = NotificationService;
		this.ModelsManager = ModelsManager;
		this.UrnParser = UrnParser;

		// Constants
		this.CreateTypes = CreateTypes;
		this.WorkspaceTypes = WorkspaceTypes;
		this.TabActionNameTypes = TabActionNameTypes;
		this.NotificationTypes = NotificationTypes;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#workspaceId
		 * @propertyOf Controllers.ItemViewerController
		 * @description The workspace id of the current selected item.
		 *
		 */
		this.workspaceId = angular.isDefined(this.workspaceId) ?
			this.workspaceId : this.$stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#viewWorkflowPermission
		 * @propertyOf Controllers.ItemViewerController
		 * @description view workflow permission id
		 */
		this.viewWorkflowPermission = PLMPermissions.VIEW_WORKFLOW;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#hasDeletePermission
		 * @propertyOf Controllers.ItemViewerController
		 * @description True, if user has delete items permission
		 */
		this.hasDeletePermission = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isBookmarked
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value tied to the current bookmark
		 * status of the item
		 */
		this.isBookmarked = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isArchived
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value tied to the current archival
		 * state of the item
		 */
		this.isArchived = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isLocked
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value tied to the current locked
		 * state of the item
		 */
		this.isLocked = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isWorkingVersion
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value tied to the current working or
		 * released state of the item
		 */
		this.isWorkingVersion = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#hasOverrideWorkflowLock
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value tied to the admin override
		 * workflow lock of the user
		 */
		this.hasOverrideWorkflowLock = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#hasOverrideRevisionLock
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value tied to the override revision
		 * control lock of the user
		 */
		this.hasOverrideRevisionLock = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#showWorkflowState
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Boolean value relevant to UI
		 */
		this.showWorkflowState = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#itemId
		 * @propertyOf Controllers.ItemViewerController
		 * @description The item id of the current selected item.
		 */
		this.itemId = this.$location.search().itemId;
		this.$scope.itemId = this.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isFullView
		 * @propertyOf Controllers.ItemViewerController
		 * @description The type of view currently in: either split or full
		 */
		this.isFullView = (this.$location.search().view === 'full');

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#tabList
		 * @propertyOf Controllers.ItemViewerController
		 * @description Stores parsed list of tabs for the current item
		 */
		this.tabList = [];

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#workspaceSections
		 * @propertyOf Controllers.ItemViewerController
		 * @description The list of sections/categories of workspaces
		 */
		this.workspaceSections;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#linkedToWorkspaces
		 * @propertyOf Controllers.ItemViewerController
		 * @description Promise for the list of revisioning workspaces that the
		 * current item can be added to
		 */
		this.linkedToWorkspaces = new Promise(angular.noop);

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isItemAdded
		 * @propertyOf Controllers.ItemViewerController
		 * @description True, if item has already been added to a change order
		 */
		this.isItemAdded;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#currentStateName
		 * @propertyOf Controllers.ItemViewerController
		 * @description String for the current state name
		 */
		this.currentStateName = '';

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isCreatePermitted
		 * @propertyOf Controllers.ItemViewerController
		 * @description True, if create button is permitted to be displayed
		 */
		this.isCreatePermitted;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#workspaceIcon
		 * @propertyOf Controllers.ItemViewerController
		 * @description Holds the current workspace icon of the item.
		 */
		this.workspaceIcon;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#itemCurrLifecycleName
		 * @propertyOf Controllers.ItemViewerController
		 * @description Holds the current item Lifecycle Name.
		 */
		this.itemCurrLifecycleName = '';

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isWorkflowTransitionEnabled
		 * @propertyOf Controllers.ItemViewerController
		 * @description Boolean for checking if the workflow transition dropdown should be shown or not
		 */
		this.isWorkflowTransitionHidden = true;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isWorkspaceWithWorkflow
		 * @propertyOf Controllers.ItemViewerController
		 * @description Boolean for checking workspace with workflow
		 */
		this.isWorkspaceWithWorkflow = false;

		// Listeners to update archive/bookmark status
		this.archiveListenerId;
		this.bookmarkListenerId;
		this.updateArchiveListenerId;
		this.updateBookmarkListenerId;

		$rootScope.$on('$locationChangeSuccess', () => {
			this.init();
		});

		$scope.$on('$destroy', () => {
			EventService.unlisten(this.archiveListenerId);
			EventService.unlisten(this.bookmarkListenerId);
			EventService.unlisten(this.updateArchiveListenerId);
			EventService.unlisten(this.updateBookmarkListenerId);
			EventService.unlisten(this.itemAddedToECOListenerId);
		});

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isDisplayed
		 * @propertyOf Controllers.ItemViewerController
		 * @description Boolean indicating if the itemViewer should be visible or not
		 */
		this.isDisplayed = false;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#navigateToRoamer
	 * @methodOf Controllers.ItemViewerController
	 * @description changes route to get into the roamer view.
	 */
	navigateToRoamer() {
		this.$state.go('roamer', {
			itemUrn: this.itemId,
			itemTab: this.$location.search().tab
		});
	}

	/*
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#init
	 * @methodOf Controllers.ItemViewerController
	 * @description Reloads the item viewer completely
	 */
	init() {
		this.isFullView = (this.$location.search().view === 'full');

		this.itemId = this.$location.search().itemId;
		this.$scope.itemId = this.itemId;
		this.workspaceId = this.$stateParams.workspaceId;

		this.isDisplayed = typeof this.itemId !== 'undefined';

		this.$mdComponentRegistry.when('item-content').then((itemContent) => {
			this.isOpen = angular.bind(itemContent, itemContent.isOpen);
			this.togglePanel = angular.bind(itemContent, itemContent.toggle);
			this.openPanel = angular.bind(itemContent, itemContent.open);
			this.closePanel = angular.bind(itemContent, itemContent.close);

			// Close any outstanding dialogs when location is changed.
			this.$mdDialog.cancel();
			this.openPanel();
			this.initPanel();
		});

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#workspacesListenerId
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Stores the listener for the workspaces
		 */
		let workspacesListenerId = this.EventService.listen('workspaces:all:done', (event, WorkspacesObj) => {
			this.EventService.unlisten(workspacesListenerId);
			this.workspaceSections = WorkspacesObj.getFullList().sections;
		});

		this.ModelsManager.getWorkspaces('workspaces:all:get');

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#updateHeaderItemListenerId
		 * @propertyOf Controllers.ItemViewerController
		 * @description `private` Stores the listener for requests to update the header item
		 */
		let updateHeaderItemListenerId = this.EventService.listen('itemViewer:setNewItem', (event, itemId) => {
			this.initPanel(itemId);
		});

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#itemAddedToECOListenerId
		 * @propertyOf Controllers.ItemViewerController
		 * @description listener for event when item is added to ECO (or any other revisioning workspace) using quick create.
		 */
		this.itemAddedToECOListenerId = this.EventService.listen('itemAddedToECO:done', () => {
			// TODO: investigate the impact of this call on build automation.
			// this.initPanel();
		});
	}

	/*
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#initPanelAndReload
	 * @methodOf Controllers.ItemViewerController
	 * @description Initialize the item viewer panel and reload the current state
	 */
	initPanelAndReload() {
		this.initPanel();
		this.$state.reload(this.$state.current.name);
	}

	/*
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#isArchiveDisabled
	 * @methodOf Controllers.ItemViewerController
	 * @description Determine if archive/unarchive should be disabled.
	 *
	 * If item is locked and/or released and user has override workflow lock
	 * and or/ override revision lock, archive/unarchive should not be disabled.
	 *
	 * If item is locked and user does not have above-mentioned locks,
	 * archive/unarchive should be disabled.
	 */
	isArchiveDisabled() {
		return !((this.hasOverrideWorkflowLock || !this.isLocked) &&
			(this.hasOverrideRevisionLock || this.isWorkingVersion));
	}

	/*
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#initPanel
	 * @methodOf Controllers.ItemViewerController
	 * @description Initialize the item viewer panel
	 *
	 * @param {String} itemId The urn of the item
	 */
	initPanel(itemId) {
		if (!angular.isDefined(itemId) && !angular.isDefined(this.$location.search().itemId)) {
			return;
		}

		this.itemId = angular.isDefined(itemId) ? itemId : this.$location.search().itemId;
		this.headerText = '';

		let itemListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, itemObj) => {
			this.EventService.unlisten(itemListenerId);
			this.selectedRevision = null;

			// Resets to false (in case it's already true from previous tab)
			this.isCreatePermitted = false;

			// Set current state
			this.currentStateName = itemObj.getFullList().currentState ?
				itemObj.getFullList().currentState.title || 'Not Found' : undefined;

			// Sets the archival state
			this.isArchived = itemObj.getFullList().deleted;

			// Sets the locked state
			this.isLocked = itemObj.getFullList().itemLocked;

			// Sets the working/released state
			this.isWorkingVersion = itemObj.isWorking();

			// Check for the various permissions needed for archive/unarchive
			let userPermissionsListenerId = this.EventService.listen(`userPermissions:${this.workspaceId}~*:done`, (event, userPermissionsObj) => {
				this.EventService.unlisten(userPermissionsListenerId);

				this.hasDeletePermission = userPermissionsObj.hasPermission(this.PLMPermissions.DELETE_ITEMS);
				this.hasOverrideWorkflowLock = userPermissionsObj.hasPermission(this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS);
				this.hasOverrideRevisionLock = userPermissionsObj.hasPermission(this.PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS);
			});

			// Sets current workspace
			this.currentWorkspaceObj = itemObj.getWorkspaceObj();

            // Retrieves the date format for the current logged in user
			let currentUserListenerId = this.EventService.listen('currentUser:currentUser:done', (event, userObj) => {
				this.EventService.unlisten(currentUserListenerId);
				this.dateFormat = userObj.getDateFormat();
            });

            this.ModelsManager.getCurrentUser();

			// Update items list if needed
			if (this.currentWorkspaceObj.getId() !== this.workspaceId) {
				this.workspaceId = this.currentWorkspaceObj.getId();
				this.EventService.send(
					`reloadWorkspaceItems:${this.workspaceId}:get`,
					[this.workspaceId, this.currentWorkspaceObj.getDisplayName()]
				);
			}

            this.selectedEffectivity = null;
            this.itemCurrLifecycleName = null;

			// Sets current item
			this.currentItemObj = itemObj;

			// sets the workspace icon on any item change.
			let iconWorkspaceListenerId = this.EventService.listen('workspaces:all:done', (event, WorkspacesObj) => {
				let categoryInfo = WorkspacesObj.getSimpleList().filter(workspace => workspace.id === parseInt(this.workspaceId)).shift();
				this.workspaceIcon = categoryInfo ? categoryInfo.icon : null;
				this.EventService.unlisten(iconWorkspaceListenerId);
			});
			this.ModelsManager.getWorkspaces('workspaces:all:get');

			/**
			 * @ngdoc property
			 * @name Controllers.ItemViewerController#tabsListenerId
			 * @propertyOf Controllers.ItemViewerController
			 * @description `private` The listener for the loading of the tabs
			 */
			let tabsListenerId = this.EventService.listen(`itemTabs:${this.workspaceId}:done`, (event, tabsObj) => {
				this.EventService.unlisten(tabsListenerId);
				this.tabList.splice(0, this.tabList.length);

				this._.each(tabsObj.getFullList(), (tab, tabIndex) => {
					// Strips out the slash from the action name
					let actionNameStripped = tab.actionName.substr(1);

					// Searches for the tab in the mapping
					let foundTab = this._.find(TABMAPPING, (foundTab, foundTabEl) =>
						foundTabEl === actionNameStripped);

					// If undefined, tab should not be displayed
					if (angular.isDefined(foundTab)) {

						// If is namedRelationshipsTab which is a dynamic tab
						// (i.e. can have multiples of this tab),
						// actionNameStripped will be replaced with the tab.key
						// which will be used as the id in the tablist.
						if (actionNameStripped === this.TabActionNameTypes.NAMED_RELATIONSHIPS) {
							actionNameStripped = tab.key;
						}

						// If name is null, the tab has not been customized
						let tabName = (tab.name === null) ? tab.key : tab.name;

						// Pushes the object that's a result of the content
						// retrieved from the endpoint, and the local mapping
						this.tabList.push({
							name: tabName,
							id: actionNameStripped,
							active: foundTab.active,
							viewLink: `${foundTab.active}-view`,
							editLink: `${foundTab.active}-edit`,
							link: foundTab.link,
							icon: foundTab.icon
						});
					}
				});
			});

			// Gets tab list
			this.ModelsManager.getTabs(this.workspaceId);

			// Whenever the user switches to a new workspace (or item), the type will get updated
			this.workspaceTypeId = parseInt(itemObj.getWorkspaceObj().getTypeId());
			this.headerText = itemObj.getFullList().title;

			// Show or not show workflow state
			this.showWorkflowState = ((this.workspaceTypeId === this.WorkspaceTypes.BASIC_WORKSPACE_WITH_WORKFLOW)
				|| (this.workspaceTypeId === this.WorkspaceTypes.REVISIONING_WORKSPACE)
				|| (this.workspaceTypeId === this.WorkspaceTypes.SUPPLIER_WITH_WORKFLOW))
			&& (this.currentStateName !== undefined);
			this.LocalizationService.init().then(() => {
				this.bundle = this.$rootScope.bundle;

				// Display revisioning dropdown according to workspace type
				// Determine the type of workspace and display the corresponding widgets
				// This is not taking into account permissions, for now (improve it later)
				// BASIC_WORKSPACE: 1,
				// BASIC_WORKSPACE_WITH_WORKFLOW: 2,
				// SUPPLIER: 3,
				// REVISION_CONTROLLED_WORKSPACE: 6,
				// REVISIONING_WORKSPACE: 7,
				// SUPPLIER_WITH_WORKFLOW: 8
				switch (this.workspaceTypeId) {
					case 2: // Basic with Workflow
					case 7: // Revisioning
					case 8: // Supplier and Workflow
						// Logic for showing and disabling the workflow transition option
						this.displayRevisionsDropdown = false;
						this.isWorkspaceWithWorkflow = true;
						let availableTransitionsListenerId = this.EventService.listen(`itemTransitions:${this.itemId}:done`, (event, data) => {
							this.isWorkflowTransitionAvailable = data.transitions.length ? true : false;
							this.EventService.unlisten(availableTransitionsListenerId);
						});
						this.ModelsManager.getTransitionsByLink(this.itemId, itemObj.getTransitionsLink());
						break;
					// This is a revision-controlled workspace, that displays the revisioning dropdown
					case 6: // Revision-controlled
						// Display the revision dropdown
						this.displayRevisionsDropdown = true;
						this.isWorkspaceWithWorkflow = false;

						let revisioningTranslationKeys = {
							// NEVER_IN_EFFECT: $scope.bundle.revision.neverInEffect, // Temporarily not being used
							OBSOLETE: this.bundle.revision.obsolete,
							PENDING: this.bundle.revision.pending,
							LATEST: this.bundle.revision.latest,
							SUPERSEDED: this.bundle.revision.superseded,
							UNRELEASED: this.bundle.revision.unreleased,
							WORKING: this.bundle.revision.working
						};

						let itemRevisionsListenerId = this.EventService.listen('itemRevisions:*:done', (event, revisionsObj) => {
							// This listener is not needed anymore
							this.EventService.unlisten(itemRevisionsListenerId);

                            let getEffectivityStatusText = (effectivity) => effectivity.status === 'PENDING' ? this.$rootScope.bundle.revision.pending : this.$rootScope.bundle.revision.neverInEffect;

                            let getEffectivityDateText = effectivity => {
                                let dateFilter = this.$filter('date');
                                let text = dateFilter(effectivity.startDate, this.dateFormat);

                                return text + (effectivity.endDate ? ' - ' + dateFilter(effectivity.endDate, this.dateFormat) : '');
                            };

                            let getEffectivityText = (effectivity) => {
                                if (!effectivity || (!effectivity.status && !effectivity.startDate)) {
                                    return null;
                                }

                                return (effectivity.status) ? getEffectivityStatusText(effectivity) : getEffectivityDateText(effectivity);
                            };

							// Builds the array containing info for the dropdown
							this.revisionDropdownArr = this._.map(revisionsObj.json.versions, (value, index) => {

								let itemLinkId = value.__self__.substr(value.__self__.indexOf('versions/') + 9);
								let obj = {
									id: itemLinkId,
									description: '',
									label: value.item.version,
									href: this.$state.href(this.$state.current.name, {
										tab: this.$location.search().tab,
										view: this.$location.search().view,
										mode: 'view',
										itemId: this.UrnParser.encode(value.item.urn)
									}),
                                    effectivity: value.effectivity ? getEffectivityText(value.effectivity) : null,
                                    lifecycle: ''
								};

								// The value in the dropdown (description)
								switch (value.status) {
									// If status is UNRELEASED or WORKING, print just the lifecycle value
									case 'UNRELEASED':
									case 'WORKING':
										obj.description += revisioningTranslationKeys[value.status];
                                        obj.lifecycle = revisioningTranslationKeys[value.status];
										// obj.description += value.lifecycle.title; // temporarily leaving this here because we're going to have changes later
										break;
									// Other statuses can only be SUPERSEDED or LATEST
									default:
										obj.lifecycle = value.lifecycle.title;
										obj.description += `${value.lifecycle.title} ${value.version} (${revisioningTranslationKeys[value.status]})`;
										break;
								}

								return obj;
							});

							// Finds and sets the current revision, comparing
							// each id on the dropdown with the current itemId
							this.selectedRevision = this._.find(this.revisionDropdownArr, (value, index) =>
								itemObj.getId().toString() === value.id);

                            this.itemCurrLifecycleName = this.selectedRevision ? this.selectedRevision.lifecycle : '';

						}, true);

						this.ModelsManager.getRevisions(this.workspaceId, this.itemId);
						break;
					case 1: // Basic
					case 3: // Supplier
					default:
						this.displayRevisionsDropdown = false;
						this.isWorkspaceWithWorkflow = false;
						break;
				}
			});

			this.updateInContextualCreateLinkState(itemObj);
		});

		// Listens for BookmarkedObj finishing its loading process
		this.bookmarkListenerId = this.EventService.listen('bookmarkedItems:load:done', (event, BookmarkedObj) => {
			// Sets the bookmark state
			this.isBookmarked = BookmarkedObj.isItemBookmarked(this.itemId);
		}, true);

		this.ModelsManager.getBookmarkedItems('bookmarkedItems:load:get');

		// Listens for changes in archival state; should only be triggered by
		// ModelsManager.getItem in `setArchiveDone` listener (below)
		this.updateArchiveListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, itemObj) => {
			// Sets the archival state
			this.isArchived = itemObj.getFullList().deleted;
		}, true);

		// Listens for ARCHIVING/UNARCHIVING events
		this.archiveListenerId = this.EventService.listen(`itemInstance:${this.itemId}:setArchiveDone`, (event) => {
			this.NotificationService.showNotifications();

			this.ModelsManager.resetModels();
			this.ModelsManager.getItem(this.itemId);
		});

		// Listens for Bookmark/Remove Bookmark events
		this.updateBookmarkListenerId = this.EventService.listen(`itemInstance:${this.itemId}:setBookmarkDone`, (event) => {
			this.NotificationService.showNotifications();

			// Forces reload of data to update the model
			this.ModelsManager.resetModels();
			this.ModelsManager.getBookmarkedItems('bookmarkedItems:load:get');
		});

		this.ModelsManager.getItem(this.itemId);
	}

	/*
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#updateInContextualCreateLinkState
	 * @methodOf Controllers.ItemViewerController
	 * @description set properties that will control the visibility and disable
	 * state of the in-contextual create link.
	 *
	 * @param {Models.Item} an instance of item model.
	 */
	updateInContextualCreateLinkState(itemObj) {
		let workspaceTypeId = parseInt(itemObj.workspaceObj.getTypeId());

		// Determine if item is a revision controlled item
		let isRevisionControlledWorkspace = workspaceTypeId === this.WorkspaceTypes.REVISION_CONTROLLED_WORKSPACE;

		// Determine if item has already been added to a change order
		this.isItemAdded = itemObj.getFullList().workflowReference || !itemObj.getFullList().workingVersion;

		if (!isRevisionControlledWorkspace) {
			return;
		}

		// Fetch all the revisioning workspaces that have a workspace
		// relationship with the current revision controlled item
		let linkedToWorkspacesListenerId = this.EventService.listen(`linkedToWorkspaces:${itemObj.workspaceObj.getId()}:done`, (event, linkedToWorkspacesObj) => {
			this.EventService.unlisten(linkedToWorkspacesListenerId);

			let linkedToRevisioningWorkspaces = linkedToWorkspacesObj.getRevisioningWorkspaces();

			let permissionPromises = _.map(linkedToRevisioningWorkspaces, workspace => {
				return new Promise((resolve, reject) => {
					let workspaceId = workspace.link.split('/').pop();
					let workspaceListenerId = this.EventService.listen(`workspaceInstance:${workspaceId}:done`, (event, workspaceObj) => {
						this.EventService.unlisten(workspaceListenerId);

						this.PermissionService.hasPermissions([
							this.PLMPermissions.VIEW_ITEMS,
							this.PLMPermissions.ADD_ITEMS,
							this.PLMPermissions.VIEW_WORKFLOW_ITEMS,
							this.PLMPermissions.EDIT_WORKFLOW_ITEMS,
							this.PLMPermissions.ADD_WORKFLOW_ITEMS
						], workspaceObj.getId())
							.then(hasPermission => {
								if (hasPermission) {
									resolve(workspaceObj);
								} else {
									resolve(false);
								}
							});
					});

					this.ModelsManager.getWorkspace(workspaceId);
				});
			});

			this.linkedToWorkspaces = Promise.all(permissionPromises).then(this._.filter);
			this.linkedToWorkspaces.then(workspaces => this.isCreatePermitted = this._.some(workspaces));
		});

		this.ModelsManager.getAffectedItemLinkedToWorkspaces(itemObj.workspaceObj.getId());
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#getTabLink
	 * @methodOf Controllers.ItemViewerController
	 * @description Returns the tab string that needs to be for the tab
	 *
	 * @param {String} tabActiveId The active property of the tab
	 * @param {String} tabLinkId The link property of the tab
	 * @param {String} tabID The id property of the tab
	 *
	 * @return {String} THe string of the tab parameter for the tab
	 */
	getTabLink(tabActiveId, tabLinkId, tabItemId, tabId) {
		return this.$state.href(tabLinkId, {
			tab: tabLinkId,
			view: this.$location.search().view,
			mode: 'view',
			itemId: tabItemId,
			relationshipKey: tabId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#goToTab
	 * @methodOf Controllers.ItemViewerController
	 * @description Navigates to the tab
	 *
	 * @param {String} tabActiveId The active property of the tab
	 * @param {String} tabLinkId The link property of the tab
	 */
	goToTab(tabActiveId, tabLinkId) {
		let tabString = 'workspace-item-details';

		this._.each(this.$state.get(), (val) => {
			if (val.name === `workspace-item-${tabActiveId}` && val.views) {
				tabString = `workspace-item-${tabActiveId}`;
			} else if (val.name === tabLinkId && val.views) {
				tabString = tabLinkId;
			}
		});

		this.$timeout(() => {
			this.$location.search({
				tab: tabString,
				view: this.$location.search().view,
				mode: 'view',
				itemId: this.$location.search().itemId
			});
		}, 300);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#getActiveTab
	 * @methodOf Controllers.ItemViewerController
	 * @description Get the 'active' name of the currently selected tab
	 *
	 * @param {String} tabActiveId Active state id of the tab
	 * @param {String} tabLinkId Name of the identifier of the tab
	 * @param {String} tabId Id of the tab
	 *
	 * @return {String} Active of the current tab
	 */
	getActiveTab(tabActiveId = null, tabLinkId = null, tabId = null) {
		if (tabActiveId !== null && tabLinkId !== null) {
			let tabString = '';

			this._.each(this.$state.get(), (val) => {
				if (val.name === `workspace-item-${tabActiveId}` && val.views) {
					tabString = `workspace-item-${tabActiveId}`;
				} else if (tabLinkId === 'named-relationships' && tabId !== null) {
					// NamedRelationships Tab uses tabID as the identifier,
					// which is same as the relationshipKey
					tabString = tabId;
				} else if (val.name === tabLinkId && val.views) {
					tabString = tabLinkId;
				}
			});

			return tabString;
		} else {
			if (this.$location.search().tab === 'named-relationships') {
				// namedRelationships Tab uses relationshipKey to ensure
				// each tab has a distinct identifier.
				return this.$location.search().relationshipKey;
			}

			return this.$location.search().tab;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#openPanel
	 * @methodOf Controllers.ItemViewerController
	 * @description Placeholder function to be binded
	 */
	openPanel() {}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#closePanel
	 * @methodOf Controllers.ItemViewerController
	 * @description Placeholder function to be binded
	 */
	closePanel() {}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#gotoItemsList
	 * @methodOf Controllers.ItemViewerController
	 * @description Navigates to items list, force a reload if already on the list.
	 */
	gotoItemsList() {
		if (this.$location.search().view === 'split') {
			this.closePanel();
			this.$location.search({});
		} else {
			this.$state.current.reloadOnSearch = true;
			this.$state.transitionTo(
				'workspace-items-list',
				{workspaceId: this.workspaceId},
				{location: true, reload: true, inherit: false}
			);

			this.$timeout(() => {
				this.$state.current.reloadOnSearch = false;
			}, 2000);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#showTransitions
	 * @methodOf Controllers.ItemViewerController
	 * @description Shows the workflow transition flyout
	 *
	 */
	showTransitions() {
		let flyoutInstance = this.FlyoutService.open({
			templateUrl: 'build/components/itemHeader/workflowTransition.html',
			scope: this.$scope,
			anchorEl: document.getElementById('itemviewer-menu-dropdown-button'),
			placement: 'center-center',
			flyoutClass: 'workflow-flyout',
			controller: 'WorkflowTransitionController',
			resolve: {
				AnchorElWidth: () => document.getElementById('itemviewer-menu-dropdown-button').clientWidth,
				ParentController: () => this,
				ItemObj: () => this.currentItemObj
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#proceedTransition
	 * @methodOf Controllers.ItemViewerController
	 * @description Proceed with the change of workflow action.
	 *
	 * @param {Object} result Object that contains workflow transition attributes
	 * (like comments or password for approval).
	 * @param {String} selectedTransitionId The ID of the transition to be made
	 *
	 * TODO add string literals used in this method to translations once finalized
	 */
	proceedTransition(result, selectedTransitionId) {
		let deferred = this.$q.defer();
		this.processingTransition = true;

		this.EventService.send(`itemInstance:${this.itemId}:performTransition`,
			[this.currentItemObj, result.transition, result.comments, result.selectedUserImpersonation]);

		let performTransitionListenerId = this.EventService.listen(`itemInstance:${this.itemId}:performTransitionDone`, (event, flag) => {
			this.EventService.unlisten(performTransitionListenerId);
			this.EventService.unlisten(performTransitionBadRequestListenerId);

			if (flag) {
				this.processingTransition = false;
				this.initPanel();

				this.NotificationService.addNotification(
					this.NotificationTypes.SUCCESS,
					`${this.$rootScope.bundle.transition.success}`
				);

				deferred.resolve();
			} else {
				this.processingTransition = false;

				this.NotificationService.addNotification(
					this.NotificationTypes.ERROR,
					`${this.$rootScope.bundle.transition.error}`
				);

				deferred.reject('');
			}

			this.EventService.send(`transitions:${selectedTransitionId}:done`, flag);
		});

		let performTransitionBadRequestListenerId = this.EventService.listen(`itemInstance:${this.itemId}:performTransitionBadRequest`, (event, errorDetails) => {
			this.EventService.unlisten(performTransitionListenerId);
			this.EventService.unlisten(performTransitionBadRequestListenerId);

			this.NotificationService.addNotification(
				this.NotificationTypes.ERROR,
				`${this.$rootScope.bundle.transition.error}: ${errorDetails.message}`
			);

			deferred.reject(errorDetails.message);
		});

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#triggerArchive
	 * @methodOf Controllers.ItemViewerController
	 * @description Controls archiving/unarchiving for this item
	 *
	 * @param {Boolean} flag The boolean val to set the archiving to
	 */
	triggerArchive(flag) {
		this.EventService.send(`itemInstance:${this.itemId}:setArchive`, this.currentItemObj, flag);

		if (flag) {
			this.NotificationService.addNotification(
				this.NotificationTypes.SUCCESS,
				`${this.currentItemObj.getItemTitle()}${this.$rootScope.bundle.notification.archive.success}`
			);
		} else {
			this.NotificationService.addNotification(
				this.NotificationTypes.SUCCESS,
				`${this.currentItemObj.getItemTitle()}${this.$rootScope.bundle.notification.unarchive.success}`
			);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#close
	 * @methodOf Controllers.ItemViewerController
	 * @description Close item viewer
	 *
	 */
	close() {
		this.isFullView ? this.$state.go('workspace-items-list', {workspaceId: this.workspaceId}) : this.closePanel().then(() => this.$state.go('^.^'));
	}

    /**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#changeViewMode
	 * @methodOf Controllers.ItemViewerController
	 * @description change view mode
     *
	 * @param {String} view mode ('full' or 'split') for the item viewer
	 */
    changeViewMode(mode = 'full') {
        this.$state.go(this.$state.current, {view: mode}, {
           location: true,
           inherit: true,
           notify: true,
           reload: false
        });
        this.isFullView = mode === 'full';
    }

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#triggerBookmark
	 * @methodOf Controllers.ItemViewerController
	 * @description Controls bookmark or removing the bookmark for this item
	 *
	 * @param {String} target The id of the md-button
	 * @param {Boolean} flag The boolean val to set the bookmark to
	 */
	triggerBookmark(target, flag) {
		this.EventService.send(`itemInstance:${this.itemId}:setBookmark`, this.currentItemObj, flag);

		if (flag) {
			this.NotificationService.addNotification(
				this.NotificationTypes.SUCCESS,
				`${this.currentItemObj.getItemTitle()}${this.$rootScope.bundle.notification.bookmark.success}`
			);
		} else {
			this.NotificationService.addNotification(
				this.NotificationTypes.SUCCESS,
				`${this.currentItemObj.getItemTitle()}${this.$rootScope.bundle.notification.removeBookmark.success}`
			);
		}

		// Remove focus from the clicked button
		angular.element(document.getElementById(target)).blur();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#triggerCreate
	 * @methodOf Controllers.ItemViewerController
	 * @description Trigger the create item dialog
	 */
	triggerCreate() {
		this.$mdDialog.show({
			controller: 'CreateItemDialogController',
			controllerAs: 'createItemDialogCtrl',
			templateUrl: 'build/components/createItem/createItemDialog.html',
			locals: {
				createType: this.CreateTypes.CONTEXTUAL
			},
			resolve: {
				CurrentItem: () => this.currentItemObj,
				CurrentWorkspace: () => this.currentItemObj.getWorkspaceObj(),
				// TODO Categorise the workspaces by sections
				// for create dropdown of workspaces
				WorkspaceSections: () => this.workspaceSections,
				AddWorkspaceList: () => this.linkedToWorkspaces
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#isViewState
	 * @methodOf Controllers.ItemViewerController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.$location.search().mode === 'view');
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemViewerController#isSeparatorNeeded
	 * @methodOf Controllers.ItemViewerController
	 * @description Add a separator class if needed on the itemviewer-item-header
	 * @param {arguments} list of elements before this DIV
	 * @return {Boolean} true if a separator class is needed
	 */
	isSeparatorNeeded() {
		let args = Array.prototype.slice.call(arguments);
		let isSeparatorNeeded = false;
		args.every((ngIfExpression) => {
			if ((this._.isBoolean(ngIfExpression) && ngIfExpression) ||
				(angular.isObject(ngIfExpression) && (ngIfExpression !== null))) {
					isSeparatorNeeded = true;
					return false;
			}
			return true;
		});

		return isSeparatorNeeded;
	}
}

export default ItemViewerController;
