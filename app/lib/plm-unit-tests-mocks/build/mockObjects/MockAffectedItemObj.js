'use strict';

angular.module('plm360.mockObjects').factory('MockAffectedItemObj', function () {
	return function () {
		return sinon.stub({
			getObject: function () {},
			getSelfLink: function () {},
			getId: function () {},
			getETag: function () {},
			getItemTitle: function () {},
			getWorkspaceId: function () {},
			setLifecycle: function () {},
			getLifecycle: function () {},
			setEffectivity: function () {},
			getEffectivity: function () {},
			setCustomColumnData: function () {},
			getLinkedFieldLink: function () {},
			getLinkedFieldUrn: function () {},
			getLinkedFieldId: function () {},
			getLinkedFieldDataTypeId: function () {},
			save: function () {},
			getItemUrn: function () {},
			delete: function () {}
		});
	};
});
