'use strict';

angular.module('plm360.mockObjects').factory('MockNamedRelationshipsItemObj', function () {
	return function () {
		return sinon.stub({
			getItemTitle: function() {},
			getWorkspaceId: function () {},
			getResourceId: function () {},
			getItemDescriptorValue: function () {},
			getItemUrn: function () {}
		});
	};
});