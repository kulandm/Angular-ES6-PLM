'use strict';
angular.module('plm360.mockData').value('MockRelatedWorkspaces',{
	workspaces: [
		{
			link: '/api/v2/workspaces/8',
			title: 'Items and BOMs',
			type: '/workflowItems'
		},
		{
			link: '/api/v2/workspaces/47',
			title: 'Products',
			type: '/workflowItems'
		}
	]
});