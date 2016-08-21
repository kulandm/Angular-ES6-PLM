'use strict';
describe('[MODEL] BomEdge', () => {
    let BomEdge, MockBomEdgeData;
    let BomEdgeInstance;

    beforeEach(() => {
        module('plm360.mockData');
    });

    beforeEach(() => {
        inject((_MockBomEdgeData_) => {
            MockBomEdgeData = _MockBomEdgeData_;
        });
        BomEdge = System.get('com/autodesk/models/bomGraph/bomEdge.model.js').default;
        BomEdgeInstance = new BomEdge(MockBomEdgeData.edgeData);
    });

    describe('[STATE]', () => {
        it('Should initialize a BomEdge instance correctly', () => {
            expect(BomEdgeInstance.link).to.equal(MockBomEdgeData.edgeData.link);
            expect(BomEdgeInstance.bomId).to.equal(MockBomEdgeData.edgeData.bomId);
            expect(BomEdgeInstance.toNode).to.equal(MockBomEdgeData.edgeData.toNode);
            expect(BomEdgeInstance.edgeProperties).to.equal(MockBomEdgeData.edgeData.edgeProperties);
        });
    });

    describe('[METHOD] addField', () => {
        it('Should add a field to the', () => {
            let field = {
                id: 'edgeFieldId'
            };
            BomEdgeInstance.addField(field);
            expect(BomEdgeInstance.getField(field.id)).to.equal(field);
        });
    });

    describe('[METHOD] fromBulkEdge', () => {
        it('Should create a BomEdge from a Bulk Bom Node', () => {
            let bomEdge = BomEdge.fromBulkEdge(MockBomEdgeData.bulkEdgeData);

            expect(bomEdge.link).to.equal(MockBomEdgeData.bulkEdgeData.edgeLink);
            expect(bomEdge.bomId).to.equal(MockBomEdgeData.bulkEdgeData.edgeId);
            expect(bomEdge.toNode).to.equal(MockBomEdgeData.bulkEdgeData.child);
            expect(bomEdge.edgeProperties.itemNumber).to.equal(MockBomEdgeData.bulkEdgeData.itemNumber);
        });
    });
});
