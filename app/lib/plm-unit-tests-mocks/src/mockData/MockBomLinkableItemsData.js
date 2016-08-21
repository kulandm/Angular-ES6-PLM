(function (module) {
	'use strict';

	/**
	 * Mock Data Sets Available
	 * itemLists - List of lists of mock item data returned by the AddLinkableItems Controller,
	 *	specifically those filtered by the Items and Boms workspace
	 * itemLists[0]:
	 *	Workspace 8, item 2785
	 *	Workspace 8, item 2786
	 *	Workspace 8, item 2788
	 * itemLists[1]:
	 *	Workspace 8, item 2789
	 */
	module.value('MockBomLinkableItemsData', {
		itemLists: [
			[
				{
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
								"permissions": [

								]
							},
							"workspace": {
								"link": "/api/v3/workspaces/8",
								"title": "Items and BOMs",
								"urn": "urn:adsk.plm:tenant.workspace:DEVINDMACHINE.8",
								"permissions": [

								]
							}
						},
						"selected": true,
						"link": "/api/v3/workspaces/8/items/2785",
						"$$hashKey": "object:1183"
					}
				},
				{
					"id": "/api/v3/workspaces/8/items/2786",
					"ref": {
						"json": {
							"__self__": "/api/v3/workspaces/8/items/2786",
							"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2786",
							"item": {
								"link": "/api/v3/workspaces/8/items/2786",
								"title": "155-0004-000 - 5/16 X 1 in Long, SHCS Drive,",
								"version": "[REV:w]",
								"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2786",
								"permissions": [

								]
							},
							"workspace": {
								"link": "/api/v3/workspaces/8",
								"title": "Items and BOMs",
								"urn": "urn:adsk.plm:tenant.workspace:DEVINDMACHINE.8",
								"permissions": [

								]
							}
						},
						"selected": true,
						"link": "/api/v3/workspaces/8/items/2786",
						"$$hashKey": "object:1184"
					}
				},
				{
					"id": "/api/v3/workspaces/8/items/2788",
					"ref": {
						"json": {
							"__self__": "/api/v3/workspaces/8/items/2788",
							"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2788",
							"item": {
								"link": "/api/v3/workspaces/8/items/2788",
								"title": "306-0000-000 - Laser Sensor ,",
								"version": "[REV:w]",
								"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2788",
								"permissions": [

								]
							},
							"workspace": {
								"link": "/api/v3/workspaces/8",
								"title": "Items and BOMs",
								"urn": "urn:adsk.plm:tenant.workspace:DEVINDMACHINE.8",
								"permissions": [

								]
							}
						},
						"selected": true,
						"link": "/api/v3/workspaces/8/items/2788",
						"$$hashKey": "object:1186"
					}
				}
			],

			[
				{
					"id": "/api/v3/workspaces/8/items/2789",
					"ref": {
						"json": {
							"__self__": "/api/v3/workspaces/8/items/2789",
							"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2789",
							"item": {
								"link": "/api/v3/workspaces/8/items/2789",
								"title": "402-0000-000 - Laser Mount LM011752 Single Part 101",
								"version": "[REV:w]",
								"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2789",
								"permissions": [

								]
							},
							"workspace": {
								"link": "/api/v3/workspaces/8",
								"title": "Items and BOMs",
								"urn": "urn:adsk.plm:tenant.workspace:DEVINDMACHINE.8",
								"permissions": [

								]
							}
						},
						"selected": true,
						"link": "/api/v3/workspaces/8/items/2789",
						"$$hashKey": "object:1693"
					}
				}
			]
		]

	});
}(angular.module('plm360.mockData')));