(function (module) {
	'use strict';

	/**
	 * Mock success response that can be returned by the add to Bom endpoint
	 * Mock Data Sets Available
	 * basicData: a basic response to a request
	 
	 *
	 */
	module.value('MockBomAddItemSuccessResponse', {
		basicData: {
			"location": "http://daniels-mbp.ads.autodesk.com/api/v3/workspaces/47/items/2694/bom-items/872",
			"route": "",
			"reqParams": null,
			"fromServer": true,
			"parentResource": {
				"route": "api/v3/workspaces/47/items/2694/bom-items",
				"parentResource": null
			},
			"restangularCollection": false
		}
	});
}(angular.module('plm360.mockData')));