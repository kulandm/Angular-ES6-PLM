'use strict';

angular.module('plm360.mockData').value('MockLongFieldData', {
	data: {
		editActive: false,
		fieldTypeId: 'LONG',
		id: '59@6733',
		metadata: {
			dataTypeId: 30,
			fieldLength: 5
		},
		originalValue: '5000',
		value: '5000'
	},
	meta: {
		__self__: '/api/v3/workspaces/59/views/11/fields/LONG',
		defaultValue: null,
		derived: false,
		description: '',
		displayLength: 5,
		displayOrder: 1,
		editability: 'ALWAYS',
		fieldLength: 5,
		fieldPrecision: null,
		label: null,
		name: 'Long',
		picklist: null,
		picklistFieldDefinition: null,
		type: {
			link: '/api/v3/field-types/30',
			title: 'Long',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.30'
		},
		unitOfMeasure: null,
		validators: '/api/v3/workspaces/59/views/11/fields/LONG/validators',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	}
});
