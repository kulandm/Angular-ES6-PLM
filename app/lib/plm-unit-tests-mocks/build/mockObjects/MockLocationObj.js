'use strict';

angular.module('plm360.mockObjects').factory('MockLocationObj', function () {
	return function () {
		return sinon.stub({
			search: function () {}
		});
	}
});