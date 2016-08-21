'use strict';

describe('[MODEL] BomChangeList', () => {
	let BomChangeList, changeList;

	let MockBomChangeEditObj, MockBomChangeAddObj, MockBomChangeRemoveObj, MockBomChangeCompiled, MockBomErrorData, MockBomChangeErrorObj, MockBomChangeListTypeData, MockBomChangeTypeData;

	let editChangeA, editChangeB, editChangeC, editChangeD, addChangeA, addChangeB, addChangeC, removeChangeA, removeChangeB, removeChangeC;

	let sandbox;

	beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		inject((_MockBomChangeListTypeData_, _MockBomChangeEditObj_, _MockBomChangeAddObj_, _MockBomChangeRemoveObj_, _MockBomChangeErrorObj_, _MockBomErrorData_, _MockBomChangeTypeData_) => {
			MockBomChangeEditObj = _MockBomChangeEditObj_;
			MockBomChangeAddObj = _MockBomChangeAddObj_;
			MockBomChangeRemoveObj = _MockBomChangeRemoveObj_;
			MockBomErrorData = _MockBomErrorData_;
			MockBomChangeErrorObj = _MockBomChangeErrorObj_;
			MockBomChangeListTypeData = _MockBomChangeListTypeData_;
			MockBomChangeTypeData = _MockBomChangeTypeData_;
		});

		MockBomChangeCompiled = System.get('com/autodesk/models/bomEdit/bomChangeCompiled.model.js').default;
		sandbox.stub(MockBomChangeCompiled.prototype, 'generatePayload');

		BomChangeList = System.get('com/autodesk/models/bomEdit/bomChangeList.model.js').default;

		let changeIdCounter = 0;
		let changeListKey = '112';

		changeList = new BomChangeList(changeListKey);

		editChangeA = new MockBomChangeEditObj();
		editChangeB = new MockBomChangeEditObj();
		editChangeC = new MockBomChangeEditObj();
		editChangeD = new MockBomChangeEditObj();

		let group1 = [editChangeA, editChangeC, editChangeD];
		let group2 = [editChangeB];

		let prepMockEditChange = (change, sameField, differentField, isRevertingChange) => {
			change.changeType = MockBomChangeTypeData.FIELDEDIT;
			change.changeId = changeIdCounter;
			changeIdCounter++;

			sameField.forEach((otherChange) => {
				change.targetsSameField.withArgs(otherChange).returns(true);
			});

			differentField.forEach((otherChange) => {
				change.targetsSameField.withArgs(otherChange).returns(false);
			});

			change.isRevertingChange.returns(isRevertingChange);
		};

		prepMockEditChange(editChangeA, group1, group2, false);
		prepMockEditChange(editChangeB, group2, group1, false);
		prepMockEditChange(editChangeC, group1, group2, false);
		prepMockEditChange(editChangeD, group1, group2, true);

		addChangeA = new MockBomChangeAddObj();
		addChangeA.changeType = MockBomChangeTypeData.ADDITEM;
		addChangeA.changeId = 4;
		addChangeB = new MockBomChangeAddObj();
		addChangeB.changeType = MockBomChangeTypeData.ADDITEM;
		addChangeB.changeId = 5;
		addChangeC = new MockBomChangeAddObj();
		addChangeC.changeType = MockBomChangeTypeData.ADDITEM;
		addChangeC.changeId = 6;
		addChangeC.targetsSameItemAddition.withArgs(addChangeA).returns(true);
		addChangeC.targetsSameItemAddition.withArgs(addChangeB).returns(false);

		removeChangeA = new MockBomChangeRemoveObj();
		removeChangeA.changeType = MockBomChangeTypeData.REMOVEITEM;
		removeChangeA.changeId = 7;
		removeChangeB = new MockBomChangeRemoveObj();
		removeChangeB.changeType = MockBomChangeTypeData.REMOVEITEM;
		removeChangeB.changeId = 8;
		removeChangeC = new MockBomChangeRemoveObj();
		removeChangeC.changeType = MockBomChangeTypeData.REMOVEITEM;
		removeChangeC.changeId = 9;

		// We are guaranteed by AbstractChangeList that the lists will exist when we need to access them
		changeList.changes.set(MockBomChangeTypeData.FIELDEDIT, []);
		changeList.changes.set(MockBomChangeTypeData.ADDITEM, []);
		changeList.changes.set(MockBomChangeTypeData.REMOVEITEM, []);
	});

	describe('[METHOD] acceptanceFunction', () => {
		it('Should accept all changes', () => {
			expect(changeList.acceptanceFunction(editChangeA)).to.be.true;
			expect(changeList.acceptanceFunction(addChangeA)).to.be.true;
			expect(changeList.acceptanceFunction(removeChangeA)).to.be.true;
		});
	});

	describe('[METHOD] acceptEditChange', () => {
		it('Should add an edit change if there is no other edits targeting the same field', () => {
			changeList.acceptEditChange(editChangeB);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).length).to.equal(1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeB)).to.not.equal(-1);

			changeList.acceptEditChange(editChangeC);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).length).to.equal(2);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeB)).to.not.equal(-1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeC)).to.not.equal(-1);
		});

		it('Should replace a change if it targets the same field', () => {
			changeList.acceptEditChange(editChangeA);
			changeList.acceptEditChange(editChangeB);
			changeList.acceptEditChange(editChangeC);

			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).length).to.equal(2);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeA)).to.equal(-1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeB)).to.not.equal(-1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeC)).to.not.equal(-1);
		});

		it('Should remove changes targeting the field if the new change is a reverting change', () => {
			changeList.acceptEditChange(editChangeA);
			changeList.acceptEditChange(editChangeB);
			changeList.acceptEditChange(editChangeD);

			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).length).to.equal(1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeA)).to.equal(-1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeD)).to.equal(-1);
			expect(changeList.changes.get(MockBomChangeTypeData.FIELDEDIT).indexOf(editChangeB)).to.not.equal(-1);
		});
	});

	describe('[METHOD] acceptRemoveChange', () => {
		it('Should add a remove change if there are no previous remove changes', () => {
			changeList.acceptRemoveChange(removeChangeA);
			expect(changeList.changes.get(MockBomChangeTypeData.REMOVEITEM).length).to.equal(1);
			expect(changeList.changes.get(MockBomChangeTypeData.REMOVEITEM).indexOf(removeChangeA)).to.not.equal(-1);
		});

		it('Should replace a previous remove change if there was one already', () => {
			changeList.acceptRemoveChange(removeChangeA);
			changeList.acceptRemoveChange(removeChangeB);
			expect(changeList.changes.get(MockBomChangeTypeData.REMOVEITEM).length).to.equal(1);
			expect(changeList.changes.get(MockBomChangeTypeData.REMOVEITEM).indexOf(removeChangeA)).to.equal(-1);
			expect(changeList.changes.get(MockBomChangeTypeData.REMOVEITEM).indexOf(removeChangeB)).to.not.equal(-1);
		});
	});

	describe('[METHOD] acceptChange', () => {
		it('Should call the edit acceptance method if an edit is passed in', () => {
			let editAcceptStub = sinon.stub(changeList, 'acceptEditChange');
			editAcceptStub.withArgs(editChangeA);

			changeList.acceptChange(editChangeA);

			expect(editAcceptStub.withArgs(editChangeA).calledOnce).to.be.true;

			editAcceptStub.restore();
		});

		it('Should call the remove acceptance method if a remove is passed in', () => {
			let removeAcceptStub = sinon.stub(changeList, 'acceptRemoveChange');
			removeAcceptStub.withArgs(removeChangeA);

			changeList.acceptChange(removeChangeA);

			expect(removeAcceptStub.withArgs(removeChangeA).calledOnce).to.be.true;

			removeAcceptStub.restore();
		});
	});

	describe('[METHOD] compilationFunction', () => {
		it('Should return a BomChangeCompiled if there is a change', () => {
			changeList.acceptChange(addChangeA);
			changeList.acceptChange(editChangeA);
			changeList.acceptChange(editChangeB);

			MockBomChangeCompiled.prototype.generatePayload.returns('Some payload');

			expect(changeList.compilationFunction().changeType).to.equal(changeList.getChangeType());
			expect(changeList.compilationFunction().payload).to.equal('Some payload');
		});

		it('Should return null if there is no change', () => {
			expect(changeList.compilationFunction()).to.equal(null);
		});
	});

	describe('[METHOD] getChangeType', () => {
		let hasStub, getStub;

		beforeEach(() => {
			hasStub = sinon.stub(changeList.changes, 'has');
			getStub = sinon.stub(changeList.changes, 'get');
		});

		afterEach(() => {
			hasStub.restore();
			getStub.restore();
		});

		// Lists for use in matching with hasInvalidStub
		let addMatchList = [addChangeA];
		let removeMatchList = [removeChangeA];
		let editMatchList = [editChangeA];

		let setHas = (changeType, has) => {
			hasStub.withArgs(changeType).returns(has);
			if (has) {
				if (changeType === MockBomChangeTypeData.ADDITEM) {
					getStub.withArgs(changeType).returns(addMatchList);
				} else if (changeType === MockBomChangeTypeData.REMOVEITEM) {
					getStub.withArgs(changeType).returns(removeMatchList);
				} else if (changeType === MockBomChangeTypeData.FIELDEDIT) {
					getStub.withArgs(changeType).returns(editMatchList);
				}
			} else {
				getStub.withArgs(changeType).returns([]);
			}
		};

		let setHasAdd = (has) => {
			setHas(MockBomChangeTypeData.ADDITEM, has);
		};

		let setHasRemove = (has) => {
			setHas(MockBomChangeTypeData.REMOVEITEM, has);
		};

		let setHasEdit = (has) => {
			setHas(MockBomChangeTypeData.FIELDEDIT, has);
		};

		it('Should return ADD when an add occured', () => {
			setHasAdd(true);
			setHasRemove(false);
			setHasEdit(false);

			expect(changeList.getChangeType()).to.equal(MockBomChangeListTypeData.ADD);
		});

		it('Should return REMOVE when an remove occured', () => {
			setHasAdd(false);
			setHasRemove(true);
			setHasEdit(false);

			expect(changeList.getChangeType()).to.equal(MockBomChangeListTypeData.REMOVE);
		});

		it('Should return EDIT when an remove occured', () => {
			setHasAdd(false);
			setHasRemove(false);
			setHasEdit(true);

			expect(changeList.getChangeType()).to.equal(MockBomChangeListTypeData.EDIT);
		});
	});

	describe('[METHOD] getEditState', () => {
		let hasInvalidStub, changeTypeStub, getStub;
		let addMatchList, removeMatchList, editMatchList;

		beforeEach(() => {
			// Lists for use in matching with hasInvalidStub
			addMatchList = [addChangeA];
			removeMatchList = [removeChangeA];
			editMatchList = [editChangeA];

			hasInvalidStub = sinon.stub(changeList, 'hasInvalidChange');
			changeTypeStub = sinon.stub(changeList, 'getChangeType');
			getStub = sinon.stub(changeList.changes, 'get');
		});

		afterEach(() => {
			hasInvalidStub.restore();
			changeTypeStub.restore();
			getStub.restore();
		});

		let setGet = (changeType, hasValue) => {
			if (hasValue) {
				if (changeType === MockBomChangeTypeData.ADDITEM) {
					getStub.withArgs(changeType).returns(addMatchList);
				} else if (changeType === MockBomChangeTypeData.REMOVEITEM) {
					getStub.withArgs(changeType).returns(removeMatchList);
				} else if (changeType === MockBomChangeTypeData.FIELDEDIT) {
					getStub.withArgs(changeType).returns(editMatchList);
				}
			} else {
				getStub.withArgs(changeType).returns([]);
			}
		};

		let setGetAdd = (hasValue) => {
			setGet(MockBomChangeTypeData.ADDITEM, hasValue);
		};

		let setGetRemove = (hasValue) => {
			setGet(MockBomChangeTypeData.REMOVEITEM, hasValue);
		};

		let setGetEdit = (hasValue) => {
			setGet(MockBomChangeTypeData.FIELDEDIT, hasValue);
		};

		it('Should return with the correct state', () => {
			changeTypeStub.returns('SomeOtherChangeType');

			let result = changeList.getEditState();

			expect(result.changeType).to.equal('SomeOtherChangeType');
			expect(result.isInvalid).to.equal(false);
		});

		it('Should set isInvalid to true if there is an invalid add', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.ADD);
			setGetAdd(true);
			setGetRemove(false);
			setGetEdit(false);

			hasInvalidStub.withArgs(addMatchList).returns(true);

			expect(changeList.getEditState().isInvalid).to.be.true;
		});

		it('Should set isInvalid to true if there is an add with invalid field edits', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.ADD);
			setGetAdd(true);
			setGetRemove(false);
			setGetEdit(true);

			hasInvalidStub.withArgs(addMatchList).returns(false);
			hasInvalidStub.withArgs(editMatchList).returns(true);

			expect(changeList.getEditState().isInvalid).to.be.true;
		});

		it('Should set isInvalid to false if there is an valid add with no invalid changes', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.ADD);
			setGetAdd(true);
			setGetRemove(false);
			setGetEdit(true);

			hasInvalidStub.withArgs(addMatchList).returns(false);
			hasInvalidStub.withArgs(editMatchList).returns(false);

			expect(changeList.getEditState().isInvalid).to.be.false;
		});

		it('Should set isInvalid to true if there is an invalid remove', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.REMOVE);
			setGetAdd(false);
			setGetRemove(true);
			setGetEdit(false);

			hasInvalidStub.withArgs(removeMatchList).returns(true);

			expect(changeList.getEditState().isInvalid).to.be.true;
		});

		it('Should set isInvalid to false if there is an valid remove', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.REMOVE);
			setGetAdd(false);
			setGetRemove(true);
			setGetEdit(false);

			hasInvalidStub.withArgs(removeMatchList).returns(false);

			expect(changeList.getEditState().isInvalid).to.be.false;
		});

		it('Should set isInvalid to true if there is an edit with any invalid field edits', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.EDIT);
			setGetAdd(false);
			setGetRemove(false);
			setGetEdit(true);

			hasInvalidStub.withArgs(editMatchList).returns(true);

			expect(changeList.getEditState().isInvalid).to.be.true;
		});

		it('Should set isInvalid to false if there is an edit with no invalid field edits', () => {
			changeTypeStub.returns(MockBomChangeListTypeData.EDIT);
			setGetAdd(false);
			setGetRemove(false);
			setGetEdit(true);

			hasInvalidStub.withArgs(editMatchList).returns(false);

			expect(changeList.getEditState().isInvalid).to.be.false;
		});
	});

	describe('[METHOD] hasInvalidChange', () => {
		let changes;

		beforeEach(() => {
			changes = [
				{
					isInvalid: sinon.stub()
				},
				{
					isInvalid: sinon.stub()
				},
				{
					isInvalid: sinon.stub()
				}
			];
		});

		it('Should return false if there are no changes provided', () => {
			expect(changeList.hasInvalidChange(), 'No Array').to.be.false;
			expect(changeList.hasInvalidChange([]), 'Empty Array').to.be.false;
		});

		it('Should return true if any of the changes are invalid', () => {
			changes[0].isInvalid.returns(false);
			changes[1].isInvalid.returns(true);
			changes[2].isInvalid.returns(false);

			expect(changeList.hasInvalidChange(changes)).to.be.true;
		});

		it('Should return false if none of the changes are invalid', () => {
			changes[0].isInvalid.returns(false);
			changes[1].isInvalid.returns(false);
			changes[2].isInvalid.returns(false);

			expect(changeList.hasInvalidChange(changes)).to.be.false;
		});
	});
});
