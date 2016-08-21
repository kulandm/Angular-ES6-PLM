'use strict';

describe('[MODEL] BomField', () => {

	let BomField, UrnParser, mockViewDefinitionFieldObj;
	let viewDefField, itemNumberField;

	beforeEach(module('com/autodesk/UrnParser.js', 'com/autodesk/models/bomGraph/bomGraph.js', 'plm360.mockObjects', 'plm360.mockData'));

	beforeEach(module(($provide) => {
		$provide.value('$state', {
			href: sinon.stub()
		});
		$provide.value('FieldTypes', {
			NOOB: 0
		});
	}));

	beforeEach(function () {
		inject(function (_BomField_, _UrnParser_, MockViewDefinitionFieldObj) {
			BomField = _BomField_;
			UrnParser = _UrnParser_;
			mockViewDefinitionFieldObj = MockViewDefinitionFieldObj;

			viewDefField = new mockViewDefinitionFieldObj();
			viewDefField.getUrn.returns('someUrn');
			viewDefField.getTypeId.returns(1444);
			viewDefField.getFieldSemantics.returns('$$BASIC');
			viewDefField.getSelf.returns('Some self data');

			itemNumberField = {
				id: '$$BOM_ITEM_NUMBER',
				semantics: '$$BOM_ITEM_NUMBER',
				type: 0,
				value: {
					depth: 1,
					itemNumber: 44
				}
			};
		});
	});

	describe('[STATE] Initialization', () => {
		it('Inits with correct properties', () => {
			let field = new BomField(itemNumberField);

			expect(field.viewDefFieldInfo).to.be.undefined;
			expect(field.type).to.equal(itemNumberField.type);
			expect(field.id).to.equal(itemNumberField.id);
			expect(field.semantics).to.equal(itemNumberField.semantics);
			expect(field.value).to.equal(itemNumberField.value);
		});
	});

	describe('[STATIC METHOD] ItemNumberField', () => {
		it('Creates a BomField with the correct properties', () => {
			let field = BomField.ItemNumberField();

			expect(field.viewDefFieldInfo).to.be.undefined;
			expect(field.type).to.equal(0);
			expect(field.id).to.equal('$$BOM_ITEM_NUMBER');
			expect(field.semantics).to.equal('$$BOM_ITEM_NUMBER');
		});
	});

	describe('[STATIC METHOD] FromViewDefField', () => {
		it('Creates an BomField with the correct properties', () => {
			let field = BomField.FromViewDefField(viewDefField);

			expect(field.viewDefFieldInfo).to.equal(viewDefField.getSelf());
			expect(field.type).to.equal(viewDefField.getTypeId());
			expect(field.id).to.equal(viewDefField.getUrn());
			expect(field.semantics).to.equal(viewDefField.getFieldSemantics());
			expect(field.value).to.equal('');
		});
	});

	describe('[METHOD] updateFieldValue', () => {
		it('Should update normal fields correctly', () => {
			let field = BomField.FromViewDefField(viewDefField);
			let valuesMap = new Map();
			valuesMap.set('someKey', 3);
			valuesMap.set(field.getId(), 4);

			field.updateFieldValue(valuesMap);

			expect(field.value).to.equal('4');
		});
	});

	describe('[METHOD] generateHref', () => {
		let setStateHrefReturn;
		let urnA, wsA;
		let urnB, wsB;

		beforeEach(() => {
			urnA = 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.8.2887';
			wsA = '8';
			urnB = 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINEVIEW.45.2000';
			wsB = '45';

			setStateHrefReturn = (wsId, urn, result) => {
				BomField.$state.href.withArgs('details', {
					workspaceId: wsId,
					tab: 'details',
					view: 'full',
					mode: 'view',
					itemId: UrnParser.encode(urn)
				}).returns(result);
			};
		});

		it('Should not assign a link of the field should not have a href', () => {
			let field = BomField.ItemNumberField();
			setStateHrefReturn(wsA, urnA, 'someLink');
			field.generateHref(urnA);

			expect(field.href).to.equal(null);
		});

		it('Should assign a link if the field is the descriptor field', () => {
			viewDefField.getFieldSemantics.returns('$$DESCRIPTOR');
			let field = BomField.FromViewDefField(viewDefField);
			setStateHrefReturn(wsA, urnA, 'someLink');
			field.generateHref(urnA);

			expect(field.href).to.equal('someLink');
		});

		it('Should assign a link if the field is the change order field', () => {
			viewDefField.getFieldSemantics.returns('$$CHANGE_PENDING');
			setStateHrefReturn(wsB, urnB, 'someOtherLink');
			let field = BomField.FromViewDefField(viewDefField);
			field.value = {
				urn: urnB
			};
			field.generateHref(urnA);

			expect(field.href).to.equal('someOtherLink');
		});
	});
});
