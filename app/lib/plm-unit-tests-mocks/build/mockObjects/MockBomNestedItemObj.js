(function (module) {
	'use strict';

	module.factory('MockBomNestedItemObj', function () {
		return function () {
			return sinon.stub({
				fetch: function () {},
				save: function () {},
				getSelfLink: function () {},
				getItemId: function () {},
				getDmsId: function () {},
				getWorkspaceId: function () {},
				getBomId: function () {},
				getItemNumber: function () {},
				getItemUrn: function () {},
				getItem: function () {},
				getChildren: function () {},
				hasChildren: function () {},
				getAttachmentsDataCount: function () {},
				getFields: function () {},
				getAttachmentData: function () {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));
