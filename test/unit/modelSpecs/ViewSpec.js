'use strict';

describe('View', function () {
	var app;
	var data = {
		workspaceViewDefinitionList: {
			list: {
				id:1,
				name:'name'
			}
		}
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new View();
		app.json = data;
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data.workspaceViewDefinitionList.list);
		});
	});
});
