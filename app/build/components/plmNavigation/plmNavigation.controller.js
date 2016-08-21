System.registerModule("com/autodesk/components/plmNavigation/plmNavigation.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/plmNavigation/plmNavigation.controller.js";
  var NavigationPanels = System.get("com/autodesk/components/plmNavigation/plmNavigationPanels.js").default;
  var PLMNavigationController = function() {
    function PLMNavigationController($scope, $rootScope, $state, $timeout, $q, $mdDialog, ModelsManager, AuthenticationService, EventService, $mdComponentRegistry, RESTWrapperService, App, _) {
      var $__3 = this;
      var root = new App();
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
      this.workspaceId = undefined;
      this.currentPanel = NavigationPanels.DEFAULT;
      this.currentCategory = undefined;
      this.togglePanel = angular.noop;
      this.categoryList = {};
      this.helpLinks = {};
      this.currentUser = null;
      this.interfaceStyleMandated = true;
      this.isUserAllowedToAdmin = false;
      this.isUserAllowedToImport = false;
      this.dataTabTitle = $rootScope.bundle.wip.attachments.unavailable;
      this.dataTabUri = '';
      this.$mdComponentRegistry.when('sidenav-content').then(function(sideNav) {
        $__3.isOpen = angular.bind(sideNav, sideNav.isOpen);
        $__3.togglePanel = angular.bind(sideNav, sideNav.toggle);
      });
      this.$scope.$watch(function() {
        return $__3.isOpen();
      }, function(isOpen) {
        if (!isOpen) {
          $__3.goToDefaultPanel();
        }
      });
      this.$scope.isLogged = AuthenticationService.isLogged();
      this.retrieveData(this.$scope);
      this.retrieveHelpLinks();
      this.RESTWrapperService.get(root.enabledFeatures.link).then(function(response) {
        $__3.$scope.enabledPLMJitterBitIntegration = _.find(response, function(item) {
          return item.title === 'webhooks.publishevent';
        }) ? true : false;
        var isDataTabAvailable = $__3._.uniq($__3._.filter(response, function(permission) {
          return permission.title === 'wip.datatab' || permission.title === 'customerEnvironment.A360';
        })).length === 2;
        if (isDataTabAvailable) {
          $__3.RESTWrapperService.get(root.hubs.link).then(function(hub) {
            $__3.dataTabUri = root.getDataTabUri(hub) || '';
            $__3.dataTabTitle = $__3.dataTabUri ? $rootScope.bundle.mainMenu.dataTab : $rootScope.bundle.wip.attachments.unavailable;
          });
        }
      });
      var userListener = this.EventService.listen('currentUser:currentUser:done', function(event, obj) {
        $__3.EventService.unlisten(userListener);
        if (obj && obj.json) {
          $__3.currentUser = obj;
          $__3.interfaceStyleMandated = $__3.currentUser.json.interfaceStyleMandated;
          $__3.checkIfUserIsAllowedAdmin();
        }
      });
      this.ModelsManager.getCurrentUser();
    }
    return ($traceurRuntime.createClass)(PLMNavigationController, {
      retrieveData: function(scope) {
        var $__3 = this;
        this.EventService.listen('workspaces:navigation:done', function(event, obj) {
          $__3.categoryList = obj.getCategoryList();
        });
        this.ModelsManager.getWorkspaces('workspaces:navigation:get');
      },
      retrieveHelpLinks: function() {
        var $__3 = this;
        this.EventService.listen('configurations:tenant:done', function(event, configurations) {
          $__3.helpLinks.helpLink = configurations.getConfig('helpLocation').title;
          $__3.helpLinks.adminEmail = configurations.getConfig('supportEmail').title;
        });
        this.ModelsManager.getConfigurations();
      },
      getHelpLink: function() {
        return this.helpLinks.helpLink;
      },
      getAdminEmail: function() {
        return this.helpLinks.adminEmail;
      },
      isOpen: function() {
        return false;
      },
      goToDefaultPanel: function() {
        this.currentPanel = NavigationPanels.DEFAULT;
        this.currentCategory = undefined;
      },
      goBack: function() {
        this.goToDefaultPanel();
      },
      goToInnerPanel: function(panel) {
        this.currentPanel = panel;
        if (!this.isOpen()) {
          this.togglePanel();
        }
      },
      closeMenu: function() {
        if (this.isOpen()) {
          this.togglePanel();
          this.goToDefaultPanel();
        }
      },
      isAtPanel: function(panel) {
        return this.currentPanel === panel;
      },
      toggleCategory: function(categoryId) {
        if (this.isCategoryOpen(categoryId)) {
          this.currentCategory = undefined;
        } else {
          this.currentCategory = categoryId;
        }
      },
      isCategoryOpen: function(categoryId) {
        return categoryId === this.currentCategory;
      },
      goToWorkspace: function(workspaceId) {
        var $__3 = this;
        this.$state.current.reloadOnSearch = true;
        this.$state.go('workspace-items-list', {workspaceId: workspaceId}, {
          reload: true,
          location: true,
          notify: true,
          inherit: false
        });
        this.$timeout(function() {
          $__3.$state.current.reloadOnSearch = false;
        }, 2000);
      },
      openVignettesModal: function() {
        this.closeMenu();
        this.$mdDialog.show({
          templateUrl: 'build/components/plmNavigation/vignettesModal.html',
          controller: 'VignettesModalController',
          controllerAs: 'vignetteseCtrl'
        });
      },
      checkIfUserIsAllowedAdmin: function() {
        var that = this;
        var promises = [];
        var profileDeferred = this.$q.defer();
        var permissionsDeferred = this.$q.defer();
        var hasAdminUsersPermission = false;
        var hasImportsPermission = false;
        var hasProfessionalLicense = false;
        var userId = this.currentUser.json.id;
        var isActive = this.currentUser.json.active && this.currentUser.json.active === 'Y';
        var profileListener = this.EventService.listen('userProfile:userProfile:done', function(event, obj) {
          that.EventService.unlisten(profileListener);
          hasProfessionalLicense = obj && obj.licenseType && obj.licenseType === 'PROFESSIONAL';
          profileDeferred.resolve();
        });
        if (userId) {
          var permissionsListener = this.EventService.listen(("userTenantPermissions:" + userId + ":get"), function(event, obj) {
            that.EventService.unlisten(permissionsListener);
            if (obj && obj.permissions) {
              angular.forEach(obj.permissions, function(permission) {
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
        this.$q.all(promises).then(function() {
          that.isUserAllowedToAdmin = isActive && hasAdminUsersPermission && hasProfessionalLicense;
          that.isUserAllowedToImport = isActive && hasImportsPermission;
        });
      }
    }, {});
  }();
  var $__default = PLMNavigationController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/plmNavigation/plmNavigation.controller.js
