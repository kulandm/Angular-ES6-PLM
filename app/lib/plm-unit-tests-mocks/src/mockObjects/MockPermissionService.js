'use strict';

angular.module('plm360.mockObjects').factory('MockPermissionService', function () {
	return function () {
		return sinon.stub({
			hasPermissions: function () {},
			checkPermissionByItem: function () {},
			checkPermissionByItemId: function () {}
		});
	}
});