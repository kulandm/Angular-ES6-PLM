'use strict';

angular.module('plm360.mockData').value('MockEmailFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		editActive: false,
		fieldTypeId: 'MAIL',
		id: '59@6733',
		metadata: {
			dataTypeId: 18,
			fieldLength: 100
		},
		originalValue: 'email@email.com',
		value: 'email@email.com'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/MAIL',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 100,
		displayOrder: 3,
		editability: 'ALWAYS',
		fieldLength: 3,
		fieldPrecision: null,
		label: null,
		name: 'Mail',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/18',
			title: 'Email',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.18'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/MAIL/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	}
});
