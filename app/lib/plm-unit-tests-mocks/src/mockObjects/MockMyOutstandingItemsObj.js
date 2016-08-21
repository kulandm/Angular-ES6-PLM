'use strict';

angular.module('plm360.mockObjects').factory('MockMyOutstandingItemsObj', function () {
	return function () {
		return sinon.stub({
			getDisplayableData: function () {}
		});
	}
});