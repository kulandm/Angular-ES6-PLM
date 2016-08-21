' use strict ';
// get VISIBLE COLUMNS from a tableau from an specific workspace
angular.module('plm360.mockData').value('MockWorkspacesTableauVisibleColumnsData',{
    "__self__": "/api/v3/workspaces/47/tableaus/91",
    "urn": "urn:adsk.plm:tenant.workspace.tableau:DEVINDMACHINE1003.47.91",
    "name": "My Default View",
    "description": "",
    "createdDate": "2015-08-27T04:47:21.902+0000",
    "modifiedDate": "2015-08-27T04:47:21.902+0000",
    "logicClause": "",
    "isDefault": true,
    "showOnlyDeletedRecords": false,
    "owner": {
        "link": "/api/v3/users/PLMAutoTest",
        "urn": "urn:adsk.plm:tenant.user:DEVINDMACHINE1003.PLMAutoTest",
        "title": "PLMAutoTest Selenium1",
        "permissions": []
    },
    "workspace": {
        "link": "/api/v3/workspaces/47",
        "urn": "urn:adsk.plm:tenant.workspace:DEVINDMACHINE1003.47",
        "title": "Products",
        "permissions": []
    },
    "columns": [
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
                    "label": "report.filter.type.does_not_contain",
                    "name": "Does Not Contain",
                    "allowValue": true
                },
                {
                    "label": "report.filter.type.is_blank",
                    "name": "Is Blank",
                    "allowValue": false
                }
            ],
            "displayOrder": 0,
            "sort": {
                "order": 0,
                "direction": "DESC"
            }
        },
        {
            "field": {
                "__self__": "/api/v3/workspaces/47/views/0/fields/WF_CURRENT_STATE",
                "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1003.47.0.WF_CURRENT_STATE",
                "title": "Current State",
                "type": {
                    "link": "/api/v3/field-types/4",
                    "urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
                    "title": "Alpha Numeric",
                    "permissions": []
                },
                "value": null
            },
            "group": {
                "label": "WORKFLOW_FIELD",
                "name": "Workflow Summary",
                "section": 1
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
                    "label": "report.filter.type.is_blank",
                    "name": "Is Blank",
                    "allowValue": false
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
                    "label": "report.filter.type.not_blank",
                    "name": "Not Blank",
                    "allowValue": false
                },
                {
                    "label": "report.filter.type.ends_with",
                    "name": "Ends With",
                    "allowValue": true
                }
            ],
            "displayOrder": 1
        }
    ]
});
