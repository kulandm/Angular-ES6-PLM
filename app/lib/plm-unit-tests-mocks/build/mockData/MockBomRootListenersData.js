(function (module) {
	'use strict';

	/**
	 * Mock Data Sets Available
	 * getData - A basic set of mock data
	 */
	module.value('MockBomRootListenersData', {
		getData: {
			link: 'api/v3/workspaces/8/items/2887/bom',
			params: {
                'rootId': '2887',
				'effectiveDate': '2015-12-01',
				'revisionBias': 'release',
				'viewDefId': '2'
			},
			response: {
				data: "Some response Data"
			}
		}
	});
}(angular.module('plm360.mockData')));
