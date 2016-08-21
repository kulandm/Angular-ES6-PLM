'use strict';

angular.module('plm360.mockData').value('MockPropertyPagination',{
    "properties": [
        {
            "id": 14,
            "name": "TOP_PICKLIST_FIELD",
            "displayName": "Top Picklist Field",
            "type": "picklist",
            "defaultValue": "Top default value",
            "description": null,
            "ext": {},
            "constraints": {
                "description": "constraints",
                "link": "properties/14/constraints",
                "size": 1
            },
            "readOnly": false,
            "required": false,
            "__self__": "properties/14",
            "__urn__": "urn:adsk.cws:property:14"
        }
    ],
    "sort": "id",
    "direction": "asc",
    "page": 1,
    "size": 1
});