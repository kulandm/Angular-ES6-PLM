'use strict';

angular.module('plm360.mockData').value('MockMultiPicklistFieldData', {
	data: {
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 13
		},
		options: {
			__self__: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
			first: {
				count: 2,
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
				permissions: [],
				title: "First",
				urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO",
			},
			items: [{
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
				title: "Yes"
			}, {
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/2",
				title: "No"
			}],
			last: {
				count: 2,
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
				permissions: [],
				title: "Last",
				urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO"
			},
			limit: 10,
			offset: 0,
			totalCount: 2,
			urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO"
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.TEST",
		value: [
			{
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
				permissions: [],
				title: "Multi Picklist Value 1",
				urn: "urn:adsk.plm:tenant.lookup.option:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO.1"
			},
			{
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
				permissions: [],
				title: "Multi Picklist Value 2",
				urn: "urn:adsk.plm:tenant.lookup.option:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO.2"
			}
		]
	},
	meta: {
		defaultValue: "0",
		derived: false,
		description: "",
		displayLength: null,
		displayOrder: 1,
		editability: "ALWAYS",
		fieldLength: null,
		fieldPrecision: null,
		label: null,
		name: "test",
		picklist: "/api/v3/picklists/CUSTOM_LOOKUP_YES_NO",
		picklistFieldDefinition: null,
		type: {
			link: "/api/v3/field-types/13",
			permissions: [],
			title: "Multi Picklist",
			urn: "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.10"
		},
		unitOfMeasure: null,
		validators: null,
		visibility: "ALWAYS",
		visibleOnPreview: false
	}
});
