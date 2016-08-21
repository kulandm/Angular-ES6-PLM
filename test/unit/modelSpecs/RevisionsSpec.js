'use strict';

describe('Revisions', function () {
	var app;
	var data = {
		id:1,
		name:'name',
		item: {
			id: 2,
			links: [{
				id: 1,
				link: 'api/[workspaceId]/[itemId]/link'
			}, {
				id: 3,
				link: 'api/[workspaceId]/[itemId]/link'
			}]
		}
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new Revisions();
		app.json = data;
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getCurrentId', function () {
		it('should return the id of the current revision', function () {
			expect(app.getCurrentId()).to.equal(data.item.id);
		});
	});

	// describe('getSelectedRevision', function () {
	// 	it('should return empty object if id is invalid', function () {
	// 		expect(app.getSelectedRevision()).to.deep.equal({});
	// 	});
	// 	it('should return the object if id is valid', function () {
	// 		app.json.item.id = 1;
	// 		expect(app.getSelectedRevision()).to.deep.equal(data.item.links[0]);
	// 	});
	// });
});
