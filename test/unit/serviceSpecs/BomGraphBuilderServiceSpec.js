describe('[SERVICE] BomGraphBuilder', () => {
    let BomNode = System.get('com/autodesk/models/bomGraph/bomNode.model.js').default;
    let BomEdge = System.get('com/autodesk/models/bomGraph/bomEdge.model.js').default;
    let BomGraph = System.get('com/autodesk/models/bomGraph/bomGraph.model.js').default;
    let BomUIFieldSemantics = System.get('com/autodesk/models/bomFields/BomUIFieldSemantics.service.js').default;

    let BomGraphBuilder, BomField, BomFieldData, BulkBom;

    let MockBomRootObj, MockBomNestedObj, MockBomNestedItemObj, MockBomFieldObj, MockViewDefinitionObj, MockBomGraphObj, MockBulkBomObj;

    let mockBomRootObj, mockViewDefObj, mockBomGraphObj, bomGraph, mockBulkBomObj;

    let MockBulkbomData, BulkBomInstance;

    let sandbox = sinon.sandbox.create();

    beforeEach(() => {
        module('plm360.mockObjects',
            'plm360.mockData',
            'com/autodesk/models/bomGraph/bomGraph.js'
        );
        module({
            BomField: {
                FromViewDefField: sinon.stub(),
                ItemNumberField: sinon.stub()
            },
            BomFieldData: {
                fromField: sinon.stub()
            },
            RESTWrapperService: {
                get: () => {}
            },
            BomMessageService: {},
            EventService: {},
            UrlParser: {},
            UrnParser: {},
            BulkBom: {}
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        inject((_BomGraphBuilder_, _BomField_, _BomFieldData_, _BulkBom_, _MockBomRootObj_, _MockViewDefinitionObj_, _MockBomNestedItemObj_, _MockBomFieldObj_, _MockBulkBomData_, _MockBulkBomObj_) => {
            BomGraphBuilder = _BomGraphBuilder_;
            BomField = _BomField_;
            BomFieldData = _BomFieldData_;
            BulkBom = _BulkBom_;
            MockBomRootObj = _MockBomRootObj_;
            MockViewDefinitionObj = _MockViewDefinitionObj_;
            MockBomNestedItemObj = _MockBomNestedItemObj_;
            MockBomFieldObj = _MockBomFieldObj_;
            MockBulkbomData = _MockBulkBomData_;
            MockBulkBomObj = _MockBulkBomObj_;
        });

        mockBomRootObj = new MockBomRootObj();
        mockViewDefObj = new MockViewDefinitionObj();
        bomGraph = new BomGraph();
        mockBulkBomObj = new MockBulkBomObj();
    });

    describe('buildRootNode', () => {
        let buildFieldsForViewDefFieldsStub;

        beforeEach(() => {
            buildFieldsForViewDefFieldsStub = sandbox.stub(BomGraphBuilder, 'buildFieldsForViewDefFields');
            buildFieldsForViewDefFieldsStub.returns([]);

            mockBomRootObj.getItemId.returns('SomeId');
            mockBomRootObj.getItemUrn.returns('SomeUrn');
            mockBomRootObj.getFields.returns([]);
            mockBomRootObj.json = {};
        });

        it('Should create a node with the correct itemId', () => {
            let node = BomGraphBuilder.buildRootNode(mockBomRootObj, mockViewDefObj);
            expect(node.itemId).to.equal(mockBomRootObj.getItemId());
        });

        it('Should set the node\'s hasChildren to false if it has no children', () => {
            mockBomRootObj.getOccurancesCount.returns(1);
            let node = BomGraphBuilder.buildRootNode(mockBomRootObj, mockViewDefObj);
            expect(node.hasChildren).to.be.false;
        });

        it('Should set the node\'s hasChildren to true if it has children', () => {
            mockBomRootObj.getOccurancesCount.returns(5);
            let node = BomGraphBuilder.buildRootNode(mockBomRootObj, mockViewDefObj);
            expect(node.hasChildren).to.be.true;
        });

        describe('Fields', () => {
            let rootFields, viewDefFields, fieldsResponse, valueSourceMatcher;

            beforeEach(() => {
                sandbox.stub(BomNode.prototype, 'addField');

                let rootFieldA = {
                    metaData: {
                        urn: 'someUrn'
                    },
                    value: 'someValue'
                };
                rootFields = [rootFieldA];
                mockBomRootObj.getFields.returns(rootFields);

                let viewDefFieldA = {};
                let viewDefFieldB = {};
                viewDefFields = [viewDefFieldA, viewDefFieldB];
                mockViewDefObj.getFields.returns(viewDefFields);

                valueSourceMatcher = (valueMap) => {
                    return rootFields.reduce((accumulated, current) => {
                        return accumulated && valueMap.get(current.metaData.urn) === current.value;
                    });
                };

                let respFieldA = {};
                let respFieldB = {};
                fieldsResponse = [respFieldA, respFieldB];
            });

            it('Should create the fields correctly', () => {
                buildFieldsForViewDefFieldsStub.withArgs(viewDefFields, sinon.match(valueSourceMatcher), mockBomRootObj.getItemUrn())
                    .returns(fieldsResponse);

                let node = BomGraphBuilder.buildRootNode(mockBomRootObj, mockViewDefObj);

                expect(node.addField.callCount).to.equal(fieldsResponse.length);
                fieldsResponse.forEach((respField) => {
                    expect(node.addField.calledWith(respField)).to.be.true;
                });
            });
        });
    });

    describe('buildEdgeForBomNestedItem', () => {
        let edgeNode, fieldsMap, fieldA, fieldB;
        beforeEach(() => {
            fieldA = {};
            fieldB = {};

            fieldsMap = new Map();
            fieldsMap.set('urn1', 'someFieldA');
            fieldsMap.set('urn2', 'someFieldB');
            fieldsMap.set('urn3', 'someFieldC');

            edgeNode = new MockBomNestedItemObj();
            edgeNode.__self__ = 'someSelfLink';
            edgeNode.getBomId.returns('someBomId');
            edgeNode.getItemId.returns('someItemId');
            edgeNode.getItemNumber.returns('someItemNumber');
            edgeNode.getItemUrn.returns('someItemUrn');

            mockViewDefObj.getEdgeFields.returns('someEdgeFields');
            sandbox.stub(BomGraphBuilder, 'buildFieldsForViewDefFields');
            BomGraphBuilder.buildFieldsForViewDefFields.returns([fieldA, fieldB]);

            sandbox.stub(BomEdge.prototype, 'addField');
        });

        it('Should build an edge with the correct properties', () => {
            let edge = BomGraphBuilder.buildEdgeForBomNestedItem(edgeNode, fieldsMap, mockViewDefObj);

            expect(edge.bomId).to.equal(edgeNode.getBomId());
            expect(edge.toNode).to.equal(edgeNode.getItemId());
            expect(edge.edgeProperties.itemNumber).to.equal(edgeNode.getItemNumber());
        });

        it('Should build an edge with every field in the view', () => {
            let edge = BomGraphBuilder.buildEdgeForBomNestedItem(edgeNode, fieldsMap, mockViewDefObj);

            expect(edge.addField.callCount).to.equal(2);
            expect(edge.addField.calledWith(fieldA)).to.be.true;
            expect(edge.addField.calledWith(fieldB)).to.be.true;
        });
    });

    describe('buildNodeForBomNestedItem', () => {
        let edgeNode, fieldsMap, fieldA, fieldB;
        beforeEach(() => {
            fieldA = {};
            fieldB = {};

            fieldsMap = new Map();
            fieldsMap.set('urn1', 'someFieldA');
            fieldsMap.set('urn2', 'someFieldB');
            fieldsMap.set('urn3', 'someFieldC');

            edgeNode = new MockBomNestedItemObj();
            edgeNode.getItemId.returns('someItemId');
            edgeNode.hasChildren.returns(true);
            edgeNode.getItem.returns('someItem');
            mockViewDefObj.getNodeFields.returns('someNodeFields');

            sandbox.stub(BomGraphBuilder, 'buildFieldsForViewDefFields');
            BomGraphBuilder.buildFieldsForViewDefFields.returns([fieldA, fieldB]);

            sandbox.stub(BomNode.prototype, 'addField');
        });

        it('Should build an node with the correct properties', () => {
            let node = BomGraphBuilder.buildNodeForBomNestedItem(edgeNode, fieldsMap, mockViewDefObj);

            expect(node.itemId).to.equal(edgeNode.getItemId());
            expect(node.hasChildren).to.equal(edgeNode.hasChildren());
            expect(node.item).to.deep.equal(edgeNode.getItem());
        });

        it('Should build an node with every field in the view', () => {
            let node = BomGraphBuilder.buildNodeForBomNestedItem(edgeNode, fieldsMap, mockViewDefObj);

            expect(node.addField.callCount).to.equal(2);
            expect(node.addField.calledWith(fieldA)).to.be.true;
            expect(node.addField.calledWith(fieldB)).to.be.true;
        });
    });

    describe('addEdgeNodeToGraph', () => {
        let edgeNode, node, edge;
        beforeEach(() => {
            edgeNode = new MockBomNestedItemObj();
            edgeNode.getFields.returns([]);
            node = {
                itemId: '31415'
            };
            edge = {};

            sandbox.stub(BomGraphBuilder, 'buildNodeForBomNestedItem');
            sandbox.stub(BomGraphBuilder, 'buildEdgeForBomNestedItem');
            sandbox.stub(bomGraph, 'hasNode');
            sandbox.stub(bomGraph, 'addNode');
            sandbox.stub(bomGraph, 'addEdge');

            BomGraphBuilder.buildNodeForBomNestedItem.returns(node);
            BomGraphBuilder.buildEdgeForBomNestedItem.returns(edge);
            bomGraph.hasNode.withArgs(node.itemId).returns(true);
        });

        it('Should add the edge to the graph', () => {
            expect(bomGraph.addEdge.called).to.be.false;
            BomGraphBuilder.addEdgeNodeToGraph(edgeNode, mockViewDefObj, bomGraph);
            expect(bomGraph.addEdge.calledOnce).to.be.true;
            expect(bomGraph.addEdge.calledWith(edge)).to.be.true;
        });

        it('Should add the node to the graph when it does not already exist', () => {
            bomGraph.hasNode.withArgs(node.itemId).returns(false);

            expect(bomGraph.addNode.called).to.be.false;
            BomGraphBuilder.addEdgeNodeToGraph(edgeNode, mockViewDefObj, bomGraph);
            expect(bomGraph.addNode.calledOnce).to.be.true;
            expect(bomGraph.addNode.calledWith(node)).to.be.true;
        });

        it('Should not add the node to the graph if it already exists', () => {
            bomGraph.hasNode.withArgs(node.itemId).returns(true);

            expect(bomGraph.addNode.called).to.be.false;
            BomGraphBuilder.addEdgeNodeToGraph(edgeNode, mockViewDefObj, bomGraph);
            expect(bomGraph.addNode.called).to.be.false;
        });
    });

    describe('buildEdgeForBulkBom', () => {
        it('Should be able to build bom edges from BulkBom edge properties ', () => {
            let bulkBomEdge = MockBulkbomData.bomData.edges[0];
            let addFieldsStub = sandbox.stub(BomGraphBuilder, 'addFields');
            let buildBomFieldsStub = sandbox.stub(BomGraphBuilder, 'buildBomFields');
            let fromBulkEdgeSpy = sandbox.spy(BomEdge, 'fromBulkEdge');
            buildBomFieldsStub.returns([]);

            let edge = BomGraphBuilder.buildEdgeForBulkBom(bulkBomEdge, mockViewDefObj);

            expect(edge.bomId).to.equal(bulkBomEdge.edgeId);
            expect(edge.toNode).to.equal(bulkBomEdge.child);
            expect(edge.edgeProperties.itemNumber).to.equal(bulkBomEdge.itemNumber);
            expect(fromBulkEdgeSpy.calledOnce).to.be.true;
            expect(addFieldsStub.calledOnce).to.be.true;
        });
    });
    describe('addEdgesToGraph', () => {
        it('Should be able to build bom edges from BulkBom edge properties ', () => {
            bomGraph.clear();
            let edgeList = MockBulkbomData.bomData.edges;
            let numberOfEdges = edgeList.length;
            let addEdgeSpy = sandbox.spy(bomGraph, 'addEdge');
            let addOutEdgeStub = sandbox.stub(BomGraphBuilder, 'addOutEdgeToParentNode');
            let buildBomFieldsStub = sandbox.stub(BomGraphBuilder, 'buildBomFields');
            let buildEdgeForBulkBomSpy = sandbox.spy(BomGraphBuilder, 'buildEdgeForBulkBom');
            buildBomFieldsStub.returns([]);

            BomGraphBuilder.addEdgesToGraph(edgeList, mockViewDefObj, bomGraph);

            expect(bomGraph.bomEdges.size).to.equal(numberOfEdges);
            expect(addEdgeSpy.callCount).to.equal(numberOfEdges);
            expect(buildBomFieldsStub.callCount).to.equal(numberOfEdges);
            expect(buildEdgeForBulkBomSpy.callCount).to.equal(numberOfEdges);
            expect(addOutEdgeStub.callCount).to.equal(numberOfEdges);
        });
    });

    describe('buildNodeForBulkBom', () => {
        it('Should build a BomNode from a BulkBomNode property', () => {
            let bulkBomNode = MockBulkbomData.bomData.nodes[0];
            let addFieldsStub = sandbox.stub(BomGraphBuilder, 'addFields');
            let buildBomFieldsStub = sandbox.stub(BomGraphBuilder, 'buildBomFields');
            let fromBulkNodeSpy = sandbox.spy(BomNode, 'fromBulkNode');
            buildBomFieldsStub.returns([]);

            let node = BomGraphBuilder.buildNodeForBulkBom(bulkBomNode, mockViewDefObj);

            expect(node.itemId).to.equal(bulkBomNode.item.urn);
            expect(node.item).to.equal(bulkBomNode.item);
            expect(node.getOutDegree()).to.equal(0);
            expect(fromBulkNodeSpy.calledOnce).to.be.true;
            expect(addFieldsStub.calledOnce).to.be.true;
        });
    });

    describe('addNodesToGraph', () => {
        it('Should add a list of nodes to the graph', () => {
            bomGraph.clear();
            let nodeList = MockBulkbomData.bomData.nodes;
            let rootId = MockBulkbomData.bomData.rootNodeId;
            let numberOfNodes = nodeList.length;
            let hasNodeSpy = sandbox.spy(bomGraph, 'hasNode');
            let addNodeSpy = sandbox.spy(bomGraph, 'addNode');
            let buildBomFieldsStub = sandbox.stub(BomGraphBuilder, 'buildBomFields');
            let buildNodeForBulkBomSpy = sandbox.spy(BomGraphBuilder, 'buildNodeForBulkBom');
            buildBomFieldsStub.returns([]);

            BomGraphBuilder.addNodesToGraph(nodeList, rootId, mockViewDefObj, bomGraph);

            expect(bomGraph.bomNodes.size).to.equal(numberOfNodes);
            expect(hasNodeSpy.callCount).to.equal(numberOfNodes);
            expect(addNodeSpy.callCount).to.equal(numberOfNodes);
            expect(buildBomFieldsStub.callCount).to.equal(numberOfNodes);
            expect(buildNodeForBulkBomSpy.callCount).to.equal(numberOfNodes);
        });
    });

    describe('addOutEdgeToParentNode', () => {
        it('Should add an edge to the list of outEges of a node', () => {
            let node = new BomNode({});
            let edge = {
                parent: '123',
                edgeId: 'anEdgeId'
            };
            let getNodeStub = sandbox.stub(bomGraph, 'getNode');
            getNodeStub.withArgs('123').returns(node);

            expect(node.hasChildren).to.be.false;
            expect(node.getOutDegree()).to.equal(0);

            BomGraphBuilder.addOutEdgeToParentNode(edge, bomGraph);

            expect(node.hasChildren).to.be.true;
            expect(node.getOutDegree()).to.equal(1);
        });
    });

    describe('addFields', () => {
        it('Should build bom edges from BulkBom edge properties ', () => {
            let fieldA = {
                    id: 'id1',
                    value: 1
                },
                fieldB = {
                    id: 'id2',
                    value: 2
                };
            let fields = [fieldA, fieldB];

            let buildBomFieldsStub = sandbox.stub(BomGraphBuilder, 'buildBomFields');
            buildBomFieldsStub.returns(fields);

            let node = new BomNode({});
            BomGraphBuilder.addFields(node, fields);

            expect(node.getField('id1')).to.equal(fieldA);
            expect(node.getField('id2')).to.equal(fieldB);
        });
    });

    describe('buildBomFields', () => {
        it('Should be able to build bom fields from a list of edge fields', () => {
            let valuesMap = new Map();
            let bomFieldsArray = [];
            let viewDefFields = [];
            let urn = 'someUrn';
            let buildFieldsForViewDefFieldsStub = sandbox.stub(BomGraphBuilder, 'buildFieldsForViewDefFields');
            let extractFieldValuesStub = sandbox.stub(BomGraphBuilder, 'extractFieldValues');
            buildFieldsForViewDefFieldsStub.returns(bomFieldsArray);
            extractFieldValuesStub.returns(valuesMap);

            let result = BomGraphBuilder.buildBomFields(viewDefFields, valuesMap, urn);

            expect(buildFieldsForViewDefFieldsStub.withArgs(viewDefFields, valuesMap, urn).calledOnce).to.be.true;
            expect(result).to.equal(bomFieldsArray);
        });
    });

    describe('[METHOD] extractFieldValues', () => {
        it('Should init with the correct entires', () => {
            let fields = [{
                metaData: {
                    urn: 'urn1'
                },
                value: 'val1'
            }, {
                metaData: {
                    urn: 'urn2'
                },
                value: 'val2'
            }];

            let valuesMap = BomGraphBuilder.extractFieldValues(fields);

            expect(valuesMap.size).to.equal(fields.length);
            expect(valuesMap.get(fields[0].metaData.urn)).to.equal(fields[0].value);
            expect(valuesMap.get(fields[1].metaData.urn)).to.equal(fields[1].value);
        });
    });

    describe('buildFieldsForViewDefFields', () => {
        let viewDefFields, bomFieldA, bomFieldB, valueSource, externalValueSource, sourceUrn;
        beforeEach(() => {
            let viewDefFieldA = {};
            let viewDefFieldB = {};
            viewDefFields = [viewDefFieldA, viewDefFieldB];

            bomFieldA = new MockBomFieldObj();
            bomFieldB = new MockBomFieldObj();
            BomField.FromViewDefField.withArgs(sinon.match.same(viewDefFieldA)).returns(bomFieldA);
            BomField.FromViewDefField.withArgs(sinon.match.same(viewDefFieldB)).returns(bomFieldB);

            valueSource = {};
            externalValueSource = {};
            sourceUrn = 'someUrn';
        });

        it('Should create a field for each view def field', () => {
            let fields = BomGraphBuilder.buildFieldsForViewDefFields(viewDefFields, valueSource, sourceUrn);
            expect(fields.length).to.equal(viewDefFields.length);
            expect(fields).to.contain(bomFieldA);
            expect(fields).to.contain(bomFieldB);
        });

        it('Should call the correct functions on the created fields', () => {
            let fields = BomGraphBuilder.buildFieldsForViewDefFields(viewDefFields, valueSource, sourceUrn);

            expect(fields[0].updateFieldValue.calledOnce).to.be.true;
            expect(fields[0].updateFieldValue.calledWith(valueSource)).to.be.true;
            expect(fields[0].generateHref.calledOnce).to.be.true;
            expect(fields[0].generateHref.calledWith(sourceUrn)).to.be.true;
        });
    });

    describe('populateBomGraph', () => {
        it('Should be able to build bom edges from BulkBom edge properties ', () => {
            let addEdgesStub = sandbox.stub(BomGraphBuilder, 'addEdgesToGraph');
            let addNodesStub = sandbox.stub(BomGraphBuilder, 'addNodesToGraph');

            mockBulkBomObj.getNodes.returns(MockBulkbomData.bomData.nodes);
            mockBulkBomObj.getEdges.returns(MockBulkbomData.bomData.edges);
            mockBulkBomObj.getRootNodeId.returns(MockBulkbomData.bomData.rootNodeId);

            BomGraphBuilder.populateBomGraph(mockBulkBomObj, mockViewDefObj, bomGraph);

            expect(addNodesStub.withArgs(MockBulkbomData.bomData.nodes, MockBulkbomData.bomData.rootNodeId, mockViewDefObj, bomGraph).calledOnce).to.be.true;
            expect(addEdgesStub.withArgs(MockBulkbomData.bomData.edges, mockViewDefObj, bomGraph).calledOnce).to.be.true;
        });
    });
});
