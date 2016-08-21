'use strict';

describe('LinkedToWorkspaces', function () {
	var app;
	var provide, q, mockEventService, mockRESTWrapperService;
	var data = {
		workspaces: [
			{
				link: '/api/v3/workspaces/29',
				title: 'Design Review',
				type: '/api/v3/workspace-types/2',
				urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.29',
				permissions: []
			},
			{
				link: '/api/v3/workspaces/9',
				title: 'Change Orders',
				type: '/api/v3/workspace-types/7',
				urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.9',
				permissions: []
			},
			{
				link: '/api/v3/workspaces/26',
				title: 'Change Request',
				type: '/api/v3/workspace-types/2',
				urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.26',
				permissions: []
			},
			{
				link: '/api/v3/workspaces/20',
				title: 'Corrective / Preventative Actions',
				type: '/api/v3/workspace-types/2',
				urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.20',
				permissions: []
			},
			{
				link: '/api/v3/workspaces/49',
				title: 'Field Failure Requests',
				type: '/api/v3/workspace-types/2',
				urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE.49',
				permissions: []
			}
		]
	};

	beforeEach(module(
		'plm360',
		'plm360.models',
		'plm360.mockObjects'
	));

	beforeEach(function () {
		module(function ($provide) {
			provide = $provide;
		});

		inject(function ($q, EventService, MockRESTWrapperService) {
			q = $q;
			mockEventService = EventService;
			mockRESTWrapperService = new MockRESTWrapperService();

			provide.value('RESTWrapperService', mockRESTWrapperService);
			mockRESTWrapperService.get.returns(q.when(data));
		});

		app = new LinkedToWorkspaces();
		app.json = data.workspaces;

		mockEventService.send('linkedToWorkspaces:8:get',
			'api/v3/workspaces/8/views/11/linkedto-workspaces');
	});

	describe('getFullList', function () {
		it('returns the json data', function () {
			expect(app.getFullList()).to.deep.equal(data.workspaces);
		});
	});

	describe('getRevisioningWorkspaces', function () {
		it('returns the filtered json data', function () {
			expect(app.getRevisioningWorkspaces()).to.deep.equal([data.workspaces[1]]);
		});
	});
});
