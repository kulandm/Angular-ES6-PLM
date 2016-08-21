'use strict';

describe('Items', function () {
	var app;
	var itemsData = [
		{
			dmsId:1,
			displayName:'name'
		},
		{
			dmsId:2,
			displayName:'a name'
		}
	];
	var data = {
		id:1,
		name:'name',
		items: itemsData
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new Items();
		app.json = data;
		angular.forEach(app.json.items, function (item) {
			item.link = 'api/v2/workspaces/[workspaceId]/items/' + item.dmsId;
		});
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getItemLink', function () {
		it('should return the link given valid item id', function () {
			expect(app.getItemLink(1, 1)).to.equal(itemsData[0].link.replace('[workspaceId]', 1));
		});
		it('should return empty string given invalid item id', function () {
			expect(app.getItemLink(1, 3)).to.equal('');
		});
	});
});
