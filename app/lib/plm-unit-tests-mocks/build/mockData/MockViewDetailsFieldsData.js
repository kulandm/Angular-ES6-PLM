'use strict';

angular.module('plm360.mockData').value('MockViewDetailsFieldsData', [{
	collapsable: false,
	description: 'Test Section 1',
	displayName: 'Test Section 1',
	sectionLocked: false,
	fields: [{
		defaultValue: null,
		description: null,
		displayLength: 30,
		displayName: 'Test Field 1',
		editable: 'ALWAYS',
		fieldLength: 30,
		fieldMetadata: {
			__self__: '/api/v3/workspaces/9/views/1/fields/SINGLE_SELECTION',
			dataTypeId: '23',
			defaultValue: null,
			derived: false,
			description: '',
			displayLength: 30,
			editability: 'ALWAYS',
			fieldLength: 30,
			fieldPrecision: null,
			name: 'Single Selection',
			picklist: '/api/v3/picklists/CUSTOM_LOOKUP_PRODUCT',
			picklistFieldDefinition: '/api/v3/workspaces/47/views/1/fields/DESCRIPTOR',
			picklistPayload: {
				__self__: '/api/v3/lookups/CUSTOM_LOOKUP_PRODUCT?offset=0&limit=10',
				first: {
					count: 2,
					link: '/api/v3/lookups/CUSTOM_LOOKUP_PRODUCT?offset=0&limit=10',
					permissions: [],
					title: 'First',
					urn: 'urn:adsk.plm:tenant.lookup:DEVINDMACHINE1001.CUSTOM_LOOKUP_PRODUCT'
				},
				items: [
					{
						link: '/api/v3/workspaces/47/items/2948',
						permissions: [],
						title: ' - test BOM',
						urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.47.2948'
					},
					{
						link: '/api/v3/workspaces/47/items/2694',
						permissions: [],
						title: 'EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable',
						urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.47.2694'
					}
				],
				last: {
					count: 2,
					link: '/api/v3/lookups/CUSTOM_LOOKUP_PRODUCT?offset=0&limit=10',
					permissions: [],
					title: 'Last',
					urn: 'urn:adsk.plm:tenant.lookup:DEVINDMACHINE1001.CUSTOM_LOOKUP_PRODUCT'
				},
				limit: 10,
				offset: 0,
				totalCount: 2,
				urn: 'urn:adsk.plm:tenant.lookup:DEVINDMACHINE1001.CUSTOM_LOOKUP_PRODUCT'
			},
			type: {
				link: '/api/v3/field-types/23',
				permissions: [],
				title: 'Single Selection',
				urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
			},
			unitOfMeasure: null,
			validators: '/api/v3/workspaces/9/views/1/fields/SINGLE_SELECTION/validators',
			visibility: 'ALWAYS',
			visibleOnPreview: false
		},
		fieldPrecision: null,
		fieldTypeId: 'SINGLE_LINE_TEXT',
		id: 'TEST_FIELD_1',
		isDerived: false,
		metadata: {
			dataTypeId: '23',
			type: {
				link: '/api/v3/field-types/23',
				permissions: [],
				title: 'Single Selection',
				urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
			}
		},
		picklistFieldDefinitionId: null,
		picklistId: null,
		pivotFieldDefinitionId: null,
		sentToAjax: false,
		sourceFieldDefinitionId: null,
		triggerAjax: false,
		type: {
			link: '/api/v3/field-types/23',
			permissions: [],
			title: 'Single Selection',
			urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
		},
		unitOfMeasure: null,
		validations: [{
			id: 1,
			settings: {
				fieldId: 'TEST_FIELD_1'
			},
			type: 'UNIQUE'
		}, {
			id: 2,
			settings: {},
			type: 'REQUIRED'
		}],
		value: 'test value 1',
		visible: 'ALWAYS'
	}, {
		defaultValue: null,
		description: null,
		displayLength: 50,
		displayName: 'Test Field 2',
		editable: 'ALWAYS',
		fieldLength: 100,
		fieldPrecision: null,
		fieldTypeId: 'PARAGRAPH_NO_LINE_BREAK',
		id: 'TEST_FIELD_2',
		isDerived: false,
		metadata: {
			dataTypeId: '20',
			type: {
				link: '/api/v3/field-types/20',
				permissions: [],
				title: 'Single Selection',
				urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.20'
			}
		},
		picklistFieldDefinitionId: null,
		picklistId: null,
		pivotFieldDefinitionId: null,
		sentToAjax: false,
		sourceFieldDefinitionId: null,
		triggerAjax: false,
		type: {
			link: '/api/v3/field-types/20',
			permissions: [],
			title: 'Single Selection',
			urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.20'
		},
		unitOfMeasure: null,
		validations: null,
		value: '',
		visible: 'ALWAYS'
	}],
	id: 1
}, {
	collapsable: true,
	description: 'Test Section 2',
	displayName: 'Test Section 2',
	sectionLocked: false,
	fields: [{
		defaultValue: '',
		description: '',
		displayLength: 60,
		displayName: 'Test Field 3',
		editable: 'ALWAYS',
		fieldLength: null,
		fieldPrecision: null,
		fieldTypeId: 'PARAGRAPH',
		id: 'TEST_FIELD_3',
		isDerived: false,
		metadata: {
			dataTypeId: '20',
			type: {
				link: '/api/v3/field-types/20',
				permissions: [],
				title: 'Single Selection',
				urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.20'
			}
		},
		picklistFieldDefinitionId: null,
		picklistId: null,
		pivotFieldDefinitionId: null,
		sentToAjax: false,
		sourceFieldDefinitionId: null,
		triggerAjax: false,
		type: {
			link: '/api/v3/field-types/20',
			permissions: [],
			title: 'Single Selection',
			urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.20'
		},
		unitOfMeasure: null,
		validations: [{
			id: 3,
			settings: {
				maxlength: '1000'
			},
			type: 'MAX_LENGTH'
		}],
		value: '',
		visible: 'ALWAYS'
	}],
	id: 2
}, {
	collapsable: true,
	sectionLocked: true,
	description: 'Test (Empty) Section 1',
	displayName: 'Test (Empty) Section 1',
	fields: [],
	id: 3
}, {
	collapsable: true,
	description: 'Test Section With Matrix 1',
	displayName: 'Test Section With Matrix 1',
	sectionLocked: false,
	fields: [{
		type: 'MATRIX',
		urn: 'urn:adsk.plm:tenant.workspace.section.matrix:DEVINDMACHINE1001.70.265.1',
		width: 2,
		height: 2,
		columnNames: [
			'Col 1',
			'Col 2'
		],
		rowNames: [
			'Row 1',
			'Row 2'
		],
		definition: {
			fields: [[{
				defaultValue: null,
				description: null,
				displayLength: 50,
				displayName: 'Test Field 1_1',
				editable: 'ALWAYS',
				fieldLength: 100,
				fieldPrecision: null,
				fieldTypeId: 'PARAGRAPH_SINGLE_LINE_TEXT',
				id: 'TEST_FIELD_1_1',
				isDerived: false,
				metadata: {
					dataTypeId: '23',
					type: {
						link: '/api/v3/field-types/23',
						permissions: [],
						title: 'Single Line Text',
						urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
					}
				},
				picklistFieldDefinitionId: null,
				picklistId: null,
				pivotFieldDefinitionId: null,
				sentToAjax: false,
				sourceFieldDefinitionId: null,
				triggerAjax: false,
				type: {
					link: '/api/v3/field-types/23',
					permissions: [],
					title: 'Single Line Text',
					urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
				},
				unitOfMeasure: null,
				validations: null,
				value: 'test field col 1 row 1',
				visible: 'ALWAYS'
			},
			null], [
			null,
			{
				defaultValue: null,
				description: null,
				displayLength: 50,
				displayName: 'Test Field 2_2',
				editable: 'ALWAYS',
				fieldLength: 100,
				fieldPrecision: null,
				fieldTypeId: 'PARAGRAPH_SINGLE_LINE_TEXT',
				id: 'TEST_FIELD_2_2',
				isDerived: false,
				metadata: {
					dataTypeId: '23',
					type: {
						link: '/api/v3/field-types/23',
						permissions: [],
						title: 'Single Line Text',
						urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
					}
				},
				picklistFieldDefinitionId: null,
				picklistId: null,
				pivotFieldDefinitionId: null,
				sentToAjax: false,
				sourceFieldDefinitionId: null,
				triggerAjax: false,
				type: {
					link: '/api/v3/field-types/23',
					permissions: [],
					title: 'Single Line Text',
					urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.23'
				},
				unitOfMeasure: null,
				validations: null,
				value: 'test field col 2 row 2',
				visible: 'ALWAYS'
			}]]
		}
	}],
	id: 4
}]);
