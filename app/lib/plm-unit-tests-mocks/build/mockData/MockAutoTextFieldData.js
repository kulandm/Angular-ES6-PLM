'use strict';

angular.module('plm360.mockData').value('MockAutoTextFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		fieldTypeId: 'MAIL',
		id: '59@6733',
		metadata: {
			dataTypeId: 12
		},
		value: 'test'
	},
	meta: {
		defaultValue: null,
		derived: false,
		description: '',
		displayOrder: 3,
		name: 'Mail',
		visibility: 'ALWAYS',
		visibleOnPreview: null
	}
});
