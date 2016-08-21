(() => {
    'use strict';

    describe('BomTableColumnBuilder', function () {
        let FieldTypes, BomTableColumn, BomUIFieldSemantics, bomTableColumnBuilder;
        let mockFieldTypesData, mockViewDefinitionFieldData, mockViewDefinitionFieldObj, viewDefField;

        beforeEach(() => {
            module('plm360.mockObjects', 'plm360.mockData', 'com/autodesk/models/bomTable/bomTable.js');
            module(($provide) => {
                $provide.value('FieldTypes', mockFieldTypesData);
            });
        });

        beforeEach(() => {
            inject((_BomTableColumnBuilder_, _FieldTypes_, _MockFieldTypes_, _MockViewDefinitionFieldObj_) => {
                FieldTypes = _FieldTypes_;
                mockFieldTypesData = _MockFieldTypes_;
                bomTableColumnBuilder = _BomTableColumnBuilder_;
                mockViewDefinitionFieldObj = _MockViewDefinitionFieldObj_;
            });

            BomUIFieldSemantics = System.get('com/autodesk/models/bomFields/BomUIFieldSemantics.service.js').default;
            BomTableColumn = System.get('com/autodesk/models/bomTable/bomTableColumn.model.js').default;
            viewDefField = new mockViewDefinitionFieldObj();
        });

        describe('[STATE]', () => {
            it('Should initially set the template for descriptor column', () => {
                let descriptorTemplate = bomTableColumnBuilder.columnTemplates.get(BomUIFieldSemantics.DESCRIPTOR);

                expect(descriptorTemplate.cellTemplate).to.equal('bomItemDescriptorTemplate');
            });

            it('Should initially set the template for revision column', () => {
                let revisionTemplate = bomTableColumnBuilder.columnTemplates.get(BomUIFieldSemantics.REVISION);

                expect(revisionTemplate.cellTemplate).to.equal('bomRevisionTemplate');
            });

            it('Should initially set the template for pinning column', () => {
                let pinningTemplate = bomTableColumnBuilder.columnTemplates.get(BomUIFieldSemantics.PINNING);

                expect(pinningTemplate.cellTemplate).to.equal('bomPinnedTemplate');
            });
            it('Should initially set the template for attachments column', () => {
                let attachmentTemplate = bomTableColumnBuilder.columnTemplates.get(BomUIFieldSemantics.ATTACHMENTS);

                expect(attachmentTemplate.cellTemplate).to.equal('bomAttachmentsTemplate');
            });

            it('Should initially set the template for change pending column', () => {
                let changePendingTemplate = bomTableColumnBuilder.columnTemplates.get(BomUIFieldSemantics.CHANGE_PENDING);

                expect(changePendingTemplate.cellTemplate).to.equal('bomPendingChangeTemplate');
            });
        });

        describe('[METHOD] buildColumnForViewDefField', () => {
            it('Should use a one of the initial templates if the field requires special handling', () => {
                viewDefField.getTypeId.returns(mockFieldTypesData.CHECKBOX);
                viewDefField.getName.returns('attachmentsField');
                viewDefField.getUrn.returns('attachmentsUrn');
                viewDefField.getFieldSemantics.returns(BomUIFieldSemantics.ATTACHMENTS);

                let column = bomTableColumnBuilder.buildColumnForViewDefField(viewDefField);

                expect(column.displayName).to.equal('attachmentsField');
                expect(column.fieldId).to.equal('attachmentsUrn');
                expect(column.cellTemplate).to.equal('bomAttachmentsTemplate');
            });

            it('Should use bomCheckBoxTemplate for check fields', () => {
                viewDefField.getTypeId.returns(mockFieldTypesData.CHECKBOX);
                viewDefField.getName.returns('testCheckBoxField');
                viewDefField.getUrn.returns('urn');
                viewDefField.getFieldSemantics.returns(BomUIFieldSemantics.BASIC);

                let column = bomTableColumnBuilder.buildColumnForViewDefField(viewDefField);

                expect(column.displayName).to.equal('testCheckBoxField');
                expect(column.fieldId).to.equal('urn');
                expect(column.cellTemplate).to.equal('bomNoEditOnClickTemplate');
            });

            it('Should use RTF cell template for paragraph fields', () => {
                viewDefField.getTypeId.returns(mockFieldTypesData.PARAGRAPH);
                viewDefField.getName.returns('paragraphField');
                viewDefField.getUrn.returns('anotherurn');
                viewDefField.getFieldSemantics.returns(BomUIFieldSemantics.BASIC);

                let column = bomTableColumnBuilder.buildColumnForViewDefField(viewDefField);

                expect(column.displayName).to.equal('paragraphField');
                expect(column.fieldId).to.equal('anotherurn');
                expect(column.cellTemplate).to.equal('bomRTFTemplate');
            });
        });

        describe('[METHOD] buildEditIndicatorColumn', () => {
            it('Should create a row indicator column ', () => {
                let rowIndicatorColumn = bomTableColumnBuilder.buildEditIndicatorColumn();

                expect(rowIndicatorColumn.displayName).to.equal(' ');
                expect(rowIndicatorColumn.field).to.equal('indicator');
                expect(rowIndicatorColumn.enableSorting).to.be.false;
                expect(rowIndicatorColumn.suppressRemoveSort).to.be.true;
                expect(rowIndicatorColumn.enableColumnResizing).to.be.false;
                expect(rowIndicatorColumn.cellTemplate).to.equal('bomEditIndicatorTemplate');
                expect(rowIndicatorColumn.width).to.equal('5');
            });
        });

        describe('[METHOD] buildRowSelectorColumn', () => {
            it('Should create a row selector column ', () => {
                let rowSelectorColumn = bomTableColumnBuilder.buildRowSelectorColumn();

                expect(rowSelectorColumn.displayName).to.equal('');
                expect(rowSelectorColumn.field).to.equal('selector');
                expect(rowSelectorColumn.enableSorting).to.be.false;
                expect(rowSelectorColumn.suppressRemoveSort).to.be.true;
                expect(rowSelectorColumn.enableColumnResizing).to.be.false;
                expect(rowSelectorColumn.cellTemplate).to.equal('bomRowSelectorTemplate');
                expect(rowSelectorColumn.width).to.equal('50');
            });
        });

        describe('[METHOD] buildRowIdColumn', () => {
            it('Should create a row id column ', () => {
                let rowIdColumn = bomTableColumnBuilder.buildRowIdColumn();

                expect(rowIdColumn.displayName).to.equal('#');
                expect(rowIdColumn.fieldId).to.equal(BomUIFieldSemantics.BOM_ITEM_NUMBER);
                expect(rowIdColumn.enableSorting).to.be.false;
                expect(rowIdColumn.suppressRemoveSort).to.be.true;
                expect(rowIdColumn.cellTemplate).to.equal('bomRowIdTemplate');
                expect(rowIdColumn.width).to.equal('10%');
            });
        });

        describe('[METHOD] buildHeaderTemplate', () => {
            it('Should create tempalte with given class and title text ', () => {
                let cellTemplate = bomTableColumnBuilder.buildHeaderTemplate('aClass', 'aTitle');
                let elm = angular.element(cellTemplate).children();

                expect(elm.hasClass('aClass')).to.be.true;
                expect(elm.attr('title')).to.equal('aTitle');
            });
        });
    });
})();
