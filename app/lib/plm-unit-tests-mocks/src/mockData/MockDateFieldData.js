'use strict';

angular.module('plm360.mockData').value('MockDateFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		link: "/api/v3/workspaces/47/views/1/fields/TESTDATE",
		metadata: {
			dataTypeId: 3
		},
		permissions: [],
		title: "testdate",
		type: "FIELD",
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE.47.1.TESTDATE",
		value: "2015-08-30"
	},
	meta: {
		__self__: "/api/v3/workspaces/47/views/1/fields/TESTDATE",
		defaultValue: null,
		derived: false,
		description: "",
		displayLength: null,
		displayOrder: 3,
		editability: "ALWAYS",
		fieldLength: null,
		fieldPrecision: null,
		label: null,
		name: "testdate",
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: "/api/v3/field-types/3",
			permissions: [],
			title: "Date",
			urn: "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.3"
		},
		unitOfMeasure: null,
		validators: "/api/v3/workspaces/47/views/1/fields/TESTDATE/validators",
		visibility: "ALWAYS",
		visibleOnPreview: false
	}
});
