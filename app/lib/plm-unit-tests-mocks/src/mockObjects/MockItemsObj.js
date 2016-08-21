'use strict';

angular.module('plm360.mockObjects').factory('MockItemsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	}
});