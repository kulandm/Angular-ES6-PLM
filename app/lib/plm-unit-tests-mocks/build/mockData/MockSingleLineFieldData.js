'use strict';

angular.module('plm360.mockData').value('MockSingleLineFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'SLT',
		id: '59@6733',
		metadata: {
			dataTypeId: 4,
			fieldLength: 100
		},
		value: 'What!?!'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/SLT',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 80,
		displayOrder: 2,
		editability: 'ALWAYS',
		fieldLength: 100,
		fieldPrecision: null,
		label: null,
		name: 'SLT',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/4',
			title: 'Single Line Text',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.4'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/SLT/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	},
	newData: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'SLT',
		id: '59@6733',
		metadata: {
			dataTypeId: 4,
			fieldLength: 100
		},
		value: 'Not What!?!'
	}
});
