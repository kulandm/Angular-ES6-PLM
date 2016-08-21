System.registerModule("com/autodesk/TokenService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/TokenService.js";
  var tokenStorageKey = 'O2AuthToken';
  var _cache;
  var TokenService = function() {
    function TokenService($rootScope, $q, $http, EventService) {
      var $__2 = this;
      this.$q = $q;
      this.$http = $http;
      this.EventService = EventService;
      this.tokenUrl = '/api/rest/v1/token';
      this.tokenListenerId;
      this.loginListenerId;
      this.tokenListenerId = this.EventService.listen("unsetToken:done", function(event) {
        $__2.EventService.unlisten($__2.tokenListenerId);
        $__2.unset();
      });
      this.loginListenerId = this.EventService.listen("loginStatus:check", function(event) {
        EventService.send("loginStatus:done", localStorage.getItem(tokenStorageKey));
      });
      $rootScope.$on('$destroy', function() {
        $__2.EventService.unlisten($__2.loginListenerId);
      });
    }
    return ($traceurRuntime.createClass)(TokenService, {
      get: function(config) {
        var $__2 = this;
        var tokenStorageValue = this.getStoredToken();
        var lastToken;
        if (tokenStorageValue && tokenStorageValue.indexOf('token_type') > -1) {
          lastToken = JSON.parse(tokenStorageValue);
        } else {
          lastToken = '';
        }
        var tokenOnly = (config && config.hasOwnProperty('tokenOnly') && typeof config.tokenOnly !== 'undefined' ? config.tokenOnly : true);
        var forceNew = (config && config.hasOwnProperty('forceNew') && typeof config.forceNew !== 'undefined' ? config.forceNew : false);
        if (lastToken && (new Date()).getTime() < (lastToken.valid_till) && !forceNew) {
          return tokenOnly ? this.$q.when(lastToken.access_token) : this.$q.when(lastToken);
        }
        var deferred = this.$q.defer();
        return _cache || (_cache = this.$http.get(this.tokenUrl)).then(function(ret) {
          ret.data.valid_till = new Date().getTime() + (ret.data.expires_in * 1000);
          $__2.set(JSON.stringify(ret.data));
          return tokenOnly ? deferred.resolve(ret.data.access_token) : deferred.resolve(ret.data);
        }, function(error) {
          deferred.reject(error);
        }).finally(function() {
          _cache = null;
        });
      },
      getStoredToken: function() {
        return localStorage.getItem(tokenStorageKey);
      },
      set: function(tok) {
        localStorage.setItem(tokenStorageKey, tok);
      },
      unset: function() {
        localStorage.removeItem(tokenStorageKey);
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('TokenService', ['$rootScope', '$q', '$http', 'EventService', function($rootScope, $q, $http, EventService) {
    return new TokenService($rootScope, $q, $http, EventService);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/TokenService.js
