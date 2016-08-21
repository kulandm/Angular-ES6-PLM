'use strict';

angular.module('plm360.mockData').value('MockViewRelationshipsData', [
	{
		"item": {
			"link": "/api/v3/workspaces/9/items/2846",
			"title": "CO000002 - Change Valve Fitting - 3 - High",
			"urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.9.2846"
		},
		"workspace": {
			"link": "/api/v3/workspaces/9",
			"title": "Change Orders"
		},
		"state": {
			"link": "/api/v3/workspaces/9/workflows/1/states/146",
			"title": "Route Change & Lock Items"
		},
		"direction": {
			"type": "Uni-Directional"
		},
		"description": "",
		"__self__": "/api/v3/workspaces/47/items/2694/views/10/relationships/2846"
	},
	{
		"item": {
			"link": "/api/v3/workspaces/48/items/2858",
			"title": "QIP000001 - 163-0000-000 - VALVE BALL 1/2\" Female-Female Threaded ,	REV:A - Incoming Materials",
			"urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.48.2858"
		},
		"workspace": {
			"link": "/api/v3/workspaces/48",
			"title": "Quality Inspection Plan"
		},
		"state": {
			"link": "/api/v3/workspaces/48/workflows/1/states/139",
			"title": "In Use"
		},
		"direction": {
			"type": "Uni-Directional"
		},
		"description": "",
		"__self__": "/api/v3/workspaces/47/items/2694/views/10/relationships/2858"
	},
	{
		"item": {
			"link": "/api/v3/workspaces/9/items/2861",
			"title": "CO000004 - Update Project 622 Base to Protect Piping - 1 - Low",
			"urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.9.2861"
		},
		"workspace": {
			"link": "/api/v3/workspaces/9",
			"title": "Change Orders"
		},
		"state": {
			"link": "/api/v3/workspaces/9/workflows/1/states/146",
			"title": "Route Change & Lock Items"
		},
		"direction": {
			"type": "Uni-Directional"
		},
		"description": "",
		"__self__": "/api/v3/workspaces/47/items/2694/views/10/relationships/2861"
	}
]);
