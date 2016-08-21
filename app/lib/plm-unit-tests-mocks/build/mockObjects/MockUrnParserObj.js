'use strict';

angular.module('plm360.mockObjects').factory('MockUrnParser', function () {
	return function () {
		return sinon.stub({
			encode: function () {},
			decode: function () {}
		});
	}
});