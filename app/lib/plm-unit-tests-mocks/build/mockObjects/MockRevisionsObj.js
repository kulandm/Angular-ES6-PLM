'use strict';

angular.module('plm360.mockObjects').factory('MockRevisionsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {}
		});
	};
});