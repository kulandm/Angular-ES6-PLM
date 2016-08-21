'use strict';

angular.module('plm360.mockData').value('MockViewAffectedItemsData', [
	{
		item: {
			link: '/api/v3/workspaces/8/items/5763',
			title: '001-300-A1 - GT216-300-A1 DT ROHS 969FCBGA 29x29',
			version: '[REV:w]',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001LOCAL.8.5763'
		},
		type: 'REVISION_CONTROLLED',
		targetTransition: {
			link: '/api/v3/workflows/9223372036854775807/transitions/4',
			title: 'Production Revision'
		},
		availableTransitions: '/api/v3/workspaces/59/items/6881/affected-items/5763/transitions',
		effectivityDate: '2016-03-01T00:00:00.000+08:00',
		fromRelease: '',
		toRelease: 'A0',
		linkedFields: [{
			__self__: '/api/v3/workspaces/59/views/11/fields/EMAIL',
			urn: 'urn:adsk.plm:tenant.workspace.view.field:STANDARDDEMO.59.11.EMAIL',
			title: 'Email',
			type: {
				link: '/api/v3/field-types/18',
				title: 'Email'
			},
			value: 'coolestemail@cool.com'
		}],
		__self__: '/api/v3/workspaces/59/items/6881/views/11/affected-items/5763',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:STANDARDDEMO.59.6881.11.5763'
	},
	{
		item: {
			link: '/api/v3/workspaces/59/items/6829',
			title: '155-2010-000 - SCREW - STANDARD M3 6 HEX BLK OX STL   ',
			version: '[REV:1]',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001LOCAL.59.6829'
		},
		type: 'REVISION_CONTROLLED',
		targetTransition: {
			link: '/api/v3/workspaces/59/workflows/9223372036854775807/transitions/6',
			title: 'Release Direct to Production'
		},
		availableTransitions: '/api/v3/workspaces/59/items/6828/affected-items/6829/transitions',
		fromRelease: '0',
		toRelease: 'A',
		linkedFields: [{
			__self__: '/api/v3/workspaces/59/views/11/fields/DISPOSITION',
			urn: 'urn:adsk.plm:tenant.workspace.view.field:STANDARDDEMO.59.11.DISPOSITION',
			title: 'Disposition',
			type: {
				link: '/api/v3/field-types/20',
				title: 'Single Selection'
			},
			value: {
				link: '/api/v3/lookups/CUSTOM_LOOKUP_DISPOSITION/options/2',
				title: 'Rework'
			}
		}],
		__self__: '/api/v3/workspaces/59/items/6828/views/11/affected-items/6829',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:STANDARDDEMO.59.6828.11.6829'
	},
	{
		item: {
			link: '/api/v3/workspaces/59/items/6770',
			title: '680-2002-000 - SBOM THERMAL 555 55W Passive Heatsink, Al      ',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001LOCAL.59.6770'
		},
		type: 'REVISION_CONTROLLED',
		targetTransition: {
			link: '/api/v3/workspaces/59/workflows/9223372036854775807/transitions/4',
			title: 'Production Revision'
		},
		availableTransitions: '/api/v3/workspaces/59/items/6828/affected-items/6770/transitions',
		effectivityDate: '2017-03-01T00:00:00.000+08:00',
		fromRelease: 'E',
		toRelease: 'F',
		linkedFields: [{
			__self__: '/api/v3/workspaces/59/views/11/fields/DISPOSITION',
			urn: 'urn:adsk.plm:tenant.workspace.view.field:STANDARDDEMO.59.11.DISPOSITION',
			title: 'Disposition',
			type: {
				link: '/api/v3/field-types/20',
				title: 'Single Selection'
			},
			value: {
				link: '/api/v3/lookups/CUSTOM_LOOKUP_DISPOSITION/options/5',
				title: 'No Impact'
			}
		}],
		__self__: '/api/v3/workspaces/59/items/6828/views/11/affected-items/6770',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:STANDARDDEMO.59.6828.11.6770'
	}
]);
