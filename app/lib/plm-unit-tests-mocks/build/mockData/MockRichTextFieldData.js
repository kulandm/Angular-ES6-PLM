'use strict';

angular.module('plm360.mockData').value('MockRichTextFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		id: '8@2783',
		value: 'Here is a sentence.<b>We have some bold characters.</b>',
		originalValue: 'Here is a sentence.<b>We have some bold characters.</b>',
		editActive: false,
		fieldTypeId: 'PARAGRAPH',
		metadata: {
			dataTypeId: 8
		}
	},
	meta: {
		__self__: '/api/v3/workspaces/9/views/11/fields/PARAGRAPH',
		name: 'Paragraph',
		description: '',
		type: {
			link: '/api/v3/field-types/8',
			title: 'Paragraph',
			urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE.8',
			permissions: []
		},
		defaultValue: null,
		unitOfMeasure: null,
		fieldLength: null,
		fieldPrecision: null,
		displayOrder: 3,
		displayLength: 50,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false,
		picklist: null,
		validators: '/api/v3/workspaces/9/views/11/fields/PARAGRAPH/validators',
		label: null,
		picklistFieldDefinition: null,
		visibleOnPreview: null
	}
});
