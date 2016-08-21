'use strict';

angular.module('plm360.mockData').value('MockSuppliersData', [
  {
    "/api/v3/workspaces/11/items/3900" : {
      "__self__" : "/api/v3/workspaces/11/items/3900",
      "urn" : "urn:adsk.plm:tenant.workspace.item:SELENIUM.11.3900",
      "workspace" : {
        "link" : "/api/v3/workspaces/11",
        "title" : "Selenium Suppliers"
      },
      "root" : {
        "link" : "/api/v3/workspaces/11/items/3900",
        "title" : "PERM-SUPPLIER-1"
      },
      "title" : "PERM-SUPPLIER-1",
      "deleted" : false,
      "latestRelease" : true,
      "workingVersion" : true,
      "itemLocked" : false,
      "lifecycle" : {
        "link" : "/api/v3/workflows/9223372036854775807/states/0",
        "title" : "Unreleased"
      },
      "sections" : [ {
        "link" : "/api/v3/workspaces/11/items/3900/views/1/sections/6",
        "title" : "General",
        "fields" : [ {
          "__self__" : "/api/v3/workspaces/11/items/3900/views/1/fields/NAME",
          "urn" : "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM.11.3900.1.NAME",
          "title" : "Name",
          "type" : {
            "link" : "/api/v3/field-types/4",
            "title" : "Single Line Text"
          },
          "value" : "PERM-SUPPLIER-1"
        } ]
      }, {
        "link" : "/api/v3/workspaces/11/items/3900/views/1/sections/9",
        "title" : "Invisible Section",
        "fields" : [ ]
      } ]
    },
    "/api/v3/workspaces/11/items/3901" : {
      "__self__": "/api/v3/workspaces/11/items/3901",
      "urn": "urn:adsk.plm:tenant.workspace.item:SELENIUM.11.3901",
      "workspace": {
        "link": "/api/v3/workspaces/11",
        "title": "Selenium Suppliers"
      },
      "root": {
        "link": "/api/v3/workspaces/11/items/3901",
        "title": "PERM-SUPPLIER-2"
      },
      "title": "PERM-SUPPLIER-2",
      "deleted": false,
      "latestRelease": true,
      "workingVersion": true,
      "itemLocked": false,
      "lifecycle": {
        "link": "/api/v3/workflows/9223372036854775807/states/0",
        "title": "Unreleased"
      },
      "sections": [{
        "link": "/api/v3/workspaces/11/items/3901/views/1/sections/6",
        "title": "General",
        "fields": [{
          "__self__": "/api/v3/workspaces/11/items/3901/views/1/fields/NAME",
          "urn": "urn:adsk.plm:tenant.workspace.item.view.field:SELENIUM.11.3901.1.NAME",
          "title": "Name",
          "type": {
            "link": "/api/v3/field-types/4",
            "title": "Single Line Text"
          },
          "value": "PERM-SUPPLIER-2"
        }]
      }, {
        "link": "/api/v3/workspaces/11/items/3901/views/1/sections/9",
        "title": "Invisible Section",
        "fields": []
      }]
    }
  }
]);
