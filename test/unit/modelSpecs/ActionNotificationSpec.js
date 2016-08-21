'use strict';

describe('ActionNotification', function () {
	var app;
	var underscore, q, provide, mockRESTWrapperService;
	var data = {
		id:2,
		type:'State',
		users: '/api/v3/workspaces/26/items/6766/views/2000/notifications/2/users',
		groups: '/api/v3/workspaces/26/items/6766/views/2000/notifications/2/groups',
		'workflow-state': {
			link: '/api/v3/workspaces/26/views/0/states/68',
			title: 'Create'
		},
		'workflow-transition': null,
		item: {
			link: 'api/v2/workspaces/26/items/6766',
			title: 'title'
		}
	};

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockObjects'));

	beforeEach(function () {
		app = new ActionNotification();
		app.json = data;
		module(function ($provide) {
			provide = $provide;
		});
		inject(function (_, $q, MockRESTWrapperService) {
			underscore = _;
			q = $q;
			mockRESTWrapperService = new MockRESTWrapperService();
			provide.value('RESTWrapperService', mockRESTWrapperService);
		});
	});

	describe('getNotificationId',function () {
		it('should return the notification id', function () {
			expect(app.getNotificationId()).to.deep.equal(2);
		});
	});

	describe('getEventType',function () {
		it('should return the event type', function () {
			expect(app.getEventType()).to.deep.equal('State');
		});
	});

	describe('getNotificationEvent',function () {
		it('should return the notification event', function () {
			expect(app.getNotificationEvent()).to.deep.equal({name: 'Create', id: '68'});
		});
	});
});
