import NavigationPanels from 'com/autodesk/components/plmNavigation/plmNavigationPanels.js';

/**
 * @ngdoc object
 * @name Controllers.PLMNavigationController
 *
 * @description This controller is attached to PLMNavigationDirective
 *
 * ##Dependencies
 *
 */

class PLMNavigationController {

	/*
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#constructor
	 * @methodOf Controllers.PLMNavigationController
	 * @description The class constructor
	 */
	constructor($scope, $rootScope, $state, $timeout, $q, $mdDialog, ModelsManager, AuthenticationService, EventService, $mdComponentRegistry, RESTWrapperService, App, _) {

		let root = new App();

		this.$scope = $scope;
		this.$scope.NavigationPanels = NavigationPanels;

		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$timeout = $timeout;
		this.ModelsManager = ModelsManager;
		this.AuthenticationService = AuthenticationService;
		this.EventService = EventService;
		this.$mdComponentRegistry = $mdComponentRegistry;
		this.RESTWrapperService = RESTWrapperService;
		this._ = _;
		this.$q = $q;
		this.$mdDialog = $mdDialog;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#workspaceId
		 * @propertyOf Controllers.PLMNavigationController
		 * @description The id of the current workspace
		 * (for the create item dialog)
		 */
		this.workspaceId = undefined;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#currentPanel
		 * @propertyOf Controllers.PLMNavigationController
		 * @description The currently selected panel
		 */
		this.currentPanel = NavigationPanels.DEFAULT;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#currentCategory
		 * @propertyOf Controllers.PLMNavigationController
		 * @description The id of the current open category
		 */
		this.currentCategory = undefined;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#togglePanel
		 * @methodOf Controllers.PLMNavigationController
		 * @description Toggles expansion/collapsing of the panel
		 * (will be bound to the sidenav native method)
		 */
		this.togglePanel = angular.noop;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#categoryList
		 * @methodOf Controllers.PLMNavigationController
		 * @description The list of workspace categories
		 */
		this.categoryList = {};

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#helpLinks
		 * @methodOf Controllers.PLMNavigationController
		 * @description Links for various help options
		 */
		this.helpLinks = {};

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#currentUser
		 * @methodOf Controllers.PLMNavigationController
		 * @description The current logged user
		 */
		this.currentUser = null;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#interfaceStyleMandated
		 * @methodOf Controllers.PLMNavigationController
		 * @description A flag that tells whether the user has an interface style mandated.
		 */
		this.interfaceStyleMandated = true;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#isUserAllowedToAdmin
		 * @propertyOf Controllers.PLMNavigationController
		 * @description Truthy if the user is allowed to navigate to administration section
		 */
		this.isUserAllowedToAdmin = false;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#isUserAllowedToImport
		 * @propertyOf Controllers.PLMNavigationController
		 * @description Truthy if the user is allowed to run imports
		 */
		this.isUserAllowedToImport = false;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#dataTabTitle
		 * @propertyOf Controllers.PLMNavigationController
		 * @description tooptip message for datatab
		 */
		this.dataTabTitle = $rootScope.bundle.wip.attachments.unavailable;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#dataTabUri
		 * @propertyOf Controllers.PLMNavigationController
		 * @description uri to datatab
		 */
		this.dataTabUri = '';

		// Rebind our controller methods to the component's methods
		this.$mdComponentRegistry.when('sidenav-content').then((sideNav) => {
			this.isOpen = angular.bind(sideNav, sideNav.isOpen);
			this.togglePanel = angular.bind(sideNav, sideNav.toggle);
		});

		// Watches for whenever the panel is closed, and restore the panel to default
		this.$scope.$watch(() => {
			return this.isOpen();
		}, (isOpen) => {
			if (!isOpen) {
				this.goToDefaultPanel();
			}
		});

		/**
		 * @ngdoc property
		 * @name Controllers.PLMNavigationController#isLogged
		 * @propertyOf Controllers.PLMNavigationController
		 * @description Flag for whether user is currently logged
		 */
		this.$scope.isLogged = AuthenticationService.isLogged();

		// Retrieves list of workspaces
		this.retrieveData(this.$scope);

		// Retrieves the links for the help menu
		this.retrieveHelpLinks();

		// TODO : revisit this approach once enable featured directive is available
		// Check if permission exists for the plmJitterBit integration
		this.RESTWrapperService.get(root.enabledFeatures.link).then((response) => {
			this.$scope.enabledPLMJitterBitIntegration = _.find(response, item => item.title === 'webhooks.publishevent') ? true : false;

			let isDataTabAvailable = this._.uniq(this._.filter(response, permission => {
				return permission.title === 'wip.datatab' || permission.title === 'customerEnvironment.A360';
			})).length === 2;

			if (isDataTabAvailable) {
				// Getting datatab uri from hubs endpoint
				this.RESTWrapperService.get(root.hubs.link).then(hub => {
					this.dataTabUri = root.getDataTabUri(hub) || '';
					this.dataTabTitle = this.dataTabUri ? $rootScope.bundle.mainMenu.dataTab : $rootScope.bundle.wip.attachments.unavailable;
				});
			}
		});

		let userListener = this.EventService.listen('currentUser:currentUser:done', (event, obj) => {
			this.EventService.unlisten(userListener);
			if (obj && obj.json) {
				this.currentUser = obj;
				this.interfaceStyleMandated = this.currentUser.json.interfaceStyleMandated;
				// Checks whether the use is allowed to admin and updates the flag related to that state
				this.checkIfUserIsAllowedAdmin();
			}
		});

		this.ModelsManager.getCurrentUser();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#retrieveData
	 * @propertyOf Controllers.PLMNavigationController
	 * @description Retrieve the category list
	 *
	 * @param {Object} scope Scope of current page
	 */
	retrieveData(scope) {
		this.EventService.listen('workspaces:navigation:done', (event, obj) => {
			// Retrieves all the categories from the endpoint
			this.categoryList = obj.getCategoryList();
		});
		this.ModelsManager.getWorkspaces('workspaces:navigation:get');
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#retrieveHelpLinks
	 * @propertyOf Controllers.PLMNavigationController
	 * @description Retrieve the links for the help menu
	 */
	retrieveHelpLinks() {
		this.EventService.listen('configurations:tenant:done', (event, configurations) => {
			// Retrieves all the configurations from the endpoint
			this.helpLinks.helpLink = configurations.getConfig('helpLocation').title;
			this.helpLinks.adminEmail = configurations.getConfig('supportEmail').title;
		});
		this.ModelsManager.getConfigurations();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#getHelpLink
	 * @methodOf Controllers.PLMNavigationController
	 * @description Returns the link to the help system
	 */
	getHelpLink() {
		return this.helpLinks.helpLink;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#getAdminEmail
	 * @methodOf Controllers.PLMNavigationController
	 * @description Returns the email address of the admin
	 */
	getAdminEmail() {
		return this.helpLinks.adminEmail;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#isOpen
	 * @methodOf Controllers.PLMNavigationController
	 * @description Returns the current state of the panel (will be bound to the sideNav's native method)
	 */
	isOpen() {
		return false;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#goToDefaultPanel
	 * @methodOf Controllers.PLMNavigationController
	 * @description Updates the current panel to be the default panel, closing any categories
	 */
	goToDefaultPanel() {
		this.currentPanel = NavigationPanels.DEFAULT;
		this.currentCategory = undefined;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#goBack
	 * @methodOf Controllers.PLMNavigationController
	 * @description Currently just returns to the default panel
	 */
	goBack() {
		this.goToDefaultPanel();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#goToInnerPanel
	 * @methodOf Controllers.PLMNavigationController
	 * @description Opens the navigation menu if it is not yet open, and selects the correct panel
	 *
	 * @param {NavigationPanels} panel The panel to go to
	 */
	goToInnerPanel(panel) {
		this.currentPanel = panel;

		if (!this.isOpen()) {
			this.togglePanel();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#closeMenu
	 * @methodOf Controllers.PLMNavigationController
	 * @description if the menu is open. closes it and returns to the default panel
	 */
	closeMenu() {
		if (this.isOpen()) {
			this.togglePanel();
			this.goToDefaultPanel();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#isAtPanel
	 * @methodOf Controllers.PLMNavigationController
	 * @description Determines if the provided panel is the current panel
	 * @param {NavigationPanels} panel The panel to check
	 *
	 * @returns {Boolean} True if the current panel is the provided panel
	 */
	isAtPanel(panel) {
		return this.currentPanel === panel;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#toggleCategory
	 * @methodOf Controllers.PLMNavigationController
	 * @description Opens the category
	 *
	 * @param {Integer} categoryId 		The id of the category (in PLM)
	 */
	toggleCategory(categoryId) {
		// Closes the currently open category is user is clicking on it again
		if (this.isCategoryOpen(categoryId)) {
			this.currentCategory = undefined;
		} else {
			this.currentCategory = categoryId;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#isCategoryOpen
	 * @methodOf Controllers.PLMNavigationController
	 * @description Checks which level the menu is currently at
	 *
	 * @param {Integer} categoryId The id of the category
	 *
	 * @returns {Boolean} True/false if corresponds to the current category
	 */
	isCategoryOpen(categoryId) {
		return categoryId === this.currentCategory;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#goToWorkspace
	 * @methodOf Controllers.PLMNavigationController
	 * @description Navigate to state, forcing reload
	 *
	 * @param {Integer} workspaceId The id of the workspace
	 */
	goToWorkspace(workspaceId) {
		this.$state.current.reloadOnSearch = true;
		this.$state.go('workspace-items-list', {workspaceId: workspaceId}, {reload: true, location: true, notify: true, inherit: false});
		this.$timeout(() => {
			this.$state.current.reloadOnSearch = false;
		}, 2000);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#openVignettesModal
	 * @methodOf Controllers.PLMNavigationController
	 * @description Closes the main menu and opens up the modal containing the
	 * vignettes.
	 */
	openVignettesModal() {
		this.closeMenu();
		this.$mdDialog.show({
			templateUrl: 'build/components/plmNavigation/vignettesModal.html',
			controller: 'VignettesModalController',
			controllerAs: 'vignetteseCtrl'
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.PLMNavigationController#checkIfUserIsAllowedAdmin
	 * @methodOf Controllers.PLMNavigationController
	 * @description Retrieves user data and evaluates whether can navigate to Administration or not
	 *
	 */
	checkIfUserIsAllowedAdmin() {

		let that = this;
		let promises = [];
		let profileDeferred = this.$q.defer();
		let permissionsDeferred = this.$q.defer();

		// Conditions
		let hasAdminUsersPermission = false;
		let hasImportsPermission = false;
		let hasProfessionalLicense = false;

		// USER
		let userId = this.currentUser.json.id;
		let isActive = this.currentUser.json.active && this.currentUser.json.active === 'Y';

		// PROFILE
		let profileListener = this.EventService.listen('userProfile:userProfile:done', (event, obj) => {
			that.EventService.unlisten(profileListener);
			hasProfessionalLicense = obj && obj.licenseType && obj.licenseType === 'PROFESSIONAL';
			profileDeferred.resolve();
		});

		// PERMISSIONS
		if (userId) {
			let permissionsListener = this.EventService.listen(`userTenantPermissions:${userId}:get`, (event, obj) => {
				that.EventService.unlisten(permissionsListener);
				if (obj && obj.permissions) {
					angular.forEach(obj.permissions, function (permission) {
						if (permission.title === 'Administer Users') {
							hasAdminUsersPermission = true;
						}
						if (permission.title === 'Run Imports') {
							hasImportsPermission = true;
						}
					});
				}
				permissionsDeferred.resolve();
			});
		}

		this.ModelsManager.getUserTenantPermissions(userId);
		this.ModelsManager.getUserProfile();

		promises.push(profileDeferred.promise);
		promises.push(permissionsDeferred.promise);

		this.$q.all(promises).then(() => {
			that.isUserAllowedToAdmin = isActive && hasAdminUsersPermission && hasProfessionalLicense;
			that.isUserAllowedToImport = isActive && hasImportsPermission;
		});
	}

}

export default PLMNavigationController;
