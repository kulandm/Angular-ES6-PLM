'use strict';

describe('[MODEL] BomChangePinningEdit', () => {
    let BomChangePinningEdit, mockBomChangeEditData, pinningEdits;

    beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

    beforeEach(() => {
        inject((MockBomChangeEditData) => {
            mockBomChangeEditData = MockBomChangeEditData;
            pinningEdits = mockBomChangeEditData.edge1.fields[3].edits;
        });

        BomChangePinningEdit = System.get('com/autodesk/models/bomEdit/bomChangePinningEdit.model.js').default;
    });

    describe('[STATE]', () => {
        it('Should init with the correct properties when revision field is provided', () => {
            let edit = new BomChangePinningEdit(pinningEdits[0]);
            expect(edit.targetFieldData).to.equal(pinningEdits[0].targetFieldData);
            expect(edit.revisionField).to.equal(pinningEdits[0].revisionField);
            expect(edit.currentRevision).to.equal(pinningEdits[0].currentRevision);
            expect(edit.targetItem).to.be.undefined;
        });

        it('Should init with the correct properties when revision field is not provided', () => {
            let edit = new BomChangePinningEdit(pinningEdits[1]);
            expect(edit.targetFieldData).to.equal(pinningEdits[1].targetFieldData);
            expect(edit.revisionField).to.be.undefined;
            expect(edit.currentRevision).to.be.undefined;
            expect(edit.targetItem).to.equal(pinningEdits[1].targetItem);
        });
    });

    describe('[METHOD] isRevertingChange', () => {
        let edit;
        beforeEach(() => {
            edit = new BomChangePinningEdit(pinningEdits[0].raw);
            edit.targetFieldData.isConsequentialChange = sinon.stub();
            edit.revisionField.isConsequentialChange = sinon.stub();
        });

        it('Should return false if the pinning has changed', () => {
            edit.targetFieldData.isConsequentialChange.returns(true);
            expect(edit.isRevertingChange()).to.be.false;
        });

        it('Should return false if the pinning has not changed but the revision has changed', () => {
            edit.targetFieldData.isConsequentialChange.returns(false);
            edit.revisionField.isConsequentialChange.returns(true);
            expect(edit.isRevertingChange()).to.be.false;
        });

        it('Should return false if the pinning has not changed and the revision has not changed', () => {
            edit.targetFieldData.isConsequentialChange.returns(false);
            edit.revisionField.isConsequentialChange.returns(false);
            expect(edit.isRevertingChange()).to.be.true;
        });

        it('Should return true if the pinning has not changed and the revision is not provided', () => {
            edit.targetFieldData.isConsequentialChange.returns(false);
            edit.revisionField = undefined;
            expect(edit.isRevertingChange()).to.be.true;
        });
    });
});
