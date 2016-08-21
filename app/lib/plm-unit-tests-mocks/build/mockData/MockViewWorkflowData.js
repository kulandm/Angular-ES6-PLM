'use strict';

angular.module('plm360.mockData').value('MockViewWorkflowData', [
	{
		__self__: '/api/v2/workspaces/111/items/6895',
		item: {
			link: '/api/v2/workspaces/111/items/6895',
			title: 'CO000071 - Change Order #1',
			urn: 'urn:adsk.plm:tenant.workspace.item:TEST.111.6895',
			version: '[REV:w]'
		},
		'workflow-state': {
			link: '/api/v3/workspaces/111/workflows/1/states/223',
			title: 'Create'
		},
		'last-workflow-history': {
			id: {
				item: {
					link: '/api/v2/workspaces/111/items/6895',
					title: 'CO000071 - Change Order #1'
				},
				step: 1
			},
			workflowTransition: {
				link: '/api/v3/workspaces/111/workflows/0/transitions/391',
				title: 'Initiate'
			},
			user: {
				link: '/api/v3/users/PLMAutoTest',
				title: 'PLMAutoTest Selenium1'
			},
			comments: '',
			created: '2014-10-24T10:52:56.584+08:00',
			'action-invoker': 'USER',
			'actual-user': {
				link: '/api/v3/users/PLMAutoTest',
				title: 'PLMAutoTest Selenium1'
			}
		},
		'first-workflow-history': {
			id: {
				item: {
					link: '/api/v2/workspaces/111/items/6895',
					title: 'CO000071 - Change Order #1'
				},
				step: 1
			},
			workflowTransition: {
				link: '/api/v3/workspaces/111/workflows/0/transitions/391',
				title: 'Initiate'
			},
			user: {
				link: '/api/v3/users/PLMAutoTest',
				title: 'PLMAutoTest Selenium1'
			},
			comments: '',
			created: '2014-10-24T10:52:56.584+08:00',
			'action-invoker': 'USER',
			'actual-user': {
				link: '/api/v3/users/PLMAutoTest',
				title: 'PLMAutoTest Selenium1'
			}
		}
	},
	{
		__self__: '/api/v2/workspaces/200/items/6494',
		item: {
			link: '/api/v2/workspaces/200/items/6494',
			title: 'TEAM000005 - GK100 Supercomputing',
			urn: 'urn:adsk.plm:tenant.workspace.item:TEST.200.6494'
		},
		'workflow-state': null,
		'last-workflow-history': null,
		'first-workflow-history': null
	}
]);
