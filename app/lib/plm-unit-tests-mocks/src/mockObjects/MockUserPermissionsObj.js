'use strict';

angular.module('plm360.mockObjects').factory('MockUserPermissionsObj', function () {
	return function () {
		return sinon.stub({
			hasPermission: function () {}
		});
	}
});
