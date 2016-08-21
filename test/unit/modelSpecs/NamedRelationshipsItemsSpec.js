'use strict';

describe('NamedRelationshipsItems', function () {
	var namedRelationshipsItems;
	var array = [
		{json: 'object1'},
		{json: 'object2'},
		{json: 'object3'},
		{json: 'object4'}
	];

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		namedRelationshipsItems = new NamedRelationshipsItems();
		namedRelationshipsItems.array = array;
	});

	describe('getFullList', function () {
		it('returns a deep copy of an object', function () {
			expect(namedRelationshipsItems.getFullList()).to.deep.equal(array);
		});
	});
});
