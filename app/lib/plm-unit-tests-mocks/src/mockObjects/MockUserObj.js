'use strict';

angular.module('plm360.mockObjects').factory('MockUserObj', function () {
	return function () {
		return sinon.stub({
			getId: function () {},
			getDisplayName: function () {},
			getDateFormat: function () {
				return 'MM/dd/yyyy';
			},
			permissions: {
				hasPermission: function () {
					return true;
				}
			},
			hasPermission: function () {
				return true;
			},
			setDefaultInterface: function () {},
			getProfileImage: function () {},
			getEmail: function () {}
		});
	};
});
