'use strict';

/**
 * INFO:
 * This data is used in modelSpecs/OutstandingWorkSpec tests.
 * Related data mocks: MockOutstandingWorkData, MockMilestonesData.
 * It retrieves the data for an item in the MOW list (MockOutstandingWorkData), its workspace and
 * the link for retrieving its milestones in a new request (MockMilestonesData).
 */

angular.module('plm360.mockData').value('MockMOWItemData', {
	"__self__": "/api/v3/workspaces/7/items/4611",
	"urn": "urn:adsk.plm:tenant.workspace.item:SELENIUM1001.7.4611",
	"workspace": {
		"link": "/api/v3/workspaces/7",
		"title": "Selenium Suite - Controlled",
		"urn": "urn:adsk.plm:tenant.workspace:SELENIUM1001.7",
		"permissions": []
	},
	"root": {
		"link": "/api/v3/workspaces/7/items/4611",
		"title": "Item-M",
		"urn": "urn:adsk.plm:tenant.workspace.item:SELENIUM1001.7.4611",
		"permissions": []
	},
	"title": "Item-M",
	"deleted": false,
	"latestRelease": true,
	"workingVersion": true,
	"itemLocked": false,
	"workflowReference": false,
	"workingHasChanged": false,
	"currentState": {
		"link": "/api/v3/workspaces/7/workflows/1/states/1",
		"title": "State A",
		"urn": "urn:adsk.plm:tenant.workspace.workflow.state:SELENIUM1001.7.1.1",
		"permissions": []
	},
	"lifecycle": {
		"link": "/api/v3/workflows/9223372036854775807/states/0",
		"title": "Unreleased",
		"urn": "urn:adsk.plm:tenant.workflow.state:SELENIUM1001.9223372036854775807.0",
		"permissions": []
	},
	"bom": {
		"link": "/api/v3/workspaces/7/items/4611/bom",
		"permissions": []
	},
	"nestedBom": {
		"link": "/api/v3/workspaces/7/items/4611/bom-items",
		"count": 0,
		"permissions": []
	},
	"whereUsed": {
		"link": "/api/v3/workspaces/7/items/4611/where-used",
		"count": {
			"value": 0,
			"type": "EXACT"
		}
	},
	"sections": [
		{
			"link": "/api/v3/workspaces/7/items/4611/views/1/sections/2",
			"title": "SELENIUM SECTION",
			"fields": [
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/NAME",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.NAME",
					"title": "Name",
					"type": {
						"link": "/api/v3/field-types/4",
						"title": "Single Line Text",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.4",
						"permissions": []
					},
					"value": "Item-M"
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/TEXT_INPUT",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.TEXT_INPUT",
					"title": "Text Input",
					"type": {
						"link": "/api/v3/field-types/4",
						"title": "Single Line Text",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.4",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/TEXT_AREA",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.TEXT_AREA",
					"title": "Text Area",
					"type": {
						"link": "/api/v3/field-types/17",
						"title": "Paragraph w/o Line Breaks",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.17",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/SELECT_LIST",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.SELECT_LIST",
					"title": "Select List",
					"type": {
						"link": "/api/v3/field-types/6",
						"title": "Pick List (Show first value as default)",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.6",
						"permissions": []
					},
					"value": {
						"link": "/api/v3/lookups/CUSTOM_LOOKUP_SELECT_LIST/options/0",
						"title": "-- Select --",
						"urn": "urn:adsk.plm:tenant.lookup.option:SELENIUM1001.CUSTOM_LOOKUP_SELECT_LIST.0",
						"permissions": []
					}
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/CHECKBOX",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.CHECKBOX",
					"title": "Checbox",
					"type": {
						"link": "/api/v3/field-types/9",
						"title": "Check Box",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.9",
						"permissions": []
					},
					"value": "false",
					"defaultValue": "false"
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/RADIO_BUTTON",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.RADIO_BUTTON",
					"title": "Radio Button",
					"type": {
						"link": "/api/v3/field-types/10",
						"title": "Radio Button",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.10",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/PLAIN_TEXT",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.PLAIN_TEXT",
					"title": "Plain Text",
					"type": {
						"link": "/api/v3/field-types/11",
						"title": "Auto Number",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.11",
						"permissions": []
					},
					"value": "1095"
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/IMAGE",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.IMAGE",
					"title": "Image",
					"type": {
						"link": "/api/v3/field-types/15",
						"title": "Image",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.15",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/MULTI_SELECT",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.MULTI_SELECT",
					"title": "Multi Select",
					"type": {
						"link": "/api/v3/field-types/13",
						"title": "Multiple Selection",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.13",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/EMAIL",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.EMAIL",
					"title": "Email",
					"type": {
						"link": "/api/v3/field-types/18",
						"title": "Email",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.18",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/URL",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.URL",
					"title": "Url",
					"type": {
						"link": "/api/v3/field-types/16",
						"title": "URL",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.16",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/PICK_LIST_FILTER",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.PICK_LIST_FILTER",
					"title": "Pick List Filter",
					"type": {
						"link": "/api/v3/field-types/14",
						"title": "Pick List (With search filter)",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.14",
						"permissions": []
					},
					"value": null
				},
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/DATE",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.DATE",
					"title": "Date",
					"type": {
						"link": "/api/v3/field-types/3",
						"title": "Date",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.3",
						"permissions": []
					},
					"value": null
				}
			]
		},
		{
			"link": "/api/v3/workspaces/7/items/4611/views/1/sections/7",
			"title": "Uncontrolled Section",
			"fields": [
				{
					"__self__": "/api/v3/workspaces/7/items/4611/views/1/fields/NOTES",
					"urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM1001.7.4611.1.NOTES",
					"title": "Notes",
					"type": {
						"link": "/api/v3/field-types/8",
						"title": "Paragraph",
						"urn": "urn:adsk.plm:tenant.field-type:SELENIUM1001.8",
						"permissions": []
					},
					"value": null,
					"defaultValue": ""
				}
			]
		}
	],
	"milestones": {
		"link": "/api/v3/workspaces/7/items/4611/views/17",
		"permissions": []
	}
});