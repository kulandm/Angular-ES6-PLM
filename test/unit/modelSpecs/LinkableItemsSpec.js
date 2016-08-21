'use strict';

describe('LinkableItems', function () {
	var app;
	var data = {
		items: [{
			workspace: {
				title: 'test workspace'
			},
			lifecycle: {
				title: 'test lifecycle'
			},
			item: {
				title: 'test item',
				link: 'api/v2/dummy-link'
			}
		}],
		totalCount: 0
	};

	var provide, mockRESTWrapperService, q;

	beforeEach(module('plm360','plm360.models', 'plm360.mockObjects'));

	beforeEach(function () {
		app = new LinkableItems();

		module(function ($provide) {
			provide = $provide;
		});

		inject(function ($q, MockRESTWrapperService) {
			q = $q;
			mockRESTWrapperService = new MockRESTWrapperService();
			provide.value('RESTWrapperService', mockRESTWrapperService);
		});
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			mockRESTWrapperService.get.returns(data);
			app.fetch().then(function () {
				expect(app.getFullList()).to.deep.equal(data.linkableItems);
			});
		});
	});

	describe('getTotalCount', function () {
		it('should return the total count of linked items', function () {
			mockRESTWrapperService.get.returns(q.when(data));
			app.fetch().then(function () {
				expect(app.getTotalCount()).to.equal(data.totalCount);
			});
		});
	});

	describe('getLength', function () {
		it('should return the length of the linkable item list', function () {
			mockRESTWrapperService.get.returns(q.when(data));
			app.fetch().then(function () {
				expect(app.getLength()).to.equal(data.linkableItems.length());
			});
		});
	});
});
