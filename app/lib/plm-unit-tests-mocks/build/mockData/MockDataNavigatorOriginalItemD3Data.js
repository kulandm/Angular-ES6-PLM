'use strict';

/**
 * MockDataNavigatorOriginalItemD3Data
 *
 * This data is used in DataNavigator related specs
 *
 * service: RoamerServiceSpec
 *
 */

angular.module('plm360.mockData')
	.value('MockDataNavigatorOriginalItemD3Data', [{
		"urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.2694",
		"name":"EM-4001 - Assembly P...",
		"state":"Kickoff",
		"workspace":"Products",
		"symbol":"cross",
		"workspaceId": 1
	}, {
		"name":"600-0000-000 - SBOM ...",
		"state":"Not fetched",
		"workspace":"Not fetched",
		"urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2695",
		"workspaceId": 2
	}]);