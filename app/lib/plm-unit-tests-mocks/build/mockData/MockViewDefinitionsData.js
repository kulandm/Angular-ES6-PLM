(function (module) {
	'use strict';

	/**
	 * basicData - simple set of data.
	 */
	module.value('MockViewDefinitionsData', {
		basicData: {
			"__self__" : {
				"link" : "/api/v3/workspaces/8/views/5",
				"permissions" : []
			},
			"count" : 2,
			"bomViews" : [{
				"link" : "/api/v3/workspaces/8/views/5/viewdef/1",
				"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef:DEVINDMACHINE1003.8.5.1",
				"permissions" : []
			}, {
				"link" : "/api/v3/workspaces/8/views/5/viewdef/3",
				"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef:DEVINDMACHINE1003.8.5.3",
				"permissions" : []
			}]
		}
	});
}(angular.module('plm360.mockData')));
