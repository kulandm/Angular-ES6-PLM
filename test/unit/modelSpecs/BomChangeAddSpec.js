'use strict';

describe('[MODEL] BomChangeAdd', () => {
	let BomChangeAdd, mockBomChangeAddData, mockLinkableItemObj;

	beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

	beforeEach(() => {
		inject((MockBomChangeAddData, MockLinkableItemObj) => {
			mockBomChangeAddData = MockBomChangeAddData;
			mockLinkableItemObj = MockLinkableItemObj;
		});

		BomChangeAdd = System.get('com/autodesk/models/bomEdit/bomChangeAdd.model.js').default;
	});

	describe('[STATE]', () => {
		it('Should init with correct properties', () => {
			let linkableItem = new mockLinkableItemObj(mockBomChangeAddData.item1.ref.json);
			let changeObj = {};
			changeObj.ref = linkableItem;
			let change = new BomChangeAdd(changeObj);

			expect(change.itemJSON).to.equal(changeObj.ref.json);
			expect(change.edgeId).to.equal(`Temp${linkableItem.getItemId()}`);
		});
	});
});
