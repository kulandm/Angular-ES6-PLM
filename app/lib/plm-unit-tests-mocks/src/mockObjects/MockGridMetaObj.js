'use strict';

angular.module('plm360.mockObjects').factory('MockGridMetaObj', function () {
	return function () {
		return sinon.stub({
			fetchFieldDefinitions: function () {},
			getFullList: function () {}
		});
	}
});