'use strict';

angular.module('plm360.mockData').value('MockClassification', [{
		"id": 1,
		"name": "CLASSIFICATION_OBJECT",
		"displayName": "Classification Object",
		"description": "",
		"parents": {
			"description": "parents",
			"link": "classifications/1/parents",
			"size": 1
		},
		"children": {
			"description": "children",
			"link": "classifications/1/children",
			"size": 1
		},
		"propertyInstances": {
			"description": "propertyInstances",
			"link": "classifications/1/property-instances",
			"size": 1
		},
		"ext": {
			"abstract": false
		},
		"effectiveSchema": {
			"FIELD_TEXT": null,
			"FIELD_NUMBER": null,
			"FIELD_PICKLIST": null
		},
		"__self__": "classifications/1",
		"__urn__": "urn:adsk.cws:classification:1"
	},
	{
		"id": 2,
		"name": "CLASSIFICATION_OBJECT",
		"displayName": "Classification Object 2",
		"description": "",
		"parents": {
			"description": "parents",
			"link": "classifications/2/parents",
			"size": 1
		},
		"children": {
			"description": "children",
			"link": "classifications/2/children",
			"size": 1
		},
		"propertyInstances": {
			"description": "propertyInstances",
			"link": "classifications/2/property-instances",
			"size": 1
		},
		"ext": {
			"abstract": false
		},
		"effectiveSchema": {
			"FIELD_TEXT": 'Classification 2 FIELD_TEXT',
			"FIELD_NUMBER": 88888,
			"FIELD_PICKLIST": null,
			"FIELD_TEXT_2": 'Classification 2 FIELD_TEXT 2'
		},
		"__self__": "classifications/2",
		"__urn__": "urn:adsk.cws:classification:2"
	},
	{
		"id": 3,
		"name": "CLASSIFICATION_OBJECT",
		"displayName": "Classification Object 3",
		"description": "",
		"parents": {
			"description": "parents",
			"link": "classifications/3/parents",
			"size": 1
		},
		"children": {
			"description": "children",
			"link": "classifications/3/children",
			"size": 1
		},
		"propertyInstances": {
			"description": "propertyInstances",
			"link": "classifications/3/property-instances",
			"size": 1
		},
		"ext": {
			"abstract": false
		},
		"effectiveSchema": {
			"FIELD_TEXT": 'Classification 3 FIELD_TEXT',
			"FIELD_NUMBER": 88888,
			"FIELD_PICKLIST": null,
			"FIELD_TEXT_2": 'Classification 3 FIELD_TEXT 2'
		},
		"__self__": "classifications/3",
		"__urn__": "urn:adsk.cws:classification:3"
	}
]);
