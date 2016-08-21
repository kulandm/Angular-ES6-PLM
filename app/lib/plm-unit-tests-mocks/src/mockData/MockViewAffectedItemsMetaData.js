'use strict';

angular.module('plm360.mockData').value('MockViewAffectedItemsMetaData', [
	{
		__self__: '/api/v3/workspaces/59/views/11/fields/SINGLE_LINE',
		name: 'Single Line',
		description: '',
		type: {
			link: '/api/v3/field-types/4',
			title: 'Single Line Text',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.4'
		},
		fieldLength: 100,
		displayOrder: 2,
		displayLength: 100,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false
	},
	{
		__self__: '/api/v3/workspaces/59/views/11/fields/DISPOSITION',
		name: 'Disposition',
		description: '',
		type: {
			link: '/api/v3/field-types/20',
			title: 'Single Selection',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.20'
		},
		defaultValue: '5',
		unitOfMeasure: 'dis',
		displayOrder: 1,
		displayLength: 22,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false,
		picklist: '/api/v3/picklists/CUSTOM_LOOKUP_DISPOSITION'
	},
	{
		__self__: '/api/v3/workspaces/59/views/11/fields/INT',
		name: 'Int',
		description: '',
		type: {
			link: '/api/v3/field-types/30',
			title: 'Integer',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.30'
		},
		fieldLength: 3,
		displayOrder: 3,
		displayLength: 3,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false,
		validators: '/api/v3/workspaces/59/views/11/fields/INT/validators'
	},
	{
		__self__: '/api/v3/workspaces/59/views/11/fields/EMAIL',
		name: 'Email',
		description: '',
		type: {
			link: '/api/v3/field-types/18',
			title: 'Email',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.18'
		},
		fieldLength: 100,
		displayOrder: 5,
		displayLength: 100,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false,
		validators: '/api/v3/workspaces/59/views/11/fields/EMAIL/validators'
	},
	{
		__self__: '/api/v3/workspaces/59/views/11/fields/CSV',
		name: 'CSV',
		description: '',
		type: {
			link: '/api/v3/field-types/19',
			title: 'CSV',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.19'
		},
		fieldLength: 10,
		displayOrder: 4,
		displayLength: 10,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false
	},
	{
		__self__: '/api/v3/workspaces/59/views/11/fields/FLOAT',
		name: 'Float',
		description: '',
		type: {
			link: '/api/v3/field-types/2',
			title: 'Float',
			urn: 'urn:adsk.plm:tenant.field-type:STANDARDDEMO.2'
		},
		unitOfMeasure: null,
		fieldLength: 5,
		fieldPrecision: 3,
		displayOrder: 6,
		displayLength: 5,
		editability: 'ALWAYS',
		visibility: 'ALWAYS',
		derived: false,
		validators: '/api/v3/workspaces/59/views/11/fields/PRGH/validators'
	}
]);
