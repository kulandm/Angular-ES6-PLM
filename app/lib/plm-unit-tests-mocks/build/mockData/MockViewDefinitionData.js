(function (module) {
	'use strict';

	/**
	 * basicData - simple set of data. Is the default view
	 * notDefault - Data of a view which is not the default
	 *
	 */
	module.value('MockViewDefinitionData', {
		basicData: {
			'__self__' : {
				'link' : '/api/v3/workspaces/8/views/5/viewdef/1',
				'urn' : 'urn:adsk.plm:tenant.workspace.view.viewdef:DEVINDMACHINE1002.8.5.1',
				'permissions' : [ ]
			},
			'name' : 'Default View',
			'isDefault' : true,
			'id' : 1,
			'fields' : [ {
				'link' : '/api/v3/workspaces/8/views/5/viewdef/1/fields/FAKEFIELD1',
				'urn' : 'urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1002.8.5.1.FAKEFIELD1',
				'permissions' : [ ]
				}, {
				'link' : '/api/v3/workspaces/8/views/5/viewdef/1/fields/FAKEFIELD2',
				'urn' : 'urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1002.8.5.1.FAKEFIELD2',
				'permissions' : [ ]
			}]
		},
		notDefault: {
			'__self__' : {
				'link' : '/api/v3/workspaces/8/views/5/viewdef/2',
				'urn' : 'urn:adsk.plm:tenant.workspace.view.viewdef:DEVINDMACHINE1002.8.5.2',
				'permissions' : [ ]
			},
			'name' : 'Not Default View',
			'isDefault' : false,
			'id' : 2,
			'fields' : [ {
				'link' : '/api/v3/workspaces/8/views/5/viewdef/1/fields/FAKEFIELD3',
				'urn' : 'urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1002.8.5.1.FAKEFIELD3',
				'permissions' : [ ]
				}
			]
		}
	});
}(angular.module('plm360.mockData')));
