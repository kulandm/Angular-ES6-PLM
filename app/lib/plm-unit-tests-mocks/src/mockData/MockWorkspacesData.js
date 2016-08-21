'use strict';

angular.module('plm360.mockData').value('MockWorkspacesData', {
	sections: [
		{
			id: 7,
			displayName: 'Program Management',
			iconResourceUrl: 'icon-plm-cubes',
			workspaces: [
				{
					id: 1,
					url: 'http:\/\/sin6902f12.ads.autodesk.com\/api\/v2\/workspaces\/1',
					displayName: 'Project Management',
					systemName: 'WS_PROJECT_MANAGEMENT',
					description: '',
					workspaceTypeId: 'BASIC',
					onCreateScriptId: null,
					onEditScriptId: null,
					onDemandScriptIds: null,
					link: 'api\/v3\/workspaces\/1'
				},
				{
					id: 2,
					url: 'http:\/\/sin6902f12.ads.autodesk.com\/api\/v2\/workspaces\/2',
					displayName: 'Tasks',
					systemName: 'WS_TASKS',
					description: '',
					workspaceTypeId: 'BASIC_AND_WORKFLOW',
					onCreateScriptId: null,
					onEditScriptId: null,
					onDemandScriptIds: null,
					link: 'api\/v3\/workspaces\/2'
				}
			]
		},
		{
			id: 8,
			displayName: 'Engineering',
			iconResourceUrl: 'icon-plm-gear_stamp_document',
			workspaces: [
				{
					id: 47,
					url: 'http:\/\/sin6902f12.ads.autodesk.com\/api\/v2\/workspaces\/47',
					displayName: 'Products',
					systemName: 'WS_PRODUCTS',
					description: '',
					workspaceTypeId: 'BASIC_AND_WORKFLOW',
					onCreateScriptId: null,
					onEditScriptId: null,
					onDemandScriptIds: null,
					link: 'api\/v3\/workspaces\/47'
				},
				{
					id: 8,
					url: 'http:\/\/sin6902f12.ads.autodesk.com\/api\/v2\/workspaces\/8',
					displayName: 'Items and BOMs',
					systemName: 'WS_ITEMS_AND_BOMS',
					description: '',
					workspaceTypeId: 'REVISION_CONTROLLED',
					onCreateScriptId: null,
					onEditScriptId: null,
					onDemandScriptIds: null,
					link: 'api\/v3\/workspaces\/8'
				}
			]
		},
		{
			id: 19,
			displayName: 'Change Management',
			iconResourceUrl: 'icon-plm-stamp',
			workspaces: [
				{
					id: 26,
					url: 'http:\/\/sin6902f12.ads.autodesk.com\/api\/v2\/workspaces\/26',
					displayName: 'Change Request',
					systemName: 'WS_CHANGE_REQUEST',
					description: '',
					workspaceTypeId: 'BASIC_AND_WORKFLOW',
					onCreateScriptId: null,
					onEditScriptId: null,
					onDemandScriptIds: null,
					link: 'api\/v3\/workspaces\/26'
				},
				{
					id: 9,
					url: 'http:\/\/sin6902f12.ads.autodesk.com\/api\/v2\/workspaces\/9',
					displayName: 'Change Orders',
					systemName: 'WS_CHANGE_ORDERS',
					description: '',
					workspaceTypeId: 'REVISIONING',
					onCreateScriptId: null,
					onEditScriptId: null,
					onDemandScriptIds: null,
					link: 'api\/v3\/workspaces\/9'
				}
			]
		}
	]
});
