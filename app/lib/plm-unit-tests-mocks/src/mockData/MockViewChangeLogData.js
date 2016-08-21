'use strict';

angular.module('plm360.mockData').value('MockViewChangeLogData', [{
	'elements': [
		{
			timestamp: '2014-04-08T07\:54\:43+0000',
			userDisplayName: 'PLMAutoTest Selenium1',
			action: 'EDIT_MILESTONE',
			description: 'description1',
			records: [{
				oldValue: 'oldValue1',
				newValue: 'newValue1',
				rowId: 0,
				fieldID: 2,
				fieldName: 'fieldName1'
			}]
		},
		{
			timestamp: '2014-03-08T07\:54\:43+0000',
			userDisplayName: 'PLMAutoTest Selenium2',
			action: 'EDIT_MILESTONE',
			description: null,
			records: [{
				oldValue: 'oldValue2',
				newValue: 'newValue2',
				rowId: 0,
				fieldID: 2,
				fieldName: 'fieldName2'
			}]
		}
	]
}]);