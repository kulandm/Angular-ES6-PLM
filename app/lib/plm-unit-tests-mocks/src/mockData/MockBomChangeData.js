'use strict';

angular.module('plm360.mockData').value('MockBomChangeData', {
	data: [{
		changeType: 'edit',
		edgeId: '879'
	},
	{
		changeType: 'edit',
		edgeId: '203'
	}, {
		changeType: 'add',
		payload: {
			item: {
				link: '/api/v3/workspaces/8/items/2788',
				permissions: Array[0],
				title: '306-0000-000 - Laser Sensor',
				urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2788',
				version: '[REV:w]'
			}
		},
		edgeId: 'Temp8@2886'
	}, {
		changeType: 'add',
		payload: {
			item: {
				link: '/api/v3/workspaces/8/items/2788',
				
				permissions: Array[0],
				title: '306-0000-000 - Laser Sensor ,',
				urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2788',
				version: '[REV:w]'
			}
		},
		edgeId: 'Temp8@2788'
	}, {
		changeType: 'remove',
		edgeId: '2788'
	}]
});
