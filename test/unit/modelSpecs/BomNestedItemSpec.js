'use strict';

describe('[MODEL] BomNestedItemModel', () => {
	// Model Handle
	let BomNestedItem, nestedItem;
	let MockRESTWrapperService, MockPromiseStubber, MockBomNestedItemData;
	let mockDataSet;

	beforeEach(module('plm360.mockObjects', 'plm360.mockData', ($provide) => {
		$provide.value('RESTWrapperService', {});
	}));

	beforeEach(module('com/autodesk/models/bomApi/bomNestedItem.model.js'));

	beforeEach(() => {
		// Inject services and values that will be used
		inject(($injector) => {
			MockRESTWrapperService = $injector.get('MockRESTWrapperService');
			MockPromiseStubber = $injector.get('MockPromiseStubber');
			MockBomNestedItemData = $injector.get('MockBomNestedItemData');

			mockDataSet = angular.copy(MockBomNestedItemData);

			BomNestedItem = $injector.get('BomNestedItem');
			BomNestedItem.RESTWrapperService = new MockRESTWrapperService();

			nestedItem = new BomNestedItem(mockDataSet.basicData);
		});
	});

	describe('[STATIC METHOD] fetch', () => {
		it('Should return an instance of BomNestedItem corresponding to the link', () => {
			MockPromiseStubber.setPromiseStubSuccess(BomNestedItem.RESTWrapperService.get, mockDataSet.basicData, ['randomItemLink', sinon.match.any, sinon.match.any, sinon.match.any]);
			expect(BomNestedItem.fetch('randomItemLink', null)).to.deep.equal(nestedItem);
		});
	});

	describe('[STATIC METHOD] add', () => {
		it('Should return the response from the rest call', () => {
			BomNestedItem.RESTWrapperService.post.withArgs(nestedItem, 'randomItemLink').returns('Something');
			expect(BomNestedItem.add('randomItemLink', nestedItem)).to.equal('Something');
		});
	});

	describe('[STATIC METHOD] edit', () => {
		it('Should return the response from the rest call', () => {
			let fakeLink = 'Some link';
			let selfLinkStub = sinon.stub(nestedItem, 'getSelfLink');
			selfLinkStub.returns(fakeLink);

			BomNestedItem.RESTWrapperService.patch.withArgs(nestedItem, fakeLink).returns('Something2');
			expect(BomNestedItem.edit(nestedItem)).to.equal('Something2');

			selfLinkStub.restore();
		});
	});

	describe('[STATIC METHOD] delete', () => {
		it('Should return the response from the rest call', () => {
			let fakeLink = 'Some link';
			let selfLinkStub = sinon.stub(nestedItem, 'getSelfLink');
			selfLinkStub.returns(fakeLink);

			BomNestedItem.RESTWrapperService.delete.withArgs(fakeLink).returns('Something3');
			expect(BomNestedItem.delete(nestedItem)).to.equal('Something3');

			selfLinkStub.restore();
		});
	});

	describe('[METHOD] getSelfLink', () => {
		it('should return the expected self link', () => {
			// Check assert link is what it should be
			expect(nestedItem.getSelfLink()).to.deep.equal(mockDataSet.basicData.__self__.replace(/^\//, ''));
		});
	});

	describe('[METHOD] getItemId', () => {
		it('should return the expected item id', () => {
			// Helper Var
			let selfLinkTokens = mockDataSet.basicData.item.link.split('/');

			// Check assert item id is as expected
			expect(nestedItem.getItemId()).to.equal(selfLinkTokens[4] + '@' + selfLinkTokens[6]);
		});
	});

	describe('[METHOD] getDmsId', () => {
		it('should return the dms id', () => {
			// helper to assert value expected
			let selfLinkTokens = mockDataSet.basicData.item.link.split('/');
			expect(nestedItem.getDmsId()).to.equal(selfLinkTokens[6]);
		});
	});

	describe('[METHOD] getWorkspaceId', () => {
		it('should return the workspace id', () => {
			// helper to assert value expected
			let selfLinkTokens = mockDataSet.basicData.item.link.split('/');
			expect(nestedItem.getWorkspaceId()).to.equal(selfLinkTokens[4]);
		});
	});

	describe('[METHOD] getItemUrn', () => {
		it('should return the expected item urn', () => {
			expect(nestedItem.getItemUrn()).to.equal(mockDataSet.basicData.item.urn);
		});
	});

	describe('[METHOD] getItem', () => {
		it('should return the expected item', () => {
			expect(nestedItem.getItem()).to.deep.equal(mockDataSet.basicData.item);
		});
	});

	describe('[METHOD] getBomId', () => {
		it('should return the expected bom id', () => {
			// Check assert bom id is as expected
			expect(nestedItem.getBomId()).to.equal(mockDataSet.basicData.__self__.split('/').pop());
		});
	});

	describe('[METHOD] getItemNumber', () => {
		it('should return the item number', () => {
			// Check assert we are passing item number as expected
			expect(nestedItem.getItemNumber()).to.equal(mockDataSet.basicData.itemNumber);
		});
	});

	describe('[METHOD] getUrn', () => {
		it('should return the urn', () => {
			// Check assert we are passing item number as expected
			expect(nestedItem.getUrn()).to.equal(mockDataSet.basicData.urn);
		});
	});

	describe('[METHOD] getChildren', () => {
		it('should return the full collection of children', () => {
			// Check returning full list of children
			expect(nestedItem.getChildren()).to.deep.equal(mockDataSet.basicData.children);
		});
	});

	describe('[METHOD] hasChildren', () => {
		it('should return boolean true of false if it has children', () => {
			let expectedResult = mockDataSet.basicData.children.length > 0 ? true : false;

			// Check assert we have children
			expect(nestedItem.hasChildren()).to.equal(expectedResult);
		});
	});

	describe('[METHOD] getFields', () => {
		it('should return the full collection of fields', () => {
			// Check assert that we are returning all fields
			expect(nestedItem.getFields()).to.deep.equal(mockDataSet.basicData.fields);
		});
	});

	describe('[METHOD] getFieldLink', () => {
		it('should return the correct link to the specified field', () => {
			let field = nestedItem.getFields()[0];
			expect(nestedItem.getFieldLink(field.__self__.split('/').pop())).to.equal(field.__self__);
		});
	});
});
