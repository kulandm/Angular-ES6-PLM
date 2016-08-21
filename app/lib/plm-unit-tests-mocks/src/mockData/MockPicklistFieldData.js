'use strict';

angular.module('plm360.mockData').value('MockPicklistFieldData', {
	data: {
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 20
		},
		options: {
			__self__: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
			first: {
				count: 2,
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
				permissions: [],
				title: "First",
				urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO",
			},
			items: [{
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
				title: "Yes"
			}, {
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/2",
				title: "No"
			}],
			last: {
				count: 2,
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
				permissions: [],
				title: "Last",
				urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO"
			},
			limit: 10,
			offset: 0,
			totalCount: 2,
			urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO"
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.TEST",
		value: {
			link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
			permissions: [],
			title: "Picklist Value",
			urn: "urn:adsk.plm:tenant.lookup.option:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO.1"
		},
		defaultValue: {
			link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/2",
			title: "No",
			urn: "urn:adsk.plm:tenant.lookup.option:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO.2",
			permissions: []
		}
	},
	dataWs: {
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 20
		},
		options: {
			"__self__" : "/api/v3/lookups/CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS?offset=0&limit=25&filter=&filter=",
			"urn" : "urn:adsk.plm:tenant.lookup:DEVINDMACHINEVIEW.CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS",
			"offset" : 0,
			"limit" : 25,
			"totalCount" : 3,
			"first" : {
			 "link" : "/api/v3/lookups/CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS?offset=0&limit=25&filter=&filter=",
			 "title" : "First",
			 "count" : 3,
			 "urn" : "urn:adsk.plm:tenant.lookup:DEVINDMACHINEVIEW.CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS",
			 "permissions" : [ ]
			},
			"last" : {
			 "link" : "/api/v3/lookups/CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS?offset=0&limit=25&filter=&filter=",
			 "title" : "Last",
			 "count" : 3,
			 "urn" : "urn:adsk.plm:tenant.lookup:DEVINDMACHINEVIEW.CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS",
			 "permissions" : [ ]
			},
			"items" : [
				{
				 "link" : "/api/v3/workspaces/64/items/7372",
				 "title" : "Change Orders - Mechanical - CCB",
				 "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.7372",
				 "permissions" : [ ]
				}, {
				 "link" : "/api/v3/workspaces/64/items/7371",
				 "title" : "Change Orders - Mechanical - Fast Track",
				 "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.7371",
				 "permissions" : [ ]
				}, {
				 "link" : "/api/v3/workspaces/64/items/7373",
				 "title" : "Change Request - Mechanical - Fast Track",
				 "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.7373",
				 "permissions" : [ ]
				}
			]
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.TEST",
		value: {
			"link" : "/api/v3/workspaces/64/items/9999",
			"title" : "Change Request - Mechanical - Slow Track",
			"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.9999"
		},
		defaultValue: null
	},
	dataWsRev: {
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 20
		},
		options: {
			"__self__" : "/api/v3/lookups/CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS?offset=0&limit=25&filter=&filter=",
			"urn" : "urn:adsk.plm:tenant.lookup:DEVINDMACHINEVIEW.CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS",
			"offset" : 0,
			"limit" : 25,
			"totalCount" : 3,
			"first" : {
			 "link" : "/api/v3/lookups/CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS?offset=0&limit=25&filter=&filter=",
			 "title" : "First",
			 "count" : 3,
			 "urn" : "urn:adsk.plm:tenant.lookup:DEVINDMACHINEVIEW.CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS",
			 "permissions" : [ ]
			},
			"last" : {
			 "link" : "/api/v3/lookups/CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS?offset=0&limit=25&filter=&filter=",
			 "title" : "Last",
			 "count" : 3,
			 "urn" : "urn:adsk.plm:tenant.lookup:DEVINDMACHINEVIEW.CUSTOM_LOOKUP_WS_APPROVAL_BOARD_CHANGE_ORDERS",
			 "permissions" : [ ]
			},
			"items" : [
				{
				 "link" : "/api/v3/workspaces/64/items/7372",
				 "title" : "Change Orders - Mechanical - CCB",
				 "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.7372",
				 "permissions" : [ ],
				 "version" : "[REV:A]"
				}, {
				 "deleted" : true,
				 "link" : "/api/v3/workspaces/64/items/7371",
				 "title" : "Change Orders - Mechanical - Fast Track",
				 "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.7371",
				 "permissions" : [ ]
				}, {
				 "link" : "/api/v3/workspaces/64/items/7373",
				 "title" : "Change Request - Mechanical - Fast Track",
				 "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.7373",
				 "permissions" : [ ],
				 "version" : "[REV:B]"
				}
			]
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.TEST",
		value: {
			"deleted" : true,			
			"link" : "/api/v3/workspaces/64/items/9999",
			"title" : "Change Request - Mechanical - Slow Track",
			"urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.64.9999",
			"version" : "[REV:C]"			
		},
		defaultValue: null
	},
	meta: {
		derived: false,
		description: "",
		displayLength: null,
		displayOrder: 1,
		editability: "ALWAYS",
		fieldLength: null,
		fieldPrecision: null,
		label: null,
		name: "testWs",
		picklist: "/api/v3/picklists/CUSTOM_LOOKUP_YES_NO",
		picklistFieldDefinition: null,
		type: {
			link: "/api/v3/field-types/20",
			permissions: [],
			title: "Picklist",
			urn: "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.10"
		},
		unitOfMeasure: null,
		validators: null,
		visibility: "ALWAYS",
		visibleOnPreview: false
	}
});
