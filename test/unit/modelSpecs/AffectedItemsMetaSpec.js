'use strict';

describe('AffectedItemsMeta', function () {
	var provide, $rootScope, $q, RESTWrapperService;
	var affectedItemsMeta;
	var json = {
		__self__: '/api/v3/workspaces/9/items/2950/views/11/fields',
		fields: [
			{
				__self__: '/api/v3/workspaces/9/views/11/fields/SLT',
				name: 'SLT',
				description: '',
				type: {
					link: '/api/v3/field-types/4',
					title: 'Single Line Text',
					urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001LOCAL.4'
				},
				picklist: null
			},
			{
				__self__: '/api/v3/workspaces/9/views/11/fields/INT',
				name: 'Int',
				description: '',
				picklist: '/api/v3/picklists/CUSTOM_LOOKUP_PRODUCT'
			}
		]
	};

	beforeEach(module(
		'plm360',
		'plm360.models',
		'plm360.mockData',
		'plm360.mockObjects'
	));

	beforeEach(function () {
		affectedItemsMeta = new AffectedItemsMeta();
		affectedItemsMeta.json = json;

		module(function ($provide) {
			provide = $provide;
		});

		inject(function (
			_$rootScope_,
			_$q_,
			$httpBackend,
			_RESTWrapperService_,
			MockLocalizationData
		) {
			$rootScope = _$rootScope_;
			$q = _$q_;
			RESTWrapperService = _RESTWrapperService_;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.when('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
		});

		provide.value('RESTWrapperService', RESTWrapperService);
	});

	describe('fetch', function () {
		it('fetches the data', function () {
			sinon.stub(RESTWrapperService, 'get');
			sinon.spy(RESTWrapperService, 'allSettled');
			RESTWrapperService.get.onCall(0).returns($q.when(json));
			RESTWrapperService.get.onCall(1).returns($q.when());

			affectedItemsMeta.fetch();
			$rootScope.$digest();

			expect(RESTWrapperService.allSettled).to.have.been.called;
		});
	});

	describe('getFullList', function () {
		it('returns the json data', function () {
			expect(affectedItemsMeta.getFullList()).to.deep.equal(json.fields);
		});
	});

	describe('getFieldId', function () {
		it('gets the field ID of a field', function () {
			var field = affectedItemsMeta.getFullList()[0];
			expect(affectedItemsMeta.getFieldId(field)).to.equal('SLT');
		});
	});

	describe('getDataTypeId', function () {
		it('gets the data type ID of a field', function () {
			var field = affectedItemsMeta.getFullList()[0];
			expect(affectedItemsMeta.getDataTypeId(field)).to.equal('4');
		});
	});
});
