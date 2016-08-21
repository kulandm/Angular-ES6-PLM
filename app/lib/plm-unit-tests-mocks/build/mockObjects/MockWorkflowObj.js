'use strict';

angular.module('plm360.mockObjects').factory('MockWorkflowObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			getSectionsMeta: function () {},
			getSectionsMetadata: function () {},
			getLifecycleWorkflowStateLink: function () {},
			getLifecycleWorkflowStateTransitionsLink: function () {}
		});
	};
});