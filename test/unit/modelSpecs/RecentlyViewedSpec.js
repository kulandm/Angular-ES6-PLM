'use strict';

describe('RecentlyViewed', function () {
	var app, state;
	var data = [{
		escalated: false,
		user: {
			link: '/api/v3/users/PLMAutoTest',
			title: 'PLMAutoTest Selenium1'
		},
		userInitiatedBy: {
			link: '/api/v3/users/PLMAutoTest',
			title: 'PLMAutoTest Selenium1'
		},
		item: {
			urn: 'URN'
		},
		workspace: {
			id: 'jfowiejf',
			title: 'Test title'
		},
		master: {
			link: '/api/v3/workspaces/26/items/6898',
			title: 'CR000050 - fawefawe1a'
		},
		inboxItemMessageType: {
			link: '/api/v3/inboxItemMessageTypes/1',
			title: 'Recently viewed item'
		},
		createTimestamp: '2015-08-11T15:55:07.871-04:00',
		availableTransitions: [],
		message: 'CR000050 - fawefawe: was recently viewed.'
	},{
		escalated: false,
		user: {
			link: '/api/v3/users/PLMAutoTest',
			title: 'PLMAutoTest Selenium1'
		},
		userInitiatedBy: {
			link: '/api/v3/users/PLMAutoTest',
			title: 'PLMAutoTest Selenium1'
		},
		master: {
			link: '/api/v3/workspaces/26/items/6898',
			title: 'CR000050 - fawefawe1a'
		},
		inboxItemMessageType: {
			link: '/api/v3/inboxItemMessageTypes/1',
			title: 'Recently viewed item'
		},
		createTimestamp: '2015-08-11T15:55:07.871-04:00',
		availableTransitions: [],
		message: 'CR000050 - fawefawe: was recently viewed.'
	}];

	beforeEach(module('plm360', 'plm360.models'));

	beforeEach(function () {
		app = new RecentlyViewed();
		app.json = data;
		inject(function ($state) {
			app.$state = $state;
		});
	});

	describe('getDisplayableData', function () {
		it('should return the formatted data, containing only items that have "item.urn"', function () {
			var ret = app.getDisplayableData();
			expect(ret.data.length).to.equal(1);
			expect(ret.data[0]).to.have.property('itemdescription');
		});
		it('should return empty object if no data', function () {
			var emptyApp = new RecentlyViewed({});
			var ret = emptyApp.getDisplayableData();
			expect(ret.data).to.deep.equal({});
		});
	});
});
