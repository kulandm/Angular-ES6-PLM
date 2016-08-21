'use strict';

angular.module('plm360.mockData').value('MockCheckboxFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 9
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.TEST",
		value: false
	},
	meta: {
		dataTypeId: 9
	}
});
