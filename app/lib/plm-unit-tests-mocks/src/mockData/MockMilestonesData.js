'use strict';

/**
 * INFO:
 * This data is used in modelSpecs/OutstandingWorkSpec tests.
 * Related data mocks: MockMOWItemData, MockMilestonesData.
 * It retrieves the milestones for the item in mockData/MockMOWItemData.
 */

angular.module('plm360.mockData').value('MockMilestonesData', {
	"__self__" : "/api/v3/workspaces/7/items/4611/views/17",
	"milestones" : [ {
		"__self__" : "/api/v3/workspaces/7/items/4611/views/17/milestones/705",
		"urn" : "urn:adsk.plm:tenant.workspace.item.view.milestone:SELENIUM1001.7.4611.17.705",
		"date" : "2015-06-17",
		"progress" : 33,
		"warnThreshold" : 3,
		"type" : {
			"link" : "/api/v3/milestone-types/ENTER",
			"title" : "Enter state",
			"urn" : "urn:adsk.plm:tenant.milestone-type:SELENIUM1001.ENTER",
			"permissions" : [ ]
		},
		"workflowState" : {
			"link" : "/api/v3/workspaces/7/workflows/1/states/1",
			"title" : "State A",
			"urn" : "urn:adsk.plm:tenant.workspace.workflow.state:SELENIUM1001.7.1.1",
			"permissions" : [ ]
		},
		"item" : {
			"link" : "/api/v3/workspaces/7/items/4611",
			"title" : "Item-M",
			"urn" : "urn:adsk.plm:tenant.workspace.item:SELENIUM1001.7.4611",
			"permissions" : [ ]
		},
		"statusFlag" : "CRITICAL",
		"actualCompleteDate" : "2015-06-18T18:37:01.994+0000"
	}, {
		"__self__" : "/api/v3/workspaces/7/items/4611/views/17/milestones/707",
		"urn" : "urn:adsk.plm:tenant.workspace.item.view.milestone:SELENIUM1001.7.4611.17.707",
		"date" : "2015-06-22",
		"progress" : 44,
		"warnThreshold" : 5,
		"type" : {
			"link" : "/api/v3/milestone-types/EXIT",
			"title" : "Leave state",
			"urn" : "urn:adsk.plm:tenant.milestone-type:SELENIUM1001.EXIT",
			"permissions" : [ ]
		},
		"workflowState" : {
			"link" : "/api/v3/workspaces/7/workflows/1/states/3",
			"title" : "State C",
			"urn" : "urn:adsk.plm:tenant.workspace.workflow.state:SELENIUM1001.7.1.3",
			"permissions" : [ ]
		},
		"item" : {
			"link" : "/api/v3/workspaces/7/items/4611",
			"title" : "Item-M",
			"urn" : "urn:adsk.plm:tenant.workspace.item:SELENIUM1001.7.4611",
			"permissions" : [ ]
		},
		"statusFlag" : "CRITICAL"
	}, {
		"__self__" : "/api/v3/workspaces/7/items/4611/views/17/milestones/706",
		"urn" : "urn:adsk.plm:tenant.workspace.item.view.milestone:SELENIUM1001.7.4611.17.706",
		"date" : "2015-06-24",
		"progress" : 55,
		"warnThreshold" : 3,
		"type" : {
			"link" : "/api/v3/milestone-types/EXIT",
			"title" : "Leave state",
			"urn" : "urn:adsk.plm:tenant.milestone-type:SELENIUM1001.EXIT",
			"permissions" : [ ]
		},
		"workflowState" : {
			"link" : "/api/v3/workspaces/7/workflows/1/states/2",
			"title" : "State B",
			"urn" : "urn:adsk.plm:tenant.workspace.workflow.state:SELENIUM1001.7.1.2",
			"permissions" : [ ]
		},
		"item" : {
			"link" : "/api/v3/workspaces/7/items/4611",
			"title" : "Item-M",
			"urn" : "urn:adsk.plm:tenant.workspace.item:SELENIUM1001.7.4611",
			"permissions" : [ ]
		},
		"statusFlag" : "CRITICAL"
	} ]
});