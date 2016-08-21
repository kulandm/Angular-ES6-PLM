'use strict';

angular.module('plm360.mockObjects').factory('MockRestangular', function () {
	return function () {
		return sinon.stub({
			one: function () {
			}
		});
	}
});