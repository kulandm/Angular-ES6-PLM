'use strict';

describe('GridData', function () {
	var app;
	var data = {
		id:1,
		name:'name'
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new GridData();
		app.json = data;
	});

	describe('getFullList',function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});
});
