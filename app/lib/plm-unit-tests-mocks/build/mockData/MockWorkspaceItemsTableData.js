'use strict';

angular.module('plm360.mockData').value('MockWorkspaceItemsTableData', {
    "columns": [{
        "displayName": "Image",
        "suppressRemoveSort": true,
        "field": "IMAGE",
        "cellTemplate": "itemsThumbnailRenderer",
        "name": "IMAGE",
        "enableColumnMoving": false,
        "enableColumnResizing": true,
        "type": "object"
    }, {
        "displayName": "Item Descriptor",
        "suppressRemoveSort": true,
        "field": "DESCRIPTOR",
        "cellTemplate": "itemsOtherRenderer",
        "sort": {
            "direction": "desc",
            "priority": 1
        },
        "name": "DESCRIPTOR",
        "enableColumnMoving": false,
        "enableColumnResizing": true,
        "type": "object"
    }, {
        "displayName": "Current State",
        "suppressRemoveSort": true,
        "field": "WF_CURRENT_STATE",
        "cellTemplate": "itemsOtherRenderer",
        "name": "WF_CURRENT_STATE",
        "enableColumnMoving": false,
        "enableColumnResizing": true,
        "type": "object"
    }],
    "rows": [{
        "IMAGE": {
            "value": {
                "link": "/api/v2/workspaces/47/items/2694/field-values/IMAGE/image/45",
                "listMode": 1
            },
            "metadata": {
                "dataTypeId": 10396
            },
            "href": "/app/workspaces/47/items/itemDetails?view=split&tab=details&mode=view&itemId=urn%60adsk%2Cplm%60tenant%2Cworkspace%2Citem%60DEVINDMACHINE1001%2C47%2C2694",
            "urn": "urn`adsk,plm`tenant,workspace,item`DEVINDMACHINE1001,47,2694"
        },
        "DESCRIPTOR": {
            "value": "EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable",
            "metadata": {
                "dataTypeId": 4
            }
        },
        "WF_CURRENT_STATE": {
            "value": "Kickoff",
            "metadata": {
                "dataTypeId": 4
            }
        },
        "$$hashKey": "uiGrid-004U"
    }, {
        "IMAGE": {
            "value": "",
            "metadata": {
                "dataTypeId": 0
            },
            "href": "/app/workspaces/47/items/itemDetails?view=split&tab=details&mode=view&itemId=urn%60adsk%2Cplm%60tenant%2Cworkspace%2Citem%60DEVINDMACHINE1001%2C47%2C2948",
            "urn": "urn`adsk,plm`tenant,workspace,item`DEVINDMACHINE1001,47,2948"
        },
        "DESCRIPTOR": {
            "value": " - test BOM",
            "metadata": {
                "dataTypeId": 4
            }
        },
        "WF_CURRENT_STATE": {
            "value": "Kickoff",
            "metadata": {
                "dataTypeId": 4
            }
        },
        "$$hashKey": "uiGrid-004W"
    }]
});
