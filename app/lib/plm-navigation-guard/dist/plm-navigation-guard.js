System.registerModule("com/autodesk/navGuard/navGuard.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/navGuard/navGuard.directive.js";
  function NavGuardDirective(PLMNavigationGuard, $parse) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var defaultAction = $parse(attrs.defaultAction);
        scope.handleEvent = function(event) {
          event.stopPropagation();
          if (PLMNavigationGuard.shouldPrevent()) {
            PLMNavigationGuard.getUsersConsent().then(function(response) {
              if (response === 'YES') {
                PLMNavigationGuard.deactivate();
                defaultAction(scope);
              }
            });
          } else {
            PLMNavigationGuard.deactivate();
            defaultAction(scope);
          }
        };
      }
    };
  }
  var $__default = NavGuardDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/navGuard/navGuard.directive.js
;

System.registerModule("com/autodesk/navGuard/navGuard.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/navGuard/navGuard.js";
  var NavGuardModalController = System.get("com/autodesk/navGuard/navGuardModal.controller.js").default;
  var NavGuardDirective = System.get("com/autodesk/navGuard/navGuard.directive.js").default;
  var PLMNavigationGuard = System.get("com/autodesk/navGuard/plmNavigationGuard.service.js").default;
  angular.module(__moduleName, []).controller('NavGuardModalController', ['$scope', '$mdDialog', '$rootScope', 'LocalizationService', NavGuardModalController]).directive('navGuard', ['PLMNavigationGuard', '$parse', NavGuardDirective]).service('PLMNavigationGuard', ['$rootScope', '$window', '$state', '$mdDialog', '$location', 'LocalizationService', 'events', PLMNavigationGuard]).constant('events', {
    activate: 'activateNavigationGuard',
    stateChange: '$stateChangeStart',
    locationChange: '$locationChangeStart',
    beforeunload: 'beforeunload',
    destroy: '$destroy'
  });
  return {};
});
//# sourceURL=com/autodesk/navGuard/navGuard.js
;

System.registerModule("com/autodesk/navGuard/navGuardModal.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/navGuard/navGuardModal.controller.js";
  var NavGuardModalController = function() {
    function NavGuardModalController($scope, $mdDialog, $rootScope, LocalizationService) {
      var $__2 = this;
      this.$scope = $scope;
      this.$mdDialog = $mdDialog;
      this.bundle = null;
      LocalizationService.init().then(function() {
        $__2.bundle = $rootScope.bundle;
      });
    }
    return ($traceurRuntime.createClass)(NavGuardModalController, {confirmExit: function(userResponse) {
        this.$mdDialog.hide(userResponse);
      }}, {});
  }();
  var $__default = NavGuardModalController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/navGuard/navGuardModal.controller.js
;

System.registerModule("com/autodesk/navGuard/plmNavigationGuard.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/navGuard/plmNavigationGuard.service.js";
  var PLMNavigationGuard = function() {
    function PLMNavigationGuard($rootScope, $window, $state, $mdDialog, $location, LocalizationService, events) {
      var $__2 = this;
      this.$rootScope = $rootScope;
      this.$window = $window;
      this.$state = $state;
      this.$mdDialog = $mdDialog;
      this.$location = $location;
      this.events = events;
      this.bundle = null;
      LocalizationService.init().then(function() {
        $__2.bundle = $rootScope.bundle;
      });
      this.stateDeregistrator = null;
      this.locationDeregistrator = null;
      this.actingContext = null;
      this.activateDeregistrator = this.$rootScope.$on(this.events.activate, function(event, context) {
        event.stopPropagation();
        $__2.deactivate();
        event.targetScope.$on($__2.events.destroy, function() {
          $__2.deactivate();
        });
        if ($__2.isValidContext(context)) {
          $__2.actingContext = context;
          $__2.attachGuardsToNavigationEvents();
        }
      });
    }
    return ($traceurRuntime.createClass)(PLMNavigationGuard, {
      isValidContext: function(context) {
        var isValid = false;
        if (context && context.isDirty) {
          if (typeof context.isDirty === 'function') {
            isValid = true;
          }
        }
        return isValid;
      },
      activate: function(context) {
        var $__2 = this;
        var activationEvent = this.$rootScope.$emit(this.events.activate, context);
        var navGuardDeregistrator = function() {
          $__2.deactivate();
        };
        return navGuardDeregistrator;
      },
      deactivate: function() {
        this.actingContext = null;
        this.$window.removeEventListener(this.events.beforeunload, this.beforeUnloadHandler);
        if (this.stateDeregistrator) {
          this.stateDeregistrator();
        }
        if (this.locationDeregistrator) {
          this.locationDeregistrator();
        }
      },
      shouldPrevent: function() {
        return this.isValidContext(this.actingContext) && this.actingContext.isDirty();
      },
      getUsersConsent: function() {
        return this.$mdDialog.show({
          templateUrl: 'navGuard/navGuardModal.html',
          clickOutsideToClose: false,
          controller: 'NavGuardModalController',
          controllerAs: 'navGuardCtrl'
        });
      },
      attachGuardsToNavigationEvents: function() {
        var $__2 = this;
        this.locationDeregistrator = this.$rootScope.$on(this.events.locationChange, function(event, newUrl, oldUrl, newState, oldState) {
          if ($__2.shouldPrevent()) {
            event.preventDefault();
            $__2.handleLocationChangeEvent.call($__2, event, newUrl, oldUrl);
          }
        });
        this.stateDeregistrator = this.$rootScope.$on(this.events.stateChange, function(event, toState, toParams, fromState, fromParams, options) {
          if ($__2.shouldPrevent()) {
            event.preventDefault();
            $__2.handleStateChangeEvent.call($__2, event, toState, toParams, fromState, fromParams, options);
          }
        });
        this.$window.addEventListener(this.events.beforeunload, this.beforeUnloadHandler.bind(this));
      },
      handleLocationChangeEvent: function(event, newUrl, oldUrl) {
        var $__2 = this;
        var targetPath = this.$location.path();
        var targetSearch = this.$location.search();
        var targetHash = this.$location.hash();
        this.getUsersConsent().then(function(userResponse) {
          if (userResponse === 'YES') {
            $__2.deactivate();
            $__2.$location.path(targetPath).search(targetSearch).hash(targetHash);
          }
        });
      },
      handleStateChangeEvent: function(event, toState, toParams, fromState, fromParams, options) {
        var $__2 = this;
        this.getUsersConsent().then(function(userResponse) {
          if (userResponse === 'YES') {
            $__2.deactivate();
            $__2.$state.go(toState, toParams);
          }
        });
      },
      beforeUnloadHandler: function(event) {
        if (this.shouldPrevent()) {
          var message = this.bundle.confirmExit.message;
          event.returnValue = message;
          return message;
        }
      }
    }, {});
  }();
  var $__default = PLMNavigationGuard;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/navGuard/plmNavigationGuard.service.js
;

System.get("com/autodesk/navGuard/navGuard.js");angular.module("com/autodesk/navGuard/navGuard.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('navGuard/navGuardModal.html',
    "<md-dialog aria-label=\"nav-guard\" class=\"nav-guard-dialog\"><md-toolbar><div class=\"md-toolbar-tools\"><h2 class=\"nav-guard-header\">{{navGuardCtrl.bundle.confirmExit.modal.header}}</h2><span flex></span> <a href=\"#\" ng-click=\"navGuardCtrl.confirmExit('NO')\"><i class=\"zmdi zmdi-close\"></i></a></div></md-toolbar><md-divider></md-divider><md-dialog-content><div class=\"nav-guard-content\"><div>{{navGuardCtrl.bundle.confirmExit.message}}</div></div></md-dialog-content><md-dialog-actions layout=\"row\" layout-align=\"end center\"><md-button class=\"md-secondary\" aria-label=\"{{$root.bundle.button.cancel}}\" ng-click=\"navGuardCtrl.confirmExit('YES')\">{{navGuardCtrl.bundle.confirmExit.modal.leave}}</md-button><md-button class=\"md-primary\" aria-label=\"{{$root.bundle.button.confirm}}\" ng-click=\"navGuardCtrl.confirmExit('NO')\">{{navGuardCtrl.bundle.confirmExit.modal.stay}}</md-button></md-dialog-actions></md-dialog>"
  );
}]);