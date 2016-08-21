'use strict';

angular.module('plm360.mockData').value('MockImageFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: ''
		},
		link: "/api/v3/workspaces/47/views/1/fields/IMAGE",
		metadata: {
			dataTypeId: 15
		},
		permissions: [],
		title: "Image",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.IMAGE",
		value: {
			link: "/api/v2/workspaces/47/items/2694/field-values/IMAGE/image/45",
			permissions: [],
			urn: "urn:adsk.plm:tenant.workspace.item.field-value.image:DEVINDMACHINETEST.47.2694.IMAGE.45"
		}
	},
	meta: {
		dataTypeId: 15
	}
});
