'use strict';

angular.module('plm360.mockObjects').factory('MockBulkBomObj', function () {
	return function () {
		return sinon.stub({
			getSelfLink: function () {},
			getConfiguration: function () {},
			getConfigDate: function () {},
			getConfigBias: function () {},
			getNodes: function () {},
			getEdges: function () {},
			getRootNodeId: function () {},
			getDmsId: function () {},
			fetch: function () {},
		});
	}
});
