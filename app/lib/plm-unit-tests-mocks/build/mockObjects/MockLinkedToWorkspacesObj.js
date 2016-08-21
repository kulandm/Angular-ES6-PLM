'use strict';

angular.module('plm360.mockObjects').factory('MockLinkedToWorkspacesObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			getRevisioningWorkspaces: function () {}
		});
	};
});
