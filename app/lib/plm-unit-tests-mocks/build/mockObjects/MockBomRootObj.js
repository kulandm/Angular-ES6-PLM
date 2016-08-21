(function (module) {
	'use strict';

	module.factory('MockBomRootObj', function () {
		return function () {
			return sinon.stub({
				fetch: function () {},
				extractFieldPropertyIdFromLink: function () {},
				getSelfLink: function () {},
				getItemId: function () {},
				getItemUrn: function () {},
				getDmsId: function () {},
				getWorkspaceId: function () {},
				getConfigDate: function () {},
				getConfigBias: function () {},
				getFields: function () {},
				getOccurancesCount: function () {},
				getAttachmentData: function () {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));
