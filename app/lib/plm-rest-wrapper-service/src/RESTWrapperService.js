import PLM360ConfModule from 'com/autodesk/PLM360Conf.js';
import UnderscoreServiceModule from 'com/autodesk/UnderscoreService.js';
import TokenServiceModule from 'com/autodesk/TokenService.js';
import EventServiceModule from 'com/autodesk/EventService.js';
import LoadingDataServiceModule from 'com/autodesk/LoadingDataService.js';
import AuthenticationServiceModule from 'com/autodesk/AuthenticationService.js';

/**
 * @ngdoc object
 * @name Miscellaneous.RESTWrapperService
 *
 * @description Screens all requests made to REST endpoints for PLM360 - all services should use this wrapper service
 * to handle communication with the backend
 * Refer to http://vantage.autodesk.com/wiki/index.php/AngularJS_App_Development#Services for full documentation
 *
 * ##Dependencies
 *
 */
class RESTWrapperService {

	/*
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#constructor
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description The class constructor
	 */
	constructor(Restangular, GlobalSettings, DSCacheFactory, $q, $log, $state, $timeout, $rootScope, LoadingDataService, TokenService, AuthenticationService, EventService, ADSKHttpInterceptor, $interval, _) {
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

		/**
		 * @ngdoc property
		 * @name Miscellaneous.RESTWrapperService#reqs
		 * @propertyOf Miscellaneous.RESTWrapperService
		 * @description `private` Holds the current requests, needed to avoid concurrent duplicates
		 */
		this.reqs = {};

		/**
		 * @ngdoc property
		 * @name Miscellaneous.RESTWrapperService#requestCounter
		 * @propertyOf Miscellaneous.RESTWrapperService
		 * @description `private` Counts the number of requests made
		 *
		 */
		this.requestCounter = 0;

		/**
		 * @ngdoc property
		 * @name Miscellaneous.RESTWrapperService#requestArray
		 * @propertyOf Miscellaneous.RESTWrapperService
		 * @description `private` Stores a list of URLs that were called
		 */
		this.requestArray = [];

		// Listen to state change begin, so that we can clear cache
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			that.resetCache();
		});

		/**
		 * @ngdoc property
		 * @name Miscellaneous.RESTWrapperService#cache
		 * @propertyOf Miscellaneous.RESTWrapperService
		 * @description `private` Holds the the client side caches, set to expire in 3 hours
		 * Our precious client side cache is back
		 */
		this.cache = DSCacheFactory('plm360Cache', {
			capacity: 1000,
			maxAge: 10800000,
			deleteOnExpire: 'aggressive',
			recycleFreq: 60000,
			cacheFlushInterval: 10800000
		});

	}

	/**
	 * @ngdoc property
	 * @name Miscellaneous.RESTWrapperService#resetCache
	 * @propertyOf Miscellaneous.RESTWrapperService
	 * @description `private` Resets cache variables
	 *
	 */
	resetCache() {
		this.reqs = {};
		this.cache.removeAll();
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#makeRequest
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description `private` Performs the actual request
	 *
	 * @param 	{Object} config 			The configuration object, defined as follow:
	 * 		{String}	type 		The type of request
	 * 		{String}	base 		The base of the Request Endpoint URL
	 * 		{Object}	data 		(optional) The Data to be attached to the request
	 * 		{Array} 	path 		(optional) List containing indexes/objects that are to be appended to the URL
	 * 		{Object} 	params 		(optional) List containing the parameters to be appended to the URL
	 * 		{Object} 	headers		(optional) Headers to be sent to the endpoint
	 * 		{Object} 	options		(optional) Options that can be used for performing get, such as:
	 * 											targetAttribute: {String} In case a specific key (attribute) from the payload is to be retrieved
	 *												event: {Object} Used for event service, this is the event that will be broadcasted
	 *
	 * @returns {Object} 					A promise OR the resolved/rejected promise containing the data/error
	 */
	makeRequest(config = {}) {
		var that = this;

		var methodMap = {
			get: 'get',
			put: 'customPUT',
			post: 'customPOST',
			delete: 'customDELETE',
			patch: 'patch'
		};

		// default parameters
		var type = config.type || 'get';
		var data = config.data || (config.data === '' ? config.data : {});
		var base = config.base || 'api/v3';
		var path = config.path || [];
		var params = config.params || {};
		var headers = config.headers || {};
		var options = config.options || {};

		var methodName = methodMap[type] || 'get'; // find the method name for Restangular

		var deferred = this.$q.defer(); // general deferred object
		var requestUri = base + this.parsePath(path); // construct the REST request URI

		// flush the cache
		// TODO: well, let's see if there's a better way to do this in the future
		// TODO: well, maybe not, but oh well.  Well.
		if (type !== 'get') {
			this.resetCache();
		}

		var cacheKey = [];
		this._.each(params, function (value, key) {
			cacheKey.push(key + '=' + value);
		});

		cacheKey = requestUri + '?' + cacheKey.join('&');

		// this.ADSKHttpInterceptor.setHandlers(function (rejection) {
		// 	console.log('pre-rejection', rejection);
		// 	// unauthorized, redirect back to login
		// 	//
		// 	if ((rejection.status === 401) || (rejection.status === 503) || (rejection.status === 500)) {
		// 		that.TokenService.unset();
		// 		that.AuthenticationService.requestRelogin();
		// 	}
		// }, function (response) {
		// 	that.AuthenticationService.unsetReAuth();
		// });

		// If we're doing a get, and we already made this request in this state, use the cache
		if (type === 'get' && (!angular.isDefined(options.skipCache) || options.skipCache === false)) {
			if (angular.isDefined(this.reqs[cacheKey])) {
				var cacheDeferred = this.$q.defer();

				/**
				 * @ngdoc method
				 * @name Miscellaneous.RESTWrapperService#waitForRet
				 * @methodOf Miscellaneous.RESTWrapperService
				 * @description `private` Wait for the request to return
				 */
				var waitForRet = function () {
					if (!angular.isDefined(that.cache.get(cacheKey))) {
						that.$timeout(function () {
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

		// calls method to increase the amount of requests performed, for loading purposes
		this.handleRequestCount('increase', requestUri);

		// handles timing out
		var requestTimeoutCounter = this.$timeout(function () {
			that.LoadingDataService.stateChangeError();
		}, this.GlobalSettings.requestTimeout);

		this.ADSKHttpInterceptor.setHandlers(requestUri, function (rejection) {
			// unauthorized, redirect back to login
			//
			if ((rejection.status === 401) || (rejection.status === 503)) {
				that.TokenService.unset();
				that.AuthenticationService.requestRelogin();
			}
			if (rejection.status === 403 && !!!options.hideError) {
				/**
				 * @todo RESTWrapperServiceSpecs Issue: PLM-8978
				 * This block of code has not related unit test due to an issue into RESTWrapperServiceSpecs
				 * We must revisit this section and build proper tests for this
				 */
				if (rejection.data && !!rejection.data.fusionLifecycleTermsOfServiceAccepted) {
					that.EventService.send('forbiddenAccess:notAcceptedAgreement');
				} else {
					that.AuthenticationService.unsetReAuth();
					that.TokenService.get().then(function (token) {
						// that.$state.go('dashboard');
						that.EventService.send('forbiddenAccess:permissionDenied', rejection.data);
					});
				}
			}
		}, function () {
			that.TokenService.get().then(function (token) {
				that.AuthenticationService.unsetReAuth();
			});
		});

		this.TokenService.get().then(function (token) {
			// assign the token
			headers.Authorization = 'Bearer ' + token;

			var args = [data, params, headers];

			// args for post and put are a little different
			if (type === 'post' || type === 'put') {
				args.splice(1, 0, '');
			}

			// args for get is only the params
			if (type === 'get') {
				args = [params, headers];
			}

			that.Restangular.one(requestUri)[methodName].apply(that.Restangular, args).then(function (response) {
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
			}, function (error) {
				var configUrl = (angular.isDefined(error.config)) ? error.config.url : '';

				// Reset cache only when the method is not GET
				// or the state has been changed ($stateChangeStart, line 71)
				if (methodName !== 'get') {
					that.resetCache();
				} else {
					// @todo We must decide if we want to parse the error code or some other data from the rejection
					// by the moment we are adding an additional attribute to be read when resolved in the cache waitForRet method.
					error.rejected = true;
					that.cache.put(cacheKey, error);
				}

				return deferred.reject(error);
			}).finally(function () {
				that.handleRequestCount('decrease', requestUri); // decrease the count of requests

				// cancels the timeout counter
				try {
					that.$timeout.cancel(requestTimeoutCounter);
				} catch (e) {}
			});
		}, function () {
			that.TokenService.unset();
			that.AuthenticationService.requestRelogin();
		});

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#parsePath
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description `private` Parses the path to a REST endpoint
	 *
	 * @param {Array} path The path to the endpoint
	 *
	 * @returns {String} The formatted string to be appended to the base URL
	 */
	parsePath(path) {
		var that = this;
		var parsedPath = '';

		if (!this._.isArray(path)) {
			this.$log.error('Error! You have to pass the PATH to the endpoint as an array!');
		}

		this._.each(path, function (value, key) {
			if (that._.isObject(value)) { // it's an object, so loop through it
				that._.each(value, function (id, resource) {
					parsedPath = parsedPath + '/' + resource + '/' + id;
				});
			} else { // if it's a index in the array, just append it to the variable
				parsedPath = parsedPath + '/' + value;
			}
		});

		return parsedPath;
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#handleRequestCount
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description `private` Handles the counting of requests for calls
	 *
	 * @param {String} flag 'increase' for REQUESTS, 'decrease' for succesful RESPONSES
	 * @param {String} key 	The name of the key to check for in the array
	 */
	handleRequestCount(flag, key) {
		switch (flag) {
			case 'increase':
				this.requestCounter++; // increase the counter, since this is a legitimate request
				if (this._.indexOf(this.requestArray, key) === -1) { // adds the current key to the requests array
					this.requestArray.push(key);
				}
				this.LoadingDataService.dataRequest({
					url: key,
					requests: this.requestCounter,
					requestsArr: this.requestArray
				});
				break;
			case 'decrease':
				this.requestCounter--; // decrease the counter, since this is a legitimate response
				var keyPos = this._.indexOf(this.requestArray, key);
				if (keyPos !== -1) { // removes the current key from the requests array
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
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#get
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description Performs a general GET to the endpoint
	 *
	 * @param 	{String} 	base 		String containing the base URL to access, without the starting and/or trailing slashes. E.g. 'api/v2'
	 * @param 	{Array} 	resources	(optional) List containing indexes/objects that are to be appended to the URL, E.g.: using the base URL above, [{'workspaces': 7, 'item-fields': 1685}, 'values'] will turn into 'api/v2/workspaces/7/item-fields/1685/values'
	 * @param 	{Object} 	params 		(optional) List containing the parameters to be appended to the URL
	 * @param 	{Object} 	options		(optional) Options that can be used for performing get, such as:
	 *												constructor: {Object} When using the new model structure, this is the wrapper object for the response
	 * @param 	{Object} header	(optional) Headers to be sent to the endpoint
	 *
	 * @returns {Object} 	A promise OR the resolved/rejected promise containing the data/error
	 *
	 */
	get(base, resources, params, options, headers) {
		return this.makeRequest({
			type: 'get',
			base: base,
			path: resources,
			params: params,
			options: options,
			headers: headers
		});
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#put
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description Performs a general PUT to the endpoint
	 *
	 * @param 	{Object} data 		The data to PUT
	 * @param 	{String} base 		String containing the base URL to access, without the starting and/or trailing slashes. E.g. 'api/v2'
	 * @param 	{Array}  path 		(optional) List containing indexes/objects that are to be appended to the URL, E.g.: using the base URL above, [{'workspaces': 7, 'item-fields': 1685}, 'values'] will turn into 'api/v2/workspaces/7/item-fields/1685/values'
	 * @param 	{Object} params 	(optional) List containing the parameters to be appended to the URL
	 * @param 	{Object} header	(optional) Headers to be sent to the endpoint
	 * @param 	{Object} options	(optional) Options that can be used for performing get, such as:
	 * 											targetAttribute: {String} In case a specific key (attribute) from the payload is to be retrieved
	 *												constructor: {Object} When using the new model structure, this is the wrapper object for the response
	 *												eventId: {String} the id of the event for the operation
	 *
	 * @returns {Object} 			A promise OR the resolved/rejected promise containing the data/error
	 */
	put(data, base, path, params, header, options) {
		return this.makeRequest({
			type: 'put',
			data: data,
			base: base,
			path: path,
			params: params,
			headers: header,
			options: options
		});
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#post
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description Performs a general POST to the endpoint
	 *
	 * @param 	{Object} data 		The data to POST
	 * @param 	{String} base 		String containing the base URL to access, without the starting and/or trailing slashes. E.g. 'api/v2'
	 * @param 	{Array} path 		(optional) List containing indexes/objects that are to be appended to the URL, E.g.: using the base URL above, [{'workspaces': 7, 'item-fields': 1685}, 'values'] will turn into 'api/v2/workspaces/7/item-fields/1685/values'
	 * @param 	{Object} params 	(optional) List containing the parameters to be appended to the URL
	 * @param 	{Object} header	(optional) Headers to be sent to the endpoint
	 * @param 	{Object} options	(optional) Options that can be used for performing delete, such as:
	 *											eventId: {String} the id of the event for the operation
	 *
	 * @returns {Object} 			A promise OR the resolved/rejected promise containing the data/error
	 */
	post(data, base, path, params, header, options) {
		return this.makeRequest({
			type: 'post',
			data: data,
			base: base,
			path: path,
			params: params,
			headers: header,
			options: options
		});

		// WE"LL LEAVE THIS HERE FOR NOW
		// we need XSRF token
		// Restangular.one("login/sessiontoken.form").get().then(function (sessionData) {
		// 	headers['PLM-XSRF-TOKEN'] = sessionData.token;
		// });
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#delete
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description Performs a general DELETE to the endpoint
	 *
	 * @param 	{String} base		String containing the base URL to access, without the starting and/or trailing slashes. E.g. 'api/v2'
	 * @param 	{Array} path 		(optional) List containing indexes/objects that are to be appended to the URL, E.g.: using the base URL above, [{'workspaces': 7, 'item-fields': 1685}, 'values'] will turn into 'api/v2/workspaces/7/item-fields/1685/values'
	 * @param 	{Object} params 	(optional) List containing the parameters to be appended to the URL
	 * @param 	{Object} header	(optional) Headers to be sent to the endpoint
	 * @param 	{Object} options	(optional) Options that can be used for performing delete, such as:
	 *											eventId: {String} the id of the event for the operation
	 *
	 * @returns {Object} 			A promise OR the resolved/rejected promise containing the data/error
	 */
	delete(base, path, params, header, options) {
		return this.makeRequest({
			type: 'delete',
			data: '',
			base: base,
			path: path,
			params: params,
			headers: header,
			options: options
		});
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#patch
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description Performs a general PATCH to the endpoint
	 *
	 * @param 	{Object} data 		The data to PATCH
	 * @param 	{String} base 		String containing the base URL to access, without the starting and/or trailing slashes. E.g. 'api/v2'
	 * @param 	{Array} path 		(optional) List containing indexes/objects that are to be appended to the URL
	 * @param 	{Object} params 	(optional) List containing the parameters to be appended to the URL, E.g.: using the base URL above, [{'workspaces': 7, 'item-fields': 1685}, 'values'] will turn into 'api/v2/workspaces/7/item-fields/1685/values'
	 * @param 	{Object} header		(optional) Headers to be sent to the endpoint
	 * @param 	{Object} options	(optional) Options that can be used for performing patch, such as:
	 *											constructor: {Object} When using the new model structure, this is the wrapper object for the response
	 *
	 * @returns {Object} 			A promise OR the resolved/rejected promise containing the data/error
	 */
	patch(data, base, path, params, header, options) {
		return this.makeRequest({
			type: 'patch',
			data: data,
			base: base,
			path: path,
			params: params,
			headers: header,
			options: options
		});
	}

	/**
	 * @ngdoc method
	 * @name Miscellaneous.RESTWrapperService#allSettled
	 * @methodOf Miscellaneous.RESTWrapperService
	 * @description A modified version of {@link $q#all} and inspired by Q's allSettled method to prevent short circuiting on first rejection.
	 *
	 * @param {Array} promises List of promises to resolve.
	 *
	 * @returns {Array} The list of promise results. Each An object will have a property 'success' that will determine whether promise is resolved or rejected.
	 *
	 * TODO: need to revisit this method. This may not be the most suitable place for this method.
	 */
	allSettled(promises = []) {
		var deferred = this.$q.defer();
		var counter = 0;
		var results = [];

		this._.each(promises, function (promise, $index) {
			counter++;
			promise.then(function (value) {
				results[$index] = {
					success: true,
					value: value
				};
				if (!(--counter)) {
					deferred.resolve(results);
				}
			}, function (reason) {
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
}

export default angular.module(__moduleName, [
	PLM360ConfModule.name,
	UnderscoreServiceModule.name,
	TokenServiceModule.name,
	EventServiceModule.name,
	LoadingDataServiceModule.name,
	AuthenticationServiceModule.name,
	'angular-data.DSCacheFactory',
	'restangular',
	'ADSK.HttpInterceptorService',
    'ui.router'
]).factory('RESTWrapperService', [
	'Restangular',
	'GlobalSettings',
	'DSCacheFactory',
	'$q',
	'$log',
	'$state',
	'$timeout',
	'$rootScope',
	'LoadingDataService',
	'TokenService',
	'AuthenticationService',
	'EventService',
	'ADSK.HttpInterceptorService.service',
	'$interval',
	'_',
	(Restangular, GlobalSettings, DSCacheFactory, $q, $log, $state, $timeout, $rootScope, LoadingDataService, TokenService, AuthenticationService, EventService, ADSKHttpInterceptor, $interval, _) => new RESTWrapperService(Restangular, GlobalSettings, DSCacheFactory, $q, $log, $state, $timeout, $rootScope, LoadingDataService, TokenService, AuthenticationService, EventService, ADSKHttpInterceptor, $interval, _)
]);
