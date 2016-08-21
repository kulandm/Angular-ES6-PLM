import underscoreModule from 'com/autodesk/UnderscoreService.js';

/**
 * @ngdoc object
 * @name Services.AuthenticationService
 *
 * @description This service is responsible for the authentication process as well as keeping track of authentication status.
 *
 * ##Dependencies
 * - Requires {@link Services.TokenService}
 *
 */

/**
 * @ngdoc property
 * @name Services.AuthenticationService#prevLocationKey
 * @propertyOf Services.AuthenticationService
 * @description `private` The key of session storage item which holds the location path of the pre-login state, so that app knows where to navigate to post-login
 */
let prevLocationKey = 'PLMPrevLocation';

/**
 * @ngdoc property
 * @name Services.AuthenticationService#reAuthKey
 * @propertyOf Services.AuthenticationService
 * @description `private` The key of session storage item which holds flag whether we already triggered a re-authentication request
 */
let reAuthKey = 'PLMReAuth';

class AuthenticationService {

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#constructor
	 * @methodOf Services.AuthenticationService
	 * @description The class constructor
	 */
	constructor(EventService, $rootScope, $location, $injector, $window, $timeout, _) {
		this.EventService = EventService;
		this.$rootScope = $rootScope;
		this.$location = $location;
		this.$injector = $injector;
		this.$window = $window;
		this.$timeout = $timeout;
		this._ = _;
		this.isLoggedin = false;
		
		this.loginListenerId = this.EventService.listen(`loginStatus:done`, (event, tokenObj) => {
			this.isLoggedin = !!(tokenObj)
		});

		$rootScope.$on('$destroy', () => {
			this.EventService.unlisten(this.loginListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#isLogged
	 * @methodOf Services.AuthenticationService
	 * @description Returns the authentication status of current user
	 *
	 * @returns {string} A string representation of the current authentication token, undefined if not authenticated
	 */
	isLogged() {		
		this.EventService.send(`loginStatus:check`);
		return this.isLoggedin;
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#setReAuth
	 * @methodOf Services.AuthenticationService
	 * @description Sets the reauthentication flag to true
	 *
	 */
	setReAuth() {
		sessionStorage.setItem(reAuthKey, 1);
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#unsetReAuth
	 * @methodOf Services.AuthenticationService
	 * @description Removes the reauthentication flag
	 *
	 */
	unsetReAuth() {
		sessionStorage.removeItem(reAuthKey);
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#setPrev
	 * @methodOf Services.AuthenticationService
	 * @description Saves the current location path for post-login retrieval
	 *
	 */
	setPrev() {
		if (this.$location.path() === '/login' || this.$location.path() === '/redirect') {
			// well we don't store it if the previous url is login or login redirect
		} else {
			sessionStorage.setItem(prevLocationKey, this.$location.path());
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#requestRelogin
	 * @methodOf Services.AuthenticationService
	 * @description Navigate to the /login for re-authentication
	 *
	 */
	requestRelogin() {
		// save the current URL for post login redirection
		this.setPrev();

		// saves the operation telling the app that we're doing re-authentication
		this.setReAuth();

		// tell everybody else we're logging in
		this.$rootScope.$broadcast('__logging');

		// let's redirect to the middle page
		this.$location.path('/redirect');
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#doRequestLogin
	 * @methodOf Services.AuthenticationService
	 * @description Performs the login sequence where the user is redirected to Oxygen for the authentication process
	 *
	 */
	doRequestLogin() {
		// if we're actually doing re-authentication
		if (sessionStorage.getItem(reAuthKey)) {

			// unset the re-auth token so we don't loop until end of time
			this.unsetReAuth();

			// now let's reload to trigger tomcat authentication process
			this.$window.location.reload();
		} else {

			// let's now redirect to the previous URL after authentication
			// default to dashboard
			this.$location.path(sessionStorage.getItem(prevLocationKey) || '/');
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.AuthenticationService#requestLogout
	 * @methodOf Services.AuthenticationService
	 * @description Unset authentication token in order to log user out
	 *
	 */
	requestLogout() {
		this.EventService.send(`unsetToken:done`);
		this.unsetReAuth();
		// Tell all controllers we're changing login status
		sessionStorage.removeItem(prevLocationKey);
		this.$rootScope.$broadcast('__logging');
	}
}

export default angular.module(__moduleName, [
	underscoreModule.name
]).factory('AuthenticationService', [
	'EventService',
	'$rootScope',
	'$location',
	'$injector',
	'$window',
	'$timeout',
	'_',
	(EventService, $rootScope, $location, $injector, $window, $timeout, _) => new AuthenticationService(EventService, $rootScope, $location, $injector, $window, $timeout, _)
]);
