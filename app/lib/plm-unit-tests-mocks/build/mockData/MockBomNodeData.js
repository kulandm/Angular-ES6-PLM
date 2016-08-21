(function(module) {
    'use strict';
    module.value('MockBomNodeData', {
        nodeData: {
            "item": {
                "link": "/api/v3/workspaces/59/items/3317",
                "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003B.59.3317",
                "title": "RevTest005 [REV:w]",
                "deleted": false,
                "version": "WIP",
                "permissions": []
            },
            "itemId": "59@3317",
            "outEdges": [],
            "hasChildren": false,
            "nestedBomLink": "/api/v3/workspaces/59/items/3317/bom-items",
            "bomRootLink": "/api/v3/workspaces/59/items/3317/bom"
        },

        bulkNode: {
            "item": {
                "link": "/api/v3/workspaces/59/items/3302",
                "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003B.59.3302",
                "title": "RevTest002 [REV:C]",
                "deleted": false,
                "version": "C",
                "permissions": []
            },
            "bomItems": "/api/v3/workspaces/59/items/3302/bom-items",
            "bomRoot": "/api/v3/workspaces/59/items/3302/bom",
            "fields": [{
                "value": "RevTest002 [REV:C]",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/84",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.84",
                    "deleted": false,
                    "permissions": []
                }
            }, {
                "value": "C",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/85",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.85",
                    "deleted": false,
                    "permissions": []
                }
            }, {
                "value": "Production",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/89",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.89",
                    "deleted": false,
                    "permissions": []
                }
            }, {
                "value": "Latest",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/90",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.90",
                    "deleted": false,
                    "permissions": []
                }
            }, {
                "value": "0.00",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/94",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.94",
                    "deleted": false,
                    "permissions": []
                }
            }, {
                "value": 0,
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/95",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.95",
                    "deleted": false,
                    "permissions": []
                }
            }]
        }
    });
}(angular.module('plm360.mockData')));
