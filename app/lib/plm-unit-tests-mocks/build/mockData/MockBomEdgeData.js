(function(module) {
    'use strict';
    module.value('MockBomEdgeData', {
        edgeData: {
            "link": 'anEdgeLink',
            "bomId": 'aBomId',
            "toNode": 'theToNode',
            "edgeProperties": {}
        },

        bulkEdgeData: {
            "edgeId": 924,
            "parent": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003B.59.3317",
            "child": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003B.59.3301",
            "edgeLink": "/api/v3/workspaces/59/items/3317/bom-items/924",
            "depth": 1,
            "itemNumber": 1,
            "fields": [{
                "value": "true",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/86",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.86",
                    "deleted": false,
                    "permissions": []
                }
            }, {
                "value": "1.0",
                "metaData": {
                    "link": "/api/v3/workspaces/59/views/5/viewdef/38/fields/91",
                    "urn": "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003B.59.5.38.91",
                    "deleted": false,
                    "permissions": []
                }
            }]
        }
    });
}(angular.module('plm360.mockData')));
