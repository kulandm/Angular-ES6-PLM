(function (module) {
	'use strict';

	module.factory('MockLinkableItemsObj', function () {
		return function () {
			return sinon.stub({
				fetch: function () {},
				getFullList: function () {},
				getTotalCount: function () {},
				isNext: function () {},
				getNextLink: function () {},
				getLength: function () {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));