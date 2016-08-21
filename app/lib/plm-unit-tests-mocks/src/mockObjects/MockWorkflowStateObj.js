'use strict';

angular.module('plm360.mockObjects').factory('MockWorkflowStateObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	};
});