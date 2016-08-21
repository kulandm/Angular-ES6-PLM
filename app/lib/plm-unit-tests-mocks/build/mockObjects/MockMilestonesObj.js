'use strict';

angular.module('plm360.mockObjects').factory('MockMilestonesObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	};
});
