'use strict';

angular.module('plm360.mockObjects').factory('MockRelatedWorkspacesObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	}
});