(function (module) {
	'use strict';

	module.factory('MockBomNestedObj', function () {
		return function () {
			return sinon.stub({
				fetch: function () {},
				extractBomItemIdsFromLink: function () {},
				getSelfLink: function () {},
				getBomItems: function () {},
				getBomMetaObj: function () {},
				getBomConfigObj: function () {},
				find: function () {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));