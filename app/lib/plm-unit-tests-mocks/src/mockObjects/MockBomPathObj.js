'use strict';

angular.module('plm360.mockObjects').factory('MockBomPathObj', () => {
	return function () {
		return sinon.stub({
			equals: function () {},
			asString: function () {},
            isPathToRoot: function () {},
            getFinalEdge: function () {},
            WithSucceedingPath: function () {},
            WithSucceedingEdges: function () {},
            WithSucceedingEdge: function () {},
            WithPrecedingEdges: function () {},
            WithPrecedingEdge: function () {}
		});
	};
});
