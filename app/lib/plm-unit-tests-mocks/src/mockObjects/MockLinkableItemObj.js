(function (module) {
	'use strict';

	module.factory('MockLinkableItemObj', function () {
		return function () {
			return sinon.stub({
				removeBaseUrl: function () {},
				getObject: function () {},
				getItemLink: function () {},
				getItemId: function () {},
				getItemTitle: function () {},
				getItemVersion: function () {},
				getWorkspaceTitle:function () {},
				getLifecycleTitle: function () {},
				isLifecycle: function () {},
				isLinkedTo: function () {},
				itemLinkedTo: function () {},
				itemLinkedToId: function () {},
				setSelection: function () {},
				isSelected: function () {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));