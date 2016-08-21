(() => {
    'use strict';

    describe('[MODEL] viewDefinitionField', () => {

        let ViewDefinitionField, mockRestWrapperService, mockPromiseStubber, FieldTypeMappings, mockViewFieldData, systemField, customBomField, editableField, itemDetailsField;

        beforeEach(() => {
            module('com/autodesk/models/bomViewDefinition/viewDefinitionField.model.js', 'plm360.mockObjects', 'plm360.mockData');

            module(($provide) => {
                $provide.value('RESTWrapperService', {
                    get: () => {}
                });
            });
        });

        beforeEach(() => {
            inject((_RESTWrapperService_, _ViewDefinitionField_, MockViewDefinitionFieldData, MockPromiseStubber) => {
                ViewDefinitionField = _ViewDefinitionField_;
                mockViewFieldData = MockViewDefinitionFieldData;
                mockRestWrapperService = _RESTWrapperService_;
                mockPromiseStubber = MockPromiseStubber;
            });

            systemField = new ViewDefinitionField(mockViewFieldData.systemField);
            customBomField = new ViewDefinitionField(mockViewFieldData.customBomField);
            editableField = new ViewDefinitionField(mockViewFieldData.editableField);
            itemDetailsField = new ViewDefinitionField(mockViewFieldData.itemDetailsField);
        });

        describe('[STATE]', () => {
            it('Should initialize the field object correctly', () => {
                expect(customBomField.name).to.equal(mockViewFieldData.customBomField.name);
                expect(customBomField.fieldTypeId).to.equal(4);
                expect(customBomField.editability).to.equal('CREATE_ONLY');
                expect(customBomField.visibility).to.equal('ALWAYS');
                expect(customBomField.__self__).to.equal(mockViewFieldData.customBomField.__self__);
            });
        });

        describe('[METHOD] determineSemantics', () => {
            it('Should return the corrent value for Descriptor field', () => {
                expect(systemField.determineSemantics('SYSTEM', 'Descriptor')).to.equal('$$DESCRIPTOR');
            });
            it('Should return the corrent value for Quantity field', () => {
                expect(systemField.determineSemantics('STANDARD_BOM', 'Quantity')).to.equal('$$QUANTITY');
            });
            it('Should return the corrent value for Revision field', () => {
                expect(systemField.determineSemantics('SYSTEM', 'Revision')).to.equal('$$REVISION');
            });
            it('Should return the corrent value for Change Pending field', () => {
                expect(systemField.determineSemantics('SYSTEM', 'Change Pending')).to.equal('$$CHANGE_PENDING');
            });
            it('Should return the corrent value for Attachments field', () => {
                expect(systemField.determineSemantics('SYSTEM', 'Attachments')).to.equal('$$ATTACHMENTS');
            });
            it('Should return the corrent value for Revision pinning field', () => {
                expect(systemField.determineSemantics('STANDARD_BOM', 'Revision Pinning')).to.equal('$$PINNING');
            });
            it('Should return the corrent value for any other field', () => {
                expect(systemField.determineSemantics('STANDARD_BOM', 'some other standard field')).to.equal('$$BASIC');
            });
        });

        describe('[METHOD] getSelf', () => {
            it('Should return the self data', () => {
                expect(customBomField.getSelf()).to.equal(mockViewFieldData.customBomField.__self__);
            });
        });

        describe('[METHOD] getLink', () => {
            it('Should return the correct value', () => {
                expect(customBomField.getLink()).to.equal(mockViewFieldData.customBomField.__self__.link);
            });
        });

        describe('[METHOD] getUrn', () => {
            it('Should return the correct value', () => {
                expect(customBomField.getUrn()).to.equal(mockViewFieldData.customBomField.__self__.urn);
            });
        });

        describe('[METHOD] getDisplayOrder', () => {
            it('Should return the correct value', () => {
                expect(customBomField.getDisplayOrder()).to.equal(mockViewFieldData.customBomField.displayOrder);
            });
        });

        describe('[METHOD] isAlwaysEditable', () => {
            it('Should return true for Quantity', () => {
                systemField.fieldSemantics = '$$QUANTITY';
                expect(systemField.isAlwaysEditable()).to.be.true;
            });

            it('Should return true for Pinning', () => {
                systemField.fieldSemantics = '$$PINNING';
                expect(systemField.isAlwaysEditable()).to.be.true;
            });

            it('Should return true for Revision', () => {
                systemField.fieldSemantics = '$$REVISION';
                expect(systemField.isAlwaysEditable()).to.be.true;
            });

            it('Should return false if the field is not a bom field', () => {
                expect(itemDetailsField.isAlwaysEditable()).to.be.false;
            });

            it('Should return false when the field is only editable on create', () => {
                expect(customBomField.isAlwaysEditable()).to.be.false;
            });

            it('Should return false when the field is never editable ', () => {
                systemField.fieldSemantics = null;
                expect(systemField.isAlwaysEditable()).to.be.false;
            });

            it('Should return true when the field is always editable', () => {
                expect(editableField.isAlwaysEditable()).to.be.true;
            });
        });

        describe('[METHOD] isOnlyEditableOnCreate', () => {
            it('Should return false if the field is not a bom field', () => {
                itemDetailsField.editability = 'CREATE_ONLY';
                expect(itemDetailsField.isOnlyEditableOnCreate()).to.be.false;
            });

            it('Should return false when the field always editable', () => {
                expect(editableField.isOnlyEditableOnCreate()).to.be.false;
            });

            it('Should return false when the field is never editable', () => {
                expect(systemField.isOnlyEditableOnCreate()).to.be.false;
            });

            it('Should return true only when the field is editable', () => {
                expect(customBomField.isOnlyEditableOnCreate()).to.be.true;
            });
        });

        describe('[METHOD] isEditableOnCreate', () => {
            let alwaysStub, onlyOnCreateStub;
            beforeEach(() => {
                alwaysStub = sinon.stub(customBomField, 'isAlwaysEditable');
                onlyOnCreateStub = sinon.stub(customBomField, 'isOnlyEditableOnCreate');
            });

            it('Should return true if the field is always editable', () => {
                alwaysStub.returns(true);
                onlyOnCreateStub.returns(false);
                expect(customBomField.isEditableOnCreate()).to.be.true;
                onlyOnCreateStub.returns(true);
                expect(customBomField.isEditableOnCreate()).to.be.true;
            });

            it('Should return true if the field is only editable on create', () => {
                alwaysStub.returns(false);
                onlyOnCreateStub.returns(true);
                expect(customBomField.isEditableOnCreate()).to.be.true;
            });

            it('Should return false if the field is not editable', () => {
                alwaysStub.returns(false);
                onlyOnCreateStub.returns(false);
                expect(customBomField.isEditableOnCreate()).to.be.false;
            });
        });

        describe('[METHOD] getName', () => {
            it('Should return the correct field name for the field', () => {
                expect(customBomField.getName()).to.equal(mockViewFieldData.customBomField.name);
            });
        });

        describe('[METHOD] getFieldId', () => {
            it('Should return the correct field id for the field', () => {
                expect(customBomField.getFieldId()).to.equal(mockViewFieldData.customBomField.fieldId);
                expect(systemField.getFieldId()).to.equal(mockViewFieldData.systemField.fieldId);
                expect(systemField.getFieldId()).to.equal(mockViewFieldData.systemField.fieldId);
            });
        });

        describe('[METHOD] buildTypeId', () => {
            it('Should build the correct type', () => {
                let type = {
                    urn: 'urn:someUrn.type:someValue.4'
                };

                expect(customBomField.buildTypeId(type)).to.equal(4);
            });
        });

        describe('[STATIC METHOD] fetch', () => {
            it('Should be able to fetch the correct data when called with right parameters', () => {
                let link = 'someLink';

                mockPromiseStubber.stubWithSuccess(mockRestWrapperService, 'get', mockViewFieldData.customBomField, [link, sinon.match.any, sinon.match.any, sinon.match.any]);

                let field = ViewDefinitionField.fetch(link);
                expect(field.getName()).to.equal(mockViewFieldData.customBomField.name);
            });
        });
    });
})();
