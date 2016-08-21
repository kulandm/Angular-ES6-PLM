(function (module) {
	'use strict';

	/**
	 * Mock Data Sets Available
	 * basicData - A basic set of mock data
	 *
	 */
	module.value('MockBomNestedItemData', {
		basicData: {
			"__self__" : "/api/v3/workspaces/8/items/2887/bom-items/241",
			"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item:DEVINDMACHINE1003.8.2887.241",
			"description" : "680-0000-000 - SBOM Mech Upper Bushing [REV:B]",
			"item" : {
				"link" : "/api/v3/workspaces/8/items/2795",
				"title" : "680-0000-000 - SBOM Mech Upper Bushing",
				"version" : "B",
				"urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2795",
				"permissions" : [ ]
			},
			"depth" : 1,
			"itemNumber" : 1,
			"quantity" : 2.0,
			"isUsingDefaultQuote" : false,
			"isPinned" : false,
			"attachmentData" : {
				"count" : "1",
				"workspaceId" : "8",
				"itemId" : "2795"
			},
			"fields" : [ {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/UNIT_OF_MEASURE",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.UNIT_OF_MEASURE",
				"value" : "1",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/7",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.7",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/PIN",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.PIN",
				"value" : "false",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/3",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.3",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/QUANTITY",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.QUANTITY",
				"value" : "2.0",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/6",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.6",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/DESCRIPTOR",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.DESCRIPTOR",
				"value" : "680-0000-000 - SBOM Mech Upper Bushing [REV:B]",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/1",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.1",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/REVISION",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.REVISION",
				"value" : "B",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/2",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.2",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/TOTAL_COST",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.TOTAL_COST",
				"value" : "51.34",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/11",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.11",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/UNIT_COST",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.UNIT_COST",
				"value" : "25.67",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/10",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.10",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2795/bom-items/241/fields/LIFECYCLE",
				"urn" : "urn:adsk.plm:tenant.workspace.item.bom-item.field:DEVINDMACHINE1003.8.2795.241.LIFECYCLE",
				"value" : "Production",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/5",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.5",
					"permissions" : [ ]
				}
			} ],
			"children" : [ {
				"link" : "/api/v3/workspaces/8/items/2708/bom-items",
				"title" : "155-0003-000 - 3/8 X 1 in Long, SHCS Drive",
				"version" : "A",
				"permissions" : [ ]
			}, {
				"link" : "/api/v3/workspaces/8/items/2713/bom-items",
				"title" : "156-0000-000 - WASHER LOCK 1/2\"",
				"version" : "A",
				"permissions" : [ ]
			}, {
				"link" : "/api/v3/workspaces/8/items/2719/bom-items",
				"title" : "156-0002-000 - Helical Spring Lock Washer ANSI/ASME B18.21.1 - 1/2 Hi-Collar. Carbon Steel",
				"version" : "A",
				"permissions" : [ ]
			}, {
				"link" : "/api/v3/workspaces/8/items/2720/bom-items",
				"title" : "155-0005-000 - 1/2\" X 2 in Long, SHCS Drive,",
				"version" : "A",
				"permissions" : [ ]
			}, {
				"link" : "/api/v3/workspaces/8/items/2721/bom-items",
				"title" : "401-0003-000 - UPPER GUIDE",
				"version" : "A",
				"permissions" : [ ]
			}, {
				"link" : "/api/v3/workspaces/8/items/2722/bom-items",
				"title" : "158-0000-000 - BORE SEAL ,",
				"version" : "A",
				"permissions" : [ ]
			}, {
				"link" : "/api/v3/workspaces/8/items/2723/bom-items",
				"title" : "159-0000-000 - THOMSON BALL BUSHING - 1\" BORE ,",
				"version" : "A",
				"permissions" : [ ]
			} ],
			"attachmentsData" : {
				"attachments" : "http://daniels-mbp.ads.autodesk.com/api/rest/v1/workspaces/8/items/2795/attachments",
				"count" : "1",
				"itemUrn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2795"
			}
		}
	});
}(angular.module('plm360.mockData')));
