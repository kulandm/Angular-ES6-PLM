'use strict';

angular.module('plm360.mockData').value('MockFloatFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'FLOAT',
		id: '59@6733',
		metadata: {
			dataTypeId: 2,
			fieldLength: 5,
			fieldPrecision: 3
		},
		originalValue: '1',
		value: '1'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/FLOAT',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 5,
		displayOrder: 5,
		editability: 'ALWAYS',
		fieldLength: 5,
		fieldPrecision: 3,
		label: null,
		name: 'Float',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.2'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/FLOAT/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	}
});
