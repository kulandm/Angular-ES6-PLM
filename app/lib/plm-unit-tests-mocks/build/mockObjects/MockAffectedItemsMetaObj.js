'use strict';

angular.module('plm360.mockObjects').factory('MockAffectedItemsMetaObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			getFieldId: function () {},
			getDataTypeId: function () {},
			getPicklistPayload: function () {}
		});
	};
});
