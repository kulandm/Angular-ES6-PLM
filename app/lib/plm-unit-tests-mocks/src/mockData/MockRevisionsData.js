'use strict';

angular.module('plm360.mockData').value('MockRevisionsData', {
	basicData: {
	  "__self__" : "/api/v3/workspaces/59/items/3302/versions",
	  "versions" : [ {
	    "__self__" : "/api/v3/workspaces/59/items/3302/versions/3319",
	    "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3319",
	    "item" : {
	      "link" : "/api/v3/workspaces/59/items/3319",
	      "title" : "RevTest002",
	      "version" : "[REV:w]",
	      "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.59.3319",
	      "permissions" : [ ]
	    },
	    "status" : "WORKING",
	    "lifecycle" : {
	      "link" : "/api/v3/workspaces/59/items/3319/workflows/workspace-types/states",
	      "title" : "Production",
	      "permissions" : [ ]
	    },
	    "effectivity" : {
	      "status" : "PENDING"
	    },
	    "versionNumber" : 4
	  }, {
	    "__self__" : "/api/v3/workspaces/59/items/3302/versions/3302",
	    "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3302",
	    "item" : {
	      "link" : "/api/v3/workspaces/59/items/3302",
	      "title" : "RevTest002",
	      "version" : "[REV:C]",
	      "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.59.3302",
	      "permissions" : [ ]
	    },
	    "version" : "C",
	    "status" : "LATEST",
	    "lifecycle" : {
	      "link" : "/api/v3/workspaces/59/items/3302/workflows/workspace-types/states",
	      "title" : "Production",
	      "permissions" : [ ]
	    },
	    "effectivity" : {
	      "startDate" : "2010-11-15T00:00:00.000-05:00"
	    },
	    "supersededBy" : {
	      "link" : "/api/v3/workspaces/59/items/3302/versions/3319",
	      "title" : "RevTest002",
	      "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3319",
	      "permissions" : [ ]
	    },
	    "versionNumber" : 3
	  }, {
	    "__self__" : "/api/v3/workspaces/59/items/3302/versions/3303",
	    "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3303",
	    "item" : {
	      "link" : "/api/v3/workspaces/59/items/3303",
	      "title" : "RevTest002",
	      "version" : "[REV:sB]",
	      "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.59.3303",
	      "permissions" : [ ]
	    },
	    "version" : "B",
	    "status" : "SUPERSEDED",
	    "lifecycle" : {
	      "link" : "/api/v3/workspaces/59/items/3303/workflows/workspace-types/states",
	      "title" : "Production",
	      "permissions" : [ ]
	    },
	    "effectivity" : {
	      "startDate" : "2010-05-15T00:00:00.000-04:00",
	      "endDate" : "2010-11-14T00:00:00.000-05:00"
	    },
	    "supersededBy" : {
	      "link" : "/api/v3/workspaces/59/items/3302/versions/3302",
	      "title" : "RevTest002",
	      "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3302",
	      "permissions" : [ ]
	    },
	    "versionNumber" : 2
	  }, {
	    "__self__" : "/api/v3/workspaces/59/items/3302/versions/3304",
	    "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3304",
	    "item" : {
	      "link" : "/api/v3/workspaces/59/items/3304",
	      "title" : "RevTest002",
	      "version" : "[REV:sA]",
	      "urn" : "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.59.3304",
	      "permissions" : [ ]
	    },
	    "version" : "A",
	    "status" : "SUPERSEDED",
	    "lifecycle" : {
	      "link" : "/api/v3/workspaces/59/items/3304/workflows/workspace-types/states",
	      "title" : "Production",
	      "permissions" : [ ]
	    },
	    "effectivity" : {
	      "status" : "NEVER_IN_EFFECT"
	    },
	    "supersededBy" : {
	      "link" : "/api/v3/workspaces/59/items/3302/versions/3303",
	      "title" : "RevTest002",
	      "urn" : "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.59.3302.3303",
	      "permissions" : [ ]
	    },
	    "versionNumber" : 1
	  } ]
	}
});
