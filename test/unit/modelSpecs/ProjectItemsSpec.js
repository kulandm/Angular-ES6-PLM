'use strict';

describe('ProjectItems', function () {
	var projectItems;
	var data = {
		id: 42
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		projectItems = new ProjectItems();
		projectItems.json = data;
	});

	describe('getFullList', function () {
		it('returns the json data', function () {
			expect(projectItems.getFullList()).to.deep.equal(data);
		});
	});
});
