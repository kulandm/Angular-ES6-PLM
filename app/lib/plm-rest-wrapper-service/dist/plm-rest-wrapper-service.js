System.registerModule("com/autodesk/RESTWrapperService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/RESTWrapperService.js";
  var PLM360ConfModule = System.get("com/autodesk/PLM360Conf.js").default;
  var UnderscoreServiceModule = System.get("com/autodesk/UnderscoreService.js").default;
  var TokenServiceModule = System.get("com/autodesk/TokenService.js").default;
  var EventServiceModule = System.get("com/autodesk/EventService.js").default;
  var LoadingDataServiceModule = System.get("com/autodesk/LoadingDataService.js").default;
  var AuthenticationServiceModule = System.get("com/autodesk/AuthenticationService.js").default;
  var RESTWrapperService = function() {
    function RESTWrapperService(Restangular, GlobalSettings, DSCacheFactory, $q, $log, $state, $timeout, $rootScope, LoadingDataService, TokenService, AuthenticationService, EventService, ADSKHttpInterceptor, $interval, _) {
      var that = this;
      this.Restangular = Restangular;
      this.GlobalSettings = GlobalSettings;
      this.DSCacheFactory = DSCacheFactory;
      this.$state = $state;
      this.$q = $q;
      this.$log = $log;
      this.$timeout = $timeout;
      this.$rootScope = $rootScope;
      this.LoadingDataService = LoadingDataService;
      this.TokenService = TokenService;
      this.AuthenticationService = AuthenticationService;
      this.EventService = EventService;
      this.ADSKHttpInterceptor = ADSKHttpInterceptor;
      this.$interval = $interval;
      this._ = _;
      this.reqs = {};
      this.requestCounter = 0;
      this.requestArray = [];
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        that.resetCache();
      });
      this.cache = DSCacheFactory('plm360Cache', {
        capacity: 1000,
        maxAge: 10800000,
        deleteOnExpire: 'aggressive',
        recycleFreq: 60000,
        cacheFlushInterval: 10800000
      });
    }
    return ($traceurRuntime.createClass)(RESTWrapperService, {
      resetCache: function() {
        this.reqs = {};
        this.cache.removeAll();
      },
      makeRequest: function() {
        var config = arguments[0] !== (void 0) ? arguments[0] : {};
        var that = this;
        var methodMap = {
          get: 'get',
          put: 'customPUT',
          post: 'customPOST',
          delete: 'customDELETE',
          patch: 'patch'
        };
        var type = config.type || 'get';
        var data = config.data || (config.data === '' ? config.data : {});
        var base = config.base || 'api/v3';
        var path = config.path || [];
        var params = config.params || {};
        var headers = config.headers || {};
        var options = config.options || {};
        var methodName = methodMap[type] || 'get';
        var deferred = this.$q.defer();
        var requestUri = base + this.parsePath(path);
        if (type !== 'get') {
          this.resetCache();
        }
        var cacheKey = [];
        this._.each(params, function(value, key) {
          cacheKey.push(key + '=' + value);
        });
        cacheKey = requestUri + '?' + cacheKey.join('&');
        if (type === 'get' && (!angular.isDefined(options.skipCache) || options.skipCache === false)) {
          if (angular.isDefined(this.reqs[cacheKey])) {
            var cacheDeferred = this.$q.defer();
            var waitForRet = function() {
              if (!angular.isDefined(that.cache.get(cacheKey))) {
                that.$timeout(function() {
                  waitForRet();
                }, 50);
                return;
              }
              if (that.cache.get(cacheKey).rejected) {
                cacheDeferred.reject(that.cache.get(cacheKey));
              } else {
                cacheDeferred.resolve(that.cache.get(cacheKey));
              }
            };
            waitForRet();
            return cacheDeferred.promise;
          } else {
            this.reqs[cacheKey] = 1;
          }
        }
        if (type === 'get' && options.ifModifiedSince) {
          var lastRequest = sessionStorage.getItem(cacheKey);
          if (lastRequest) {
            headers['If-Modified-Since'] = JSON.parse(lastRequest).date;
          }
        }
        this.handleRequestCount('increase', requestUri);
        var requestTimeoutCounter = this.$timeout(function() {
          that.LoadingDataService.stateChangeError();
        }, this.GlobalSettings.requestTimeout);
        this.ADSKHttpInterceptor.setHandlers(requestUri, function(rejection) {
          if ((rejection.status === 401) || (rejection.status === 503)) {
            that.TokenService.unset();
            that.AuthenticationService.requestRelogin();
          }
          if (rejection.status === 403 && !!!options.hideError) {
            if (rejection.data && !!rejection.data.fusionLifecycleTermsOfServiceAccepted) {
              that.EventService.send('forbiddenAccess:notAcceptedAgreement');
            } else {
              that.AuthenticationService.unsetReAuth();
              that.TokenService.get().then(function(token) {
                that.EventService.send('forbiddenAccess:permissionDenied', rejection.data);
              });
            }
          }
        }, function() {
          that.TokenService.get().then(function(token) {
            that.AuthenticationService.unsetReAuth();
          });
        });
        this.TokenService.get().then(function(token) {
          headers.Authorization = 'Bearer ' + token;
          var args = [data, params, headers];
          if (type === 'post' || type === 'put') {
            args.splice(1, 0, '');
          }
          if (type === 'get') {
            args = [params, headers];
          }
          that.Restangular.one(requestUri)[methodName].apply(that.Restangular, args).then(function(response) {
            var data = response.data;
            var status = response.status;
            that.cache.put(cacheKey, data);
            if (type === 'get' && options.ifModifiedSince) {
              if (status === 304) {
                return deferred.resolve(JSON.parse(sessionStorage.getItem(cacheKey)).response);
              } else {
                var sessionCachedRequest = {};
                sessionCachedRequest.date = new Date().toUTCString();
                sessionCachedRequest.response = data;
                sessionStorage.setItem(cacheKey, JSON.stringify(sessionCachedRequest));
              }
            }
            return deferred.resolve(data);
          }, function(error) {
            var configUrl = (angular.isDefined(error.config)) ? error.config.url : '';
            if (methodName !== 'get') {
              that.resetCache();
            } else {
              error.rejected = true;
              that.cache.put(cacheKey, error);
            }
            return deferred.reject(error);
          }).finally(function() {
            that.handleRequestCount('decrease', requestUri);
            try {
              that.$timeout.cancel(requestTimeoutCounter);
            } catch (e) {}
          });
        }, function() {
          that.TokenService.unset();
          that.AuthenticationService.requestRelogin();
        });
        return deferred.promise;
      },
      parsePath: function(path) {
        var that = this;
        var parsedPath = '';
        if (!this._.isArray(path)) {
          this.$log.error('Error! You have to pass the PATH to the endpoint as an array!');
        }
        this._.each(path, function(value, key) {
          if (that._.isObject(value)) {
            that._.each(value, function(id, resource) {
              parsedPath = parsedPath + '/' + resource + '/' + id;
            });
          } else {
            parsedPath = parsedPath + '/' + value;
          }
        });
        return parsedPath;
      },
      handleRequestCount: function(flag, key) {
        switch (flag) {
          case 'increase':
            this.requestCounter++;
            if (this._.indexOf(this.requestArray, key) === -1) {
              this.requestArray.push(key);
            }
            this.LoadingDataService.dataRequest({
              url: key,
              requests: this.requestCounter,
              requestsArr: this.requestArray
            });
            break;
          case 'decrease':
            this.requestCounter--;
            var keyPos = this._.indexOf(this.requestArray, key);
            if (keyPos !== -1) {
              this.requestArray.splice(keyPos, 1);
            }
            this.LoadingDataService.dataResponse({
              url: key,
              requests: this.requestCounter,
              requestsArr: this.requestArray
            });
            break;
          default:
            this.$log.error('You have to pass a valid flag to the handleRequestCount method!');
        }
      },
      get: function(base, resources, params, options, headers) {
        return this.makeRequest({
          type: 'get',
          base: base,
          path: resources,
          params: params,
          options: options,
          headers: headers
        });
      },
      put: function(data, base, path, params, header, options) {
        return this.makeRequest({
          type: 'put',
          data: data,
          base: base,
          path: path,
          params: params,
          headers: header,
          options: options
        });
      },
      post: function(data, base, path, params, header, options) {
        return this.makeRequest({
          type: 'post',
          data: data,
          base: base,
          path: path,
          params: params,
          headers: header,
          options: options
        });
      },
      delete: function(base, path, params, header, options) {
        return this.makeRequest({
          type: 'delete',
          data: '',
          base: base,
          path: path,
          params: params,
          headers: header,
          options: options
        });
      },
      patch: function(data, base, path, params, header, options) {
        return this.makeRequest({
          type: 'patch',
          data: data,
          base: base,
          path: path,
          params: params,
          headers: header,
          options: options
        });
      },
      allSettled: function() {
        var promises = arguments[0] !== (void 0) ? arguments[0] : [];
        var deferred = this.$q.defer();
        var counter = 0;
        var results = [];
        this._.each(promises, function(promise, $index) {
          counter++;
          promise.then(function(value) {
            results[$index] = {
              success: true,
              value: value
            };
            if (!(--counter)) {
              deferred.resolve(results);
            }
          }, function(reason) {
            results[$index] = {
              success: false,
              value: reason
            };
            if (!(--counter)) {
              deferred.resolve(results);
            }
          });
        });
        if (counter === 0) {
          deferred.resolve(results);
        }
        return deferred.promise;
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, [PLM360ConfModule.name, UnderscoreServiceModule.name, TokenServiceModule.name, EventServiceModule.name, LoadingDataServiceModule.name, AuthenticationServiceModule.name, 'angular-data.DSCacheFactory', 'restangular', 'ADSK.HttpInterceptorService', 'ui.router']).factory('RESTWrapperService', ['Restangular', 'GlobalSettings', 'DSCacheFactory', '$q', '$log', '$state', '$timeout', '$rootScope', 'LoadingDataService', 'TokenService', 'AuthenticationService', 'EventService', 'ADSK.HttpInterceptorService.service', '$interval', '_', function(Restangular, GlobalSettings, DSCacheFactory, $q, $log, $state, $timeout, $rootScope, LoadingDataService, TokenService, AuthenticationService, EventService, ADSKHttpInterceptor, $interval, _) {
    return new RESTWrapperService(Restangular, GlobalSettings, DSCacheFactory, $q, $log, $state, $timeout, $rootScope, LoadingDataService, TokenService, AuthenticationService, EventService, ADSKHttpInterceptor, $interval, _);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/RESTWrapperService.js
