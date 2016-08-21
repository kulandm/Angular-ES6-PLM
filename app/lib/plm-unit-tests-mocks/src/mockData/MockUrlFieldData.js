'use strict';

angular.module('plm360.mockData').value('MockUrlFieldData', {
	data: {
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 16
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE.47.1.TEST",
		value: "www.autodesk.com"
	},
	meta: {
		defaultValue: "",
		derived: false,
		description: "",
		displayLength: 10,
		displayOrder: 1,
		editability: "ALWAYS",
		fieldLength: 10,
		fieldPrecision: null,
		label: null,
		name: "test",
		picklist: null,
		picklistFieldDefinition: null,
		unitOfMeasure: null,
		validators: null,
		visibility: "ALWAYS",
		visibleOnPreview: false
	}
});
