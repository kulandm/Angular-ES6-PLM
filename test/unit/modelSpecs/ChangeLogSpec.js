'use strict';

describe('ChangeLog', function () {
	var app;
	var data = {
		id:1,
		name: 'name'
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new ChangeLog();
		app.json = data;
	});

	describe('getFullList',function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});
});
