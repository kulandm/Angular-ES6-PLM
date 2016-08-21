(() => {
    'use strict';

    describe('[MODEL] BulkBom', () => {

        let BulkBom, mockRestWrapperService, bomMessageService, eventService, urlParser, mockBulkBomData, $q, $rootScope;
        let BulkBomInstance;

        beforeEach(() => {
            module('com/autodesk/models/bulkBom/bulkBom.model.js', 'plm360.mockObjects', 'plm360.mockData');
            module({
                RESTWrapperService: {
                    get: sinon.stub()
                },
                BomMessageService: {},
                EventService: {},
                UrlParser: {}
            });
        });

        beforeEach(() => {
            inject((_BulkBom_, _RESTWrapperService_, _BomMessageService_, _EventService_, _UrlParser_, _MockBulkBomData_, _$q_, _$rootScope_) => {
                BulkBom = _BulkBom_;
                mockBulkBomData = _MockBulkBomData_;
                mockRestWrapperService = _RESTWrapperService_;
                bomMessageService = _BomMessageService_;
                eventService = _EventService_;
                urlParser = _UrlParser_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });
            BulkBomInstance = new BulkBom(mockBulkBomData.bomData);
        });

        describe('[STATE]', () => {
            it('Should initialize a BulkBom instance correctly', () => {
                expect(BulkBomInstance.nodes.length).to.equal(mockBulkBomData.bomData.nodes.length);
                expect(BulkBomInstance.edges.length).to.equal(mockBulkBomData.bomData.edges.length);
                expect(BulkBomInstance.rootNodeId).to.equal(mockBulkBomData.bomData.root);
            });
        });

        describe('[METHOD] getConfiguration', () => {
            it('Should get the configuration that was used to fetch the payload', () => {
                let configuration = BulkBomInstance.getConfiguration();
                expect(configuration).to.deep.equal(mockBulkBomData.bomData.config);
            });
        });

        describe('[METHOD] getNodes', () => {
            it('Should return the the nodes of the BulkBom', () => {
                let nodes = BulkBomInstance.getNodes();
                expect(nodes).to.equal(mockBulkBomData.bomData.nodes);
            });
        });

        describe('[METHOD] getEdges', () => {
            it('Should return the the edges of the BulkBom', () => {
                let edges = BulkBomInstance.getEdges();
                expect(edges).to.equal(mockBulkBomData.bomData.edges);
            });
        });

        describe('[METHOD] getRootNodeId', () => {
            it('Should return the the root node of the BulkBom', () => {
                let rootNodeId = BulkBomInstance.getRootNodeId();
                expect(rootNodeId).to.equal(mockBulkBomData.bomData.root);
            });
        });

        describe('[STATIC METHOD] fetch', () => {
            it('Should be able to fetch the correct data when called with right parameters', () => {
                let link = 'bulkBomLinkNew';
                let params = {
                    depth: 'someDepth',
                    viewDefId: 'someViewDefId',
                    revisionBias: 'someRevisionBias'
                };
                let headers = {
                  Accept: 'application/vnd.autodesk.plm.bom.bulk+json',
                  skipCache: true
                };

                let deferred = $q.defer();
                deferred.resolve(mockBulkBomData.bomData);
                mockRestWrapperService.get.withArgs(link, null, params, null, headers).returns(deferred.promise);

                let bulkBom = null;
                BulkBom.fetch(link, params).then((fetchedBom) => {
                    bulkBom = fetchedBom;
                });

                $rootScope.$digest();

                expect(bulkBom.getRootNodeId()).to.equal(mockBulkBomData.bomData.root);
                expect(bulkBom.getNodes()).to.equal(mockBulkBomData.bomData.nodes);
                expect(bulkBom.getEdges()).to.equal(mockBulkBomData.bomData.edges);
            });
        });
    });
})();
