'use strict';

describe('UserProfileSummaryDirective', function () {
	var el, $q, $timeout, scope, eventService;
	var mockModelsManager;
	var mockUserProfile;
	var mockLocalizationData;
	var provide;

	beforeEach(module('plm360', 'plm360.mockObjects', 'plm360.mockData','plmTemplates'));

	beforeEach(function () {
		module(function ($provide) {
			provide = $provide;
		});

		inject(function ($compile, _$q_, _$timeout_, $rootScope, $httpBackend, EventService, MockModelsManager, MockUserProfile, MockLocalizationData) {
			// get angular dependencies
			$q = _$q_;
			$timeout = _$timeout_;
			scope = $rootScope;
			eventService = EventService;

			// get mock objects dependencies
			mockModelsManager = new MockModelsManager();

			// get mock data dependencies
			mockUserProfile = MockUserProfile;
			mockLocalizationData = MockLocalizationData;

			// now use the mock object in place of the real object
			provide.value('ModelsManager', mockModelsManager);

			// setup mock http backend
			$httpBackend.expect('GET', '/api/rest/v1/token').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

			// initialization
			mockModelsManager.getUser.returns($q.when(mockUserProfile));

			// create and compile directive
			el = angular.element('<div><user-profile-summary user-id="user42"></user-profile-summary></div>');
			$compile(el)(scope);
			scope.$apply();
		});
	});

	it('should bind the data', function () {
		eventService.send('user:user42:done', mockUserProfile);
		scope.$digest();
		expect(scope.profileItems).to.be.an('array');
		expect(scope.avatarSrc).to.be.an('string');
	});
});
