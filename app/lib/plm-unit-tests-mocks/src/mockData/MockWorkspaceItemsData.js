'use strict';

angular.module('plm360.mockData').value('MockWorkspaceItemsData', {
    items: [{
        "index": 0,
        "item": {
            "link": "/api/v3/workspaces/47/items/2694",
            "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.47.2694",
            "permissions": []
        },
        "fields": [{
            "id": "IMAGE",
            "value": "45",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1001.47.0.IMAGE"
        }, {
            "id": "DESCRIPTOR",
            "value": "EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1001.47.0.DESCRIPTOR"
        }, {
            "id": "WF_CURRENT_STATE",
            "value": "Kickoff",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1001.47.0.WF_CURRENT_STATE"
        }],
        "urn": "urn`adsk,plm`tenant,workspace,item`DEVINDMACHINE1001,47,2694"
    }, {
        "index": 1,
        "item": {
            "link": "/api/v3/workspaces/47/items/2948",
            "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.47.2948",
            "permissions": []
        },
        "fields": [{
            "id": "IMAGE",
            "value": "",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1001.47.0.IMAGE"
        }, {
            "id": "DESCRIPTOR",
            "value": " - test BOM",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1001.47.0.DESCRIPTOR"
        }, {
            "id": "WF_CURRENT_STATE",
            "value": "Kickoff",
            "urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1001.47.0.WF_CURRENT_STATE"
        }],
        "urn": "urn`adsk,plm`tenant,workspace,item`DEVINDMACHINE1001,47,2948"
    }]
})
