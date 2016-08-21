'use strict';

describe('NamedRelationshipsItem', function () {
	
	let namedRelationshipsItem;
	let RESTWrapperService;
	let EventService; 
	
	let json = {
		item: {
			link: '/api/v3/workspaces/8/items/2773',
			title: '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621',
			version: '[REV:B]',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2773',
			permissions: []
		}
	};

	beforeEach(module('plm360.models', 'plm360'));
	
	beforeEach(function () {
		inject(function (
			  _EventService_,
			  _RESTWrapperService_
		) {
			EventService = _EventService_;
			RESTWrapperService = _RESTWrapperService_;
			
			namedRelationshipsItem = new NamedRelationshipsItem();
			namedRelationshipsItem.json = json;
		});
		
	});
	
	describe('getItemTitle', function () {
		it('returns the workspace id of an item', function () {
			let expectedValue = json.item.title;
			expect(namedRelationshipsItem.getItemTitle()).to.deep.equal(expectedValue);
		});
	});
	
	describe('getWorkspaceId', function () {
		it('returns the workspace id of an item', function () {
			let expectedValue = '8';
			expect(namedRelationshipsItem.getWorkspaceId()).to.deep.equal(expectedValue);
		});
	});
	
	describe('getResourceId', function () {
		it('returns the resource id of an item', function () {
			let expectedValue = '8@2773';
			expect(namedRelationshipsItem.getResourceId()).to.deep.equal(expectedValue);
		});
	});
	
	describe('getItemDescriptorValue', function () {
		it('returns the Item Descriptor\'s value of an item', function () {
			let expectedValue = '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621 [REV:B]';
			expect(namedRelationshipsItem.getItemDescriptorValue()).to.equal(expectedValue);
		});
		
		it('returns the Item Descriptor\'s value of an item without title', function () {
			let expectedValue = '[REV:B]';
			namedRelationshipsItem.json.item.title = undefined;
			namedRelationshipsItem.json.item.version = '[REV:B]';
			expect(namedRelationshipsItem.getItemDescriptorValue()).to.equal(expectedValue);
		});
		
		it('returns the Item Descriptor\'s value of an item without version', function () {
			let expectedValue = '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621';
			namedRelationshipsItem.json.item.title = '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621';
			namedRelationshipsItem.json.item.version = undefined;
			expect(namedRelationshipsItem.getItemDescriptorValue()).to.equal(expectedValue);
		});
		
		it('returns an empty string for an item without title and version', function () {
			namedRelationshipsItem.json.item.title = undefined;
			namedRelationshipsItem.json.item.version = undefined;
			expect(namedRelationshipsItem.getItemDescriptorValue()).to.equal('');
		});
	});
	
	describe('getItemUrn', function () {
		it('returns the Item Urn', function () {
			let expectedValue = json.item.urn;
			expect(namedRelationshipsItem.getItemUrn()).to.deep.equal(expectedValue);
		});
	});
	
	describe('delete', function () {
		it('returns what RESTWrapperService is returning', function () {
			sinon.stub(RESTWrapperService, 'delete').returns('something');
			
			let selfLink = 'namedRelationshipsItem:1~AML:deleteDone';
			
			expect(namedRelationshipsItem.delete(selfLink)).to.equal('something');
			
		});	
	});
});
