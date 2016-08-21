/**
 * @ngdoc object
 * @name Services.TokenService
 *
 * @description This service holds methods for Authentication Token management.
 *
 * ##Dependencies
 *
 */

let tokenStorageKey = 'O2AuthToken'; 
let _cache;

class TokenService {	

	/*
	 * @ngdoc method
	 * @name Services.TokenService#constructor
	 * @methodOf Services.TokenService
	 * @description The class constructor.
	 */
	constructor($rootScope, $q, $http, EventService) {
		this.$q = $q;
		this.$http = $http;
		this.EventService = EventService;
		this.tokenUrl = '/api/rest/v1/token';

		// Listeners IDs
		this.tokenListenerId
		this.loginListenerId
		
		this.tokenListenerId = this.EventService.listen(`unsetToken:done`, (event) => {
			this.EventService.unlisten(this.tokenListenerId);
			this.unset();
		});

		this.loginListenerId = this.EventService.listen(`loginStatus:check`, (event) => {
			EventService.send(`loginStatus:done`, localStorage.getItem(tokenStorageKey));
		});

		$rootScope.$on('$destroy', () => {
			this.EventService.unlisten(this.loginListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Services.TokenService#get
	 * @methodOf Services.TokenService
	 * @description Retrieves the authentication token
	 * @params  {Object} config - Default true, when true returns only the access_token, else resolves the entire token object
	 * @returns {string} The authentication token
	 */
	get(config) {
		let tokenStorageValue = this.getStoredToken();
		let lastToken;	

		// The below code is temporary as we need to migrate existing token string to new token string format
		// we are doing this as only strings can be stored in Local storage
		// TODO: remove the below logic(in about 3 weeks from 10th may 2016) and just assign lastToken after json parsing
		if(tokenStorageValue && tokenStorageValue.indexOf('token_type') > -1) {
			// We need to parse as the localstorage object is stringified
			lastToken = JSON.parse(tokenStorageValue);

		} else {
			lastToken = '';
		}

		//Accepted Config Value to return just the access token - Defaults to true
		let tokenOnly = (config && config.hasOwnProperty('tokenOnly') && typeof config.tokenOnly !== 'undefined' ? config.tokenOnly : true);
		
		//Accepted Config Value to force a new access token - Defaults to false
		let forceNew = (config && config.hasOwnProperty('forceNew') && typeof config.forceNew !== 'undefined' ? config.forceNew : false);

		//If we have a token, its not expired, and we werent requested to generate a new token, just return the cached token
		if (lastToken && (new Date()).getTime() < (lastToken.valid_till) && !forceNew) {
			return tokenOnly ? this.$q.when(lastToken.access_token) : this.$q.when(lastToken);
		}
		
		let deferred = this.$q.defer();

		// cache the promise and any subsequent request in between can just use the same promise
		return _cache || (_cache = this.$http.get(this.tokenUrl)).then(ret => {
			// Calculate actual expiry time and add it to the object
			// Expires_in *1000 to convert to milliseconds (expires_in normally in seconds)
			ret.data.valid_till = new Date().getTime() + (ret.data.expires_in * 1000);
			// Need to Stringify the object to store it in localstorage
			this.set(JSON.stringify(ret.data));
			return tokenOnly ? deferred.resolve(ret.data.access_token) : deferred.resolve(ret.data);

		}, function (error) {
			deferred.reject(error);
		}).finally(function() {
			_cache = null; // clean it off after the request is done
		});
	}

	/**
	 * @ngdoc method
	 * @name Services.TokenService#getStoredToken
	 * @methodOf Services.TokenService
	 * @description get the authentication token
	 *
	 * @returns {string} The authentication token
	 */
	getStoredToken() {
		return localStorage.getItem(tokenStorageKey);
	}

	/**
	 * @ngdoc method
	 * @name Services.TokenService#set
	 * @methodOf Services.TokenService
	 * @description Sets the authentication token
	 *
	 * @param {Object} tok The authentication token object
	 */
	set(tok) {
		localStorage.setItem(tokenStorageKey, tok);
	}

	/**
	 * @ngdoc method
	 * @name Services.TokenService#unset
	 * @methodOf Services.TokenService
	 * @description Removes the authentication token from session storage
	 *
	 */
	unset() {		
		localStorage.removeItem(tokenStorageKey);
	}
}

export default angular.module(__moduleName, [
]).factory('TokenService', [
	'$rootScope',
	'$q',
	'$http',
	'EventService',
	($rootScope, $q, $http, EventService) => new TokenService($rootScope, $q, $http, EventService)
]);
