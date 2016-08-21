'use strict';

angular.module('plm360.mockData').value('MockViewAffectedItemTransitionsData', {
	"json": [
		{
			"id": 5,
			"overrideTargetRevision": "MANUAL",
			"name": "Obsolete",
			"fromState": {
				"link": "/api/v3/workflows/9223372036854775807/states/2",
				"title": "Production"
			},
			"toState": {
				"link": "/api/v3/workflows/9223372036854775807/states/3",
				"title": "Obsolete"
			},
			"incrementVersion": true,
			"incrementRelease": true,
			"obsolete": true,
			"workspaces": [ ],
			"effectivityWritable": false,
			"__self__": "/api/v3/workflows/9223372036854775807/transitions/5"
		},
		{
			"id": 4,
			"overrideTargetRevision": "MANUAL",
			"name": "Production Revision",
			"fromState": {
				"link": "/api/v3/workflows/9223372036854775807/states/2",
				"title": "Production"
			},
			"toState": {
				"link": "/api/v3/workflows/9223372036854775807/states/2",
				"title": "Production"
			},
			"incrementVersion": true,
			"incrementRelease": true,
			"obsolete": false,
			"workspaces": [ ],
			"effectivityWritable": true,
			"__self__": "/api/v3/workflows/9223372036854775807/transitions/4"
		},
		{
			"id": 6,
			"overrideTargetRevision": "MANUAL",
			"name": 'Release Direct to Production',
			"fromState": {
				"link": "/api/v3/workflows/9223372036854775807/states/1",
				"title": "Production"
			},
			"toState": {
				"link": "/api/v3/workflows/9223372036854775807/states/2",
				"title": "Production"
			},
			"incrementVersion": true,
			"incrementRelease": true,
			"obsolete": false,
			"workspaces": [ ],
			"effectivityWritable": true,
			link: '/api/v3/workflows/9223372036854775807/transitions/6'
		}
	]
});
