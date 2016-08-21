'use strict';

angular.module('plm360.mockData').value('MockViewNamedRelationshipsData', {
	__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML?offset=0&limit=10',
	urn : 'urn:adsk.plm:tenant.workspace.item.relationship:DEVINDMACHINE1002.52.2915.AML',
	offset : 0,
	limit : 10,
	totalCount : 6,
	first : {
		link : '/api/v3/workspaces/52/items/2915/relationships/AML?offset=0&limit=10',
		title : 'First',
		count : 6,
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship:DEVINDMACHINE1002.52.2915.AML',
		permissions : [ ]
	},
	last : {
		link : '/api/v3/workspaces/52/items/2915/relationships/AML?offset=0&limit=10',
		title : 'Last',
		count : 6,
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship:DEVINDMACHINE1002.52.2915.AML',
		permissions : [ ]
	},
	items : [ {
		__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/1',
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship.linked-item:DEVINDMACHINE1002.52.2915.AML.1',
		item : {
			link : '/api/v3/workspaces/8/items/2725',
			title : '683-0002-000 - Pneumatic Assembly, Project 621',
			version : '[REV:A]',
			urn : 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2725',
			permissions : [ ]
		}
	}, {
		__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/2',
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship.linked-item:DEVINDMACHINE1002.52.2915.AML.2',
		item : {
			link : '/api/v3/workspaces/8/items/2773',
			title : '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621',
			version : '[REV:B]',
			urn : 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2773',
			permissions : [ ]
		}
	}, {
		__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/3',
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship.linked-item:DEVINDMACHINE1002.52.2915.AML.3',
		item : {
			link : '/api/v3/workspaces/8/items/2795',
			title : '680-0000-000 - SBOM Mech Upper Bushing',
			version : '[REV:B]',
			urn : 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2795',
			permissions : [ ]
		}
	}, {
		__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/4',
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship.linked-item:DEVINDMACHINE1002.52.2915.AML.4',
		item : {
			link : '/api/v3/workspaces/8/items/2837',
			title : '600-0002-000 - SBOM Project 621 Turn Table',
			version : '[REV:B]',
			urn : 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2837',
			permissions : [ ]
		}
	}, {
		__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/5',
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship.linked-item:DEVINDMACHINE1002.52.2915.AML.5',
		item : {
			link : '/api/v3/workspaces/8/items/2725',
			title : '683-0002-000 - Pneumatic Assembly, Project 621',
			version : '[REV:A]',
			urn : 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2725',
			permissions : [ ]
		}
	}, {
		__self__ : '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/6',
		urn : 'urn:adsk.plm:tenant.workspace.item.relationship.linked-item:DEVINDMACHINE1002.52.2915.AML.6',
		item : {
			link : '/api/v3/workspaces/8/items/2773',
			title : '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621',
			version : '[REV:B]',
			urn : 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2773',
			permissions : [ ]
		}
	} ]
});