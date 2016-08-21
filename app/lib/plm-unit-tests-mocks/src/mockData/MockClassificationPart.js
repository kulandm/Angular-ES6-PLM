'use strict';

angular.module('plm360.mockData').value('MockClassificationPart',{
	"classifications": [
		{
			"id": 1,
			"name": "CLASSIFICATION_OBJECT",
			"displayName": "Classification Object",
			"description": "Tenant's root node",
			"parents": {
				"description": "parents",
				"link": "classifications/1/parents",
				"size": 0
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
			"ext": {},
			"effectiveSchema": {
				"FIELD_TEXT": null,
				"FIELD_NUMBER": null,
				"FIELD_PICKLIST": null
			},
			"__self__": "classifications/1",
			"__urn__": "urn:adsk.cws:classification:1"
		}
	],
	"sort": "id",
	"direction": "asc",
	"page": 1,
	"size": 1
});