'use strict';

/**
 * @ngdoc object
 * @name Controllers.LoginController
 *
 * @description This controller corresponds to /login.
 *
 * ##Dependencies
 * - Requires {@link Services/Services.AuthenticationService}
 *
 */
/* global plm360 */
plm360.controller('LoginController', ['$scope', '$rootScope', '$location', 'LocalizationService', 'AuthenticationService', '_', function ($scope, $rootScope, $location, LocalizationService, AuthenticationService, _) {

	/**
  * @ngdoc property
  * @name Controllers.LoginController#isLogged
  * @propertyOf Controllers.LoginController
  * @description {boolean} Flag for whether user is logged in
  */
	$scope.isLogged = null;

	/**
  * @ngdoc property
  * @name Controllers.LoginController#bundle
  * @propertyOf Controllers.LoginController
  * @description The localization bundle to be loaded
  */
	$scope.bundle = {};

	/**
  * @ngdoc method
  * @name Controllers.LoginController#redirect
  * @methodOf Controllers.LoginController
  * @description Does redirection to trigger login
  */
	$scope.redirect = function () {
		AuthenticationService.doRequestLogin();
	};

	/**
  * @ngdoc method
  * @name Controllers.LoginController#login
  * @methodOf Controllers.LoginController
  * @description Request for a login through AuthenticationService
  */
	$scope.login = function () {
		AuthenticationService.requestRelogin();
	};
}]);
//# sourceMappingURL=LoginController.js.map
