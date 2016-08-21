'use strict';

angular.module('plm360.mockObjects').factory('MockAuthenticationService', function () {
	return function () {
		return sinon.stub({
			key: 1,
			requestRelogin: function () {
				this.key = 2;
			},
			unsetReAuth: function () {
				
			},
			isLogged: function () {}
		});
	}
});