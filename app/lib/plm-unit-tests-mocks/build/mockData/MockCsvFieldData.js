'use strict';

angular.module('plm360.mockData').value('MockCsvFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'CSV',
		id: '59@6733',
		metadata: {
			dataTypeId: 19,
			fieldLength: 3
		},
		value: '100'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/CSV',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 3,
		displayOrder: 4,
		editability: 'ALWAYS',
		fieldLength: 3,
		fieldPrecision: null,
		label: null,
		name: 'CSV',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/19',
			title: 'CSV',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.19'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/CSV/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	},
	newData: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'CSV',
		id: '59@6733',
		metadata: {
			dataTypeId: 19,
			fieldLength: 3
		},
		value: '200'
	},
});
