' use strict ';

angular.module('plm360.mockData').value("MockWorkspacesTableauConfigurationData", {
  "ITEM_DESCRIPTOR_FIELD": {
    "collapsed": false,
    "name": "Item Descriptor",
    "fields": [
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/0/fields/DESCRIPTOR",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.DESCRIPTOR",
          "title": "Item Descriptor",
          "type": {
            "link": "/api/v3/field-types/4",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
            "title": "Alpha Numeric",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "ITEM_DESCRIPTOR_FIELD",
          "name": "Item Descriptor",
          "section": 15,
          "displayOrder": 0
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/4",
            "label": "report.filter.type.ends_with",
            "name": "Ends With",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/15",
            "label": "report.filter.type.is",
            "name": "Is",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/2",
            "label": "report.filter.type.contains",
            "name": "Contains",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/5",
            "label": "report.filter.type.does_not_contain",
            "name": "Does Not Contain",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/21",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/20",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/3",
            "label": "report.filter.type.starts_with",
            "name": "Starts With",
            "allowValue": true
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/0/fields/DESCRIPTOR",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.DESCRIPTOR",
            "title": "Item Descriptor",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
              "title": "Alpha Numeric",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "ITEM_DESCRIPTOR_FIELD",
            "name": "Item Descriptor",
            "section": 15,
            "displayOrder": 0
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/4",
              "label": "report.filter.type.ends_with",
              "name": "Ends With",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/15",
              "label": "report.filter.type.is",
              "name": "Is",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/2",
              "label": "report.filter.type.contains",
              "name": "Contains",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/5",
              "label": "report.filter.type.does_not_contain",
              "name": "Does Not Contain",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/21",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/20",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/3",
              "label": "report.filter.type.starts_with",
              "name": "Starts With",
              "allowValue": true
            }
          ]
        },
        "displayOrder": 0,
        "sort": {
          "order": 0,
          "direction": "DESCENDING"
        },
        "visible": true
      }
    ]
  },
  "ITEM_DETAILS_FIELD": {
    "collapsed": false,
    "name": "Item Details",
    "fields": [
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/1/fields/NOT_UNIQUE",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.1.NOT_UNIQUE",
          "title": "NOT_UNIQUE on item details",
          "type": {
            "link": "/api/v3/field-types/30",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.30",
            "title": "Integer",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "defaultValue": "",
          "formulaField": false
        },
        "group": {
          "label": "ITEM_DETAILS_FIELD",
          "name": "Item Details",
          "section": 0,
          "displayOrder": 1
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/9",
            "label": "report.filter.type.greater_than",
            "name": "Greater Than",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/22",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/23",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/10",
            "label": "report.filter.type.less_than",
            "name": "Less Than",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/8",
            "label": "report.filter.type.not_equal_to",
            "name": "Not Equal To",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/7",
            "label": "report.filter.type.equal_to",
            "name": "Equal To",
            "allowValue": true
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/1/fields/NOT_UNIQUE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.1.NOT_UNIQUE",
            "title": "NOT_UNIQUE on item details",
            "type": {
              "link": "/api/v3/field-types/30",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.30",
              "title": "Integer",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "defaultValue": "",
            "formulaField": false
          },
          "group": {
            "label": "ITEM_DETAILS_FIELD",
            "name": "Item Details",
            "section": 0,
            "displayOrder": 1
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/9",
              "label": "report.filter.type.greater_than",
              "name": "Greater Than",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/22",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/23",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/10",
              "label": "report.filter.type.less_than",
              "name": "Less Than",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/8",
              "label": "report.filter.type.not_equal_to",
              "name": "Not Equal To",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/7",
              "label": "report.filter.type.equal_to",
              "name": "Equal To",
              "allowValue": true
            }
          ]
        },
        "displayOrder": 2,
        "visible": true
      },
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/1/fields/DESCRIPTION",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.1.DESCRIPTION",
          "title": "Description",
          "type": {
            "link": "/api/v3/field-types/4",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
            "title": "Single Line Text",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "defaultValue": "",
          "formulaField": false
        },
        "group": {
          "label": "ITEM_DETAILS_FIELD",
          "name": "Item Details",
          "section": 0,
          "displayOrder": 1
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/4",
            "label": "report.filter.type.ends_with",
            "name": "Ends With",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/2",
            "label": "report.filter.type.contains",
            "name": "Contains",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/21",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/5",
            "label": "report.filter.type.does_not_contain",
            "name": "Does Not Contain",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/20",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/15",
            "label": "report.filter.type.is",
            "name": "Is",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/3",
            "label": "report.filter.type.starts_with",
            "name": "Starts With",
            "allowValue": true
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/1/fields/DESCRIPTION",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.1.DESCRIPTION",
            "title": "Description",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
              "title": "Single Line Text",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "defaultValue": "",
            "formulaField": false
          },
          "group": {
            "label": "ITEM_DETAILS_FIELD",
            "name": "Item Details",
            "section": 0,
            "displayOrder": 1
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/4",
              "label": "report.filter.type.ends_with",
              "name": "Ends With",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/2",
              "label": "report.filter.type.contains",
              "name": "Contains",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/21",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/5",
              "label": "report.filter.type.does_not_contain",
              "name": "Does Not Contain",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/20",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/15",
              "label": "report.filter.type.is",
              "name": "Is",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/3",
              "label": "report.filter.type.starts_with",
              "name": "Starts With",
              "allowValue": true
            }
          ]
        },
        "visible": false
      },
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/1/fields/IMAGE",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.1.IMAGE",
          "title": "Image",
          "type": {
            "link": "/api/v3/field-types/15",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.15",
            "title": "Image",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "ITEM_DETAILS_FIELD",
          "name": "Item Details",
          "section": 0,
          "displayOrder": 1
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/22",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/23",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/1/fields/IMAGE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.1.IMAGE",
            "title": "Image",
            "type": {
              "link": "/api/v3/field-types/15",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.15",
              "title": "Image",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "ITEM_DETAILS_FIELD",
            "name": "Item Details",
            "section": 0,
            "displayOrder": 1
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/22",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/23",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            }
          ]
        },
        "visible": false
      },
      
    ]
  },
  "WORKFLOW_FIELD": {
    "collapsed": false,
    "name": "Workflow Summary",
    "fields": [
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/0/fields/WF_LAST_TRANS",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.WF_LAST_TRANS",
          "title": "Last Action",
          "type": {
            "link": "/api/v3/field-types/4",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
            "title": "Alpha Numeric",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "WORKFLOW_FIELD",
          "name": "Workflow Summary",
          "section": 1,
          "displayOrder": 4
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/5",
            "label": "report.filter.type.does_not_contain",
            "name": "Does Not Contain",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/21",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/20",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/2",
            "label": "report.filter.type.contains",
            "name": "Contains",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/15",
            "label": "report.filter.type.is",
            "name": "Is",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/3",
            "label": "report.filter.type.starts_with",
            "name": "Starts With",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/4",
            "label": "report.filter.type.ends_with",
            "name": "Ends With",
            "allowValue": true
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/0/fields/WF_LAST_TRANS",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.WF_LAST_TRANS",
            "title": "Last Action",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
              "title": "Alpha Numeric",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "WORKFLOW_FIELD",
            "name": "Workflow Summary",
            "section": 1,
            "displayOrder": 4
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/5",
              "label": "report.filter.type.does_not_contain",
              "name": "Does Not Contain",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/21",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/20",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/2",
              "label": "report.filter.type.contains",
              "name": "Contains",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/15",
              "label": "report.filter.type.is",
              "name": "Is",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/3",
              "label": "report.filter.type.starts_with",
              "name": "Starts With",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/4",
              "label": "report.filter.type.ends_with",
              "name": "Ends With",
              "allowValue": true
            }
          ]
        },
        "visible": false
      },
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/0/fields/WF_CURRENT_STATE",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.WF_CURRENT_STATE",
          "title": "Current State",
          "type": {
            "link": "/api/v3/field-types/4",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
            "title": "Alpha Numeric",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "WORKFLOW_FIELD",
          "name": "Workflow Summary",
          "section": 1,
          "displayOrder": 4
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/3",
            "label": "report.filter.type.starts_with",
            "name": "Starts With",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/20",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/21",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/5",
            "label": "report.filter.type.does_not_contain",
            "name": "Does Not Contain",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/2",
            "label": "report.filter.type.contains",
            "name": "Contains",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/15",
            "label": "report.filter.type.is",
            "name": "Is",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/4",
            "label": "report.filter.type.ends_with",
            "name": "Ends With",
            "allowValue": true
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/0/fields/WF_CURRENT_STATE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.WF_CURRENT_STATE",
            "title": "Current State",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
              "title": "Alpha Numeric",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "WORKFLOW_FIELD",
            "name": "Workflow Summary",
            "section": 1,
            "displayOrder": 4
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/3",
              "label": "report.filter.type.starts_with",
              "name": "Starts With",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/20",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/21",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/5",
              "label": "report.filter.type.does_not_contain",
              "name": "Does Not Contain",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/2",
              "label": "report.filter.type.contains",
              "name": "Contains",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/15",
              "label": "report.filter.type.is",
              "name": "Is",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/4",
              "label": "report.filter.type.ends_with",
              "name": "Ends With",
              "allowValue": true
            }
          ]
        },
        "displayOrder": 1,
        "visible": true
      }
    ]
  },
  "BOM_FIELD": {
    "collapsed": false,
    "name": "Bill of Materials",
    "fields": [
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/0/fields/ITEM_NUMBER",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.ITEM_NUMBER",
          "title": "Item Number",
          "type": {
            "link": "/api/v3/field-types/1",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.1",
            "title": "Integer",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "BOM_FIELD",
          "name": "Bill of Materials",
          "section": 6,
          "displayOrder": 10
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/23",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/7",
            "label": "report.filter.type.equal_to",
            "name": "Equal To",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/9",
            "label": "report.filter.type.greater_than",
            "name": "Greater Than",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/8",
            "label": "report.filter.type.not_equal_to",
            "name": "Not Equal To",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/10",
            "label": "report.filter.type.less_than",
            "name": "Less Than",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/22",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/0/fields/ITEM_NUMBER",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.0.ITEM_NUMBER",
            "title": "Item Number",
            "type": {
              "link": "/api/v3/field-types/1",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.1",
              "title": "Integer",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "BOM_FIELD",
            "name": "Bill of Materials",
            "section": 6,
            "displayOrder": 10
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/23",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/7",
              "label": "report.filter.type.equal_to",
              "name": "Equal To",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/9",
              "label": "report.filter.type.greater_than",
              "name": "Greater Than",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/8",
              "label": "report.filter.type.not_equal_to",
              "name": "Not Equal To",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/10",
              "label": "report.filter.type.less_than",
              "name": "Less Than",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/22",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            }
          ]
        },
        "visible": false
      },
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/7/fields/NUMBER",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.7.NUMBER",
          "title": "Number",
          "type": {
            "link": "/api/v3/field-types/30",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.30",
            "title": "Integer",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "BOM_FIELD",
          "name": "Bill of Materials",
          "section": 6,
          "displayOrder": 10
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/8",
            "label": "report.filter.type.not_equal_to",
            "name": "Not Equal To",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/10",
            "label": "report.filter.type.less_than",
            "name": "Less Than",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/7",
            "label": "report.filter.type.equal_to",
            "name": "Equal To",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/9",
            "label": "report.filter.type.greater_than",
            "name": "Greater Than",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/23",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/22",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/7/fields/NUMBER",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.7.NUMBER",
            "title": "Number",
            "type": {
              "link": "/api/v3/field-types/30",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.30",
              "title": "Integer",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "BOM_FIELD",
            "name": "Bill of Materials",
            "section": 6,
            "displayOrder": 10
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/8",
              "label": "report.filter.type.not_equal_to",
              "name": "Not Equal To",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/10",
              "label": "report.filter.type.less_than",
              "name": "Less Than",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/7",
              "label": "report.filter.type.equal_to",
              "name": "Equal To",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/9",
              "label": "report.filter.type.greater_than",
              "name": "Greater Than",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/23",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/22",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            }
          ]
        },
        "visible": false
      },
      {
        "field": {
          "__self__": "/api/v3/workspaces/47/views/7/fields/NOT_UNIQUE",
          "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.7.NOT_UNIQUE",
          "title": "NOT_UNIQUE on BOM",
          "type": {
            "link": "/api/v3/field-types/4",
            "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
            "title": "Single Line Text",
            "deleted": false,
            "permissions": [
              
            ]
          },
          "value": null,
          "formulaField": false
        },
        "group": {
          "label": "BOM_FIELD",
          "name": "Bill of Materials",
          "section": 6,
          "displayOrder": 10
        },
        "applicableFilters": [
          {
            "link": "/api/v3/filter-types/21",
            "label": "report.filter.type.not_blank",
            "name": "Not Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/3",
            "label": "report.filter.type.starts_with",
            "name": "Starts With",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/2",
            "label": "report.filter.type.contains",
            "name": "Contains",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/5",
            "label": "report.filter.type.does_not_contain",
            "name": "Does Not Contain",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/20",
            "label": "report.filter.type.is_blank",
            "name": "Is Blank",
            "allowValue": false
          },
          {
            "link": "/api/v3/filter-types/15",
            "label": "report.filter.type.is",
            "name": "Is",
            "allowValue": true
          },
          {
            "link": "/api/v3/filter-types/4",
            "label": "report.filter.type.ends_with",
            "name": "Ends With",
            "allowValue": true
          }
        ],
        "originalElement": {
          "field": {
            "__self__": "/api/v3/workspaces/47/views/7/fields/NOT_UNIQUE",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003B.47.7.NOT_UNIQUE",
            "title": "NOT_UNIQUE on BOM",
            "type": {
              "link": "/api/v3/field-types/4",
              "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003B.4",
              "title": "Single Line Text",
              "deleted": false,
              "permissions": [
                
              ]
            },
            "value": null,
            "formulaField": false
          },
          "group": {
            "label": "BOM_FIELD",
            "name": "Bill of Materials",
            "section": 6,
            "displayOrder": 10
          },
          "applicableFilters": [
            {
              "link": "/api/v3/filter-types/21",
              "label": "report.filter.type.not_blank",
              "name": "Not Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/3",
              "label": "report.filter.type.starts_with",
              "name": "Starts With",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/2",
              "label": "report.filter.type.contains",
              "name": "Contains",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/5",
              "label": "report.filter.type.does_not_contain",
              "name": "Does Not Contain",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/20",
              "label": "report.filter.type.is_blank",
              "name": "Is Blank",
              "allowValue": false
            },
            {
              "link": "/api/v3/filter-types/15",
              "label": "report.filter.type.is",
              "name": "Is",
              "allowValue": true
            },
            {
              "link": "/api/v3/filter-types/4",
              "label": "report.filter.type.ends_with",
              "name": "Ends With",
              "allowValue": true
            }
          ]
        },
        "displayOrder": 3,
        "visible": true
      }
    ]
  }
});