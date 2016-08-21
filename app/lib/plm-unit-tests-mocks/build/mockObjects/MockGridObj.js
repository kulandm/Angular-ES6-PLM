'use strict';

angular.module('plm360.mockObjects').factory('MockGridObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			save: function () {}
		});
	}
});