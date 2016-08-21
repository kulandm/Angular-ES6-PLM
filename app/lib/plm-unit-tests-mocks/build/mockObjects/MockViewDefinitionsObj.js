(function (module) {
	'use strict';

	module.factory('MockViewDefinitionsObj', () => {
		return () => {
			return sinon.stub({
				fetch: () => {},
				getLink: () => {},
				getUrn: () => {},
				getCount: () => {},
				getViews: () => {},
				getDefaultView: () => {},
				find: () => {},
				buildViewStorageKey: () => {},
				loadViews: () => {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));
