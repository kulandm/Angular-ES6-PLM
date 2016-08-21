'use strict';

describe('[MODEL] ViewDefinitions', () => {
	// Model Handle
	let ViewDefinitions, viewDefs;

	let $rootScope, EventService, UrnParser, mockRESTWrapperService, mockBomMessageService, mockViewDefinitionsData, mockViewDefinitionObj, mockPromiseStubber;

	// mock data container
	let mockDataSet;

	beforeEach(module(
		'com/autodesk/EventService.js',
		'com/autodesk/UrnParser.js',
		'com/autodesk/models/bomViewDefinition/viewDefinitions.model.js',
		'plm360.mockObjects', 'plm360.mockData',
		($provide) => {
			$provide.value('RESTWrapperService', {
				get: () => {}
			});
			$provide.value('BomMessageService', {
                getViewDefinitionReceivedMessage: sinon.stub(),
				getViewDefinitionGetMessage: () => {
						return 'message';
				}
            });
		}
	));

	beforeEach(() => {
		// Inject services and values that will be used
		inject((_$rootScope_, _RESTWrapperService_, _BomMessageService_, _EventService_, _UrnParser_, _ViewDefinitions_, MockViewDefinitionsData, MockViewDefinitionObj, MockPromiseStubber) => {
			$rootScope = _$rootScope_;
			ViewDefinitions = _ViewDefinitions_;
			EventService = _EventService_;
			UrnParser = _UrnParser_;
			mockRESTWrapperService = _RESTWrapperService_;
			mockBomMessageService = _BomMessageService_;

			mockViewDefinitionsData = MockViewDefinitionsData;
			mockViewDefinitionObj = MockViewDefinitionObj;
            mockPromiseStubber = MockPromiseStubber;

			mockDataSet = mockViewDefinitionsData;
		});

		viewDefs = new ViewDefinitions(mockDataSet.basicData);
	});

	describe('[METHOD] getLink', () => {
		it('Should return the correct value', () => {
			expect(viewDefs.getLink()).to.equal(mockDataSet.basicData.__self__.link);
		});
	});

	describe('[METHOD] getUrn', () => {
		it('Should return the correct value', () => {
			expect(viewDefs.getUrn()).to.equal(mockDataSet.basicData.__self__.urn);
		});
	});

	describe('[METHOD] getCount', () => {
		it('Should return the correct value', () => {
			expect(viewDefs.getCount()).to.equal(mockDataSet.basicData.count);
		});
	});

	describe('[METHOD] getViews', () => {
		it('Should return an arrayif the views have yet to be loaded', () => {
			expect(viewDefs.getViews().length).to.equal(0);
		});

		it('Should return the contents of viewObjects (assuming it exists)', () => {
			viewDefs.viewsMap.set(viewDefs.bomViews[0].urn, 'someView');
			expect(viewDefs.getViews()).to.deep.equal(['someView']);
		});
	});

	describe('[METHOD] getDefaultView', () => {
		it('Should return the default view', () => {
			let getViewsMapStub = sinon.stub(viewDefs, 'getViewsMap');
			let views = new Map();

			let viewA = new mockViewDefinitionObj();
			viewA.isDefaultView.returns(false);
			let viewB = new mockViewDefinitionObj();
			viewB.isDefaultView.returns(true);
			views.set('A', viewA);
			views.set('B', viewB);

			getViewsMapStub.returns(views);

			expect(viewDefs.getDefaultView()).to.equal(viewB);

			getViewsMapStub.restore();
		});
	});

	describe('[METHOD] find', () => {
		it('Should return the view with the corresponding id', () => {
			let getViewsMapStub = sinon.stub(viewDefs, 'getViewsMap');
			let views = new Map();

			let viewA = new mockViewDefinitionObj();
			viewA.getId.returns(1);
			let viewB = new mockViewDefinitionObj();
			viewB.getId.returns(7);
			let viewC = new mockViewDefinitionObj();
			viewC.getId.returns(3);
			views.set('A', viewA);
			views.set('B', viewB);
			views.set('C', viewC);

			getViewsMapStub.returns(views);

			expect(viewDefs.find(7)).to.equal(viewB);

			getViewsMapStub.restore();
		});
	});

	describe('[METHOD] loadViews', () => {
		it('Should load all the views', () => {
			let viewA = new mockViewDefinitionObj();
			viewA.getUrn.returns(mockDataSet.basicData.bomViews[0].urn);
			let loadedAMessage = 'testMessage:LoadedViewA';
			mockBomMessageService.getViewDefinitionReceivedMessage
							 .withArgs(UrnParser.encode(mockDataSet.basicData.bomViews[0].urn))
							 .returns(loadedAMessage);

			let viewB = new mockViewDefinitionObj();
			viewB.getUrn.returns(mockDataSet.basicData.bomViews[1].urn);
			let loadedBMessage = 'testMessage:LoadedViewB';
			mockBomMessageService.getViewDefinitionReceivedMessage
							 .withArgs(UrnParser.encode(mockDataSet.basicData.bomViews[1].urn))
							 .returns(loadedBMessage);

			let response = viewDefs.loadViews();
			EventService.send(loadedBMessage, viewA);
			EventService.send(loadedAMessage, viewB);
			$rootScope.$apply();

			let viewsMap = viewDefs.getViewsMap();
			expect(viewsMap.size).to.equal(2);
			expect(viewsMap.has(viewDefs.bomViews[0].urn)).to.be.defined;
			expect(viewsMap.has(viewDefs.bomViews[1].urn)).to.be.defined;
		});
	});

	describe('[METHOD] buildViewStorageKey', () => {
		it('Should create the correct key', () => {
			expect(viewDefs.buildViewStorageKey('33')).to.equal('workspace:33_bomView');
		});
	});

    describe('[METHOD] fetch', () => {
        it('Should return an instance of ViewDefinitions with the correct properties', () => {
            let link = 'linkToViewDefinitions';
            mockPromiseStubber.stubWithSuccess(mockRESTWrapperService, 'get', mockDataSet.basicData, [link, sinon.match.any, sinon.match.any, sinon.match.any]);
			mockPromiseStubber.stubWithSuccess(ViewDefinitions.prototype, 'loadViews', null);

            let views = ViewDefinitions.fetch(link);
            expect(views.getLink()).to.equal(mockDataSet.basicData.__self__.link);
        });
    });
});
