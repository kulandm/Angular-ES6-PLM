'use strict';

describe('LoginController', function () {

	var $controllerConstructor = null;
	var mockAuthenticationService = null;
	var scope = null;
	var q = null;
	var timeout = null;
	var d = null;

	beforeEach(module('plm360'));

	/**
	 * Setup for each test cases
	 */
	beforeEach(function () {

		/**
		 * Mock the service the controller needs
		 * Mock the function the controller calls
		 */
		mockAuthenticationService = sinon.stub({
			isLogged: function () {},
			requestLogin: function () {},
			requestRelogin: function () {},
			doRequestLogin: function () {}
		});

		/**
		 * Inject the angular dependencies of the controller
		 * Save these in variables so they can be used in the test cases
		 */
		inject(function ($controller, $rootScope, $q, $timeout) {
			q = $q;
			timeout = $timeout;
			scope = $rootScope;
			$controllerConstructor = $controller;
		});
	});

	describe('redirect',function () {
		it('should call authentication service to request relogin', function () {
			var called = false;

			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			var ctrl = $controllerConstructor('LoginController',{
				$scope:scope,
				$parse:{},
				AuthenticationService:mockAuthenticationService
			});

			/**
			 * Call the function we want to test, in this case, the redirect function
			 */
			scope.redirect();

			/**
			 * The actual test cases for the function (redirect)
			 */
			expect(mockAuthenticationService.doRequestLogin.calledOnce).to.equal(true);
		});
	});
});
