(function (module) {
	'use strict';

	/**
	 * Mock Data Sets Available
	 * basicData - A basic set of mock data - workspace 8, item 2887 of DevIndMachineTest Tenant
	 *
	 */
	module.value('MockBomRootData', {
		basicData: {
			"__self__" : "/api/v3/workspaces/8/items/2887/bom",
			"description" : "600-0001-000 - SBOM Project 621 Head [REV:C]",
			"revision" : "C",
			"lifecycle" : "Production",
			"unitCost" : 0.0,
			"attachmentsData" : {
				"attachments" : "http://daniels-mbp.ads.autodesk.com/api/rest/v1/workspaces/8/items/2887/attachments",
				"count" : "1"
			},
			"occurancesCount" : 66,
			"fields" : [ {
				"__self__" : "/api/v3/workspaces/8/items/2887/bom/fields/UNIT_OF_MEASURE",
				"urn" : "urn:adsk.plm:tenant.workspace.item.field:DEVINDMACHINE1003.8.2887.UNIT_OF_MEASURE",
				"value" : "1",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/7",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.7",
					"permissions" : [ ]
				}
			}, {
				"__self__" : "/api/v3/workspaces/8/items/2887/bom/fields/DESCRIPTOR",
				"urn" : "urn:adsk.plm:tenant.workspace.item.field:DEVINDMACHINE1003.8.2887.DESCRIPTOR",
				"value" : "600-0001-000 - SBOM Project 621 Head [REV:C]",
				"metaData" : {
					"link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/1",
					"urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.1",
					"permissions" : [ ]
				}
			}],
			"configData" : {
				"bomViewDate" : "2016-03-15",
				"viewDef" : {
					"link" : "/api/rest/v1/workspaces/8/viewdefs/1",
					"title" : "Default View",
					"urn" : "urn:adsk.plm:tenant.workspace.viewdefs:DEVINDMACHINE1003.8.1",
					"permissions" : [ ]
				},
				"bias" : "release"
			},
			"attachmentData" : {
				"count" : "1",
				"workspaceId" : "8",
				"itemId" : "2708",
				"itemUrn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2708"
			},
			"item": {
				"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2708"
			}
		}
	});
}(angular.module('plm360.mockData')));
