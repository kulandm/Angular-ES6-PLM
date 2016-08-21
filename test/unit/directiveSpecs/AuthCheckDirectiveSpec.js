'use strict';

describe('AuthCheckDirective', function () {
	var el, $q, $timeout, $location, $rootScope, mockAuthenticationService, mockTokenService, $httpBackend, mockLocalizationData;

	beforeEach(module('plm360','plmTemplates'));

	beforeEach(function () {
		mockLocalizationData = {};
	});

	beforeEach(function () {
		mockAuthenticationService = {
			requestRelogin: function () {
				$location.path('/login');
			},
			isLogged: function () {
				return false;
			}
		};

		mockTokenService = sinon.stub({
			unset: function () {}
		});

		module(function ($provide) {
			$provide.value('AuthenticationService', mockAuthenticationService);
			$provide.value('TokenService', mockTokenService);
		});
	});

	beforeEach(inject(function ($compile, _$rootScope_, _$q_, _$timeout_, _$location_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		$q = _$q_;
		$timeout = _$timeout_;
		$location = _$location_;
		$httpBackend = _$httpBackend_;

		  $httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

		// set up scope
		var scope = $rootScope.$new();

		// create and compile directive
		el = angular.element('<auth-check></auth-check>');
		$compile(el)(scope);
		scope.$digest();
	}));

	it('should redirect to login if user is not logged in', function () {
		$location.path('/workspaceList');
		$rootScope.$apply();
		$rootScope.$broadcast('$stateChangeSuccess', {
			name: 'test state'
		});
		expect($location.path()).to.equal('/login');
	});
});
