'use strict';

angular.module('plm360.mockObjects').factory('MockRoamerService', function () {
	return function () {
		return sinon.stub({
			addBranchToParent: function () {},
			getBomRelatedItems: function () {},
			getBranchFromCollection: function () {},
			register: function () {},
			truncate: function () {},
			getTabNames: function () {}
		});
	};
});