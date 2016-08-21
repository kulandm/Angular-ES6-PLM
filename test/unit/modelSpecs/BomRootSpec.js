(() => {
	'use strict';

	describe('[MODEL] BomRoot', () => {
		// Model Handle
		let BomRoot, rootItem;
		let MockRESTWrapperService, MockPromiseStubber, MockBomRootData;
		let mockDataSet;

		beforeEach(module('plm360.mockObjects', 'plm360.mockData', ($provide) => {
			$provide.value('RESTWrapperService', {});
		}));

		beforeEach(module('com/autodesk/models/bomApi/bomRoot.model.js'));

		beforeEach(() => {
			// Inject services and values that will be used
			inject(($injector) => {
				MockRESTWrapperService = $injector.get('MockRESTWrapperService');
				MockPromiseStubber = $injector.get('MockPromiseStubber');
				MockBomRootData = $injector.get('MockBomRootData');

				mockDataSet = MockBomRootData.basicData;

				BomRoot = $injector.get('BomRoot');
				BomRoot.RESTWrapperService = new MockRESTWrapperService();

				rootItem = new BomRoot(mockDataSet);
			});
		});

		describe('[STATE]', () => {
			it('Should set the properties from the json correctly', () => {
				expect(rootItem.__self__, '__self__').to.equal(mockDataSet.__self__);
				expect(rootItem.item, 'item').to.equal(mockDataSet.item);
				expect(rootItem.occurancesCount, 'occurancesCount').to.equal(mockDataSet.occurancesCount);
				expect(rootItem.configData, 'configData').to.equal(mockDataSet.configData);
				expect(rootItem.fields, 'fields').to.equal(mockDataSet.fields);
			});
		});

		describe('[METHOD] getSelfLink', () => {
			it('should return the expected self link', () => {
				expect(rootItem.getSelfLink()).to.equal(mockDataSet.__self__.replace(/^\//, ''));
			});
		});

		describe('[METHOD] getItemId', () => {
			it('should return the item id', () => {
				// helper to assert value expected
				let tokens = mockDataSet.item.urn.split('.');
				expect(rootItem.getItemId()).to.equal(`${tokens[4]}@${tokens[5]}`);
			});
		});

		describe('[METHOD] getDmsId', () => {
			it('should return the dms id', () => {
				expect(rootItem.getDmsId()).to.equal(mockDataSet.item.urn.split('.').pop());
			});
		});

		describe('[METHOD] getWorkspaceId', () => {
			it('should return the workspace id', () => {
				// helper to assert value expected
				let selfLinkTokens = mockDataSet.__self__.split('/');
				expect(rootItem.getWorkspaceId()).to.equal(selfLinkTokens[4]);
			});
		});

		describe('[METHOD] getOccurancesCount', () => {
			it('should return the total number of parts in the assembly', () => {
				expect(rootItem.getOccurancesCount()).to.equal(mockDataSet.occurancesCount);
			});
		});

		describe('[METHOD] getFields', () => {
			it('should return the full list of fields', () => {
				expect(rootItem.getFields()).to.equal(mockDataSet.fields);
			});
		});

		describe('[METHOD] getConfigDate', () => {
			it('should return the provided config date', () => {
				expect(rootItem.getConfigDate()).to.equal(mockDataSet.configData.bomViewDate);
			});
		});

		describe('[METHOD] getConfigBias', () => {
			it('should return the provided config date', () => {
				expect(rootItem.getConfigBias()).to.equal(mockDataSet.configData.bias);
			});
		});

		describe('[METHOD] getItemUrn', () => {
			it('should return the expected item urn', () => {
				expect(rootItem.getItemUrn()).to.equal(mockDataSet.item.urn);
			});
		});

		describe('[STATIC METHOD] fetch', () => {
			it('Should return an instance of BomRoot corresponding to the link', () => {
				let config = {
					someParam: 'Param'
				};

				MockPromiseStubber.setPromiseStubSuccess(BomRoot.RESTWrapperService.get, mockDataSet, ['randomItemLink', sinon.match.any, config, sinon.match.any]);
				expect(BomRoot.fetch('randomItemLink', config)).to.deep.equal(rootItem);
			});
		});
	});
})();
