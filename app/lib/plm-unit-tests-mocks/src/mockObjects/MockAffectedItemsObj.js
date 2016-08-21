'use strict';

angular.module('plm360.mockObjects').factory('MockAffectedItemsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	};
});