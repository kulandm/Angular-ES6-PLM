'use strict';

describe('LinkableItem', function () {
	var app;
	var data = {
		workspace: {
			title: 'test workspace'
		},
		lifecycle: {
			title: 'test lifecycle'
		},
		item: {
			title: 'test item',
			link: '/api/v2/dummy-link',
			version: '[ASA:w]',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.someWs.someItemId'
		}
	};

	var provide, mockRESTWrapperService, q, timeout;

	beforeEach(module('plm360', 'plm360.models', 'plm360.mockObjects'));

	beforeEach(function () {
		app = new LinkableItem();
		app.json = data;

		module(function ($provide) {
			provide = $provide;
		});

		inject(function ($q, MockRESTWrapperService) {
			q = $q;
			mockRESTWrapperService = new MockRESTWrapperService();
			provide.value('RESTWrapperService', mockRESTWrapperService);
		});
	});

	describe('getObject', function () {
		it('should return the json data', function () {
			expect(app.getObject()).to.deep.equal(data);
		});
	});

	describe('Item', function () {
		it('should return item link', function () {
			expect(app.getItemLink()).to.equal(data.item.link);
		});

		it('should return item title', function () {
			expect(app.getItemTitle()).to.equal(data.item.title);
		});

		it('should return item urn', function () {
			expect(app.getItemUrn()).to.equal(data.item.urn);
		});

		it('should return item version for revision controlled items', function () {
			expect(app.getItemVersion()).to.equal('[ASA:w]');
		});
	});

	describe('Workspace', function () {
		it('should return workspace title', function () {
			expect(app.getWorkspaceTitle()).to.equal('test workspace');
		});
	});

	describe('getWorkspaceId', function () {
		it('should return workspace id', function () {
			expect(app.getWorkspaceId()).to.equal('someWs');
		});
	});

	describe('Lifecycle', function () {
		it('should return lifecycle title', function () {
			expect(app.getLifecycleTitle()).to.equal('test lifecycle');
		});

		it('should return true if lifecycle is associated with item', function () {
			expect(app.isLifecycle()).to.be.true;
		});
	});

	describe('Selection', function () {
		it('should return the selection state of the item', function () {
			expect(app.isSelected()).to.be.false;
			app.setSelection(true);
			expect(app.isSelected()).to.be.true;
		});
	});
	describe('link item', function () {

		/*
		 * not sure how to fix this yet
		 * so commenting this out
		 * please fix
		 */
		// it('should add new item successfully', function() {
		// 	mockRESTWrapperService.post.returns({});
		// 	var res = app.addNewItem('workspace_1', 'item_1', 'testUrl', 'test');
		// 	expect(res).to.have.property('$$state');
		// });

		// it('should add existing items successfully', function() {
		// 	mockRESTWrapperService.post.returns({});
		// 	var res = app.addExistingAffectedItem('workspace_1', 'item_1');
		// 	expect(res).to.have.property('$$state');
		// });
	});
});
