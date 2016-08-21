'use strict';

angular.module('plm360.mockData').value('MockViewGridMetaData', [
	{
		link: '/api/v3/workspaces/8/views/13/fields/CUSTOMER',
		title: 'Customer',
		definition: {
			fieldId: 'CUSTOMER',
			type: {
				title: 'PICK_LIST_LINKED'
			}
		}
	},
	{
		link: '/api/v3/workspaces/8/views/13/fields/SITE',
		title: 'Site',
		definition: {
			fieldId: 'SITE',
			type: {
				title: 'PICK_LIST'
			}
		}
	}
]);