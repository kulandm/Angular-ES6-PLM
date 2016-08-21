'use strict';

describe('[MODEL] BomChangeError', () => {
	let BomChangeError;
	let mockBomErrorData;

	beforeEach(module('plm360.mockData'));

	beforeEach(() => {
		inject((MockBomErrorData) => {
			mockBomErrorData = MockBomErrorData;
		});

		BomChangeError = System.get('com/autodesk/models/bomEdit/bomChangeError.model.js').default;
	});

	describe('[STATE]', () => {
		it('Should init with correct properties', () => {
			let addError = new BomChangeError(mockBomErrorData.addErrors[0]);
			expect(addError.code).to.equal(mockBomErrorData.addErrors[0].code);
			expect(addError.message).to.equal(mockBomErrorData.addErrors[0].message);
			expect(addError.arguments).to.equal(mockBomErrorData.addErrors[0].arguments);
			expect(addError.editedField).equal(mockBomErrorData.addErrors[0].field);
			expect(addError.editedFieldId).equal('TEXT_BOX_FLOAT');
		});
	});

	describe('[METHOD] getErrorFieldId', () => {
		it('Should return the field id to which the error belongs to', () => {
			let editError = new BomChangeError(mockBomErrorData.editErrorMultiple[0]);
			expect(editError.getErrorFieldId()).to.equal('TEXT_BOX_INT');
		});
	});

	describe('[METHOD] convertToBomChangeErrors', () => {
		it('Should return a list of BomChangeError objects when a list payload is provided', () => {
			let payload = {
				data: mockBomErrorData.addErrors
			};
			let result = BomChangeError.convertToBomChangeErrors(payload);
			for (let i = 0; i < result.length; ++i) {
				expect(result[i] instanceof BomChangeError).to.be.true;
			}
		});
	});
});
