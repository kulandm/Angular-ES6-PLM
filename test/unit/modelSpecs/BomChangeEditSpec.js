'use strict';

describe('[MODEL] BomChangeEdit', () => {
	let BomChangeEdit, mockBomChangeEditData;

	beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

	beforeEach(() => {
		inject((MockBomChangeEditData) => {
			mockBomChangeEditData = MockBomChangeEditData;
		});

		BomChangeEdit = System.get('com/autodesk/models/bomEdit/bomChangeEdit.model.js').default;
	});

	describe('[STATE]', () => {
		it('Should init with correct properties', () => {
			let args = mockBomChangeEditData.edge1.fields[0].edits[0].raw;
			let change = new BomChangeEdit(args);

			expect(change.edgeId).to.equal(args.edgeId);
			expect(change.targetFieldData).to.equal(args.targetFieldData);
			expect(change.currentValue).to.equal(args.currentValue);
		});
	});

	describe('[METHOD] targetsSameField', () => {
		it('Should return true if the edit occurs on the the same field of the same edge', () => {
			let change1 = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[0].raw);
			let change2 = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[1].raw);

			expect(change2.targetsSameField(change1)).to.be.true;
		});

		it('Should return false if the edit occurs on a different edge', () => {
			let change1 = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[0].raw);
			let change2 = new BomChangeEdit(mockBomChangeEditData.edge2.fields[0].edits[0].raw);

			expect(change2.targetsSameField(change1)).to.be.false;
		});

		it('Should return false if the edit occurs on a different field on the same edge', () => {
			let change1 = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[0].raw);
			let change2 = new BomChangeEdit(mockBomChangeEditData.edge1.fields[1].edits[0].raw);

			expect(change2.targetsSameField(change1)).to.be.false;
		});
	});

	describe('[METHOD] isRevertingChange', () => {
		it('Should return true if the edit does not change from the original value', () => {
			let change = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[0].raw);
			change.targetFieldData.isConsequentialChange = sinon.stub();
			change.targetFieldData.isConsequentialChange.withArgs(change.targetFieldData.originalValue, change.currentValue).returns(false);

			expect(change.isRevertingChange()).to.be.true;
		});

		it('Should return false if the edit change the value to the original value', () => {
			let change = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[2].raw);
			change.targetFieldData.isConsequentialChange = sinon.stub();
			change.targetFieldData.isConsequentialChange.withArgs(change.targetFieldData.originalValue, change.currentValue).returns(true);

			expect(change.isRevertingChange()).to.be.false;
		});
	});

	describe('[METHOD] payloadForm', () => {
		it('Should return the edit in a form usable for a payload', () => {
			let change = new BomChangeEdit(mockBomChangeEditData.edge1.fields[0].edits[0].raw);

			expect(change.payloadForm()).to.deep.equal(mockBomChangeEditData.edge1.fields[0].edits[0].payload);
		});
	});
});
