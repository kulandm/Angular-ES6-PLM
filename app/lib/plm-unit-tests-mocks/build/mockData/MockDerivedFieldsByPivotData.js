'use strict';

angular.module('plm360.mockData').value('MockDerivedFieldsByPivotData', {
  dataWithoutPivotSelection: {
    "__self__": "/api/v3/workspaces/71/views/1/pivots/PIVOT_PL",
    "urn": "urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL",
    "sections": [
      {
        "link": "/api/v3/workspaces/71/sections/121",
        "title": "Section Two",
        "sectionLocked": false,
        "fields": [
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_CUSTOM_PL",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_CUSTOM_PL",
            "title": "Derived Custom PL",
            "type": {
              "link": "/api/v3/field-types/20",
              "urn": "urn:adsk.plm:tenant.field-type:CI.20",
              "title": "Single Selection",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": null,
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_WORKSPACE_PL",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_WORKSPACE_PL",
            "title": "Derived Workspace PL",
            "type": {
              "link": "/api/v3/field-types/23",
              "urn": "urn:adsk.plm:tenant.field-type:CI.23",
              "title": "Single Selection",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": null,
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_BOM_UOM",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_BOM_UOM",
            "title": "Derived Bom Uom",
            "type": {
              "link": "/api/v3/field-types/28",
              "urn": "urn:adsk.plm:tenant.field-type:CI.28",
              "title": "BOM UOM Pick List",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": null,
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_DATE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_DATE",
            "title": "Derived Date",
            "type": {
              "link": "/api/v3/field-types/3",
              "urn": "urn:adsk.plm:tenant.field-type:CI.3",
              "title": "Date",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": null,
            "formulaField": false
          }
        ]
      },
      {
        "link": "/api/v3/workspaces/71/sections/120",
        "title": "Section One",
        "sectionLocked": false,
        "fields": [
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_TITLE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_TITLE",
            "title": "Derived Title",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:CI.4",
              "title": "Single Line Text",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": null,
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_CREATED_ON",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_CREATED_ON",
            "title": "Derived Created On",
            "type": {
              "link": "/api/v3/field-types/3",
              "urn": "urn:adsk.plm:tenant.field-type:CI.3",
              "title": "Date",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": null,
            "formulaField": false
          }
        ]
      }
    ]
  },
  data: {
    "__self__": "/api/v3/workspaces/71/views/1/pivots/PIVOT_PL",
    "urn": "urn:adsk.plm:tenant.workspace.view.pivot:CI.71.1.PIVOT_PL",
    "sections": [
      {
        "link": "/api/v3/workspaces/71/sections/121",
        "title": "Section Two",
        "sectionLocked": false,
        "fields": [
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_CUSTOM_PL",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_CUSTOM_PL",
            "title": "Derived Custom PL",
            "type": {
              "link": "/api/v3/field-types/20",
              "urn": "urn:adsk.plm:tenant.field-type:CI.20",
              "title": "Single Selection",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": {
              "link": "/api/v3/lookups/CUSTOM_LOOKUP_ALL_USERS_VIEW/options/224",
              "urn": "urn:adsk.plm:tenant.lookup.option:CI.CUSTOM_LOOKUP_ALL_USERS_VIEW.224",
              "title": "Doe, Joe",
              "deleted": false,
              "permissions": [

              ]
            },
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_WORKSPACE_PL",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_WORKSPACE_PL",
            "title": "Derived Workspace PL",
            "type": {
              "link": "/api/v3/field-types/23",
              "urn": "urn:adsk.plm:tenant.field-type:CI.23",
              "title": "Single Selection",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": {
              "link": "/api/v3/workspaces/9/items/4852",
              "urn": "urn:adsk.plm:tenant.workspace.item:CI.9.4852",
              "title": "RevTest001",
              "deleted": false,
              "version": "[REV:sA]",
              "permissions": [

              ]
            },
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_BOM_UOM",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_BOM_UOM",
            "title": "Derived Bom Uom",
            "type": {
              "link": "/api/v3/field-types/28",
              "urn": "urn:adsk.plm:tenant.field-type:CI.28",
              "title": "BOM UOM Pick List",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": {
              "link": "/api/v3/lookups/BOM-UOM/options/6",
              "urn": "urn:adsk.plm:tenant.lookup.option:CI.BOM-UOM.6",
              "title": "Kilogram",
              "deleted": false,
              "permissions": [

              ]
            },
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_DATE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_DATE",
            "title": "Derived Date",
            "type": {
              "link": "/api/v3/field-types/3",
              "urn": "urn:adsk.plm:tenant.field-type:CI.3",
              "title": "Date",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": "2016-06-30",
            "formulaField": false
          }
        ]
      },
      {
        "link": "/api/v3/workspaces/71/sections/120",
        "title": "Section One",
        "sectionLocked": false,
        "fields": [
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_TITLE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_TITLE",
            "title": "Derived Title",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:CI.4",
              "title": "Single Line Text",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": "My ECN 01",
            "formulaField": false
          },
          {
            "__self__": "/api/v3/workspaces/71/views/1/fields/DERIVED_CREATED_ON",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:CI.71.1.DERIVED_CREATED_ON",
            "title": "Derived Created On",
            "type": {
              "link": "/api/v3/field-types/3",
              "urn": "urn:adsk.plm:tenant.field-type:CI.3",
              "title": "Date",
              "deleted": false,
              "permissions": [

              ]
            },
            "value": "2016-06-30",
            "formulaField": false
          }
        ]
      }
    ]
  }
});
