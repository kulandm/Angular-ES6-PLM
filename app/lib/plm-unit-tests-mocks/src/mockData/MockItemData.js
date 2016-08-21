'use strict';

/**
 * Mock Data Sets Available
 * basicData - A basic set of mock data
 */
angular.module('plm360.mockData').value('MockItemData', {
	createItemData: {
	  "__self__" : "/api/v3/workspaces/8/items/2801",
	  "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2801",
	  "workspace" : {
		"link" : "/api/v3/workspaces/8",
		"title" : "Items and BOMs",
		"urn" : "urn:adsk.plm:tenant.workspace:DEVINDMACHINE.8",
		"permissions" : [ ]
	  },
	  "root" : {
		"link" : "/api/v3/workspaces/8/items/2725",
		"title" : "683-0002-000 - Pneumatic Assembly, Project 621",
		"version" : "[REV:A]",
		"urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.8.2725",
		"permissions" : [ ]
	  },
	  "title" : "683-0002-000 - Pneumatic Assembly, Project 621",
	  "deleted" : false,
	  "latestRelease" : false,
	  "workingVersion" : true,
	  "version" : "Working",
	  "itemLocked" : false,
	  "workflowReference" : false,
	  "workingHasChanged" : false,
	  "lifecycle" : {
		"link" : "/api/v3/workflows/9223372036854775807/states/2",
		"title" : "Production",
		"urn" : "urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE.9223372036854775807.2",
		"permissions" : [ ]
	  },
	  "bom" : {
		"link" : "/api/v3/workspaces/8/items/2801/bom",
		"permissions" : [ ]
	  },
	  "nestedBom" : {
		"link" : "/api/v3/workspaces/8/items/2801/bom-items",
		"count" : 3,
		"permissions" : [ ]
	  },
	  "flatBom" : {
		"link" : "/api/v3/workspaces/8/items/2801/bom-items/flat",
		"permissions" : [ ]
	  },
	  "whereUsed" : {
		"link" : "/api/v3/workspaces/8/items/2801/where-used",
		"count" : {
		  "value" : 1,
		  "type" : "EXACT"
		}
	  },
	  "sections" : [ {
		"link" : "/api/v3/workspaces/8/items/2801/views/1/sections/19",
		"title" : "Details",
		"fields" : [ {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/NUMBER",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.NUMBER",
		  "title" : "Number",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : "683-0002-000",
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/USE_AUTO_DESCRIPTION",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.USE_AUTO_DESCRIPTION",
		  "title" : "Use Auto Description",
		  "type" : {
			"link" : "/api/v3/field-types/9",
			"title" : "Check Box",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.9",
			"permissions" : [ ]
		  },
		  "value" : "false",
		  "defaultValue" : "true"
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DESCRIPTION",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DESCRIPTION",
		  "title" : "Description",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : "Pneumatic Assembly, Project 621",
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/UNIT_OF_MEASURE",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.UNIT_OF_MEASURE",
		  "title" : "Unit of Measure",
		  "type" : {
			"link" : "/api/v3/field-types/28",
			"title" : "BOM UOM Pick List",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.28",
			"permissions" : [ ]
		  },
		  "value" : {
			"link" : "/api/v3/lookups/BOM-UOM/options/1",
			"title" : "Each",
			"urn" : "urn:adsk.plm:tenant.lookup.option:DEVINDMACHINE.BOM-UOM.1",
			"permissions" : [ ]
		  }
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/WEIGHT",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.WEIGHT",
		  "title" : "Weight per UoM",
		  "type" : {
			"link" : "/api/v3/field-types/2",
			"title" : "Float",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.2",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		} ]
	  }, {
		"link" : "/api/v3/workspaces/8/items/2801/views/1/sections/149",
		"title" : "Classification",
		"fields" : [ {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/LEVEL_1",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.LEVEL_1",
		  "title" : "Classification",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : "BOM"
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/LEVEL_2",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.LEVEL_2",
		  "title" : "Level 2",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : "SUB BOM PIPING"
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/LEVEL_3",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.LEVEL_3",
		  "title" : "Level 3",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/CLASS_NUMBER",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.CLASS_NUMBER",
		  "title" : "Class Number",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : "683"
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/CLASS_DESCRIPTION",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.CLASS_DESCRIPTION",
		  "title" : "Class Description",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : {
			"link" : "/api/v3/workspaces/51/items/2360",
			"title" : "683 - BOM - SUB BOM PIPING -",
			"permissions" : [ ]
		  }
		} ]
	  }, {
		"link" : "/api/v3/workspaces/8/items/2801/views/1/sections/150",
		"title" : "Classification Attributes",
		"fields" : [ {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_TYPE_1",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_TYPE_1",
		  "title" : "Dim Type 1",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : "Project Number"
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_VALUE_1",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_VALUE_1",
		  "title" : "Dim Value 1",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : "621",
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_UNIT_1",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_UNIT_1",
		  "title" : "Dim Unit 1",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_SEP_1",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_SEP_1",
		  "title" : "Dim Sep 1",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_TYPE_2",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_TYPE_2",
		  "title" : "Dim Type 2",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_VALUE_2",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_VALUE_2",
		  "title" : "Dim Value 2",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_UNIT_2",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_UNIT_2",
		  "title" : "Dim Unit 2",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_SEP_2",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_SEP_2",
		  "title" : "Dim Sep 2",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_TYPE_3",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_TYPE_3",
		  "title" : "Dim Type 3",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_VALUE_3",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_VALUE_3",
		  "title" : "Dim Value 3",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_UNIT_3",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_UNIT_3",
		  "title" : "Dim Unit 3",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_SEP_3",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_SEP_3",
		  "title" : "Dim Sep 3",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_TYPE_4",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_TYPE_4",
		  "title" : "Dim Type 4",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_VALUE_4",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_VALUE_4",
		  "title" : "Dim Value 4",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_UNIT_4",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_UNIT_4",
		  "title" : "Dim Unit 4",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_SEP_4",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_SEP_4",
		  "title" : "Dim Sep 4",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_TYPE_5",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_TYPE_5",
		  "title" : "Dim Type 5",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_VALUE_5",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_VALUE_5",
		  "title" : "Dim Value 5",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_UNIT_5",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_UNIT_5",
		  "title" : "Dim Unit 5",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_SEP_5",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_SEP_5",
		  "title" : "Dim Sep 5",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_TYPE_6",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_TYPE_6",
		  "title" : "Dim Type 6",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_VALUE_6",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_VALUE_6",
		  "title" : "Dim Value 6",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_UNIT_6",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_UNIT_6",
		  "title" : "Dim Unit 6",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/DIM_SEP_6",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.DIM_SEP_6",
		  "title" : "Dim Sep 6",
		  "type" : {
			"link" : "/api/v3/field-types/29",
			"title" : "Filtered",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.29",
			"permissions" : [ ]
		  },
		  "value" : null
		} ]
	  }, {
		"link" : "/api/v3/workspaces/8/items/2801/views/1/sections/151",
		"title" : "PDM Information",
		"fields" : [ {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/IMAGE",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.IMAGE",
		  "title" : "Image",
		  "type" : {
			"link" : "/api/v3/field-types/15",
			"title" : "Image",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.15",
			"permissions" : [ ]
		  },
		  "value" : null
		}, {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/CAD_FILE_NAME",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.CAD_FILE_NAME",
		  "title" : "CAD File Name",
		  "type" : {
			"link" : "/api/v3/field-types/4",
			"title" : "Single Line Text",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		} ]
	  }, {
		"link" : "/api/v3/workspaces/8/items/2801/views/1/sections/20",
		"title" : "Additional Details (Uncontrolled)",
		"fields" : [ {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/COMMENTS",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.COMMENTS",
		  "title" : "Comments",
		  "type" : {
			"link" : "/api/v3/field-types/8",
			"title" : "Paragraph",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.8",
			"permissions" : [ ]
		  },
		  "value" : null,
		  "defaultValue" : ""
		} ]
	  }, {
		"link" : "/api/v3/workspaces/8/items/2801/views/1/sections/152",
		"title" : "Sequence Reference",
		"fields" : [ {
		  "__self__" : "/api/v3/workspaces/8/items/2801/views/1/fields/LINKED_CLASS",
		  "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE.8.2801.1.LINKED_CLASS",
		  "title" : "Linked Class",
		  "type" : {
			"link" : "/api/v3/field-types/23",
			"title" : "Single Selection",
			"urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.23",
			"permissions" : [ ]
		  },
		  "value" : {
			"link" : "/api/v3/workspaces/51/items/2360",
			"title" : "683 - BOM - SUB BOM PIPING -",
			"urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.2360",
			"permissions" : [ ]
		  }
		} ]
	  } ],
	  "milestones" : {
		"link" : "/api/v3/workspaces/8/items/2801/views/17",
		"permissions" : [ ]
	  }
	},
	basicData: {
		id: 2887,
		rootId: 2717,
		version: 3,
		revision: 'C',
		workspaceId: 8,
		url: 'http://mitchells-mbp.ads.autodesk.com/api/v2/workspaces/8/items/2887',
		itemDescriptor: '600-0001-000 - SBOM Project 621 Head',
		fullItemDescriptor: '600-0001-000 - SBOM Project 621 Head [REV:C]',
		deleted: false,
		workflowReference: false,
		isWorkingVersion: false,
		isLatestVersion: true,
		fields: {
			NUMBER: '600-0001-000',
			USE_AUTO_DESCRIPTION: 'false',
			DESCRIPTION: 'SBOM Project 621 Head',
			WEIGHT: null,
			DIM_VALUE_1: null,
			DIM_VALUE_2: null,
			DIM_VALUE_3: null,
			DIM_VALUE_4: null,
			DIM_VALUE_5: null,
			DIM_VALUE_6: null,
			IMAGE: 'http://mitchells-mbp.ads.autodesk.com/api/v2/workspaces/8/items/2887/field-values/IMAGE/image/50',
			CAD_FILE_NAME: null,
			COMMENTS: null
		},
		picklistFields: {
			UNIT_OF_MEASURE: [{
				id: 1,
				displayName: 'Each',
				itemUrl: null
			}],
			LEVEL_1: [{
				id: null,
				displayName: 'BOM',
				itemUrl: null
			}],
			LEVEL_2: [{
				id: null,
				displayName: 'SUB BOM',
				itemUrl: null
			}],
			LEVEL_3: null,
			CLASS_NUMBER: [{
				id: null,
				displayName: '600',
				itemUrl: null
			}],
			CLASS_DESCRIPTION: [{
				id: 2359,
				displayName: '600 - BOM - SUB BOM -',
				itemUrl: 'http://mitchells-mbp.ads.autodesk.com/api/v2/workspaces/51/items/2359'
			}],
			DIM_TYPE_1: [{
				id: null,
				displayName: 'Project Number',
				itemUrl: null
			}],
			DIM_UNIT_1: null,
			DIM_SEP_1: null,
			DIM_TYPE_2: null,
			DIM_UNIT_2: null,
			DIM_SEP_2: null,
			DIM_TYPE_3: null,
			DIM_UNIT_3: null,
			DIM_SEP_3: null,
			DIM_TYPE_4: null,
			DIM_UNIT_4: null,
			DIM_SEP_4: null,
			DIM_TYPE_5: null,
			DIM_UNIT_5: null,
			DIM_SEP_5: null,
			DIM_TYPE_6: null,
			DIM_UNIT_6: null,
			DIM_SEP_6: null,
			LINKED_CLASS: [{
				id: 2359,
				displayName: '600 - BOM - SUB BOM -',
				itemUrl: 'http://mitchells-mbp.ads.autodesk.com/api/v2/workspaces/51/items/2359'
			}]
		},
		editableSections: [149, 150, 151, 20],
		ownership: null,
		audit: null,
		classificationUrl: 'http://mitchells-mbp.ads.autodesk.com/api/v2/parts?referenceUrn=urn:adsk.plm:tenant.workspace.item:DEVINDMACHINETEST/8/2887',
		etag: null
	}
});
