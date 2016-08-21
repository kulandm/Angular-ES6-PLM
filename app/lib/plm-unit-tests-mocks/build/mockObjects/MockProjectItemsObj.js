'use strict';

angular.module('plm360.mockObjects').factory('MockProjectItemsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	};
});
