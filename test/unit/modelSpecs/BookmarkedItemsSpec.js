'use strict';

describe('BookmarkedItems', function () {
	var app;
	var data;

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockData'));

	beforeEach(function () {
		app = new BookmarkedItems();
		inject(function ($state, EventService, MockBookmarkedItemsData) {
			app.$state = $state;
			app.EventService = EventService;
			app.json = MockBookmarkedItemsData;
		});
	});

	describe('getDisplayableData', function () {
		it('should return the formatted data', function () {
			var ret = app.getDisplayableData();
			expect(ret.data[0]).to.have.property('itemdescription');
		});
		it('should return empty object if no data', function () {
			var emptyApp = new BookmarkedItems({});
			var ret = emptyApp.getDisplayableData();
			expect(ret.data).to.deep.equal({});
		});
	});

	describe('isItemBookmarked', function () {
		it('should return true if the item URN matches', function () {
			var ret = app.isItemBookmarked('urn:adsk.plm:tenant.workspace.item:STANDARDDEMO.59.6848');
			expect(ret).to.equal(true);
		});
		it('should return true if item id matches', function () {
			var ret = app.isItemBookmarked('8@5770');
			expect(ret).to.equal(true);
		});
		it('should return false if item id does not match', function () {
			var ret = app.isItemBookmarked('api/v3/1');
			expect(ret).to.equal(false);
		});
		it('should return false if master is non object', function () {
			var emptyApp = new BookmarkedItems([{
				escalated: false,
				user: {
					link: '/api/v3/users/PLMAutoTest',
					title: 'PLMAutoTest Selenium1',
					urn: 'urn:adsk.plm:tenant.user:STANDARDDEMO.PLMAutoTest'
				},
				userInitiatedBy: {
					link: '/api/v3/users/PLMAutoTest',
					title: 'PLMAutoTest Selenium1',
					urn: 'urn:adsk.plm:tenant.user:STANDARDDEMO.PLMAutoTest'
				},
				item: null,
				inboxItemMessageType: {
					link: '/api/v3/inbox-item-message-types/5',
					title: 'Item Bookmarked',
					urn: 'urn:adsk.plm:tenant.inbox-item-message-types:STANDARDDEMO.5'
				},
				createTimestamp: '2015-08-20T13:05:07.790-03:00',
				availableTransitions: [],
				message: ' '
			}]);
			var ret = emptyApp.isItemBookmarked(1);
			expect(ret).to.equal(false);
		});
		it('should return false if no data', function () {
			var emptyApp = new BookmarkedItems({});
			var ret = emptyApp.isItemBookmarked(1);
			expect(ret).to.equal(false);
		});
	});
});
