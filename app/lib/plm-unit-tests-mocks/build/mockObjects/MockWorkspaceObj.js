'use strict';

angular.module('plm360.mockObjects').factory('MockWorkspaceObj', function () {
	return function () {
		return sinon.stub({
			workspace: {
				workspaceTypeId: ''
			},
			getFullList: function () {},
			getDisplayName: function () {},
			getTypeId: function () {},
			getId: function () {},
			getItemLink: function () {},
			getViewDefsLink: function () {},
			getViewDetailsFieldsData: function () {},
			getSectionsMeta: function () {},
			getSectionsMetadata: function () {},
			getBomRelatedWorkspacesLink: function () {},
			getLinkedToWorkspacesLink: function () {},
			addValidationRules: function () {},
			getSimpleList: function () {},
			getWorkspaceUrn: function () {},
			setPicklistHook: function () {}
		});
	};
});
