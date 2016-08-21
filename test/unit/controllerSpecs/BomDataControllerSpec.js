'use strict';

describe('BomDataController', () => {
    let bomDataController = null;
    let sandbox = sinon.sandbox.create();

    // Injects
    let $rootScope, $q, ModelsManager, EventService, UrnParser, BomTable, BomMessageService, BomDataController, BulkBomLoader, BomGraphBuilder, UrlParser, RESTWrapperService, LocalUserStorageService, BomTableRowBuilder, BomBulkAttachmentLoader;
    let MockItemObj, MockViewDefinitionsObj, MockViewDefinitionObj, MockBomRootObj, MockBomNestedObj, MockBomNestedItemObj, MockBomGraphBuilderObj, MockBulkBomObj;
    let MockBomUIFieldSemantics;

    // Imports
    let BomNode = System.get('com/autodesk/models/bomGraph/bomNode.model.js').default;
    let BomGraph = System.get('com/autodesk/models/bomGraph/bomGraph.model.js').default;
    let BomPath = System.get('com/autodesk/models/bomTable/bomPath.model.js').default;
    let BomConfigurationStateMachine = System.get('com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js').default;
    let BomUIFieldSemantics = System.get('com/autodesk/models/bomFields/BomUIFieldSemantics.service.js').default;
    let GraphBuilder = System.get('com/autodesk/models/bomGraph/bomGraphBuilder.service.js').default;
    let BulkAttachmentLoader = System.get('com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js').default;
    let BomBulkAttachment = System.get('com/autodesk/models/bomAttachment/bomBulkAttachment.model.js').default({});

    let mockItemObj, mockViewDefsObj, mockViewDefObj, mockBomRootObj, mockBomNestedObj, mockBomGraphBuilderObj, mockBomNestedItemObj, mockBulkBomObj;

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(module('com/autodesk/UrnParser.js',
        'com/autodesk/EventService.js',
        'com/autodesk/components/workspaceItem/viewBom/BomMessageService.js',
        'com/autodesk/models/bulkBom/bulkBomLoader.service.js',
        'com/autodesk/models/bulkBom/bulkBom.model.js',
        'com/autodesk/services/UrlParser.js',
        'com/autodesk/models/bomTable/bomTableRowBuilder.service.js',
        'plm360.mockObjects', 'plm360.mockData'));

    beforeEach(module(($provide) => {
        $provide.value('ModelsManager', {
            getItem: sinon.stub(),
            getViewDefs: sinon.stub(),
            getBomRoot: sinon.stub(),
            getBomNested: sinon.stub(),
            getBomNestedItem: sinon.stub(),
            getRevisions: sinon.stub()
        });

        $provide.value('LocalUserStorageService', {
            get: sinon.stub(),
            set: sinon.stub(),
            canUseLocalStorage: sinon.stub()
        });

        let tableConstructor = sinon.stub();
        tableConstructor.returns({
            addColumnsForViewDefinition: sinon.stub(),
            rowExists: sinon.stub(),
            addBomRow: sinon.stub(),
            getRowForPath: sinon.stub(),
            clear: sinon.stub()
        });
        $provide.value('BomTable', tableConstructor);

        $provide.value('BomField', {});

        $provide.value('BomFieldData', {});

        $provide.value('RESTWrapperService', {
            get: sinon.stub()
        });

        let stubbedGraphBuilder = sinon.createStubInstance(GraphBuilder);
        $provide.value('BomGraphBuilder', stubbedGraphBuilder);

        let stubbedAttachmentLoader = sinon.createStubInstance(BulkAttachmentLoader);
        $provide.value('BomBulkAttachmentLoader', stubbedAttachmentLoader);
    }));

    beforeEach(() => {
        let BomDataControllerFactory = System.get('com/autodesk/components/workspaceItem/viewBom/bomDataController.js').default;
        angular.module('BomDataControllerSpec', []).factory('BomDataController', BomDataControllerFactory);
        module('BomDataControllerSpec');
        inject((_$rootScope_, _$q_, _ModelsManager_, _EventService_, _UrnParser_, _BomTable_, _BomMessageService_, _BomDataController_, _BulkBomLoader_, _BomGraphBuilder_, _UrlParser_, _RESTWrapperService_, _LocalUserStorageService_, _BomTableRowBuilder_, _BomBulkAttachmentLoader_, _MockItemObj_, _MockViewDefinitionsObj_, _MockViewDefinitionObj_, _MockBomRootObj_, _MockBomNestedObj_, _MockBomNestedItemObj_, _MockBomGraphBuilderObj_, _MockBulkBomObj_, _MockBomUIFieldSemantics_) => {
            $rootScope = _$rootScope_;
            $q = _$q_;
            ModelsManager = _ModelsManager_;
            EventService = _EventService_;
            UrnParser = _UrnParser_;
            BomTable = _BomTable_;
            BomMessageService = _BomMessageService_;
            BomDataController = _BomDataController_;
            BulkBomLoader = _BulkBomLoader_;
            BomGraphBuilder = _BomGraphBuilder_;
            UrlParser = _UrlParser_;
            RESTWrapperService = _RESTWrapperService_;
            LocalUserStorageService = _LocalUserStorageService_;
            BomTableRowBuilder = _BomTableRowBuilder_;
            BomBulkAttachmentLoader = _BomBulkAttachmentLoader_;

            MockItemObj = _MockItemObj_;
            MockViewDefinitionsObj = _MockViewDefinitionsObj_;
            MockViewDefinitionObj = _MockViewDefinitionObj_;
            MockBomRootObj = _MockBomRootObj_;
            MockBomNestedObj = _MockBomNestedObj_;
            MockBomNestedItemObj = _MockBomNestedItemObj_;
            MockBomGraphBuilderObj = _MockBomGraphBuilderObj_;
            MockBulkBomObj = _MockBulkBomObj_;

            MockBomUIFieldSemantics = _MockBomUIFieldSemantics_;
        });

        mockItemObj = new MockItemObj();
        mockItemObj.getId.returns('someId');
        mockItemObj.getUrn.returns('someUrn');
        mockItemObj.getWorkspaceObj.returns({
            getId: () => {
                return 'someWSId';
            }
        });
        mockItemObj.isWorking.returns(false);

        mockViewDefsObj = new MockViewDefinitionsObj();
        mockViewDefsObj.getDefaultView.returns({
            getId: () => {
                return 'someDefaultViewId';
            }
        });

        mockViewDefObj = new MockViewDefinitionObj();
        mockBomRootObj = new MockBomRootObj();
        mockBomNestedObj = new MockBomNestedObj();
        mockBomGraphBuilderObj = new MockBomGraphBuilderObj();
        mockBomNestedItemObj = new MockBomNestedItemObj();
        mockBulkBomObj = new MockBulkBomObj();
        bomDataController = new BomDataController('someUrn');
    });

    describe('[INIT]', () => {
        it('Should init the configuration state machine with the correct API date format', () => {
            expect(bomDataController.configurationStateMachine).to.be.defined;
            expect(bomDataController.configurationStateMachine.dateFormat).to.equal('YYYY-MM-DD');
        });

        it('Should store the provided urn', () => {
            expect(bomDataController.itemUrn).to.equal('someUrn');
        });

        it('Should initialize the graph', () => {
            expect(bomDataController.bomGraph).to.be.defined;
        });

        it('Should initialize the table', () => {
            expect(bomDataController.bomTable).to.be.defined;
        });
    });

    describe('[METHODS]', () => {
        beforeEach(() => {
            bomDataController.configurationStateMachine = sinon.createStubInstance(BomConfigurationStateMachine);
            bomDataController.bomGraph = sinon.createStubInstance(BomGraph);
        });

        describe('getItemObj', () => {
            it('Returns the item object', () => {
                let itemObj = {};
                expect(bomDataController.getItemObj()).to.equal(null);
                bomDataController.itemObj = itemObj;
                expect(bomDataController.getItemObj()).to.equal(itemObj);
            });
        });

        describe('getGraph', () => {
            it('Returns the graph', () => {
                expect(bomDataController.getGraph()).to.equal(bomDataController.bomGraph);
            });
        });

        describe('getTable', () => {
            it('Returns the table', () => {
                expect(bomDataController.getTable()).to.equal(bomDataController.bomTable);
            });
        });

        describe('getConfigurationStateMachine', () => {
            it('Returns the state machine', () => {
                expect(bomDataController.getConfigurationStateMachine()).to.equal(bomDataController.configurationStateMachine);
            });
        });

        describe('getViewDefs', () => {
            it('Returns the view definitions', () => {
                expect(bomDataController.getViewDefs()).to.equal(null);
                bomDataController.viewDefs = {};
                expect(bomDataController.getViewDefs()).to.equal(bomDataController.viewDefs);
            });
        });

        describe('getCurrentViewDef', () => {
            it('Returns the current view definition', () => {
                expect(bomDataController.getCurrentViewDef()).to.equal(null);
                bomDataController.currentViewDef = {};
                expect(bomDataController.getCurrentViewDef()).to.equal(bomDataController.currentViewDef);
            });
        });

        describe('init', () => {
            let initBomStub, returnedPromise;
            beforeEach(() => {
                initBomStub = sandbox.stub(bomDataController, 'initBom');
                initBomStub.returns('finished');

                expect(ModelsManager.getItem.called).to.be.false;
                returnedPromise = bomDataController.init();
            });

            afterEach(() => {
                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);
                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);
            });

            it('Should request the correct item', () => {
                expect(ModelsManager.getItem.calledOnce).to.be.true;
                expect(ModelsManager.getItem.calledWith(bomDataController.itemUrn)).to.be.true;
            });

            it('Should store the returned item', () => {
                expect(bomDataController.itemObj).to.equal(null);
                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);
                expect(bomDataController.itemObj).to.equal(mockItemObj);
            });

            it('Should request the correct view def after the item returns', () => {
                expect(ModelsManager.getViewDefs.called).to.be.false;
                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);
                expect(ModelsManager.getViewDefs.calledOnce).to.be.true;
                expect(ModelsManager.getViewDefs.calledWith(mockItemObj.getWorkspaceObj().getId())).to.be.true;
            });

            it('Should store the returned view definitions', () => {
                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);

                expect(bomDataController.viewDefs).to.equal(null);
                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);
                expect(bomDataController.viewDefs).to.equal(mockViewDefsObj);
            });

            it('Should update the state machine', () => {
                mockItemObj.isWorkingRevision = true;
                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);

                expect(bomDataController.configurationStateMachine.setInitialState.called).to.be.false;
                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);
                expect(bomDataController.configurationStateMachine.setInitialState.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setInitialState.calledWith(mockItemObj.getId(), mockViewDefsObj.getDefaultView().getId(), mockItemObj.isWorking())).to.be.true;
            });

            it('Should update the state machine when no view is saved and save that view', () => {
                mockItemObj.isWorkingRevision = true;
                LocalUserStorageService.canUseLocalStorage.returns(true);
                mockViewDefsObj.buildViewStorageKey.withArgs(mockItemObj.getWorkspaceObj().getId()).returns('aKey');

                LocalUserStorageService.get.withArgs('aKey').returns(undefined);
                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);

                expect(bomDataController.configurationStateMachine.setInitialState.called).to.be.false;
                expect(LocalUserStorageService.set.called).to.be.false;

                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);

                expect(bomDataController.configurationStateMachine.setInitialState.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setInitialState.calledWith(mockItemObj.getId(), mockViewDefsObj.getDefaultView().getId(), mockItemObj.isWorking())).to.be.true;

                expect(LocalUserStorageService.set.calledOnce).to.be.true;
                expect(LocalUserStorageService.set.calledWith('aKey', mockViewDefsObj.getDefaultView().getId())).to.be.true;
            });

            it('Should update the state machine with the correct view when local storage is disabled', () => {
                mockItemObj.isWorkingRevision = true;
                LocalUserStorageService.canUseLocalStorage.returns(false);

                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);

                expect(bomDataController.configurationStateMachine.setInitialState.called).to.be.false;
                expect(LocalUserStorageService.set.called).to.be.false;

                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);

                expect(bomDataController.configurationStateMachine.setInitialState.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setInitialState.calledWith(mockItemObj.getId(), mockViewDefsObj.getDefaultView().getId(), mockItemObj.isWorking())).to.be.true;
                expect(LocalUserStorageService.set.called).to.be.false;
            });

            it('Should update the state machine with the correct view when a view has been saved', () => {
                mockItemObj.isWorkingRevision = true;
                LocalUserStorageService.canUseLocalStorage.returns(true);
                mockViewDefsObj.buildViewStorageKey.withArgs(mockItemObj.getWorkspaceObj().getId()).returns('aKey');
                LocalUserStorageService.get.withArgs('aKey').returns('32');

                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);

                expect(bomDataController.configurationStateMachine.setInitialState.called).to.be.false;
                expect(LocalUserStorageService.set.called).to.be.false;

                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);

                expect(bomDataController.configurationStateMachine.setInitialState.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setInitialState.calledWith(mockItemObj.getId(), '32', mockItemObj.isWorking())).to.be.true;
                expect(LocalUserStorageService.set.called).to.be.false;
            });

            it('Should resolve with result of initBom', (done) => {
                returnedPromise.then((result) => {
                    expect(result).to.equal('finished');
                    done();
                });

                EventService.send(`itemInstance:${bomDataController.itemUrn}:done`, mockItemObj);
                EventService.send(`viewDefinitions:${mockItemObj.getWorkspaceObj().getId()}:done`, mockViewDefsObj);
                $rootScope.$apply();
            });
        });

        describe('initBom', () => {
            let loadBomRootStub, addPathToTableStub, updateTargetStub, shouldUseBulkLoaderStub, populateInitialBomStub, loadSubAssemblyStub;
            let loadedRootPromise;

            beforeEach(() => {
                loadBomRootStub = sandbox.stub(bomDataController, 'loadBomRoot');
                addPathToTableStub = sandbox.stub(bomDataController, 'addPathToTable');
                updateTargetStub = sandbox.stub(bomDataController, 'updateTarget');
                shouldUseBulkLoaderStub = sandbox.stub(bomDataController, 'shouldUseBulkLoader');
                populateInitialBomStub = sandbox.stub(bomDataController, 'populateInitialBom');
                loadSubAssemblyStub = sandbox.stub(bomDataController, 'loadSubAssembly');

                bomDataController.viewDefs = mockViewDefsObj;
                bomDataController.itemObj = mockItemObj;
                bomDataController.configurationStateMachine.viewDefId = 'someViewDefId';
                bomDataController.configurationStateMachine.getTopLineQueryParams.returns('SomeParams');
                bomDataController.viewDefs.find.withArgs(bomDataController.configurationStateMachine.viewDefId).returns(mockViewDefObj);

                loadedRootPromise = $q.defer();
                loadBomRootStub.returns(loadedRootPromise.promise);
            });

            it('Should clear the graph', () => {
                expect(bomDataController.bomGraph.clear.called).to.be.false;
                bomDataController.initBom();
                expect(bomDataController.bomGraph.clear.calledOnce).to.be.true;
            });

            it('Should clear the table', () => {
                expect(bomDataController.bomTable.clear.called).to.be.false;
                bomDataController.initBom();
                expect(bomDataController.bomTable.clear.calledOnce).to.be.true;
            });

            it('Should store the correct current view definition', () => {
                expect(bomDataController.currentViewDef).to.equal(null);
                bomDataController.initBom();
                expect(bomDataController.currentViewDef).to.equal(mockViewDefObj);
            });

            it('Should add the columns to the table', () => {
                expect(bomDataController.bomTable.addColumnsForViewDefinition.called).to.be.false;
                bomDataController.initBom();
                expect(bomDataController.bomTable.addColumnsForViewDefinition.calledOnce).to.be.true;
                expect(bomDataController.bomTable.addColumnsForViewDefinition.calledWith(mockViewDefObj)).to.be.true;
            });

            it('Should load the bom root', () => {
                shouldUseBulkLoaderStub.returns(false);
                expect(loadBomRootStub.called).to.be.false;
                bomDataController.initBom();
                expect(loadBomRootStub.calledOnce).to.be.true;
                expect(loadBomRootStub.calledWith(UrnParser.encode(mockItemObj.getUrn()), 'SomeParams')).to.be.true;
            });

            it('Should add the root path to the table after loading the root', () => {
                shouldUseBulkLoaderStub.returns(false);
                bomDataController.initBom();
                expect(addPathToTableStub.called).to.be.false;
                loadedRootPromise.resolve(mockBomRootObj);
                $rootScope.$apply();
                expect(addPathToTableStub.calledOnce).to.be.true;
                expect(addPathToTableStub.args[0][0].isPathToRoot()).to.be.true;
            });

            it('Should resolve without updating the target if the current item is the same as bomRoot', (done) => {
                shouldUseBulkLoaderStub.returns(false);
                mockBomRootObj.getItemUrn.returns(mockItemObj.getUrn());

                let returnedPromise = bomDataController.initBom();
                returnedPromise.then((result) => {
                    expect(updateTargetStub.called).to.be.false;
                    expect(result).to.be.undefined;
                    done();
                });

                expect(updateTargetStub.called).to.be.false;
                loadedRootPromise.resolve(mockBomRootObj);
                $rootScope.$apply();
            });

            it('Should resolve with the result of updating the target if the current item is not the same as bomRoot', (done) => {
                shouldUseBulkLoaderStub.returns(false);
                mockBomRootObj.getItemUrn.returns('someOtherUrn');
                mockBomRootObj.getItemId.returns('someOtherId');
                updateTargetStub.returns('updated');

                let returnedPromise = bomDataController.initBom();
                returnedPromise.then((result) => {
                    expect(updateTargetStub.calledOnce).to.be.true;
                    expect(updateTargetStub.calledWith(mockBomRootObj.getItemId())).to.be.true;
                    expect(result).to.equal('updated');
                    done();
                });

                expect(updateTargetStub.called).to.be.false;
                loadedRootPromise.resolve(mockBomRootObj);
                $rootScope.$apply();
            });

            it('Should use bulk loader for loading the bom when the flag for bulk loading is turned on', () => {
                shouldUseBulkLoaderStub.returns(true);
                let deferred = $q.defer();
                deferred.resolve();
                let mockBomNode = sinon.createStubInstance(BomNode);
                populateInitialBomStub.returns(deferred.promise);
                loadSubAssemblyStub.returns(deferred.promise);
                bomDataController.bomGraph.getRootNode.returns(mockBomNode);
                bomDataController.initBom();

                $rootScope.$digest();
                expect(populateInitialBomStub.calledOnce).to.be.true;
                expect(loadSubAssemblyStub.calledOnce).to.be.true;
            });
        });

        describe('loadBomRoot', () => {
            let updateConfigurationStub, rootNode;
            let urn, configuration;

            beforeEach(() => {
                updateConfigurationStub = sandbox.stub(bomDataController, 'updateConfiguration');
                rootNode = {
                    itemId: 'someItemId'
                };
                BomGraphBuilder.buildRootNode.withArgs(mockBomRootObj).returns(rootNode);
                mockBomRootObj.getDmsId.returns('someDmsId');
                mockBomRootObj.getConfigDate.returns('someDate');
                mockBomRootObj.getConfigBias.returns('someBias');

                urn = 'someUrn';
                configuration = 'someConfiguration';
            });

            afterEach(() => {
                EventService.send(`bomRoot:${urn}:done`, mockBomRootObj);
            });

            it('Should fetch the root', () => {
                expect(ModelsManager.getBomRoot.called).to.be.false;
                bomDataController.loadBomRoot(urn, configuration);
                expect(ModelsManager.getBomRoot.calledOnce).to.be.true;
                expect(ModelsManager.getBomRoot.calledWith(urn, configuration)).to.be.true;
            });

            it('Should update the configuration after loading the root', () => {
                bomDataController.loadBomRoot(urn, configuration);
                expect(updateConfigurationStub.called).to.be.false;
                EventService.send(`bomRoot:${urn}:done`, mockBomRootObj);
                expect(updateConfigurationStub.calledOnce).to.be.true;
                expect(updateConfigurationStub.calledWith(mockBomRootObj.getDmsId(), mockBomRootObj.getConfigDate(), mockBomRootObj.getConfigBias())).to.be.true;
            });

            it('Should build and insert a root node corresponding to the loaded root', () => {
                bomDataController.loadBomRoot(urn, configuration);
                expect(bomDataController.bomGraph.addNode.called).to.be.false;
                expect(bomDataController.bomGraph.setRootNodeId.called).to.be.false;

                EventService.send(`bomRoot:${urn}:done`, mockBomRootObj);

                expect(bomDataController.bomGraph.addNode.calledOnce).to.be.true;
                expect(bomDataController.bomGraph.addNode.calledWith(rootNode)).to.be.true;
                expect(bomDataController.bomGraph.setRootNodeId.calledOnce).to.be.true;
                expect(bomDataController.bomGraph.setRootNodeId.calledWith(rootNode.itemId)).to.be.true;
            });

            it('Should resolve with the loaded root data', (done) => {
                let returnedPromise = bomDataController.loadBomRoot(urn, configuration);
                returnedPromise.then((result) => {
                    expect(result).to.equal(mockBomRootObj);
                    done();
                });

                EventService.send(`bomRoot:${urn}:done`, mockBomRootObj);
                $rootScope.$apply();
            });
        });

        describe('updateConfiguration', () => {
            let dmsId = 'someDmsId';
            let date = 'someDate';
            let bias = 'someBias';

            it('Should update the itemId', () => {
                bomDataController.updateConfiguration(dmsId, date, bias);
                expect(bomDataController.configurationStateMachine.setItemId.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setItemId.calledWith(dmsId)).to.be.true;
            });

            it('Should update the effective date', () => {
                bomDataController.updateConfiguration(dmsId, date, bias);
                expect(bomDataController.configurationStateMachine.setEffectiveDate.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setEffectiveDate.calledWith(date)).to.be.true;
            });

            it('Should update the itemId', () => {
                bomDataController.updateConfiguration(dmsId, date, bias);
                expect(bomDataController.configurationStateMachine.setRevisionBias.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setRevisionBias.calledWith(bias)).to.be.true;
            });
        });

        describe('updateTarget', () => {
            let itemId;
            beforeEach(() => {
                itemId = 'someItemId';
                mockItemObj.isWorking.returns(true);
            });

            afterEach(() => {
                EventService.send(`itemInstance:${itemId}:done`, mockItemObj);
            });

            it('Should request the item', () => {
                expect(ModelsManager.getItem.called).to.be.false;
                bomDataController.updateTarget(itemId);
                expect(ModelsManager.getItem.calledOnce).to.be.true;
                expect(ModelsManager.getItem.calledWith(itemId)).to.be.true;
            });

            it('Should update the item after the item returns', () => {
                bomDataController.updateTarget(itemId);
                expect(bomDataController.itemObj).to.equal(null);
                EventService.send(`itemInstance:${itemId}:done`, mockItemObj);
                $rootScope.$apply();

                expect(bomDataController.itemObj).to.equal(mockItemObj);
            });

            it('Should update the configuration after the item returns', () => {
                bomDataController.updateTarget(itemId);
                expect(bomDataController.configurationStateMachine.setIsWorkingRevision.called).to.be.false;
                EventService.send(`itemInstance:${itemId}:done`, mockItemObj);
                $rootScope.$apply();

                expect(bomDataController.configurationStateMachine.setIsWorkingRevision.calledOnce).to.be.true;
                expect(bomDataController.configurationStateMachine.setIsWorkingRevision.calledWith(mockItemObj.isWorking())).to.be.true;
            });

            it('Should return a promise that resolves after the item returns', (done) => {
                let resolved = false;
                let returnedPromise = bomDataController.updateTarget(itemId);
                returnedPromise.then((result) => {
                    resolved = true;
                    expect(result).to.equal(itemId);
                    done();
                });

                $rootScope.$apply();
                expect(resolved).to.be.false;

                EventService.send(`itemInstance:${itemId}:done`, mockItemObj);
                $rootScope.$apply();
                expect(resolved).to.be.true;
            });
        });

        describe('addPathToTable', () => {
            let path, row, sendSpy, buildRowFromPathStub;
            beforeEach(() => {
                buildRowFromPathStub = sandbox.stub(BomTableRowBuilder, 'buildRowFromPath');
                path = BomPath.EmptyPath();
                row = {};
                buildRowFromPathStub.withArgs(path).returns(row);

                sendSpy = sandbox.spy(EventService, 'send');
            });

            it('Should do nothing if the row already exists', () => {
                bomDataController.bomTable.rowExists.withArgs(path).returns(true);
                bomDataController.addPathToTable(path);
                expect(buildRowFromPathStub.called).to.be.false;
                expect(bomDataController.bomTable.addBomRow.called).to.be.false;
                expect(sendSpy.calledWith(BomMessageService.getBomRowAddedMessage(path))).to.be.false;
            });

            it('Should add a new row to the table if the row does not exists', () => {
                bomDataController.bomTable.rowExists.withArgs(path).returns(false);
                bomDataController.addPathToTable(path);
                expect(buildRowFromPathStub.called).to.be.true;
                expect(bomDataController.bomTable.addBomRow.withArgs(row).called).to.be.true;
            });

            it('Should alert to the new row being added to the table if the row does not exists', () => {
                bomDataController.bomTable.rowExists.withArgs(path).returns(false);
                bomDataController.addPathToTable(path);
                expect(sendSpy.calledWith(BomMessageService.getBomRowAddedMessage(path))).to.be.true;
            });
        });

        describe('populateChildrenAndOutputToTable', () => {
            let row, bomItemA, bomItemB;
            beforeEach(() => {
                sandbox.stub(bomDataController, 'fillTableFromPath');
                sandbox.stub(bomDataController, 'processListInChunks').returns({
                    then: sinon.stub()
                });

                row = {
                    path: new BomPath(['1', '2', '3']),
                    nodeId: '31415'
                };

                bomItemA = {
                    id: '6'
                };

                bomItemB = {
                    id: '7'
                };

                bomDataController.bomGraph.hasEdge.withArgs(bomItemA.id).returns(false);
                bomDataController.bomGraph.hasEdge.withArgs(bomItemB.id).returns(true);

                mockBomNestedObj.getBomItems.returns([bomItemA, bomItemB]);

                bomDataController.configurationStateMachine.getFullConfiguration.returns('someConfiguration');
            });

            afterEach(() => {
                EventService.send(`bomNested:${row.nodeId}:done`, mockBomNestedObj);
            });

            it('Should load the nested item', () => {
                expect(ModelsManager.getBomNested.called).to.be.false;
                bomDataController.populateChildrenAndOutputToTable(row);
                expect(ModelsManager.getBomNested.calledOnce).to.be.true;
                expect(ModelsManager.getBomNested.calledWith(row.nodeId, bomDataController.configurationStateMachine.getFullConfiguration())).to.be.true;
            });

            it('Should fill the table with the rows that do not need loading', () => {
                bomDataController.populateChildrenAndOutputToTable(row);
                expect(bomDataController.fillTableFromPath.called).to.be.false;
                EventService.send(`bomNested:${row.nodeId}:done`, mockBomNestedObj);
                expect(bomDataController.fillTableFromPath.calledOnce).to.be.true;
                expect(bomDataController.fillTableFromPath.calledWith(row.path)).to.be.true;
            });

            it('Should fill the table with the rows that do need loading', () => {
                bomDataController.populateChildrenAndOutputToTable(row);
                expect(bomDataController.processListInChunks.called).to.be.false;
                EventService.send(`bomNested:${row.nodeId}:done`, mockBomNestedObj);
                expect(bomDataController.processListInChunks.calledOnce).to.be.true;
                expect(bomDataController.processListInChunks.calledWith(sinon.match.any, [bomItemA], sinon.match.any, sinon.match.any));
            });

            it('Should process chunk correctly', () => {
                sandbox.spy(EventService, 'send');
                bomDataController.populateChildrenAndOutputToTable(row);
                expect(bomDataController.processListInChunks.called).to.be.false;
                EventService.send(`bomNested:${row.nodeId}:done`, mockBomNestedObj);
                expect(bomDataController.processListInChunks.calledOnce).to.be.true;

                let args = bomDataController.processListInChunks.args[0];
                let processingFunction = args[2];

                let deferred = $q.defer();
                sandbox.stub(bomDataController, 'loadBomItems');
                bomDataController.loadBomItems.withArgs(mockBomNestedObj, row.nodeId, [bomItemA]).returns(deferred.promise);

                processingFunction([bomItemA], 'someMessage');
                deferred.resolve();
                $rootScope.$apply();

                let pathMatcher = (path) => {
                    return path.equals(row.path.WithSucceedingEdge(bomItemA.id));
                };

                expect(bomDataController.fillTableFromPath.calledWith(sinon.match(pathMatcher))).to.be.true;
                expect(EventService.send.calledWith('someMessage'));
            });
        });

        describe('processListInChunks', () => {
            let chunksize, list, callback, messageBuilder;
            let selfSpy;

            beforeEach(() => {
                chunksize = 3;
                callback = sinon.spy((chunk, message) => {
                    EventService.send(message);
                });
                messageBuilder = (index) => {
                    return `aMessage:${index}`;
                };
                selfSpy = sandbox.spy(bomDataController, 'processListInChunks');
            });

            it('Should call callback for each chunk in order', () => {
                list = [0, 1, 2, 3, 4, 5, 6, 7];

                bomDataController.processListInChunks(chunksize, list, callback, messageBuilder);

                expect(callback.callCount).to.equal(3);
                expect(selfSpy.callCount).to.equal(Math.ceil(list.length / chunksize));
                expect(callback.args[0][0]).to.deep.equal([0, 1, 2]);
                expect(callback.args[1][0]).to.deep.equal([3, 4, 5]);
                expect(callback.args[2][0]).to.deep.equal([6, 7]);
            });

            it('Should not do any work if the list is empty', () => {
                list = [];

                bomDataController.processListInChunks(chunksize, list, callback, messageBuilder);

                expect(callback.callCount).to.equal(0);
                expect(selfSpy.callCount).to.equal(1);
            });
        });

        describe('loadBomItems', () => {
            let bomItemA, bomItemB, parentItemId, node;
            beforeEach(() => {
                bomItemA = {
                    id: '5'
                };

                bomItemB = {
                    id: '7'
                };

                parentItemId = '2@3';

                node = sinon.createStubInstance(BomNode);

                bomDataController.configurationStateMachine.getFullConfiguration.returns('someConfiguration');
                bomDataController.currentViewDef = mockViewDefObj;
                bomDataController.bomGraph.getNode.withArgs(parentItemId).returns(node);
            });

            afterEach(() => {
                EventService.send(`bomNestedItem:${bomItemA.id}:done`, {});
                EventService.send(`bomNestedItem:${bomItemB.id}:done`, {});
            });

            it('Should request the nestedItem for each bom item', () => {
                expect(ModelsManager.getBomNestedItem.called).to.be.false;
                bomDataController.loadBomItems(mockBomNestedObj, parentItemId, [bomItemA, bomItemB]);
                expect(ModelsManager.getBomNestedItem.callCount).to.equal(2);
            });

            it('Should add loaded items to the graph', () => {
                let payload = {};

                bomDataController.loadBomItems(mockBomNestedObj, parentItemId, [bomItemA]);
                expect(mockBomGraphBuilderObj.addEdgeNodeToGraph.called).to.be.false;
                EventService.send(`bomNestedItem:${bomItemA.id}:done`, payload);
                expect(BomGraphBuilder.addEdgeNodeToGraph.calledOnce).to.be.true;
                expect(BomGraphBuilder.addEdgeNodeToGraph.calledWith(payload)).to.be.true;
            });

            it('Should add loaded items to the outEdges of the parent node', () => {
                let payload = {};

                bomDataController.loadBomItems(mockBomNestedObj, parentItemId, [bomItemA]);
                expect(node.addOutEdge.called).to.be.false;
                EventService.send(`bomNestedItem:${bomItemA.id}:done`, payload);
                expect(node.addOutEdge.calledOnce).to.be.true;
                expect(node.addOutEdge.calledWith(bomItemA.id)).to.be.true;
            });

            it('Should resolve when all items have been loaded', () => {
                let resolved = false;
                let returnedPromise = bomDataController.loadBomItems(mockBomNestedObj, parentItemId, [bomItemA, bomItemB]);
                returnedPromise.then(() => {
                    resolved = true;
                });

                $rootScope.$apply();
                expect(resolved).to.be.false;

                EventService.send(`bomNestedItem:${bomItemA.id}:done`, {});
                $rootScope.$apply();
                expect(resolved).to.be.false;

                EventService.send(`bomNestedItem:${bomItemB.id}:done`, {});
                $rootScope.$apply();
                expect(resolved).to.be.true;
            });
        });

        describe('fillTableFromPath', () => {
            it('Should traverse the table', () => {
                let path = {};

                expect(bomDataController.bomGraph.BFT.called).to.be.false;
                bomDataController.fillTableFromPath(path);
                expect(bomDataController.bomGraph.BFT.calledOnce).to.be.true;
            });
        });

        describe('loadItemRevisions', () => {
            let row, node, loadedSpy, revisions;
            beforeEach(() => {

                row = {
                    hasLoadedRevisions: sinon.stub(),
                    updateRevisionField: sinon.stub()
                };
                row.path = {};
                row.isNewlyAdded = false;

                node = {
                    item: {
                        urn: 'someUrn'
                    }
                };

                bomDataController.bomGraph.getNodeForPath.withArgs(row.path).returns(node);

                sandbox.spy(EventService, 'send');
                loadedSpy = EventService.send.withArgs(`itemRevisions:${node.item.urn}:done`);

                revisions = {
                    json: {
                        versions: [{
                            status: 'A'
                        }, {
                            status: 'B'
                        }]
                    }
                };
            });

            afterEach(() => {
                EventService.send(`itemRevisions:${node.item.urn}:done`, revisions);
            });

            it('Should do nothing if the row already has loaded revision', () => {
                row.hasLoadedRevisions.returns(true);

                expect(loadedSpy.called).to.be.false;
                bomDataController.loadItemRevisions(row, []);
                expect(loadedSpy.called).to.be.false;
            });

            it('Should do nothing if the row is newly added (for the moment)', () => {
                row.hasLoadedRevisions.returns(false);
                row.isNewlyAdded = true;

                expect(loadedSpy.called).to.be.false;
                bomDataController.loadItemRevisions(row, []);
                expect(loadedSpy.called).to.be.false;
            });

            it('Should load the revisions', () => {
                row.hasLoadedRevisions.returns(false);

                expect(ModelsManager.getRevisions.called).to.be.false;
                bomDataController.loadItemRevisions(row, []);
                expect(ModelsManager.getRevisions.calledOnce).to.be.true;
                expect(ModelsManager.getRevisions.calledWith(undefined, node.item.urn)).to.be.true;
            });

            it('Should add the revisions to the row after they have loaded', () => {
                row.hasLoadedRevisions.returns(false);
                bomDataController.loadItemRevisions(row, []);

                expect(row.updateRevisionField.called).to.be.false;
                EventService.send(`itemRevisions:${node.item.urn}:done`, revisions);
                expect(row.updateRevisionField.calledOnce).to.be.true;

                let addedRevisions = row.updateRevisionField.args[0][0];
                expect(addedRevisions.length).to.equal(revisions.json.versions.length);
                expect(addedRevisions).to.contain(revisions.json.versions[0]);
                expect(addedRevisions).to.contain(revisions.json.versions[1]);
            });

            it('Should add not add excluded revisions to the row', () => {
                row.hasLoadedRevisions.returns(false);
                bomDataController.loadItemRevisions(row, ['B']);

                expect(row.updateRevisionField.called).to.be.false;
                EventService.send(`itemRevisions:${node.item.urn}:done`, revisions);
                expect(row.updateRevisionField.calledOnce).to.be.true;

                let addedRevisions = row.updateRevisionField.args[0][0];
                expect(addedRevisions.length).to.equal(revisions.json.versions.length - 1);
                expect(addedRevisions).to.contain(revisions.json.versions[0]);
                expect(addedRevisions).to.not.contain(revisions.json.versions[1]);
            });
        });

        describe('loadSubAssembly', () => {
            let fillTableFromPathStub, loadBulkbomStub, getBulkBomLinkStub;
            let config, row, nodeId, edgeId, deferred, bomNodeInstance;

            beforeEach(() => {
                nodeId = 'someNodeId';
                edgeId = 'someEdgeId';

                deferred = $q.defer();
                deferred.resolve(mockBulkBomObj);

                bomNodeInstance = sinon.createStubInstance(BomNode);
                bomNodeInstance.nodeId = nodeId;
                bomNodeInstance.getBulkBomLink.returns('someLink');
                bomNodeInstance.getDmsId.returns('someDmsId');

                config = {
                    viewDefId: 1,
                    revisionBias: 'someRevBias'
                };
                row = {
                    edgeId: edgeId,
                    nodeId: nodeId,
                    path: new BomPath([edgeId])
                };

                fillTableFromPathStub = sandbox.stub(bomDataController, 'fillTableFromPath');
                loadBulkbomStub = sandbox.stub(BulkBomLoader, 'loadBulkBom');
                bomDataController.bomGraph.getNode.withArgs(nodeId).returns(bomNodeInstance);
                bomDataController.configurationStateMachine.getFullConfiguration.returns(config);
                loadBulkbomStub.returns(deferred.promise);
            });

            it('Should be able to load the subassebmly of a Bom starting at an arbitrary path', () => {
                bomDataController.bomTable.rows = [];
                bomDataController.loadSubAssembly(row, 4);

                $rootScope.$digest();

                expect(BomGraphBuilder.populateBomGraph.withArgs(mockBulkBomObj).calledOnce).to.be.true;
                expect(fillTableFromPathStub.withArgs(row.path).calledOnce).to.be.true;

            });
        });

        describe('populateInitialBom', () => {
            it('Should load the initial bom and then resolve to root items urn ', () => {
                let itemUrn = '123.urn';
                let endpointLink = '123/bom';
                let queryParams = {};
                let rootNode = {
                    item: {
                        urn: itemUrn
                    },
                    getItemUrn: sinon.stub().returns(itemUrn)
                };
                let rootItemUrn = null;
                let deferred = $q.defer();
                deferred.resolve(mockBulkBomObj);

                mockBulkBomObj.getRootNodeId.returns('123');
                bomDataController.bomGraph.getRootNode.returns(rootNode);
                let fillTableFromPathStub = sandbox.stub(bomDataController, 'fillTableFromPath');
                let updateConfigurationStub = sandbox.stub(bomDataController, 'updateConfiguration');
                let loadBulkbomStub = sandbox.stub(BulkBomLoader, 'loadBulkBom');
                loadBulkbomStub.returns(deferred.promise);

                bomDataController.populateInitialBom(itemUrn, endpointLink, queryParams).then((urn) => {
                    rootItemUrn = urn;
                });

                $rootScope.$digest();

                expect(mockBulkBomObj.getRootNodeId.calledOnce).to.be.true;
                expect(updateConfigurationStub.calledOnce).to.be.true;
                expect(bomDataController.bomGraph.setRootNodeId.calledOnce).to.be.true;
                expect(fillTableFromPathStub.calledOnce).to.be.true;
                expect(loadBulkbomStub.calledOnce).to.be.true;
                expect(fillTableFromPathStub.calledOnce).to.be.true;
                expect(BomGraphBuilder.populateBomGraph.calledOnce).to.be.true;
                expect(rootItemUrn).to.equal(itemUrn);
            });
        });

        describe('loadAttachments', () => {
            let attachmentFieldId, attachmentField, attachmentLink, attachmentArrays, bulkAttachmentDeferred;
            let urnList, chunkSize, smallerChunkSize, numberOfChunks;
            let bomGraph, bomBulkAttachment;
            let sendSpy, processListInChunksSpy, getAttachmentChunkRecievedSpy, loadBulkAttachmentStub;

            beforeEach(() => {
                chunkSize = 24;
                smallerChunkSize = 6;
                attachmentFieldId = 'someAttachmentFieldId';
                attachmentLink = 'someAttachmentLink';
                attachmentField = {
                    getUrn: sinon.stub().returns(attachmentFieldId)
                };

                urnList = ['rootNodeUrn', 'urnA', 'urnB', 'urnC', 'urnD', 'urnE', 'urnF', 'urnG', 'urnH'];
                numberOfChunks = Math.ceil(urnList.length / chunkSize);
                attachmentArrays = [
                    [{
                        itemId: urnList[0]
                    }],
                    [{
                        itemId: urnList[1]
                    }, {
                        itemId: urnList[1]
                    }]
                ];
                bomBulkAttachment = new BomBulkAttachment(attachmentArrays, urnList);

                bomGraph = new BomGraph();
                urnList.forEach((urn) => {
                    let bomNode = sinon.createStubInstance(BomNode);
                    let defaultAttachmentValueObj = {
                        count: 0,
                        itemUrn: urn,
                        attachmentLink: attachmentLink
                    };

                    bomNode.itemId = urn;
                    bomNode.nodeProperties ={
                        fields: new Map()
                    };
                    bomNode.getItemUrn.returns(urn);
                    bomNode.getField.withArgs(attachmentFieldId).returns({
                        getValue: sinon.stub().returns(defaultAttachmentValueObj)
                    });
                    bomGraph.addNode(bomNode);
                });
                bomGraph.setRootNodeId('rootNodeUrn');
                bomDataController.bomGraph = bomGraph;

                bomDataController.currentViewDef = mockViewDefObj;
                mockViewDefObj.getFieldWithSemantics.withArgs(MockBomUIFieldSemantics.ATTACHMENTS).returns(attachmentField);

                bulkAttachmentDeferred = $q.defer();
                bulkAttachmentDeferred.resolve(bomBulkAttachment);
                BomBulkAttachmentLoader.loadBulkAttachment.returns(bulkAttachmentDeferred.promise);

                processListInChunksSpy = sandbox.spy(bomDataController, 'processListInChunks');
                getAttachmentChunkRecievedSpy = sandbox.spy(BomMessageService, 'getAttachmentChunkRecieved');
                sendSpy = sandbox.spy(EventService, 'send');

                bomDataController.loadAttachments();
                expect(sendSpy.callCount).to.equal(0);
            });

            it('should process the given list of item urns in chunks', () => {
                $rootScope.$digest();

                expect(processListInChunksSpy.callCount).to.equal(numberOfChunks);
                expect(getAttachmentChunkRecievedSpy.callCount).to.equal(numberOfChunks*2);
                expect(sendSpy.callCount).to.equal(numberOfChunks);
            });

            it('should update the attachment field value after the attachmetn has been loaded', () => {
                let attachmentFieldValue = bomGraph.getNode(urnList[1]).getField(attachmentFieldId).getValue();

                expect(attachmentFieldValue.count).to.equal(0);

                $rootScope.$digest();

                expect(attachmentFieldValue.count).to.equal(2);
                expect(attachmentFieldValue.attachments.getSize()).to.equal(2);
                expect(attachmentFieldValue.attachments.getItemId()).to.equal(urnList[1]);
            });
        });

        describe('handleBomBulkLoading', () => {
            let bomRootLink, expectedUrn, queryParams, rootItemUrn, toplineUrn;
            let populateInitialBomStub, loadSubAssemblyStub, loadAttachmentsStub;
            let attachmentsDeferred, initialDeferred, subassebmlyDeferred;

            beforeEach(() => {
                bomRootLink = 'someBomRootLink';
                expectedUrn = null;
                queryParams = {};
                rootItemUrn = 'someRootItemUrn';
                toplineUrn = 'someToplineUrn';

                initialDeferred = $q.defer();
                initialDeferred.resolve(rootItemUrn);
                populateInitialBomStub = sandbox.stub(bomDataController, 'populateInitialBom').returns(initialDeferred.promise);

                subassebmlyDeferred = $q.defer();
                subassebmlyDeferred.resolve();
                loadSubAssemblyStub = sandbox.stub(bomDataController, 'loadSubAssembly').returns(subassebmlyDeferred.promise);

                attachmentsDeferred = $q.defer();
                attachmentsDeferred.resolve();
                loadAttachmentsStub = sandbox.stub(bomDataController, 'loadAttachments').returns(attachmentsDeferred.promise);

                bomDataController.itemObj = mockItemObj;
                mockViewDefObj.hasAttachmentField.returns(false);

                bomDataController.currentViewDef = mockViewDefObj;
                mockItemObj.getBomRootLink.returns(bomRootLink);
            });

            it('Should resolve to the urn of item', () => {
                bomDataController.handleBomBulkLoading(toplineUrn, queryParams).then((urn) => {
                    expectedUrn = urn;
                });

                $rootScope.$digest();

                expect(populateInitialBomStub.withArgs(toplineUrn, bomRootLink, queryParams)).to.be.calledOnce;
                expect(loadSubAssemblyStub).to.be.calledOnce;
                expect(loadAttachmentsStub).to.not.be.called;
                expect(expectedUrn).to.equal(rootItemUrn);
            });

            it('Should load attachments if the current view definition contains attachments column', () => {
                mockViewDefObj.hasAttachmentField.returns(true);

                bomDataController.handleBomBulkLoading(toplineUrn, queryParams).then((urn) => {
                    expectedUrn = urn;
                });

                $rootScope.$digest();

                expect(populateInitialBomStub.withArgs(toplineUrn, bomRootLink, queryParams)).to.be.calledOnce;
                expect(loadSubAssemblyStub).to.be.calledOnce;
                expect(loadAttachmentsStub).to.be.calledOnce;
                expect(expectedUrn).to.equal(rootItemUrn);
            });
        });
    });
});
