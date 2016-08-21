'use strict';

describe('Milestones', function () {
	var milestones;
	var data = {
		__self__: '/api/v3/workspaces/47/items/6884/views/17',
		milestones: []
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		milestones = new Milestones();
		milestones.json = data;
	});

	describe('getFullList', function () {
		it('returns the json data', function () {
			expect(milestones.getFullList()).to.deep.equal(data.milestones);
		});
	});
});
