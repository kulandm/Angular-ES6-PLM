'use strict';

describe('Transitions', () => {
	let app;
	let provide, mockRESTWrapperService, q;
	let data = [{
		customLabel: 'INITIATE',
		toState: {
			link: '/api/v3/workspaces/47/workflows/1/states/127',
			title: 'Kickoff'
		},
		name: 'Initiate',
		description: '',
		permission: {
			link: '/api/v2/permissions/604',
			title: 'Product WF Permission'
		},
		escalationPermission: {
			link: '/api/v2/permissions/604',
			title: 'Product WF Permission'
		},
		workspace: '/api/v2/workspaces/47',
		sendEmail: true,
		showInOutstanding: true,
		notifyPerformers: true,
		saveStepLabel: '',
		ignoreEscalatedPreconditions: false,
		comments: 'OPTIONAL',
		__self__: '/api/v3/workspaces/47/workflows/1/transitions/215'
	}, {
		customLabel: 'SET_TO_OBSOLETE',
		fromState: {
			link: '/api/v3/workspaces/47/workflows/1/states/136',
			title: 'Production'
		},
		toState: {
			link: '/api/v3/workspaces/47/workflows/1/states/137',
			title: 'Obsolete'
		},
		name: 'Set to Obsolete',
		description: '',
		permission: {
			link: '/api/v2/permissions/604',
			title: 'Product WF Permission'
		},
		escalationPermission: {
			link: '/api/v2/permissions/604',
			title: 'Product WF Permission'
		},
		workspace: '/api/v2/workspaces/47',
		sendEmail: false,
		showInOutstanding: false,
		notifyPerformers: false,
		saveStepLabel: '',
		ignoreEscalatedPreconditions: false,
		comments: 'OPTIONAL',
		__self__: '/api/v3/workspaces/47/workflows/1/transitions/231'
	}];

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockObjects'));

	beforeEach(() => {
		app = new Transitions();

		module(function ($provide) {
			provide = $provide;
		});

		inject(($q, MockRESTWrapperService) => {
			q = $q;
			mockRESTWrapperService = new MockRESTWrapperService();
			provide.value('RESTWrapperService', mockRESTWrapperService);
		});
	});

	it('should fetch the transitions', () => {
		mockRESTWrapperService.get.returns(data);
		app.fetch().then(() => {
			expect(app.transitions).to.deep.equal(data);
		});
	});

	it('should handle error response from server', () => {
		let deferredObj = q.defer();
		mockRESTWrapperService.get.returns(deferredObj);
		app.fetch().then(() => {}, () => {
			expect(app.transition).to.be.undefined;
		});
		deferredObj.reject();
	});
});
