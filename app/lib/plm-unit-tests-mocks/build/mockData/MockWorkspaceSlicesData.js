'use strict';

angular.module('plm360.mockData').value('MockWorkspaceSlicesData', {
	json: {
		id: 1,
		name: 'name',
		items: [{
			link: '/api/v3/workspaces/47/reports/91',
			title: 'My Default View',
			urn: 'urn:adsk.plm:tenant.workspace.report:DEVINDMACHINE1001.47.91',
			permissions: [ ]
		}, {
			link: '/api/v3/workspaces/47/reports/97',
			title: 'Images',
			urn: 'urn:adsk.plm:tenant.workspace.report:DEVINDMACHINE1001.47.97',
			permissions: [ ]
		}]
	}
});
