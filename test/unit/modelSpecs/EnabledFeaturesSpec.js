'use strict';

describe('EnabledFeatures', function () {

	var model, RESTWrapperService, $provide;

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockObjects', 'plm360.mockData', function (_$provide_) {
		$provide = _$provide_;
	}));

	beforeEach(inject(function (_MockRESTWrapperService_, _$q_, _$timeout_, _$httpBackend_, _MockEnabledFeaturesData_) {

		// Mock required requests
		_$httpBackend_.whenGET('lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});
		_$httpBackend_.whenGET('/api/rest/v1/token').respond(200, '');
		_$httpBackend_.whenGET('build/components/plmWrapper/plmWrapper.html').respond('');
		_$httpBackend_.whenGET('components/mainDashboard/mainDashboard.html').respond('');

		RESTWrapperService = _MockRESTWrapperService_();
		$provide.value('RESTWrapperService', RESTWrapperService);
		EnabledFeatures.prototype.RESTWrapperService = RESTWrapperService;

		var deferred = _$q_.defer();
		RESTWrapperService.get.withArgs('api/v3/tenant/enabled-features', null, null, {})
			.returns(deferred.promise);
		deferred.resolve(_MockEnabledFeaturesData_);

		model = new EnabledFeatures();
		model.fetch('api/v3/tenant/enabled-features');

		_$timeout_.flush();

	}));

	it('should exist the model instance', function () {
		expect(EnabledFeatures).to.be.defined;
		expect(model.__proto__).to.equal(EnabledFeatures.prototype);
	});

	describe('fetch method', function () {

		it('should have the fetch method', function () {
			expect(EnabledFeatures).to.be.defined;
			expect(EnabledFeatures.prototype.fetch).to.be.defined;
			expect(typeof model.fetch).to.equal('function');
		});

		it('should have executed correctly', function () {
			expect(model.json).to.be.defined;
		});

	});

	describe('getDisplayableData method', function () {

		it('should have the getDisplayableData method', function () {
			expect(EnabledFeatures).to.be.defined;
			expect(EnabledFeatures.prototype.getDisplayableData).to.be.defined;
			expect(typeof model.fetch).to.equal('function');
		});

		it('should execute correctly', function () {
			var value = model.getDisplayableData();
			expect(value.data[0].title).to.equal('item.update');
		});
	});
});
