'use strict';

angular.module('plm360.mockObjects').factory('MockChangeLogObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	}
});