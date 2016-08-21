'use strict';

angular.module('plm360.mockData').value('MockClassificationParent', [{
	"classifications": [{
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
	}],
	"sort": "id",
	"direction": "asc",
	"page": 1,
	"size": 1
},{
	"classifications": [{
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
			"FIELD_TEXT": null,
			"FIELD_NUMBER": null,
			"FIELD_PICKLIST": null
		},
		"__self__": "classifications/2",
		"__urn__": "urn:adsk.cws:classification:2"
	}],
	"sort": "id",
	"direction": "asc",
	"page": 1,
	"size": 1
}]);
