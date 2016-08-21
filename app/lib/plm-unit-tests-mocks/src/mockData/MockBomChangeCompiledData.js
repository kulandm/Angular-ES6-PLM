'use strict';

angular.module('plm360.mockData').value('MockBomChangeCompiledData',
    (function () {
        let editChangeA = {
            "changeType": "edit",
            "edgeId": "346",
            "drivingChanges": null,
            "payload": {
                "fields": [
                    {
                        "__self__":"/api/v3/workspaces/8/items/2697/bom-items/346/fields/WEIGHT_TOTAL",
                        "value":"2.2",
                        "fieldId":"WEIGHT_TOTAL",
                        "fieldTab":"CUSTOM_BOM"
                    }
                ],
                "quantity":"23",
            },
            "enhancedWithLink": "/api/v3/workspaces/8/items/2909/bom-items/346"
        };

        let editChangeB = {
            "changeType": "edit",
            "edgeId": "347",
            "drivingChanges": null,
            "payload": {
                "fields": [],
                "quantity": "410",
            },
            "enhancedWithLink": "/api/v3/workspaces/8/items/2909/bom-items/347"
        }

        let addChangeA = {
            "changeType": "add",
            "edgeId": "348",
            "drivingChanges": null,
            "payload": {
                "fields": [],
                "quantity": "410",
            }
        }

        let removeChangeA = {
            "changeType": "remove",
            "edgeId": "349",
            "drivingChanges": null,
            "payload": {},
            "enhancedWithLink": "/api/v3/workspaces/8/items/2909/bom-items/349"
        }

        let editMap = new Map();
        editMap.set('346', editChangeA);

        let addMap = new Map();
        addMap.set('348', addChangeA);

        let removeMap = new Map()
        removeMap.set('349', removeChangeA);

        let allChangesMap = new Map();
        allChangesMap.set('346', editChangeA);
        allChangesMap.set('347', editChangeB);
        allChangesMap.set('348', addChangeA);
        allChangesMap.set('349', removeChangeA);



        return {
            editMap: editMap,
            addMap: addMap,
            removeMap: removeMap,
            allChangesMap: allChangesMap
        };
    })()
);
