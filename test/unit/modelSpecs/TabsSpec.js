'use strict';

describe('Tabs', function () {
	var app;
	var data = {
		id: 1,
		name: 'name'
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new Tabs();
		app.json = data;
	});

	describe('getFullList',function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});
});
