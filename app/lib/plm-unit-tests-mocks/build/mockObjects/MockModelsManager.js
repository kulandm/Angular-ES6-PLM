'use strict';

angular.module('plm360.mockObjects').factory('MockModelsManager', function () {
	return function () {
		return sinon.stub({
			resetModels: function () {},
			getExistingLinkedItems: function () {},
			getOutstandingWork: function () {},
			getBookmarkedItems: function () {},
			getRecentlyViewedItems: function () {},
			getUser: function () {},
			getItem: function () {},
			getItems: function () {},
			getWorkspaces: function () {},
			getWorkspace: function () {},
			getWorkspaceType: function () {},
			getCurrentUser: function () {},
			setCurrentUserDefInterface: function () {},
			getViews: function () {},
			getView: function () {},
			getBomRoot: function () {},
			getBomNested: function () {},
			getBomNestedItem: function () {},
			getViewDefs: function () {},
			getViewDef: function () {},
			getChangeLog: function () {},
			getReports: function () {},
			getReport: function () {},
			getAffectedItems: function () {},
			getAffectedItemsByLink: function () {},
			getAffectedItemsMeta: function () {},
			getAffectedItemsMetaByLink: function () {},
			getAffectedItem: function () {},
			getAffectedItemsTransitions: function () {},
			getRelatedItems: function () {},
			getAffectedItemLinkedToWorkspaces: function () {},
			getAffectedItemRelatedWorkspaces: function () {},
			getRelationshipRelatedWorkspaces: function () {},
			getBomRelatedWorkspaces: function () {},
			getRelatedWorkspaces: function () {},
			getWorkflow: function () {},
			getActionNotifications: function () {},
			getProjectItems: function () {},
			getTransitions: function () {},
			getGrid: function () {},
			getGridMeta: function () {},
			getRevisions: function () {},
			getMilestones: function () {},
			getGroups: function () {},
			getUsers: function () {},
			getWorkflowStates: function () {},
			getWorkflowTransitions: function () {},
			getSourcings: function () {},
			getSourcingQuotes: function () {},
			getTransitionsByLink: function () {},
			getTabs: function () {},
			getOwnershipByLink: function () {},
			getEnabledFeatures: function () {},
			getPicklistOptions: function () {},
			getPicklistSelection: function () {},
			getNamedRelationships: function () {},
			getStateByLink: function () {},
			getWorkspaceTableau: function () {},
			getAllWorkspaceTableaus: function () {}
		});
	}
});
