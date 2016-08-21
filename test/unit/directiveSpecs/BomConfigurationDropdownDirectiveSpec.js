(function () {
	'use strict';

	var $rootScope, $scope, $compile, $httpBackend, EventService, el, mockLocalizationData, mockUserObj, BiasService, provide, elScope;

	describe('[DIRECTIVE] BomConfigurationDropdownDirective', function () {

		beforeEach(module('com/autodesk/EventService.js', 'plm360', 'plmTemplates', 'plm360.models', 'plm360.mockData', 'plm360.mockObjects'));

		beforeEach(function () {

			module(function ($provide) {
				provide = $provide;
			});

			inject(function (_$rootScope_, _$compile_, _$httpBackend_, _EventService_, MockBiasService, MockLocalizationData, MockUserObj) {
				$rootScope = _$rootScope_;
				$scope = $rootScope.$new();
				$compile = _$compile_;
				$httpBackend = _$httpBackend_;
				EventService = _EventService_;
				BiasService = new MockBiasService();
				mockUserObj = new MockUserObj();
				mockLocalizationData = MockLocalizationData;
			});

			$httpBackend.when('GET', '/api/rest/v1/token').respond(200, '');
			$httpBackend.when('GET', 'templates/appHeader.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);

			mockUserObj.getDateFormat.returns('MM/dd/yyyy');

			BiasService.getBiases.returns(['release', 'working', 'changeOrder', 'allChangeOrder']);
			BiasService.getBiasName.withArgs('working').returns('LOCALIZED WORKING');
			BiasService.getBiasName.returns('LOCALIZED OTHER');

			provide.value('BiasService', BiasService);

			$scope.initialDate = '2001-01-01';
			$scope.initialBias = 'working';
			$scope.onSaveFn = sinon.stub();

			el = angular.element('<bom-configuration-dropdown anchor="#test" initial-bias="initialBias" initial-date="initialDate" on-save="onSaveFn(config)"></bom-configuration-dropdown>');
			$compile(el)($scope);
			$scope.$apply();

			// Provide the datepicker with the user format
			EventService.send('currentUser:currentUser:done', mockUserObj);
			$scope.$apply();
		});

		it('should display the date', function () {
			var dateField = el.find('date-field').find('input');
			expect(dateField.val()).to.equal('01/01/2001');
		});

		it('should display the chosen bias as selected', function () {
			// jqLite doesn't support selecting by id, so use DOM function
			var biasButtonSpan = angular.element(el[0].querySelector('#bias-dropdown-button')).find('span').eq(0);
			expect(biasButtonSpan.text()).to.equal('LOCALIZED WORKING');
		});
	});
}());
