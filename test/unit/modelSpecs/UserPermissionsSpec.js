'use strict';

describe('UserPermissions', function () {
	var app;
	var data = {
		permissions: [{
			link: '/api/v3/permissions/2',
			id: 2
		}]
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new UserPermissions();
		app.json = data;
	});

	describe('hasPermission', function () {
		it('should return true if permission is in the permissions object', function () {
			expect(app.hasPermission(2)).to.be.true;
		});

		it('should return false if permission is not in the permissions object', function () {
			expect(app.hasPermission(1)).to.be.false;
		});
	});
});
