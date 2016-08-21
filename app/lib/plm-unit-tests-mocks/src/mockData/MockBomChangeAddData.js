'use strict';
/**
 * Mock data for BomChangeAdd
 * item1: a LinkableItem object that gets passed to the BomChangeAdd Constructor
 */
angular.module('plm360.mockData').value('MockBomChangeAddData', {
	item1: {
		"id": "/api/v3/workspaces/8/items/2785",
		"ref": {
			"json": {
				"__self__": "/api/v3/workspaces/8/items/2785",
				"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2785",
				"item": {
					"link": "/api/v3/workspaces/8/items/2785",
					"title": "155-0003-000 - 3/8 X 1 in Long, SHCS Drive",
					"version": "[REV:w]",
					"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2785",
					"permissions": []
				},
				"workspace": {
					"link": "/api/v3/workspaces/8",
					"title": "Items and BOMs",
					"urn": "urn:adsk.plm:tenant.workspace:DEVINDMACHINE.8",
					"permissions": []
				}
			},
			"selected": true,
			"link": "/api/v3/workspaces/8/items/2785",
			"$$hashKey": "object:1183"
		}
	}
});