'use strict';
describe('[MODEL] BomNode', () => {
    let BomNode, MockBomNodeData;
    let BomNodeInstance;

    beforeEach(() => {
        module('plm360.mockData');
    });

    beforeEach(() => {
        inject((_MockBomNodeData_) => {
            MockBomNodeData = _MockBomNodeData_;
        });

        BomNode = System.get('com/autodesk/models/bomGraph/bomNode.model.js').default;
        BomNodeInstance = new BomNode(MockBomNodeData.nodeData);
    });

    describe('[STATE]', () => {
        it('Should initialize a BomNode instance correctly', () => {
            expect(BomNodeInstance.item).to.equal(MockBomNodeData.nodeData.item);
            expect(BomNodeInstance.itemId).to.equal(MockBomNodeData.nodeData.itemId);
            expect(BomNodeInstance.outEdges).to.equal(MockBomNodeData.nodeData.outEdges);
            expect(BomNodeInstance.nestedBomLink).to.equal(MockBomNodeData.nodeData.nestedBomLink);
            expect(BomNodeInstance.bomRootLink).to.equal(MockBomNodeData.nodeData.bomRootLink);
        });
    });

    describe('[METHOD] addField', () => {
        it('Add fields to to BomNode', () => {
            let field = {
                id: 'fieldId'
            };

            BomNodeInstance.addField(field);
            expect(BomNodeInstance.getField(field.id)).to.equal(field);
        });
    });

    describe('[METHOD] addOutEdge', () => {
        it('Should add an edge id to the list of outgoing edges of the BomNode', () => {
            expect(BomNodeInstance.getOutDegree()).to.equal(0);
            BomNodeInstance.addOutEdge('someEdgeId');
            expect(BomNodeInstance.getOutDegree()).to.equal(1);
        });
    });

    describe('[METHOD] getOutDegree', () => {
        it('Should return 0 if the node has no outgoing edges', () => {
            BomNodeInstance.outEdges = [];
            expect(BomNodeInstance.getOutDegree()).to.equal(0);
        });

        it('Should return the correct out degree when a node has outgoing edges', () => {
            BomNodeInstance.outEdges = [];
            BomNodeInstance.addOutEdge('edgeIdA');
            BomNodeInstance.addOutEdge('edgeIdB');

            expect(BomNodeInstance.getOutDegree()).to.equal(2);
        });
    });

    describe('[METHOD] getDmsId', () => {
        it('Should return the correct dms id of the node', () => {
            let expected = '3317';

            expect(BomNodeInstance.getDmsId()).to.equal(expected);
        });
    });

    describe('[METHOD] getBulkBomLink', () => {
        it('Should return bulk bom link for the node', () => {
            expect(BomNodeInstance.getBulkBomLink()).to.equal(MockBomNodeData.nodeData.bomRootLink);
        });
    });

    describe('[METHOD] getItemUrn', () => {
        it('Should return the urn of item represented by the node.', () => {
            expect(BomNodeInstance.getItemUrn()).to.equal(MockBomNodeData.nodeData.item.urn);
        });
    });

    describe('[METHOD] getItemUrn', () => {
        it('Should return the correct resourceId for the node.', () => {
            let expectedItemId = '59@3317';

            expect(BomNodeInstance.getResourceId()).to.equal(expectedItemId);
        });
    });

    describe('[METHOD] getItemId', () => {
        it('Should return the correct resourceId for the node.', () => {
            expect(BomNodeInstance.getItemId()).to.equal(MockBomNodeData.nodeData.itemId);
        });
    });

    describe('[METHOD] getItem', () => {
        it('Should return the correct resourceId for the node.', () => {
            expect(BomNodeInstance.getItem()).to.equal(MockBomNodeData.nodeData.item);
        });
    });

    describe('[METHOD] fromBulkNode', () => {
        it('Should create a BomEdge from a Bulk Bom Node', () => {
            let bomNode = BomNode.fromBulkNode(MockBomNodeData.bulkNode);

            expect(bomNode.item).to.equal(MockBomNodeData.bulkNode.item);
            expect(bomNode.itemId).to.equal(MockBomNodeData.bulkNode.item.urn);
            expect(bomNode.nestedBomLink).to.equal(MockBomNodeData.bulkNode.bomItems);
            expect(bomNode.bomRootLink).to.equal(MockBomNodeData.bulkNode.bomRoot);
            expect(bomNode.hasChildren).to.equal(false);
        });
    });
});
