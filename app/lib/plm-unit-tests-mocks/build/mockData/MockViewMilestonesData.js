'use strict';

angular.module('plm360.mockData').value('MockViewMilestonesData', [
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/217',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.217',
		date: '2015-05-15',
		progress: 10,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/127',
			title: 'Concept'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		},
		actualCompleteDate: '2015-05-07'
	},
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/218',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.218',
		date: '2015-05-25',
		progress: 20,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/128',
			title: 'Requirements Definition'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		}
	},
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/219',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.219',
		date: '2015-06-04',
		progress: 30,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/131',
			title: 'Development'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		}
	},
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/220',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.220',
		date: '2015-06-14',
		progress: 40,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/132',
			title: 'Validation Testing'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		}
	},
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/221',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.221',
		date: '2015-06-24',
		progress: 75,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/134',
			title: 'Control Run'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		}
	},
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/222',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.222',
		date: '2015-07-04',
		progress: 90,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/135',
			title: 'Pilot Run'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		}
	},
	{
		__self__: '/api/v3/workspaces/42/items/6884/views/17/milestones/223',
		urn: 'urn:adsk.plm:tenant.workspace.item.view.milestone:STANDARDDEMO.42.6884.17.223',
		date: '2015-07-14',
		progress: 100,
		warnThreshold: 5,
		type: {
			link: '/api/v3/milestone-types/ENTER',
			title: 'Enter state'
		},
		workflowState: {
			link: '/api/v3/workspaces/42/workflows/1/states/136',
			title: 'Production'
		},
		item: {
			link: '/api/v3/workspaces/42/items/6884',
			title: 'Coolest Phone Ever - '
		}
	}
]);
