'use strict';

describe('ActionNotifications', function () {
	var app;
	var provide, mockRESTWrapperService;
	var data = [{
		id:2,
		type:'type',
		users: '/api/v3/workspaces/26/items/6766/views/2000/notifications/2/users',
		groups: '/api/v3/workspaces/26/items/6766/views/2000/notifications/2/groups',
		'workflow-stae': {
			link: '/api/v3/workspaces/26/views/0/states/68',
			title: 'Create'
		},
		'workflow-transition': null,
		item: {
			link: 'api/v2/workspaces/26/items/6766',
			title: 'title'
		}
	}];

	beforeEach(module('plm360','plm360.models', 'plm360.mockObjects'));

	beforeEach(function () {
		app = new ActionNotifications();
		app.json = data;
		module(function ($provide) {
			provide = $provide;
		});
		inject(function (MockRESTWrapperService) {
			mockRESTWrapperService = new MockRESTWrapperService();
			provide.value('RESTWrapperService', mockRESTWrapperService);
		});
	});

	describe('getFullList',function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});
});
