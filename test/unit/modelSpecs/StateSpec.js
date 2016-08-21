'use strict';

describe('State', function () {
	var app;
	var data = {
		id:1,
		name:'name',
		data: {
			currentStateName: 'state name',
			workflowTransitions: []
		},
		availableTransitions: {
			transitions: [{
				transitionID: 1,
				link: 'api/[workspaceId]/[itemId]/link'
			}, {
				transitionID: 3,
				link: 'api/[workspaceId]/[itemId]/link'
			}]
		}
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new State();
		app.json = data;
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getName', function () {
		it('should return the name of current state', function () {
			expect(app.getName()).to.equal(data.data.currentStateName);
		});
	});

	describe('getTransitions', function () {
		it('should return the list of transitions', function () {
			expect(app.getTransitions()).to.equal(data.data.workflowTransitions);
		});
	});

	describe('getTransitionLink', function () {
		it('should return the link of the transition if transition ID is valid', function () {
			expect(app.getTransitionLink(1, 1, 1)).to.equal(data.availableTransitions.transitions[0].link.replace('[workspaceId]',1).replace('[itemId]',1));
		});
		it('should return empty string if transition ID is invalid', function () {
			expect(app.getTransitionLink(1, 1, 2)).to.equal('');
		});
	});
});
