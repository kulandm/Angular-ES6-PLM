System.registerModule("com/autodesk/AuthenticationService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/AuthenticationService.js";
  var underscoreModule = System.get("com/autodesk/UnderscoreService.js").default;
  var prevLocationKey = 'PLMPrevLocation';
  var reAuthKey = 'PLMReAuth';
  var AuthenticationService = function() {
    function AuthenticationService(EventService, $rootScope, $location, $injector, $window, $timeout, _) {
      var $__3 = this;
      this.EventService = EventService;
      this.$rootScope = $rootScope;
      this.$location = $location;
      this.$injector = $injector;
      this.$window = $window;
      this.$timeout = $timeout;
      this._ = _;
      this.isLoggedin = false;
      this.loginListenerId = this.EventService.listen("loginStatus:done", function(event, tokenObj) {
        $__3.isLoggedin = !!(tokenObj);
      });
      $rootScope.$on('$destroy', function() {
        $__3.EventService.unlisten($__3.loginListenerId);
      });
    }
    return ($traceurRuntime.createClass)(AuthenticationService, {
      isLogged: function() {
        this.EventService.send("loginStatus:check");
        return this.isLoggedin;
      },
      setReAuth: function() {
        sessionStorage.setItem(reAuthKey, 1);
      },
      unsetReAuth: function() {
        sessionStorage.removeItem(reAuthKey);
      },
      setPrev: function() {
        if (this.$location.path() === '/login' || this.$location.path() === '/redirect') {} else {
          sessionStorage.setItem(prevLocationKey, this.$location.path());
        }
      },
      requestRelogin: function() {
        this.setPrev();
        this.setReAuth();
        this.$rootScope.$broadcast('__logging');
        this.$location.path('/redirect');
      },
      doRequestLogin: function() {
        if (sessionStorage.getItem(reAuthKey)) {
          this.unsetReAuth();
          this.$window.location.reload();
        } else {
          this.$location.path(sessionStorage.getItem(prevLocationKey) || '/');
        }
      },
      requestLogout: function() {
        this.EventService.send("unsetToken:done");
        this.unsetReAuth();
        sessionStorage.removeItem(prevLocationKey);
        this.$rootScope.$broadcast('__logging');
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, [underscoreModule.name]).factory('AuthenticationService', ['EventService', '$rootScope', '$location', '$injector', '$window', '$timeout', '_', function(EventService, $rootScope, $location, $injector, $window, $timeout, _) {
    return new AuthenticationService(EventService, $rootScope, $location, $injector, $window, $timeout, _);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/AuthenticationService.js
