'use strict';

describe('RelatedBomItems', function () {
	var app, q, scope;
	var basicData = [{
		items: [{
			link: '/api/v3/workspaces/21/items/4646/bom-items/1043',
			title: 'Title1 [REV:w]',
			version: 'A',
			urn: 'urn:adsk.plm:tenant.workspace.item.bom-item:SELENIUM1001.21.4646.1043',
			permissions: [],
			item : {
				link: '/api/v3/workspaces/21/items/4787',
				title: 'Title1.1',
				version: 'Working',
				urn: 'urn:adsk.plm:tenant.workspace.item:SELENIUM1001.21.4787',
				permissions: []
			}
		}]
	}];
	var emptyData = [{
		items: []
	}];
	var itemDetailsData = {
		title: 'Title1 [REV:w]',
		version: 'A'
	};

	beforeEach(module('plm360','plm360.models', 'plm360.mockObjects', 'plm360.mockData'));

	beforeEach(function () {
		inject(function ($q, $rootScope, MockLocalizationData, $httpBackend) {
			q = $q;
			scope = $rootScope;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.when('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
		});

		app = new RelatedBomItems();
		app.json = basicData;
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(basicData);
		});
	});

	describe('getAllChildren', function () {
		it('should fetches all children', inject(function (PermissionService, RESTWrapperService) {
			sinon.stub(PermissionService, 'hasPermissions');
			PermissionService.hasPermissions.returns(q.when(true));

			sinon.stub(RESTWrapperService, 'get');
			RESTWrapperService.get.onCall(0).returns(q.when(basicData));
			RESTWrapperService.get.onCall(1).returns(q.when(emptyData));

			app.getAllChildren('/api/v3/workspaces/21/items/4646/bom-items?limit=999&revisionBias=working', [], true).then(function (result) {
				expect(result).to.have.length(1);
				expect(result[0]).to.be.an.instanceOf(RelatedBomItem);
				expect(result[0].json.link).to.equal('/api/v3/workspaces/21/items/4646/bom-items/1043');
				expect(result[0].json.item.version).to.equal('Working');
			});
			scope.$digest();

			expect(RESTWrapperService.get).to.have.been.called;
		}));
	});

	describe('fetch', function () {
		it('should fetch direct children/parents', inject(function (PermissionService, RESTWrapperService, $q) {
			sinon.stub(PermissionService, 'hasPermissions');
			PermissionService.hasPermissions.returns(q.when(true));

			sinon.stub(RESTWrapperService, 'get');
			RESTWrapperService.get.onCall(0).returns(q.when(basicData));
			RESTWrapperService.get.onCall(1).returns(q.when(itemDetailsData));

			sinon.spy($q, 'all');

			app.fetch('/api/v3/workspaces/21/items/4646/bom-items?limit=999&revisionBias=working').then(function (result) {
				expect(result).to.have.length(1);
				expect(result[0]).to.be.an.instanceOf(RelatedBomItem);
				expect(result[0].json.title).to.equal('Title1 [REV:w]');
				expect(result[0].json.version).to.equal('A');
			});
			scope.$digest();

			expect($q.all).to.have.been.called;
		}));
	});

	describe('getItemDetails', function () {
		it('should fetch the item detail', inject(function (PermissionService, RESTWrapperService, $q) {
			sinon.stub(PermissionService, 'hasPermissions');
			PermissionService.hasPermissions.returns(q.when(true));

			sinon.stub(RESTWrapperService, 'get');
			RESTWrapperService.get.returns(q.when(itemDetailsData));

			sinon.spy($q, 'all');

			app.getItemDetails(['/api/v3/workspaces/21/items/4646/bom-items?limit=999&revisionBias=working']).then(function (result) {
				expect(result).to.have.length(1);
				expect(result[0]).to.be.an.instanceOf(RelatedBomItem);
				expect(result[0].json.title).to.equal('Title1 [REV:w]');
				expect(result[0].json.version).to.equal('A');
			});
			scope.$digest();

			expect($q.all).to.have.been.called;
		}));
	});
});
