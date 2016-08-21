'use strict';

angular.module('plm360.mockData').value('MockBomRowData', {
	rows: [
		{
			path: {
				edges: []
			},
			edgeId: null,
			itemNumber: 0,
			depth: 0,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1']
			},
			edgeId: '1',
			itemNumber: 4,
			depth: 1,
			isChecked: false,
			isCheckable: true
		},
		{
			path: {
				edges: ['1', '922']
			},
			edgeId: '922',
			itemNumber: 4,
			depth: 2,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '43']
			},
			edgeId: '43',
			itemNumber: 5,
			depth: 3,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '43', '400']
			},
			edgeId: '400',
			itemNumber: 10,
			depth: 4,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '43', '399']
			},
			edgeId: '399',
			itemNumber: 11,
			depth: 4,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '43', '398']
			},
			edgeId: '398',
			itemNumber: 10,
			depth: 4,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '43', '400', '500']
			},
			edgeId: '500',
			itemNumber: 1,
			depth: 5,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '400']
			},
			edgeId: '400',
			itemNumber: 10,
			depth: 3,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['1', '922', '400', '500']
			},
			edgeId: '500',
			itemNumber: 1,
			depth: 4,
			isChecked: false,
			isCheckable: false
		},
		{
			path: {
				edges: ['2']
			},
			edgeId: '2',
			itemNumber: 99,
			depth: 1,
			isChecked: false,
			isCheckable: true
		},
		{
			path: {
				edges: ['Temp@2345']
			},
			edgeId: 'Temp@2345',
			itemNumber: 100,
			depth: 1,
			isChecked: false,
			isCheckable: true,
			addOrder : 1,
			isNewlyAdded : true
		},
		{
			path: {
				edges: ['Temp@2348']
			},
			edgeId: 'Temp@2348',
			itemNumber: 101,
			depth: 1,
			isChecked: false,
			isCheckable: true,
			addOrder : 2,
			isNewlyAdded : true
		}
	],
	rowOrder: [0, 1, 2, 3, 6, 4, 7, 5, 8, 9, 10, 11, 12]
});
