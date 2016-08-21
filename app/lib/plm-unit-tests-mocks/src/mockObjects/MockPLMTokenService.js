'use strict';

angular.module('plm360.mockObjects').factory('MockPLMTokenService', function () {
	return function () {
		return sinon.stub({
			get: function () {}
		});
	}
});