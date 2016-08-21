'use strict';

angular.module('plm360.mockData').value('MockLinkedToWorkspacesData', {
	workspaces: [
		{
			link: '/api/v3/workspaces/29',
			title: 'Design Review',
			type: '/api/v3/workspace-types/2',
			urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.29',
			permissions: []
		},
		{
			link: '/api/v3/workspaces/9',
			title: 'Change Orders',
			type: '/api/v3/workspace-types/7',
			urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.9',
			permissions: []
		},
		{
			link: '/api/v3/workspaces/99',
			title: 'Change Orders 2',
			type: '/api/v3/workspace-types/7',
			urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.99',
			permissions: []
		},
		{
			link: '/api/v3/workspaces/26',
			title: 'Change Request',
			type: '/api/v3/workspace-types/2',
			urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.26',
			permissions: []
		},
		{
			link: '/api/v3/workspaces/20',
			title: 'Corrective / Preventative Actions',
			type: '/api/v3/workspace-types/2',
			urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.20',
			permissions: []
		},
		{
			link: '/api/v3/workspaces/49',
			title: 'Field Failure Requests',
			type: '/api/v3/workspace-types/2',
			urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.49',
			permissions: []
		}
	]
});
