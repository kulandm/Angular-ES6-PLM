'use strict';

angular.module('plm360.mockData').value('MockItemPart', {
	"parts": [
		{
			"id": 1,
			"classifications": {
				"description": "classifications",
				"link": "parts/1/classifications",
				"size": 1
			},
			"data": {
				"FIELD_TEXT": "Item field text value",
				"FIELD_NUMBER": 123,
				"FIELD_PICKLIST": {"value": "picklist_value", "displayValue": "Picklist Value"}
			},
			"referenceUrn": "urn:adsk.plm:tenant.workspace.item:TENANT/1/2",
			"ext": {},
			"__self__": "parts/1",
			"__urn__": "urn:adsk.cws:part:1"
		}
	],
	"sort": "id",
	"direction": "asc",
	"page": 1,
	"size": 1
});

angular.module('plm360.mockData').value('MockItemPartAsClass', {
	"id": 1,
	"classifications": {
		"description": "classifications",
		"link": "parts/1/classifications",
		"size": 1
	},
	"data": {
		"FIELD_TEXT": "Item field text value",
		"FIELD_NUMBER": 123,
		"FIELD_PICKLIST": {"value": "picklist_value", "displayValue": "Picklist Value"}
	},
	"referenceUrn": "urn:adsk.plm:tenant.workspace.item:TENANT/1/2",
	"ext": {},
	"__self__": "parts/1",
	"__urn__": "urn:adsk.cws:part:1"
});

angular.module('plm360.mockData').value('MockItemPartAsService', [{
	"id": 1,
	"classifications": {
		"description": "classifications",
		"link": "parts/1/classifications",
		"size": 1
	},
	"data": {
		"PICKLIST": {
			"displayValue": null,
			"value": null
		},
		"NUMBER": 12,
		"TEXT": "text"
	},
	"referenceUrn": "urn:adsk.plm:tenant.workspace.item:SELENIUM/1/1234",
	"ext": {
	},
	"__self__": "parts/1",
	"__urn__": "urn:adsk.cws:part:1"
}]);