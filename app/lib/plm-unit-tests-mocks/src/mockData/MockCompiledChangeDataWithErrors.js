'use strict';

angular.module('plm360.mockData').value('MockCompiledChangeDataWithErrors', (() => {

	let editChange = {
		changeType: "edit",
		edgeId: "912",
		drivingChanges: new Map(),
		payload: {
			"fields": [
				{
					"__self__": "/api/v3/workspaces/8/items/2697/bom-items/346/fields/WEIGHT_TOTAL",
					"value": "2.2",
					"fieldId": "WEIGHT_TOTAL",
					"fieldTab": "CUSTOM_BOM"
                    }
                ],
			"quantity": "23",
		},
		serverError: [{
			"message": "{0} must be a valid decimal number with at most {1} decimal digits.",
			"code": "errors.float.precision",
			"arguments": ["float_field", "2"],
			"field": {
				"__self__": "/api/v3/workspaces/47/views/5/fields/FLOAT_FIELD",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.5.FLOAT_FIELD",
				"title": "float_field",
				"type": {
					"link": "/api/v3/field-types/2",
					"title": "Float",
					"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.2",
					"permissions": []
				},
				"value": "324342342342343fsdfs"
			}
}, {
			"message": "{0} cannot be greater than {1} characters.",
			"code": "errors.maxlength",
			"arguments": ["prod_single", "10"],
			"field": {
				"__self__": "/api/v3/workspaces/47/views/5/fields/PROD_SINGLE",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.5.PROD_SINGLE",
				"title": "prod_single",
				"type": {
					"link": "/api/v3/field-types/4",
					"title": "Single Line Text",
					"urn": "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4",
					"permissions": []
				},
				"value": "sfdsdafsdfsdfsadfsdfd"
			}
}]
	};


	let fieldEditA = {
		changeId: 0,
		changeType: "fieldEdit",
		currentValue: "324342342342343fsdfs",
		edgeId: "912",
		originalValue: "",
		serverError: null,
		targetFieldData: {
			fieldPropertyId: "FLOAT_FIELD",
			viewDefTarget: "/api/v3/workspaces/47/views/2/fields/FLOAT_FIELD",
			fieldTab: "CUSTOM_BOM",
			getFieldId: () => "field.float.urn"
		}
	};
	let fieldEditB = {
		changeId: 3,
		changeType: "fieldEdit",
		currentValue: "sfdsdafsdfsdfsadfsdfd",
		edgeId: "912",
		originalValue: "",
		serverError: null,
		targetFieldData: {
			fieldPropertyId: "PROD_SINGLE",
			viewDefTarget: "/api/v3/workspaces/47/views/2/fields/PROD_SINGLE",
			fieldTab: "CUSTOM_BOM",
			getFieldId: () => "prod.single.urn"
		}
	}

	let editList = [];
	editList.push(fieldEditA);
	editList.push(fieldEditB);
	let changeMap = new Map();
	changeMap.set('fieldEdit', editList);
	editChange.drivingChanges = changeMap;

	return {
		compliedChange: editChange
	};
})());
