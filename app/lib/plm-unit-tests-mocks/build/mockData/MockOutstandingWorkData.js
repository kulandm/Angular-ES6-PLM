'use strict';

/**
 * INFO:
 * Related data mocks: MockMOWItemData, MockMilestonesData.
 * All this is used in modelSpecs/OutstandingWorkSpec
 */

angular.module('plm360.mockData').value('MockOutstandingWorkData', {
	"__self__" : "/api/v3/users/PLMAutoTest/outstanding-work",
	"outstandingWork" : [ {
		"inboxItem" : {
			"__self__" : "/api/v3/inbox-items/190",
			"urn" : "urn:adsk.plm:tenant.inbox-item:SELENIUM1001.190",
			"created" : "2015-06-18T15:37:05.178-03:00",
			"escalated" : false,
			"delegated" : false,
			"user" : {
				"link" : "/api/v3/users/PLMAutoTest",
				"title" : "PLMAutoTest Selenium1",
				"urn" : "urn:adsk.plm:tenant.user:SELENIUM1001.PLMAutoTest",
				"permissions" : [ ]
			},
			"userInitiatedBy" : {
				"link" : "/api/v3/users/PLMAutoTest",
				"title" : "PLMAutoTest Selenium1",
				"urn" : "urn:adsk.plm:tenant.user:SELENIUM1001.PLMAutoTest",
				"permissions" : [ ]
			},
			"workspace": {
				id: "7",
				link: "",
				title: "",
			},
			"item" : {
				"link" : "/api/v3/workspaces/7/items/4611",
				"title" : "Item-M",
				"urn" : "urn:adsk.plm:tenant.workspace.item:SELENIUM1001.7.4611",
				"permissions" : [ ]
			},
			"messageType" : {
				"link" : "/api/v3/inbox-item-message-types/3",
				"title" : "Item transition occurred",
				"urn" : "urn:adsk.plm:tenant.inbox-item-message-types:SELENIUM1001.3",
				"permissions" : [ ]
			},
			"message" : "Item-M: Workflow action Transition 1 was performed by PLMAutoTest Selenium1."
		},
		"lastHistoryStep" : {
			"__self__" : "/api/v3/workspaces/7/items/4611/workflow-history-steps/1",
			"urn" : "urn:adsk.plm:tenant.workspace.item.workflow-history-step:SELENIUM1001.7.4611.1",
			"created" : "2015-06-18T15:37:01.994-03:00",
			"user" : {
				"link" : "/api/v3/users/PLMAutoTest",
				"title" : "PLMAutoTest Selenium1",
				"urn" : "urn:adsk.plm:tenant.user:SELENIUM1001.PLMAutoTest",
				"permissions" : [ ]
			},
			"actualUser" : {
				"link" : "/api/v3/users/PLMAutoTest",
				"title" : "PLMAutoTest Selenium1",
				"urn" : "urn:adsk.plm:tenant.user:SELENIUM1001.PLMAutoTest",
				"permissions" : [ ]
			},
			"actionInvoker" : "USER",
			"workflowTransition" : {
				"link" : "/api/v3/workspaces/7/workflows/0/transitions/1",
				"title" : "Transition 1",
				"urn" : "urn:adsk.plm:tenant.workspace.workflow.transition:SELENIUM1001.7.0.1",
				"permissions" : [ ]
			},
			"comments" : ""
		}
	} ]
});