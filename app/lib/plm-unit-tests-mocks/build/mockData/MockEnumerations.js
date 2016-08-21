'use strict';

angular.module('plm360.mockData').value('MockEnumerations',{
    "enumerations": [
        {
            "id": 1,
            "value": "a value",
            "displayValue": "any string",
            "rank": 1,
            "ext": {},
            "__self__": "enumerations/1",
            "__urn__": "urn:adsk.cws:enumeration:1"
        },
        {
            "id": 2,
            "value": "bbb",
            "displayValue": "BBB",
            "rank": 0,
            "ext": {},
            "__self__": "enumerations/2",
            "__urn__": "urn:adsk.cws:enumeration:2"
        },
        {
            "id": 3,
            "value": "ccc",
            "displayValue": "CCC",
            "rank": 2,
            "ext": {},
            "__self__": "enumerations/3",
            "__urn__": "urn:adsk.cws:enumeration:3"
        }
    ],
    "sort": "id",
    "direction": "asc",
    "page": 1,
    "size": 3
});