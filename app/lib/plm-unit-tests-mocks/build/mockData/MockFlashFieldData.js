'use strict';

angular.module('plm360.mockData').value('MockFlashFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: ''
		},
		link: "/api/v3/workspaces/47/views/1/fields/FLASH",
		metadata: {
			dataTypeId: 21
		},
		permissions: [],
		title: "Flash",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.FLASH",
		value: {
			link: "/api/v2/workspaces/47/items/2694/field-values/FLASH/flash/45",
			permissions: [],
			urn: "urn:adsk.plm:tenant.workspace.item.field-value.flash:DEVINDMACHINETEST.47.2694.FLASH.45"
		}
	},
	meta: {
		dataTypeId: 15
	}
});
