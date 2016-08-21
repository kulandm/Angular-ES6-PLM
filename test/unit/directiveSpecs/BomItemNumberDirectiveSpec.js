(() => {
	'use strict';

	describe('BomItemNumberDirective', () => {
		let element, scope, compile, mockDirectiveData, mockItemNumberData;

		beforeEach(module(
			'plm360.mockData',
			'plmTemplates',
			'com/autodesk/components/workspaceItem/viewBom/viewBom.js'
		));

		beforeEach(inject((_$compile_, _$rootScope_, MockBomItemNumberData) => {

			scope = _$rootScope_.$new();
			compile = _$compile_;
			mockItemNumberData = MockBomItemNumberData;
			mockDirectiveData = MockBomItemNumberData.directiveData;

			scope.itemNumberData = mockDirectiveData.itemNumberField;
			scope.expanRow = sinon.stub();
			scope.collpaseRow = sinon.stub();
			scope.onEditEnd = sinon.stub();
			scope.editView = mockDirectiveData.editView;
			scope.isExpandable = mockDirectiveData.isExpandable;
			scope.isCollapsed = mockDirectiveData.isCollapsed;
			scope.editOnClick = mockDirectiveData.editOnclick;

			element = angular.element(mockDirectiveData.directiveHtml);
			compile(element)(scope);
			scope.$digest();
		}));

		it('Should bind the data passed to it to the scope', () => {
			let directiveScope = element.isolateScope();

			expect(directiveScope.fieldData.value.itemNumber).to.equal(20);
			expect(directiveScope.fieldData.value.depth).to.equal(2);
			expect(directiveScope.fieldData.fieldPropertyId).to.equal('BOM_ITEM_NUMBER');
			expect(directiveScope.isExpandable).to.equal(true);
			expect(directiveScope.isCollapsed).to.equal(false);
		});

		it('should set the original value property using the field data value', () => {
			let directiveScope = element.isolateScope();
			let originalValue = directiveScope.fieldData.originalValue.itemNumber;
			let value = directiveScope.fieldData.value.itemNumber;
			expect(originalValue).to.equal(value);
		});

		it('should display the depth and item number as the value', () => {
			expect(element.find('span')[3].textContent).to.equal('2.20');
		});

		it('Updates the originalValue when fieldData changes', () => {
			let directiveScope = element.isolateScope();
			directiveScope.fieldData = mockItemNumberData.newData;
			scope.$digest();

			let originalValue = directiveScope.fieldData.originalValue.itemNumber;
			let value = directiveScope.fieldData.value.itemNumber;

			expect(directiveScope.fieldData.value.depth).to.equal(2);
			expect(directiveScope.fieldData.value.itemNumber).to.equal(1315);
			expect(element.find('span')[3].textContent).to.equal('2.1315');

			expect(originalValue).to.equal(value);

		});

		it('Should switch to edit view when the editView property is set to true', () => {
			scope.editView = true;
			scope.$digest();

			expect(element.find('span')[0].textContent).equal('2.');
			expect(element.find('input').length).to.equal(1);
			expect(element.find('label').length).to.equal(1);
			expect(element.find('input').attr('ng-model')).to.equal('fieldData.value.itemNumber');
		});
	});
})();
