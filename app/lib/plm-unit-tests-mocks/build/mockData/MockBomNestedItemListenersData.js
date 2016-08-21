(function (module) {
	'use strict';

	/**
	 * Mock Data Sets Available
	 * basicData - A basic set of mock data
	 *
	 */
	module.value('MockBomNestedItemListenersData', {
		getData: {
			link: 'api/v3/workspaces/47/items/2694/bom-items/138',
			params: {
				'effectiveDate': '2015-12-01',
				'revisionBias': 'release',
				'viewDefId': '2'
			},
			response: {
				data: "Some response Data"
			}
		},
		addData: {
			link: 'api/v3/workspaces/47/items/2694/bom-items',
			nestedItem: {
				"__self__":"/api/v3/workspaces/8/items/2776",
				"urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2776",
				"description":"",
				"item":{
					"link":"/api/v3/workspaces/8/items/2776",
					"title":"162-0001-000 - FITTING Coupling Class 125 4\" to 1\" ,",
					"version":"[REV:w]",
					"urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2776",
					"permissions":[

					]
				},
				"depth":0,
				"itemNumber":"",
				"quantity":1,
				"isUsingDefaultQuote":false,
				"isPinned":false,
				"children":[

				],
				"attachmentsData":null,
				"fields":[

				],
				"json":{
					"__self__":"/api/v3/workspaces/8/items/2776",
					"urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2776",
					"item":{
						"link":"/api/v3/workspaces/8/items/2776",
						"title":"162-0001-000 - FITTING Coupling Class 125 4\" to 1\" ,",
						"version":"[REV:w]",
						"urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2776",
						"permissions":[

						]
					},
					"workspace":{
						"link":"/api/v3/workspaces/8",
						"title":"Items and BOMs",
						"urn":"urn:adsk.plm:tenant.workspace:DEVINDMACHINE1002.8",
						"permissions":[

						]
					}
				}
			},
			configuration: {
				'effectiveDate': '2015-12-01',
				'revisionBias': 'release',
				'viewDefId': '2'
			},
			response: {
				location: 'http://daniels-mbp.ads.autodesk.com/api/v3/workspaces/47/items/2694/bom-items/138'
			},
			error: [
				// Not actually an error that should correspond to this payload
				{
					"code": "errors.maxlength",
					"arguments": [
						"Text box alpha-numeric",
						"50"
					],
					"field": {
						"__self__": "/api/v3/workspaces/9/views/5/fields/TEXT_BOX_ALPHA",
						"urn": "urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_ALPHA",
						"title": "Text box alpha-numeric",
						"type": {
							"link": "/api/v3/field-types/4",
							"title": "Single Line Text",
							"urn": "urn:adsk.plm:tenant.field-type:SELENIUM.4",
							"permissions": []
						},
						"value": "some text way too loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong"
					}
				}
			]
		},
		saveData: {
		    "json": {
				"fields":[
			        {
			            "__self__":"/api/v3/workspaces/8/items/2697/bom-items/346/fields/WEIGHT_TOTAL",
			            "value":"1.1",
			            "fieldId":"WEIGHT_TOTAL",
			            "fieldTab":"CUSTOM_BOM"
			        }
			    ],
			    "quantity":"2.0",
			    "__self__":"/api/v3/workspaces/8/items/2909/bom-items/346"
			},
			"error": {
				text: 'this is an error'
			}
		},
		deleteData: {
			"json": {
				"__self__":"/api/v3/workspaces/8/items/2909/bom-items/346"
			},
			"error": {
				text: 'this is an delete error'
			}
		}
	});
}(angular.module('plm360.mockData')));
