'use strict';

angular.module('plm360.mockObjects').factory('MockBomGraphBuilderObj', () => {
	return () => {
		return sinon.stub({
			buildRootNode: () => {},
			buildEdgeForBomNestedItem: () => {},
      buildNodeForBomNestedItem: () => {},
      addEdgeNodeToGraph: () => {},
      buildEdgeForBulkBom: () => {},
      addEdgesToGraph: () => {},
			buildNodeForBulkBom: () => {},
			addNodesToGraph: () => {},
      addOutEdgeToParentNode: () => {},
      addFields: () => {},
      buildBomFields: () => {},
      extractFieldValues: () => {},
      buildFieldsForViewDefFields: () => {}
		});
	};
});
