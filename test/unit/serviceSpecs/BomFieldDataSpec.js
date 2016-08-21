'use strict';

describe('[SERVICE] BomFieldData', () => {
    let BomFieldData, MockFieldTypes, $rootScope;

    beforeEach(module('plm360.mockData', 'plm360.mockObjects', ($provide) => {
        $provide.value('FieldData', {
            fromFieldData: sinon.stub()
        });
        $provide.value('FieldTypes', {});
        $provide.value('$rootScope', {
            bundle: {
                revision: {
                    working: 'WORKING'
                }
            }
        });

        $provide.value('Workspace', function () {});
    }));

    beforeEach(module('com/autodesk/models/bomTable/bomFieldData.js'));

    beforeEach(() => {
        inject((_BomFieldData_, _$rootScope_, _MockFieldTypes_) => {
            BomFieldData = _BomFieldData_;
            MockFieldTypes = _MockFieldTypes_;
            BomFieldData.FieldTypes = MockFieldTypes;
            $rootScope = _$rootScope_;
        });
    });

    describe('[METHOD] decorateFieldData', () => {
        let instance, field;
        beforeEach(() => {
            instance = {
                typeId: BomFieldData.FieldTypes.SINGLE_LINE_TEXT,
                fieldMetadata: {},
                metadata: {}
            };

            field = {
                getFieldSemantics: () => {
                    return '$$BASIC';
                },
                getId: () => {
                    return 'anId';
                },
                getViewDefFieldInfo: () => {
                    return 'someInfo';
                }
            };
        });

        it('Should add the correct properties', () => {
            BomFieldData.decorateFieldData(instance, field);

            expect(instance.getFieldId()).to.equal(field.getId());
            expect(instance.getViewDefFieldInfo()).to.equal(field.getViewDefFieldInfo());
            expect(instance.getFieldSemantics()).to.equal(field.getFieldSemantics());
            expect(instance.loadPicklistValues).to.be.undefined;
        });

        it('Should add the correct properties to picklists', () => {
            let picklistTypes = [
                BomFieldData.FieldTypes.PICKLIST,
                BomFieldData.FieldTypes.PICKLIST_LINKED,
                BomFieldData.FieldTypes.PICKLIST_DEFAULT,
                BomFieldData.FieldTypes.PICKLIST_DEFAULT_LINKED,
                BomFieldData.FieldTypes.PICKLIST_LATEST,
                BomFieldData.FieldTypes.PICKLIST_LRL,
                BomFieldData.FieldTypes.UOM,
                BomFieldData.FieldTypes.PICKLIST_WITH_FILTER,
                BomFieldData.FieldTypes.PICKLIST_FILTER_LINKED
            ];

            picklistTypes.forEach((type) => {
                instance = {
                    typeId: type,
                    fieldMetadata: {},
                    metadata: {}
                };

                BomFieldData.decorateFieldData(instance, field);

                expect(instance.getFieldId(), `fieldType ${type} fieldId`).to.equal(field.getId());
                expect(instance.getViewDefFieldInfo(), `fieldType ${type} viewDefFieldInfo`).to.equal(field.getViewDefFieldInfo());
                expect(instance.getFieldSemantics(), `fieldType ${type} fieldSemantics`).to.equal(field.getFieldSemantics());
                expect(instance.metadata.picklistLoaderWithFiltering, `fieldType ${type} picklistLoaderWithFiltering`).to.be.a('function');
            });
        });
    });

    describe('[METHOD] buildFieldDataArgs', () => {
        let field;
        beforeEach(() => {
            field = {
                value: 'SomeValue',
                type: BomFieldData.FieldTypes.SINGLE_LINE_TEXT,
                metadata: {
                    someMeta: 'someMetaData'
                },
                id: 'CUSTOM_BOMSOMEFIELD',
                getFieldSemantics: sinon.stub()
            };
        });

        it('should format basic fields correctly', () => {
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value).to.equal(field.value);
            expect(args.typeId).to.equal(field.type);
            expect(args.metadata).to.equal(field.metadata);
        });

        it('Should format descriptor field correctly', () => {
            field.getFieldSemantics.returns('$$DESCRIPTOR');
            field.value = 'someTItle';
            field.href = 'somelink';
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value).to.deep.equal({
                descriptor: field.value,
                href: field.href
            });
            expect(args.typeId).to.equal(field.type);
            expect(args.metadata).to.equal(field.metadata);
        });

        it('Should format change order field correctly', () => {
            field.getFieldSemantics.returns('$$CHANGE_PENDING');
            field.value = {
                title: 'someTItle'
            };
            field.href = 'somelink';
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value).to.deep.equal({
                title: field.value.title,
                href: field.href
            });
            expect(args.typeId).to.equal(MockFieldTypes.NOOB);
            expect(args.metadata).to.equal(field.metadata);
        });

        it('Should format item number field correctly', () => {
            field.getFieldSemantics.returns('$$BOM_ITEM_NUMBER');
            field.value = {
                itemNumber: 1
            };
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value.itemNumber).to.equal('1');
            expect(args.typeId).to.equal(field.type);
            expect(args.metadata).to.equal(field.metadata);
        });

        it('Should format revision field correctly', () => {
            field.getFieldSemantics.returns('$$REVISION');
            field.value = 'A';
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value).to.deep.equal({
                title: field.value
            });
            expect(args.typeId).to.equal(BomFieldData.FieldTypes.SELECTION);
            expect(args.metadata).to.equal(field.metadata);
        });

        it('Should format pinning field correctly', () => {
            field.getFieldSemantics.returns('$$PINNING');
            field.value = 'true';
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value).to.deep.equal(field.value);
            expect(args.typeId).to.equal(MockFieldTypes.NOOB);
            expect(args.metadata).to.equal(field.metadata);
        });

        it('Should replace the value of revision field if it is WIP', () => {
            field.getFieldSemantics.returns('$$REVISION');
            field.value = 'WIP';
            let args = BomFieldData.buildFieldDataArgs(field);
            expect(args.value).to.deep.equal({
                title: $rootScope.bundle.revision.working
            });
            expect(args.typeId).to.equal(BomFieldData.FieldTypes.SELECTION);
            expect(args.metadata).to.equal(field.metadata);
        });
    });

    describe('[METHOD] formatRevisionValue', () => {
        it('formats the value correctly if a normal revision name is provided', () => {
            expect(BomFieldData.formatRevisionValue('A')).to.deep.equal({
                title: 'A'
            });
        });

        it('formats the value correctly if a revision named WIP is provided', () => {
            expect(BomFieldData.formatRevisionValue('WIP')).to.deep.equal({
                title: $rootScope.bundle.revision.working
            });
        });

        it('formats the value correctly if an empty revision value is provided', () => {
            expect(BomFieldData.formatRevisionValue('')).to.equal('');
        });
    });
});
