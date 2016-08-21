(function (module) {
	'use strict';

	module.factory('MockViewDefinitionObj', () => {
		return () => {
			return sinon.stub({
				fetch: () => {},
				getLink: () => {},
				getUrn: () => {},
				getTitle: () => {},
				isDefaultView: () => {},
				getId: () => {},
				getField: () => {},
				getFields: () => {},
				getFieldsMap: () => {},
				getEdgeFields: () => {},
				getNodeFields: () => {},
				loadFields: () => {},
				hasAttachmentField: () => {},
				getFieldWithSemantics: () => {}
			});
		};
	});
}(angular.module('plm360.mockObjects')));
