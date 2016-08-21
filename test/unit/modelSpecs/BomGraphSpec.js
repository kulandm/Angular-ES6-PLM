'use strict';

describe('[MODEL] BomGraph', () => {
    let BomGraph, graph;
    let nodes, nodeA, nodeB, nodeC, nodeD;
    let edges, edgeAB, edgeAC, edgeBD, edgeCD;
    let MockBomPathObj, BomPath;

    beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

    beforeEach(() => {
        inject((_MockBomPathObj_) => {
            MockBomPathObj = _MockBomPathObj_;
        });

        BomPath = System.get('com/autodesk/models/bomTable/bomPath.model.js').default;
        BomGraph = System.get('com/autodesk/models/bomGraph/bomGraph.model.js').default;

        edgeAB = {
            bomId: 'AB',
            toNode: 'B'
        };
        edgeAC = {
            bomId: 'AC',
            toNode: 'C'
        };
        edgeBD = {
            bomId: 'BD',
            toNode: 'D'
        };
        edgeCD = {
            bomId: 'CD',
            toNode: 'D'
        };

        edges = new Map();
        edges.set('AB', edgeAB);
        edges.set('AC', edgeAC);
        edges.set('BD', edgeBD);
        edges.set('CD', edgeCD);

        nodeA = {
            itemId: 'A',
            outEdges: ['AB', 'AC']
        };
        nodeB = {
            itemId: 'B',
            outEdges: ['BD']
        };
        nodeC = {
            itemId: 'C',
            outEdges: ['CD']
        };
        nodeD = {
            itemId: 'D',
            outEdges: []
        };

        let nodes = new Map();
        nodes.set('A', nodeA);
        nodes.set('B', nodeB);
        nodes.set('C', nodeC);
        nodes.set('D', nodeD);

        graph = new BomGraph({
            bomNodes: nodes,
            bomEdges: edges,
            rootNodeId: nodeA.itemId
        });
    });

    describe('[METHOD] getRootNodeId', () => {
        it('Should return the root node id', () => {
            expect(graph.getRootNodeId()).to.equal(nodeA.itemId);
        });
    });

    describe('[METHOD] getNode', () => {
        it('Should return the node', () => {
            expect(graph.getNode(nodeB.itemId)).to.equal(nodeB);
        });
    });

    describe('[METHOD] getEdge', () => {
        it('Should return the edge', () => {
            expect(graph.getEdge(edgeAC.bomId)).to.equal(edgeAC);
        });
    });

    describe('[METHOD] getNodeForEdge', () => {
        it('Should return the node corresponding to the edge', () => {
            expect(graph.getNodeForEdge(edgeAC.bomId)).to.equal(nodeC);
        });
    });

    describe('[METHOD] getEdgeForPath', () => {
        it('Should return the null for the path to the root', () => {
            let path = new MockBomPathObj();
            path.isPathToRoot.returns(true);

            expect(graph.getEdgeForPath(path)).to.equal(null);
        });

        it('Should return the edge object for the final edge of the path', () => {
            let path = new MockBomPathObj();
            path.isPathToRoot.returns(false);
            path.getFinalEdge.returns(edgeAC.bomId);

            expect(graph.getEdgeForPath(path)).to.equal(edgeAC);
        });
    });

    describe('[METHOD] getNodeIdForPath', () => {
        it('Should return the root id for the path to the root', () => {
            let path = new MockBomPathObj();
            path.isPathToRoot.returns(true);

            expect(graph.getNodeIdForPath(path)).to.equal(nodeA.itemId);
        });

        it('Should return the node object pointed to by the final edge of the path', () => {
            let path = new MockBomPathObj();
            path.isPathToRoot.returns(false);
            path.getFinalEdge.returns(edgeAC.bomId);

            expect(graph.getNodeIdForPath(path)).to.equal(edgeAC.toNode);
        });
    });

    describe('[METHOD] getNodeForPath', () => {
        it('Should return the node pointed to by the path', () => {
            let path = new MockBomPathObj();

            let getIdStub = sinon.stub(graph, 'getNodeIdForPath');
            getIdStub.withArgs(path).returns(nodeC.itemId);

            expect(graph.getNodeForPath(path)).to.equal(nodeC);

            getIdStub.restore();
        });
    });

    describe('[METHOD] clear', () => {
        it('Should clear the graph', () => {
            graph.clear();

            expect(graph.bomNodes.size).to.equal(0);
            expect(graph.bomEdges.size).to.equal(0);
            expect(graph.getRootNodeId()).to.equal(null);
        });
    });

    describe('[Graph Building]', () => {
        beforeEach(() => {
            graph.clear();
        });

        describe('[METHOD] setRootNodeId', () => {
            it('Should set the root id', () => {
                graph.setRootNodeId('A');
                expect(graph.getRootNodeId()).to.equal('A');
            });
        });

        describe('[METHOD] addEdge', () => {
            it('Should add an edge', () => {
                graph.addEdge(edgeAB);
                expect(graph.getEdge(edgeAB.bomId)).to.equal(edgeAB);
            });
        });

        describe('[METHOD] addNode', () => {
            it('Should add an node', () => {
                graph.addNode(nodeA);
                expect(graph.getNode(nodeA.itemId)).to.equal(nodeA);
            });
        });

        describe('[METHOD] hasEdge', () => {
            it('Should return true if the edge exists in the graph', () => {
                graph.addEdge(edgeAB);
                expect(graph.hasEdge(edgeAB.bomId)).to.be.true;
            });

            it('Should return false if the edge does not exist in the graph', () => {
                expect(graph.hasEdge(edgeAB.bomId)).to.be.false;
            });
        });

        describe('[METHOD] hasNode', () => {
            it('Should return true if the node exists in the graph', () => {
                graph.addNode(nodeA);
                expect(graph.hasNode(nodeA.itemId)).to.be.true;
            });

            it('Should return false if the node does not exist in the graph', () => {
                expect(graph.hasNode(nodeA.itemId)).to.be.false;
            });
        });
    });

    describe('[METHOD] BFT', () => {
        let paths, pathA, pathAB, pathAC, pathABD, pathACD;
        let callback;

        beforeEach(() => {
            pathA = BomPath.EmptyPath();
            pathAB = new BomPath({
                edges: ['AB']
            });
            pathAC = new BomPath({
                edges: ['AC']
            });
            pathABD = new BomPath({
                edges: ['AB', 'BD']
            });
            pathACD = new BomPath({
                edges: ['AC', 'CD']
            });

            callback = sinon.stub();
            callback.withArgs(pathA);
            callback.withArgs(pathAB);
            callback.withArgs(pathAC);
            callback.withArgs(pathABD);
            callback.withArgs(pathACD);
        });

        it('Should hit all the nodes when called without a root or maxDepth', () => {
            graph.BFT(undefined, callback);

            expect(callback.withArgs(pathA).calledOnce, 'pathA').to.be.true;
            expect(callback.withArgs(pathAB).calledOnce, 'pathAB').to.be.true;
            expect(callback.withArgs(pathAC).calledOnce, 'pathAC').to.be.true;
            expect(callback.withArgs(pathABD).calledOnce, 'pathABD`').to.be.true;
            expect(callback.withArgs(pathACD).calledOnce, 'pathACD').to.be.true;
        });

        it('Should hit the node and its children', () => {
            graph.BFT(pathAB, callback);

            expect(callback.withArgs(pathAB).calledOnce, 'pathAB').to.be.true;
            expect(callback.withArgs(pathABD).calledOnce, 'pathABD').to.be.true;

            expect(callback.withArgs(pathA).calledOnce, 'pathA').to.be.false;
            expect(callback.withArgs(pathAC).calledOnce, 'pathAC').to.be.false;
            expect(callback.withArgs(pathACD).calledOnce, 'pathACD').to.be.false;
        });

        it('Should hit the node and its children through the given depth', () => {
            graph.BFT(undefined, callback, 1);

            expect(callback.withArgs(pathA).calledOnce, 'pathA').to.be.true;
            expect(callback.withArgs(pathAB).calledOnce, 'pathAB').to.be.true;
            expect(callback.withArgs(pathAC).calledOnce, 'pathAC').to.be.true;

            expect(callback.withArgs(pathACD).calledOnce, 'pathACD').to.be.false;
            expect(callback.withArgs(pathABD).calledOnce, 'pathABD').to.be.false;
        });
    });
});
