'use strict';

angular.module('plm360.mockData').value('MockParagraphWithoutLineBreaksFieldData', {
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		id: '8@2887',
		value: 'No more line breaks!\n\nEven though I added some before this  line!',
		originalValue: 'No more line breaks!\n\nEven though I added some before this  line!',
		editActive: false,
		fieldTypeId: 'PARAGRAPH_WITHOUT_LINE_BREAK',
		metadata: {
			dataTypeId: 17,
			fieldLength: 200
		}
	},
	meta: {
		__self__: '/api/v3/workspaces/9/views/11/fields/PARAGRAPH_WITHOUT_LINE_BREAK',
		name: 'Paragraph without Line Break',
		description: '',
		type: {
			link: '/api/v3/field-types/17',
			title: 'Paragraph w/o Line Breaks',
			urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE.17',
			permissions: []
		},
		defaultValue: null,
		unitOfMeasure: null,
		fieldLength: 200,
		fieldPrecision: null,
		displayOrder: 4,
		displayLength: 50,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false,
		picklist: null,
		validators: '/api/v3/workspaces/9/views/11/fields/PARAGRAPH_WITHOUT_LINE_BREAK/validators',
		label: null,
		picklistFieldDefinition: null,
		visibleOnPreview: null
	}
});
