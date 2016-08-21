'use strict';

angular.module('plm360.mockData').value('MockPropertyInstances', {
	"propertyInstances": [
		{
			"id": 1,
			"properties": {
				"description": "properties",
				"link": "property-instances/1/properties"
			},
			"displayName": "Top Text Field",
			"displayNameOverridden": false,
			"displayNameSuppressed": false,
			"defaultValue": null,
			"defaultValueOverridden": false,
			"defaultValueSuppressed": false,
			"description": null,
			"descriptionOverridden": false,
			"descriptionSuppressed": false,
			"inherited": true,
			"overridden": false,
			"suppressed": false,
			"ext": {},
			"constraintInstances": {
				"description": "constraintInstances",
				"link": "property-instances/1/constraint-instances",
				"size": 0
			},
			"name": "FIELD_TEXT",
			"type": "text",
			"readOnly": false,
			"required": false,
			"__self__": "property-instances/1",
			"__urn__": "urn:adsk.cws:property-instance:1"
		},
		{
			"id": 2,
			"properties": {
				"description": "properties",
				"link": "property-instances/2/properties"
			},
			"displayName": "field number",
			"displayNameOverridden": false,
			"displayNameSuppressed": false,
			"defaultValue": 111,
			"defaultValueOverridden": false,
			"defaultValueSuppressed": false,
			"description": null,
			"descriptionOverridden": false,
			"descriptionSuppressed": false,
			"inherited": false,
			"overridden": false,
			"suppressed": false,
			"ext": {},
			"constraintInstances": {
				"description": "constraintInstances",
				"link": "property-instances/2/constraint-instances",
				"size": 0
			},
			"name": "FIELD_NUMBER",
			"type": "number",
			"readOnly": false,
			"required": false,
			"__self__": "property-instances/2",
			"__urn__": "urn:adsk.cws:property-instance:2"
		},
		{
			"id": 3,
			"properties": {
				"description": "properties",
				"link": "property-instances/3/properties"
			},
			"displayName": "Field Picklist",
			"displayNameOverridden": false,
			"displayNameSuppressed": false,
			"defaultValue": null,
			"defaultValueOverridden": false,
			"defaultValueSuppressed": false,
			"description": null,
			"descriptionOverridden": false,
			"descriptionSuppressed": false,
			"inherited": false,
			"overridden": false,
			"suppressed": false,
			"ext": {},
			"constraintInstances": {
				"description": "constraintInstances",
				"link": "property-instances/3/constraint-instances",
				"size": 0
			},
			"name": "FIELD_PICKLIST",
			"type": "picklist",
			"readOnly": false,
			"required": false,
			"__self__": "property-instances/3",
			"__urn__": "urn:adsk.cws:property-instance:3"
		}
	],
	"sort": "id",
	"direction": "asc",
	"page": 1,
	"size": 3
});