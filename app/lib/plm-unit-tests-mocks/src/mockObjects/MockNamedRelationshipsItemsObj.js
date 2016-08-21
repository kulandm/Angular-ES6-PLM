'use strict';

angular.module('plm360.mockObjects').factory('MockNamedRelationshipsItemsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	};
});