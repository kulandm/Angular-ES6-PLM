'use strict';

describe('BomMessageService', () => {
	let BomMessageService;

	let MockBomPathObj;

	beforeEach(module('com/autodesk/components/workspaceItem/viewBom/BomMessageService.js', 'plm360.mockData', 'plm360.mockObjects'));

	beforeEach(() => {
		inject((_BomMessageService_, _MockBomPathObj_) => {
			BomMessageService = _BomMessageService_;
			MockBomPathObj = _MockBomPathObj_;
		});
	});

	describe('[METHOD] extractEventId', () => {
		it('Should extract the unique id of the event', () => {
			expect(BomMessageService.extractEventId('someEventNamespace:UNIQUEID1:someEvent')).to.equal('UNIQUEID1');
		});
	});

	describe('[METHOD] getViewDefinitionsReceivedMessage', () => {
		it('Should return the correct message', () => {
			expect(BomMessageService.getViewDefinitionsReceivedMessage('1')).to.equal('viewDefinitions:1:done');
		});
	});

	describe('[METHOD] getViewDefinitionReceivedMessage', () => {
		it('Should return the correct message', () => {
			expect(BomMessageService.getViewDefinitionReceivedMessage('someUrn')).to.equal('viewDefinition:someUrn:done');
		});
	});

	describe('[METHOD] getBomTopLineReceivedMessage', () => {
		it('Should return the correct message', () => {
			expect(BomMessageService.getBomTopLineReceivedMessage('2776')).to.equal('bomRoot:2776:done');
		});
	});

	describe('[METHOD] getBomRowAddedMessage', () => {
		it('Should returmn the correct message', () => {
			let path = new MockBomPathObj();
			path.asString.returns('edge1@edge2@edge3');
			expect(BomMessageService.getBomRowAddedMessage(path)).to.equal('bomTableRow:edge1@edge2@edge3:created');
		});
	});

	describe('[METHOD] getBomSaveCompletedMessage', () => {
		it('Should return the correct message', () => {
			expect(BomMessageService.getBomSaveCompletedMessage()).to.equal('bomNestedItem:saveCompleted');
		});
	});

	describe('[METHOD] getBomNestedItemFetchSuccessMessage', () => {
		it('Should return the correct message', () => {
			expect(BomMessageService.getBomNestedItemFetchSuccessMessage('112')).to.equal('bomNestedItem:112:done');
		});
	});

	describe('[METHOD] getBomChangeSendMessage', () => {
		it('Should return the correct message for an edit with a specific changeId', () => {
			expect(BomMessageService.getBomChangeSendMessage('edit', '112')).to.equal('bomNestedItem:112:edit');
		});

		it('Should return the correct message for an add with a specific changeId', () => {
			expect(BomMessageService.getBomChangeSendMessage('add', '112')).to.equal('bomNestedItem:112:add');
		});

		it('Should return the correct message for an remove with a specific changeId', () => {
			expect(BomMessageService.getBomChangeSendMessage('remove', '112')).to.equal('bomNestedItem:112:remove');
		});
	});

	describe('[METHOD] getBomChangeSuccessMessage', () => {
		it('Should return the correct message for an edit with a specific changeId', () => {
			expect(BomMessageService.getBomChangeSuccessMessage('edit', '112')).to.equal('bomNestedItem:112:editDone');
		});

		it('Should return the correct message for an add with a specific changeId', () => {
			expect(BomMessageService.getBomChangeSuccessMessage('add', '112')).to.equal('bomNestedItem:112:addDone');
		});

		it('Should return the correct message for an remove with a specific changeId', () => {
			expect(BomMessageService.getBomChangeSuccessMessage('remove', '112')).to.equal('bomNestedItem:112:removeDone');
		});
	});

	describe('[METHOD] getBomChangeFailureMessage', () => {
		it('Should return the correct message for an edit with a specific changeId', () => {
			expect(BomMessageService.getBomChangeFailureMessage('edit', '112')).to.equal('bomNestedItem:112:editFailed');
		});

		it('Should return the correct message for an add with a specific changeId', () => {
			expect(BomMessageService.getBomChangeFailureMessage('add', '112')).to.equal('bomNestedItem:112:addFailed');
		});

		it('Should return the correct message for an remove with a specific changeId', () => {
			expect(BomMessageService.getBomChangeFailureMessage('remove', '112')).to.equal('bomNestedItem:112:removeFailed');
		});
	});

	describe('[METHOD] getViewDefFieldRecievedMessage', () => {
		it('Should return correct message for a given urn of a field ', () => {
			expect(BomMessageService.getViewDefFieldRecievedMessage('someUrn')).to.equal('viewDefinitionField:someUrn:done');
		});
	});

	describe('[METHOD] getViewDefFieldGetMessage', () => {
		it('Should return correct message for a given urn of a field ', () => {
			expect(BomMessageService.getViewDefFieldGetMessage('someUrn')).to.equal('viewDefinitionField:someUrn:get');
		});
	});

	describe('[METHOD] getViewDefinitionGetMessage', () => {
		it('Should return correct message for a given urn of a view ', () => {
			expect(BomMessageService.getViewDefinitionGetMessage('someUrn')).to.equal('viewDefinition:someUrn:get');
		});
	});
});
