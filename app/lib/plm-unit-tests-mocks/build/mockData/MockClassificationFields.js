'use strict';

angular.module('plm360.mockData').value('MockClassificationFields',[
	{
		type: 'number',
		itemDefault: 1234,
		workspaceDefault: 4321,
		title: 'Number Field'
	},
	{
		type: 'text',
		itemDefault: 'Item value to show',
		workspaceDefault: 'Workspace value to show',
		title: 'String Field'
	},
	{
		type: 'picklist',
		itemDefault: 'Single value to show',
		workspaceDefault: 'Single value to show',
		title: 'Picklist Field string value',
		options: [
			{value: 'Single value to show', displayValue: 'Single value to show'},
			{value: 'Not a selected value', displayValue: 'jbot be quiet'}
		]
	},
	{
		type: 'picklist',
		itemDefault: {value: 'Value A', displayValue: null},
		workspaceDefault: {value: 'Value A', displayValue: null},
		title: 'Picklist Field Object value A',
		options: [
			{value: 'Value A', displayValue: 'Value A'},
			{value: 'Not a selected value', displayValue: 'jbot be quiet'}
		]
	},
	{
		type: 'picklist',
		itemDefault: {value: 'Value B', displayValue: 'Display Value B'},
		workspaceDefault: {value: 'Value B', displayValue: 'Display Value B'},
		title: 'Picklist Field Object value B',
		options: [
			{value: 'Not a selected value', displayValue: 'jbot be quiet'},
			{value: 'Value B', displayValue: 'Display Value B'}
		]
	}
]);