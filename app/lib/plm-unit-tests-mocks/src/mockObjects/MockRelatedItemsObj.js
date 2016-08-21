'use strict';

angular.module('plm360.mockObjects').factory('MockRelatedItemsObj', function () {
	return function () {
		return sinon.stub({
			getFullList: function () {},
			save: function () {}
		});
	};
});
