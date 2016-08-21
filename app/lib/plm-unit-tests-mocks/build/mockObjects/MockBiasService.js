'use strict';

angular.module('plm360.mockObjects').factory('MockBiasService', function () {
	return function () {
		return sinon.stub({
			getBiases: function () {},
			getBiasName: function () {}
		});
	}
});