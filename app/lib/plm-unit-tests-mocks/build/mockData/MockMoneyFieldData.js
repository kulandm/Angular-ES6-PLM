'use strict';

angular.module('plm360.mockData').value('MockMoneyFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'MONEY',
		id: '59@6733',
		metadata: {
			dataTypeId: 31,
			fieldLength: 4,
			fieldPrecision: 2
		},
		originalValue: '123456789.1234',
		value: '123456789.1234'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/MONEY',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 5,
		displayOrder: 6,
		editability: 'ALWAYS',
		fieldLength: 4,
		fieldPrecision: 2,
		label: null,
		name: 'Money',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.31'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/MONEY/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	}
});
