'use strict';

describe('[MODEL] BomChangeCompiled', () => {

    let sandbox;
    let BomChangeCompiled, compiledChange, change;
    let MockBomChangePayloadBuilderService, MockBomChangeError, BomChangeListTypes;

    beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        MockBomChangePayloadBuilderService = System.get('com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js').default;
        sandbox.stub(MockBomChangePayloadBuilderService, 'convertChangesToEditPayload');
        sandbox.stub(MockBomChangePayloadBuilderService, 'convertChangesToAddPayload');

        MockBomChangeError = System.get('com/autodesk/models/bomEdit/bomChangeError.model.js').default;
        sandbox.stub(MockBomChangeError, 'convertToBomChangeErrors');

        BomChangeListTypes = System.get('com/autodesk/models/bomEdit/bomChangeListTypes.js').default;

		BomChangeCompiled = System.get('com/autodesk/models/bomEdit/bomChangeCompiled.model.js').default;

        change = {
            changeType: BomChangeListTypes.EDIT,
            edgeId: '111',
            drivingChanges: []
        };

        MockBomChangePayloadBuilderService.convertChangesToEditPayload.returns('SomePayload');
        compiledChange = new BomChangeCompiled(change.changeType, change.edgeId, change.drivingChanges);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('[STATE]', () => {
        it('Should init with the correct variables', () => {
            expect(compiledChange.changeType).to.equal(change.changeType);
            expect(compiledChange.edgeId).to.equal(change.edgeId);
            expect(compiledChange.drivingChanges).to.equal(change.drivingChanges);
            expect(compiledChange.payload).to.equal('SomePayload');
        });
    });

    describe('[METHOD] generatePayload', () => {
        it('Should build the correct payload for Edit', () => {
            MockBomChangePayloadBuilderService.convertChangesToEditPayload.returns('EditPayload');
            expect(compiledChange.generatePayload(BomChangeListTypes.EDIT, [])).to.equal('EditPayload');
        });

        it('Should build the correct payload for Add', () => {
            MockBomChangePayloadBuilderService.convertChangesToAddPayload.returns('AddPayload');
            expect(compiledChange.generatePayload(BomChangeListTypes.ADD, [])).to.equal('AddPayload');
        });

        it('Should build the correct payload for Remove', () => {
            expect(compiledChange.generatePayload(BomChangeListTypes.REMOVE, [])).to.deep.equal({});
        });
    });

    describe('[METHOD] addErrors', () => {
        it('Should add the correct errors', () => {
            expect(compiledChange.getErrors()).to.deep.equal([]);

            let errors = ['A', 'B'];
            MockBomChangeError.convertToBomChangeErrors.returns(errors);
            compiledChange.addErrors(errors);
            expect(compiledChange.getErrors()).to.deep.equal(errors);

            let moreErrors = ['C', 'D'];
            MockBomChangeError.convertToBomChangeErrors.returns(moreErrors);
            compiledChange.addErrors(moreErrors);
            expect(compiledChange.getErrors()).to.deep.equal([].concat(errors, moreErrors));
        });
    });

    describe('[METHOD] isInvalid', () => {
        it('Should return false if there are no errors', () => {
            expect(compiledChange.isInvalid()).to.be.false;
        });

        it('Should return true if there are errors', () => {
            MockBomChangeError.convertToBomChangeErrors.returns(['A']);
            compiledChange.addErrors(['A']);
            expect(compiledChange.isInvalid()).to.be.true;
        });
    });
});
