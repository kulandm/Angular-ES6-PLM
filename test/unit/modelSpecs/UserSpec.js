'use strict';

describe('User', function () {
	var app;
	var data = {
		id:1,
		displayName:'name',
		dateFormat: 'dd/mm/yyyy',
		timezone: 'Etc/GMT+12',
		interfaceStyle: 'ClassicPLM360',
		email: 'PlmAutoTest@autodesk.com'
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new User();
		app.json = data;
	});

	describe('getDateFormat', function () {
		it('should return date format', function () {
			expect(app.getDateFormat()).to.equal(data.dateFormat);
		});
	});

	describe('getEmail', function () {
		it('should return the email', function () {
			expect(app.getEmail()).to.equal(data.email);
		});
	});

	describe('setPermissions',function () {
		it('should set the permissions object', function () {
			app.setPermissions({});
			expect(app.permissions).to.deep.equal({});
		});
	});
	describe('hasPermission',function () {
		it('should return true if permission is in the permissions object', function () {
			app.setPermissions({
				hasPermission: function (i) {
					return true;
				}
			});
			expect(app.hasPermission()).to.be.true;
		});

		it('should return false if permission is not in the permissions object', function () {
			app.setPermissions({
				hasPermission: function (i) {
					return false;
				}
			});
			expect(app.hasPermission()).to.be.false;
		});
	});

	describe('getId',function () {
		it('should return the id', function () {
			expect(app.getId()).to.equal(data.id);
		});
	});

	describe('getDisplayName',function () {
		it('should return the display name', function () {
			expect(app.getDisplayName()).to.equal(data.displayName);
		});
	});

	describe('getProfileImage',function () {
		it('should return the object for images paths', function () {
			expect(app.getProfileImage()).to.deep.equal({
				small: 'images/avatar_generic_x20.png',
				medium: 'images/avatar_generic_x35.png'
			});
		});
	});

	describe('getTimeZone',function () {
		it('should return the timezone for the current user', function () {
			expect(app.getTimeZone()).to.equal(data.timezone);
		});
	});

	describe('getInterfaceStyle',function () {
		it('should return the interface style for the current user', function () {
			expect(app.getInterfaceStyle()).to.equal(data.interfaceStyle);
		});
	});
});
