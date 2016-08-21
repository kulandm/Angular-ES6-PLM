'use strict';

describe('BomChangePayloadBuilderService', () => {

	let BomChangePayloadService;

	let MockBomChangeEditData;

	let getRawFieldWithPayload = (field) => {
		field.raw.payloadForm = sinon.stub();
		field.raw.payloadForm.returns(field.payload);
		return field.raw;
	};

	beforeEach(module('plm360.mockData', 'plm360.mockObjects'));

	beforeEach(() => {
		inject((_MockBomChangeEditData_) => {
			MockBomChangeEditData = _MockBomChangeEditData_;
		});

		BomChangePayloadService = System.get('com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js').default;
	});

	describe('[STATIC METHOD] attachFieldEditToPayload', () => {
		it('Should put CUSTOM_BOM fields in the correct format on the fields array', () => {
			let changeA = getRawFieldWithPayload(MockBomChangeEditData.edge1.fields[0].edits[0]);
			let changeB = getRawFieldWithPayload(MockBomChangeEditData.edge1.fields[1].edits[0]);

			let payload = {
				fields: []
			};

			BomChangePayloadService.attachFieldEditToPayload(payload, changeA);
			expect(payload.fields.length).to.equal(1);
			expect(payload.fields[0]).to.equal(changeA.payloadForm());

			BomChangePayloadService.attachFieldEditToPayload(payload, changeB);
			expect(payload.fields.length).to.equal(2);
			expect(payload.fields[1]).to.equal(changeB.payloadForm());
		});

		it('Should put QUANTITY field value as quantity property', () => {
			let changeA = MockBomChangeEditData.edge1.fields[2].edits[0].raw;

			let payload = {
				fields: []
			};

			BomChangePayloadService.attachFieldEditToPayload(payload, changeA);

			expect(payload.fields.length).to.equal(0);
			expect(payload.quantity).to.equal(changeA.currentValue);
		});

		it('Should put PIN field value as isPinned property and set the item as current revision when it is defined', () => {
			let changeA = MockBomChangeEditData.edge1.fields[3].edits[0].raw;

			let payload = {
				fields: []
			};

			BomChangePayloadService.attachFieldEditToPayload(payload, changeA);

			expect(payload.fields.length).to.equal(0);
			expect(payload.isPinned).to.equal(changeA.currentValue === 'true' ? true : false);
			expect(payload.item).to.equal(changeA.currentRevision.version.item);
		});

		it('Should put PIN field value as isPinned property and set the item as the targetItem property if currentRevision is not defined', () => {
			let changeA = MockBomChangeEditData.edge1.fields[3].edits[1].raw;

			let payload = {
				fields: []
			};

			BomChangePayloadService.attachFieldEditToPayload(payload, changeA);

			expect(payload.fields.length).to.equal(0);
			expect(payload.isPinned).to.equal(changeA.currentValue === 'true' ? true : false);
			expect(payload.item).to.equal(changeA.targetItem);
		});

		it('Should put BOM_ITEM_NUMBER field as itemNumber property (overwriting any previous value)', () => {
			let changeA = MockBomChangeEditData.edge1.fields[4].edits[0].raw;

			let payload = {
				itemNumber: '1',
				fields: []
			};

			BomChangePayloadService.attachFieldEditToPayload(payload, changeA);

			expect(payload.fields.length).to.equal(0);
			expect(payload.itemNumber).to.equal(changeA.currentValue.itemNumber);
		});
	});

	describe('[STATIC METHOD] attachFieldEditsToPayload', () => {
		it('Should call attachFieldEditToPayload for every BomFieldEdit in the map in the list', () => {
			let attachmentStub = sinon.stub(BomChangePayloadService, 'attachFieldEditToPayload');

			let changesMap = new Map();
			let changes = [
				MockBomChangeEditData.edge1.fields[0].edits[0].raw,
				MockBomChangeEditData.edge1.fields[1].edits[0].raw,
				MockBomChangeEditData.edge1.fields[2].edits[0].raw,
				MockBomChangeEditData.edge1.fields[3].edits[0].raw
			];
			changesMap.set('fieldEdit', changes);
			changesMap.set('NotAFieldEdit', [{}]);

			let payload = {};

			BomChangePayloadService.attachFieldEditsToPayload(changesMap, payload);

			expect(attachmentStub.callCount).to.equal(4);
			changes.forEach((change, index) => {
				expect(attachmentStub.calledWithExactly(payload, change), `change ${index} called`).to.be.true;
			});

			attachmentStub.restore();
		});

		it('Should not modify previous properties that do not correspond to changes', () => {
			let attachmentStub = sinon.stub(BomChangePayloadService, 'attachFieldEditToPayload');

			let changesMap = new Map();
			let changes = [
				MockBomChangeEditData.edge1.fields[0].edits[0].raw,
				MockBomChangeEditData.edge1.fields[1].edits[0].raw,
				MockBomChangeEditData.edge1.fields[2].edits[0].raw,
				MockBomChangeEditData.edge1.fields[3].edits[0].raw
			];
			changesMap.set('fieldEdit', changes);

			let payload = {
				dontModifyMe1: 'val1',
				dontModifyMe2: 'val2'
			};

			BomChangePayloadService.attachFieldEditsToPayload(changesMap, payload);

			expect(payload.dontModifyMe1).to.equal('val1');
			expect(payload.dontModifyMe2).to.equal('val2');

			attachmentStub.restore();
		});
	});

	describe('[STATIC METHOD] convertChangesToEditPayload', () => {
		it('Should attach the edits to the payload', () => {
			let attachmentStub = sinon.stub(BomChangePayloadService, 'attachFieldEditsToPayload');
			let changesMap = new Map();
			let changes = [
				MockBomChangeEditData.edge1.fields[0].edits[0].raw,
				MockBomChangeEditData.edge1.fields[1].edits[0].raw,
				MockBomChangeEditData.edge1.fields[2].edits[0].raw,
				MockBomChangeEditData.edge1.fields[3].edits[0].raw
			];
			changesMap.set('fieldEdit', changes);

			let payload = BomChangePayloadService.convertChangesToEditPayload(changesMap);

			expect(attachmentStub.calledWith(changesMap, sinon.match.any));

			attachmentStub.restore();
		});
	});

	describe('[STATIC METHOD] convertChangesToAddPayload', () => {
		let attachmentStub, changesMap, addChange, editChanges;
		beforeEach(() => {
			attachmentStub = sinon.stub(BomChangePayloadService, 'attachFieldEditsToPayload');

			changesMap = new Map();

			addChange = {
				itemJSON: {
					prop1: 'prop1',
					prop2: 'prop2'
				},
				correspondingRow: {
					itemNumber: '1'
				}
			};

			editChanges = [
				MockBomChangeEditData.edge1.fields[0].edits[0].raw,
				MockBomChangeEditData.edge1.fields[1].edits[0].raw,
				MockBomChangeEditData.edge1.fields[2].edits[0].raw,
				MockBomChangeEditData.edge1.fields[3].edits[0].raw
			];
		});

		afterEach(() => {
			attachmentStub.restore();
		});

		it('If there are no edits, it should return the itemJSON of the addChange with the item number of the associated row', () => {
			changesMap.set('addItem', [addChange]);

			let payload = BomChangePayloadService.convertChangesToAddPayload(changesMap);

			expect(payload.prop1).to.equal(addChange.itemJSON.prop1);
			expect(payload.prop2).to.equal(addChange.itemJSON.prop2);
			expect(payload.itemNumber).to.equal(addChange.correspondingRow.itemNumber);
			expect(attachmentStub.called).to.be.false;
		});

		it('Should attach the edits to the addChange itemJSON if there are edits', () => {
			changesMap.set('addItem', [addChange]);
			changesMap.set('fieldEdit', editChanges);

			let payload = BomChangePayloadService.convertChangesToAddPayload(changesMap);

			expect(attachmentStub.calledWith(changesMap, addChange.itemJSON));
		});
	});
});
