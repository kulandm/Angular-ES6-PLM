'use strict';

angular.module('plm360.mockData').value('MockIntegerFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'INT',
		id: '59@6733',
		metadata: {
			dataTypeId: 1,
			fieldLength: 3
		},
		originalValue: '5',
		value: '5'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/INT',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 3,
		displayOrder: 1,
		editability: 'ALWAYS',
		fieldLength: 3,
		fieldPrecision: null,
		label: null,
		name: 'Int',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/1',
			title: 'Integer',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.1'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/INT/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	}
});
