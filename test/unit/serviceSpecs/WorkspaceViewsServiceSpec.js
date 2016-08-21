System.get('com/autodesk/PLM360Conf.js');
System.get('com/autodesk/filters.js');

'use strict';

describe('WorkspaceViewsService', function () {
	var mockRestService, q, timeout, d, httpBackend, mockLocalizationData;

	beforeEach(module('com/autodesk/PLM360Conf.js','plm360','com/autodesk/filters.js','plmTemplates'));

	beforeEach(function () {
		mockRestService = sinon.stub({
			get: function () {},
			post: function () {}
		});

		mockLocalizationData = {};

		module(function ($provide) {
			$provide.value('RESTWrapperService',mockRestService);
		});
		inject(function ($q, $timeout, $httpBackend) {
			q = $q;
			timeout = $timeout;
			httpBackend = $httpBackend;

			httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);
		});
	});

	describe('getAvailableFields',function () {
		it('should return whatever RESTWrapperService returns for getting workspace views', inject(function (WorkspaceViewsService) {
			d = q.defer();
			timeout(function () {
				d.resolve({key:'val'});
			},5000);
			mockRestService.post.returns(d.promise);

			var ret = WorkspaceViewsService.getAvailableFields;
			ret().then(function (data) {
				expect(data.key).to.equal('val');
			});
			timeout.flush();
		}));

		it('should return whatever RESTWrapperService returns for getting view data', inject(function (WorkspaceViewsService) {
			d = q.defer();
			timeout(function () {
				d.resolve({key:'val'});
			},5000);
			mockRestService.get.returns(d.promise);

			WorkspaceViewsService.getViewData(1).then(function (data) {
				expect(data.key).to.equal('val');
			});
			timeout.flush();
		}));

		it('should return whatever RESTWrapperService returns for saving view data', inject(function (WorkspaceViewsService) {
			d = q.defer();
			timeout(function () {
				d.resolve({key:'val'});
			},5000);
			mockRestService.post.returns(d.promise);

			WorkspaceViewsService.saveViewData({param1: 'test data'}).then(function (data) {
				expect(data.key).to.equal('val');
			});
			timeout.flush();
		}));

		it('should return whatever RESTWrapperService returns for getting filter types', inject(function (WorkspaceViewsService) {
			d = q.defer();
			timeout(function () {
				d.resolve({key:'val'});
			},5000);
			mockRestService.get.returns(d.promise);

			WorkspaceViewsService.getFilterTypes(14).then(function (data) {
				expect(data.key).to.equal('val');
			});
			timeout.flush();
		}));
	});
});
