'use strict';

describe('AffectedItems', function () {
	var affectedItem;
	var json = {
		__self__: '/api/v3/workspaces/59/items/6814/affected-items/6812',
		name: 'name'
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		affectedItem = new AffectedItems();
		affectedItem.json = [];
		angular.forEach([json], function (item, index) {
			affectedItem.json[index] = new AffectedItem(item);
		});
	});

	describe('getFullList', function () {
		it('returns the json data', function () {
			expect(affectedItem.getFullList()[0].json).to.deep.equal(json);
		});
	});

	describe('setFullList', function () {
		it('updates the json data', function () {
			affectedItem = new AffectedItems([json]);
			affectedItem.json = [];
			var updatedItem = {
				json: {
					__self__: '/api/v3/workspaces/59/items/6814/affected-items/1',
					name: 'Item'
				}
			};

			affectedItem.setFullList([updatedItem]);

			expect(affectedItem.getFullList()[0].json).to.deep.equal(updatedItem.json);
		});
	});

	describe('find', function () {
		it('searches for a specific item by its ID', function () {
			affectedItem = new AffectedItems();
			affectedItem.json = [];
			angular.forEach([json], function (item, index) {
				affectedItem.json[index] = new AffectedItem(item);
			});
			var foundItem = affectedItem.find(6812);

			expect(foundItem.getId()).to.equal(6812);
		});
	});
});