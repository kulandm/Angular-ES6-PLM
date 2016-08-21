'use strict';

angular.module('plm360.mockObjects').factory('MockViewsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			getDefaultViewId: function () {},
		});
	}
});