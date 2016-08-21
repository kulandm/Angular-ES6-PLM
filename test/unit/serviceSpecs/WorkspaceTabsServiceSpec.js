System.get('com/autodesk/PLM360Conf.js');

'use strict';

describe('WorkspaceTabsService', function () {
	var mockRestService, q, timeout, d, httpBackend, mockLocalizationData;

	beforeEach(module('com/autodesk/PLM360Conf.js','plm360','plmTemplates'));

	beforeEach(function () {
		mockRestService = sinon.stub({
			get: function () {}
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

	describe('getWorkspaceTabsData', function (workspaceId) {
		it('should return whatever RESTWrapperService returns for getting workspace Tabs Data', inject(function (WorkspaceTabsService) {
			mockRestService.get.returns({
				get:function () {
					d = q.defer();
					timeout(function () {
						d.resolve({key:'val'});
					},5000);
					return d.promise;
				}
			});
			var ret = WorkspaceTabsService.getWorkspaceTabsData(7);
			ret.get().then(function (data) {
				expect(data.key).to.equal('val');
			});
			timeout.flush();
		}));
	});
});
