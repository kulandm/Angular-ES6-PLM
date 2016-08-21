'use strict';

angular.module('plm360.mockObjects').factory('MockItemObj', function () {
	return function () {
		return sinon.stub({
			addExistingAffectedItem: function () {},
			setWorkspaceObj: function () {},
			getFullList: function () {},
			getSections: function () {},
			getViewDetailsFieldsData: function () {},
			save: function () {},
			saveNew: function () {},
			getId: function () {},
			getUrn: function () {},
			getItemTitle: function () {},
			getWorkspaceObj: function () {},
			workspaceObj: sinon.stub({
				getId: function () {},
				getSectionsMetadata: function () {},
				getTypeId: function () {}
			}),
			getAffectedItemLinkableItemsLink: function () {},
			getAffectedItemsMetaLink: function () {},
			getAffectedItemsLink: function () {},
			getBomItemLinkableItemsLink: function () {},
			associateAffectedItem: function () {},
			getBomNestedLink: function () {},
			getBomRootLink: function () {},
			getProjectItemLinkableItemsLink: function () {},
			getRelationshipItemLinkableItemsLink: function () {},
			getNamedRelationshipItemsLink: function () {},
			getTransitionsLink: function () {},
			getOwnershipLink: function () {},
			setArchive: function () {},
			setBookmark: function () {},
			isLocked: function () {},
			isWorking: function () {},
			isReleased: function () {},
			performTransition: function () {},
			getLifecycleState: function () {}
		});
	};
});
