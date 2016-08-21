'use strict';

angular.module('plm360.mockData').value('MockFieldData', [
	{
		id: 'NAME',
		displayName: 'Name',
		description: null,
		fieldTypeId: 'PICK_LIST_RADIO',
		fieldMetadata: {
			unitOfMeasure: null,
		},
		displayLength: 30,
		fieldLength: 30,
		editable: 'ALWAYS',
		visible: 'ALWAYS',
		defaultValue: null,
		fieldPrecision: null,
		isDerived: false,
		pivotFieldDefinitionId: null,
		sourceFieldDefinitionId: null,
		picklistId: null,
		picklistFieldDefinitionId: null,
		triggerAjax: false,
		sentToAjax: false,
		metadata: {
			dataTypeId: 4
		},
		validations: [
			{
				id: 4,
				type: 'UNIQUE',
				settings: {
					fieldid: 'NAME'
				}
			},
			{
				id: 3,
				type: 'REQUIRED',
				settings: {}
			}
		],
		type: 'FIELD',
		value: 'test5-2'
	},
	{
		id: 'TEXT_INPUT',
		displayName: 'Text Input',
		description: null,
		fieldTypeId: 'IMAGE',
		fieldMetadata: {
			unitOfMeasure: null,
		},
		dataTypeId: 4,
		unitOfMeasure: null,
		displayLength: 50,
		fieldLength: 50,
		editable: 'NEVER',
		visible: 'ALWAYS',
		defaultValue: null,
		fieldPrecision: null,
		isDerived: false,
		pivotFieldDefinitionId: null,
		sourceFieldDefinitionId: null,
		picklistId: null,
		picklistFieldDefinitionId: null,
		triggerAjax: false,
		sentToAjax: false,
		metadata: {
			dataTypeId: 4
		},
		validations: null,
		type: 'FIELD',
		value: undefined
	},
	{
		id: 'PARAGRAPH',
		displayName: 'Paragraph',
		description: null,
		fieldTypeId: 'IMAGE',
		fieldMetadata: {
			unitOfMeasure: null,
		},
		dataTypeId: 8,
		unitOfMeasure: null,
		displayLength: 50,
		fieldLength: 50,
		editable: 'NEVER',
		visible: 'ALWAYS',
		defaultValue: null,
		fieldPrecision: null,
		isDerived: false,
		pivotFieldDefinitionId: null,
		sourceFieldDefinitionId: null,
		picklistId: null,
		picklistFieldDefinitionId: null,
		triggerAjax: false,
		sentToAjax: false,
		metadata: {
			dataTypeId: 8
		},
		validations: null,
		type: 'FIELD',
		value: "<b>a paragraph<i>with</i><br />HTML<p>injected</p></b>javascript:void(document.cookie='Authorized=yes');<script>javascript:alert('testing');</script>"
	},
	{
		id: 'FLASH',
		displayName: 'Flash',
		description: null,
		fieldTypeId: 7,
		dataTypeId: 21,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 21
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/21',
			title: 'Flash'
		},
		value: {
			link: '/api/v2/workspaces/109/items/6939/field-values/FLASHFIELD/image/105'
		}
	},
	{
		id: 'FLOAT',
		displayName: 'Float L5_P2',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 5,
			fieldPrecision: 2
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '12.23'
	},
	{
		id: 'FLOAT',
		displayName: 'Float L5_P2B',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 5,
			fieldPrecision: 2
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '12.2'
	},
	{
		id: 'FLOAT',
		displayName: 'Float L10_P4',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 10,
			fieldPrecision: 4
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '1234.5'
	},
	{
		id: 'FLOAT',
		displayName: 'Float L10_P4B',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 10,
			fieldPrecision: 4
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '1234.456'
	},
	{
		id: 'FLOAT',
		displayName: 'Float L10_P4C',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 10,
			fieldPrecision: 4
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '1234'
	},
	{
		id: 'FLOAT',
		displayName: 'Float L10_PBLANK',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 10,
			fieldPrecision: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '345678'
	},
	{
		id: 'FLOAT',
		displayName: 'Float L10_P4NOW2',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 10,
			fieldPrecision: 2
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '1234.4567'
	},
	{
		id: 'MONEY',
		displayName: 'Money L6_P2',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 6,
			fieldPrecision: 2,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '123.23'
	},
	{
		id: 'MONEY',
		displayName: 'Money L8_P2',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 8,
			fieldPrecision: 2,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '12345.23'
	},
	{
		id: 'MONEY',
		displayName: 'Money L10_P2',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 10,
			fieldPrecision: 2,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '123456.5'
	},
	{
		id: 'MONEY',
		displayName: 'Money L10_P4',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 10,
			fieldPrecision: 4,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '1234.456'
	},
	{
		id: 'MONEY',
		displayName: 'Money L10_P4B',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 10,
			fieldPrecision: 4,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '123456'
	},
	{
		id: 'MONEY',
		displayName: 'Money L10_P4C',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 10,
			fieldPrecision: 0,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '123456789'
	},
	{
		id: 'MONEY',
		displayName: 'Money L10_PBLANK',
		description: null,
		fieldTypeId: 31,
		dataTypeId: 31,
		unitOfMeasure: null,
		metadata: {
			dataTypeId: 31
		},
		fieldMetadata: {
			fieldLength: 10,
			fieldPrecision: null,
			unitOfMeasure: null
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/31',
			title: 'Money'
		},
		value: '123456789.00'
	},
	{
		id: 'IMAGE',
		displayName: 'Image',
		description: null,
		fieldTypeId: 7,
		dataTypeId: 15,
		unitOfMeasure: null,
		fieldMetadata: {
			unitOfMeasure: null,
		},
		metadata: {
			dataTypeId: 15
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/15',
			title: 'image'
		},
		value: {
			link: '/api/v2/workspaces/109/items/6939/field-values/IMAGEFIELD/image/105'
		}
	},
	{
		id: 'FLOAT',
		displayName: 'Float with uom',
		description: null,
		fieldTypeId: 2,
		dataTypeId: 2,
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		metadata: {
			dataTypeId: 2,
			fieldLength: 10,
			fieldPrecision: 2
		},
		validations: null,
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float'
		},
		value: '1234.4567'
	}
]);
