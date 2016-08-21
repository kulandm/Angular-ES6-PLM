' use strict ';
// get AVAIBLE COLUMNS from a tableau from an specific workspace
angular.module('plm360.mockData').value('MockWorkspacesTableauAvaibleColumnsData',[
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/FILE_SIZE",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.FILE_SIZE",
			"title": "File Size",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/PROGRAM_MANAGER",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.PROGRAM_MANAGER",
			"title": "Program Manager",
			"type": {
				"link": "/api/v3/field-types/14",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.14",
				"title": "Pick List (With search filter)",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/WF_HIST_COMMENTS",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WF_HIST_COMMENTS",
			"title": "Action Comments",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "WORKFLOW_HISTORY_FIELD",
			"name": "Workflow Actions",
			"section": 11
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/MECHANICAL_LEAD",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.MECHANICAL_LEAD",
			"title": "Mechanical Lead",
			"type": {
				"link": "/api/v3/field-types/14",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.14",
				"title": "Pick List (With search filter)",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/MILESTONE_STATUS",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.MILESTONE_STATUS",
			"title": "Status",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/LAST_MODIFIED_BY",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.LAST_MODIFIED_BY",
			"title": "Last Modified by",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "LOG_FIELD",
			"name": "Owner and Change Summary",
			"section": 3
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/QUANTITY",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.QUANTITY",
			"title": "Quantity",
			"type": {
				"link": "/api/v3/field-types/2",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.2",
				"title": "Floating Point",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "BOM_FIELD",
			"name": "Bill of Materials",
			"section": 6
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/WF_HIST_TIMESTAMP",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WF_HIST_TIMESTAMP",
			"title": "Date of Action",
			"type": {
				"link": "/api/v3/field-types/17",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.17",
				"title": "Date and Time",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "WORKFLOW_HISTORY_FIELD",
			"name": "Workflow Actions",
			"section": 11
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.earlier_than",
			"name": "Earlier Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_month",
			"name": "Next Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.later_than",
			"name": "Later Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.this_week",
			"name": "This Week"
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_month",
			"name": "Last Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_in_the_next_number_of_days",
			"name": "Is in the Next NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ltt+nod",
			"name": "Later Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_week",
			"name": "Last Week"
		},
		{
			"label": "report.filter.type.this_month",
			"name": "This Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.next_year",
			"name": "Next Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ett+nod",
			"name": "Earlier Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_week",
			"name": "Next Week"
		},
		{
			"label": "report.filter.type.last_year",
			"name": "Last Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_year",
			"name": "This Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.today",
			"name": "Today",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_in_the_last_number_of_days",
			"name": "Is in the Last NUMBER of Days",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/WF_HIST_TRANS",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WF_HIST_TRANS",
			"title": "Workflow Action",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "WORKFLOW_HISTORY_FIELD",
			"name": "Workflow Actions",
			"section": 11
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/CREATED_BY_USERID",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.CREATED_BY_USERID",
			"title": "Created by",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "LOG_FIELD",
			"name": "Owner and Change Summary",
			"section": 3
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/LAST_MODIFIED_ON",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.LAST_MODIFIED_ON",
			"title": "Last Modified on",
			"type": {
				"link": "/api/v3/field-types/3",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.3",
				"title": "Date",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "LOG_FIELD",
			"name": "Owner and Change Summary",
			"section": 3
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.earlier_than",
			"name": "Earlier Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_week",
			"name": "Last Week"
		},
		{
			"label": "report.filter.type.is_in_the_last_number_of_days",
			"name": "Is in the Last NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ett+nod",
			"name": "Earlier Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_month",
			"name": "Last Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.next_month",
			"name": "Next Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.today",
			"name": "Today",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.this_month",
			"name": "This Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.next_year",
			"name": "Next Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.later_than",
			"name": "Later Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.this_year",
			"name": "This Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.last_year",
			"name": "Last Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.next_week",
			"name": "Next Week"
		},
		{
			"label": "report.filter.type.this_week",
			"name": "This Week"
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_in_the_next_number_of_days",
			"name": "Is in the Next NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ltt+nod",
			"name": "Later Than Today +/- NUMBER of Days",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/MILESTONE_DATE",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.MILESTONE_DATE",
			"title": "Target Date",
			"type": {
				"link": "/api/v3/field-types/3",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.3",
				"title": "Date",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_in_the_last_number_of_days",
			"name": "Is in the Last NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ett+nod",
			"name": "Earlier Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_week",
			"name": "Next Week"
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_year",
			"name": "Next Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.today",
			"name": "Today",
			"allowValue": false
		},
		{
			"label": "report.filter.type.last_week",
			"name": "Last Week"
		},
		{
			"label": "report.filter.type.this_week",
			"name": "This Week"
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_year",
			"name": "This Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_in_the_next_number_of_days",
			"name": "Is in the Next NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_month",
			"name": "Next Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_month",
			"name": "This Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.later_than",
			"name": "Later Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_month",
			"name": "Last Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.last_year",
			"name": "Last Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ltt+nod",
			"name": "Later Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.earlier_than",
			"name": "Earlier Than",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/IMAGE",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.IMAGE",
			"title": "Image",
			"type": {
				"link": "/api/v3/field-types/15",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.15",
				"title": "Image",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": []
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/DESCRIPTION",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.DESCRIPTION",
			"title": "Description",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "RELATIONSHIP_FIELD",
			"name": "Relationships",
			"section": 8
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/TIMESTAMP",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.TIMESTAMP",
			"title": "Timestamp",
			"type": {
				"link": "/api/v3/field-types/3",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.3",
				"title": "Date",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_in_the_last_number_of_days",
			"name": "Is in the Last NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ett+nod",
			"name": "Earlier Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ltt+nod",
			"name": "Later Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_year",
			"name": "This Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.last_year",
			"name": "Last Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_month",
			"name": "This Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.next_year",
			"name": "Next Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.later_than",
			"name": "Later Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.this_week",
			"name": "This Week"
		},
		{
			"label": "report.filter.type.last_week",
			"name": "Last Week"
		},
		{
			"label": "report.filter.type.next_week",
			"name": "Next Week"
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_in_the_next_number_of_days",
			"name": "Is in the Next NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_month",
			"name": "Next Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.earlier_than",
			"name": "Earlier Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.today",
			"name": "Today",
			"allowValue": false
		},
		{
			"label": "report.filter.type.last_month",
			"name": "Last Month",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/RELATED_ITEM",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.RELATED_ITEM",
			"title": "Related Item",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "RELATIONSHIP_FIELD",
			"name": "Relationships",
			"section": 8
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/WF_HIST_USERID",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WF_HIST_USERID",
			"title": "Action Performed by",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "WORKFLOW_HISTORY_FIELD",
			"name": "Workflow Actions",
			"section": 11
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/FILE_STATUS",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.FILE_STATUS",
			"title": "Attachment Status",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/CAD_FILE_NAME",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.CAD_FILE_NAME",
			"title": "CAD File Name",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Single Line Text",
				"permissions": []
			},
			"value": null,
			"defaultValue": ""
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/FILENAME",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.FILENAME",
			"title": "File Name",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/MARKETING_NAME",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.MARKETING_NAME",
			"title": "Marketing Name",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Single Line Text",
				"permissions": []
			},
			"value": null,
			"defaultValue": ""
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/DESCRIPTOR",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.DESCRIPTOR",
			"title": "Item Descriptor",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ITEM_DESCRIPTOR_FIELD",
			"name": "Item Descriptor",
			"section": 15
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/NUMBER",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.NUMBER",
			"title": "Number",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Single Line Text",
				"permissions": []
			},
			"value": null,
			"defaultValue": ""
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/ELECTRICAL_LEAD",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.ELECTRICAL_LEAD",
			"title": "Electrical Lead",
			"type": {
				"link": "/api/v3/field-types/14",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.14",
				"title": "Pick List (With search filter)",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/MILESTONE_STATE",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.MILESTONE_STATE",
			"title": "Workflow State",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/WF_HIST_STEP",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WF_HIST_STEP",
			"title": "Workflow Step Number",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "WORKFLOW_HISTORY_FIELD",
			"name": "Workflow Actions",
			"section": 11
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/WARN_THRESHOLD",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WARN_THRESHOLD",
			"title": "Warning days before",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/TYPE_NAME_KEY",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.TYPE_NAME_KEY",
			"title": "Relationship Type",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "RELATIONSHIP_FIELD",
			"name": "Relationships",
			"section": 8
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/PROJECT_NUMBER",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.PROJECT_NUMBER",
			"title": "Project Number",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Single Line Text",
				"permissions": []
			},
			"value": null,
			"defaultValue": ""
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/FILETYPE",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.FILETYPE",
			"title": "File Type",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/MILESTONE_PROGRESS_PERCENT",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.MILESTONE_PROGRESS_PERCENT",
			"title": "Milestone Progress (%)",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/ITEM_NUMBER",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.ITEM_NUMBER",
			"title": "Item Number",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "BOM_FIELD",
			"name": "Bill of Materials",
			"section": 6
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/PLUS_MINUS_DAYS",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.PLUS_MINUS_DAYS",
			"title": "+/- days from Target Date",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/CHECKED_IN_BY",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.CHECKED_IN_BY",
			"title": "Last Checked In by",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/MILESTONE_TYPE",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.MILESTONE_TYPE",
			"title": "Milestone Event",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "MILESTONE_FIELD",
			"name": "Milestones",
			"section": 12
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/TEST",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.TEST",
			"title": "test",
			"type": {
				"link": "/api/v3/field-types/30",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.30",
				"title": "Integer",
				"permissions": []
			},
			"value": null,
			"defaultValue": ""
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": []
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/ENGINEERING_DIRECTOR",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.ENGINEERING_DIRECTOR",
			"title": "Engineering Director",
			"type": {
				"link": "/api/v3/field-types/14",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.14",
				"title": "Pick List (With search filter)",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/SUBASSEMBLY_ITEM",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.SUBASSEMBLY_ITEM",
			"title": "Part/Process",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "BOM_FIELD",
			"name": "Bill of Materials",
			"section": 6
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/CREATED_ON",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.CREATED_ON",
			"title": "Created on",
			"type": {
				"link": "/api/v3/field-types/3",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.3",
				"title": "Date",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "LOG_FIELD",
			"name": "Owner and Change Summary",
			"section": 3
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.next_year",
			"name": "Next Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.last_week",
			"name": "Last Week"
		},
		{
			"label": "report.filter.type.earlier_than",
			"name": "Earlier Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_in_the_last_number_of_days",
			"name": "Is in the Last NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_week",
			"name": "Next Week"
		},
		{
			"label": "report.filter.type.this_month",
			"name": "This Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.today",
			"name": "Today",
			"allowValue": false
		},
		{
			"label": "report.filter.type.is_in_the_next_number_of_days",
			"name": "Is in the Next NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_month",
			"name": "Last Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_week",
			"name": "This Week"
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.this_year",
			"name": "This Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.later_than",
			"name": "Later Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.next_month",
			"name": "Next Month",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ltt+nod",
			"name": "Later Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.last_year",
			"name": "Last Year",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ett+nod",
			"name": "Earlier Than Today +/- NUMBER of Days",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/VERSION",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.VERSION",
			"title": "Version",
			"type": {
				"link": "/api/v3/field-types/1",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.1",
				"title": "Integer",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.greater_than",
			"name": "Greater Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.equal_to",
			"name": "Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.less_than",
			"name": "Less Than",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_equal_to",
			"name": "Not Equal To",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/OWNER_USERID",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.OWNER_USERID",
			"title": "Owner",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "LOG_FIELD",
			"name": "Owner and Change Summary",
			"section": 3
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/1/fields/SKU",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.1.SKU",
			"title": "SKU",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Single Line Text",
				"permissions": []
			},
			"value": null,
			"defaultValue": ""
		},
		"group": {
			"label": "ITEM_DETAILS_FIELD",
			"name": "Item Details",
			"section": 0
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		}
		]
	},
	{
		"field": {
			"__self__": "/api/v3/workspaces/47/views/0/fields/RESOURCE_NAME",
			"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.RESOURCE_NAME",
			"title": "Attachment Title",
			"type": {
				"link": "/api/v3/field-types/4",
				"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
				"title": "Alpha Numeric",
				"permissions": []
			},
			"value": null
		},
		"group": {
			"label": "ATTACHMENT_FIELD",
			"name": "Attachments",
			"section": 4
		},
		"applicableFilters": [
		{
			"label": "report.filter.type.is_blank",
			"name": "Is Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.ends_with",
			"name": "Ends With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.starts_with",
			"name": "Starts With",
			"allowValue": true
		},
		{
			"label": "report.filter.type.not_blank",
			"name": "Not Blank",
			"allowValue": false
		},
		{
			"label": "report.filter.type.contains",
			"name": "Contains",
			"allowValue": true
		},
		{
			"label": "report.filter.type.does_not_contain",
			"name": "Does Not Contain",
			"allowValue": true
		},
		{
			"label": "report.filter.type.is",
			"name": "Is",
			"allowValue": true
		}
		]
	}
]);
