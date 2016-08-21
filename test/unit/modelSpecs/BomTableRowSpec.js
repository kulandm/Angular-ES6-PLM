'use strict';

describe('[MODEL] BomTableRow', () => {
    let BomTableRow, row, mockRevisionsData;

    beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

    beforeEach(() => {
        inject((MockRevisionsData) => {
            mockRevisionsData = MockRevisionsData.basicData;
        });

        BomTableRow = System.get('com/autodesk/models/bomTable/bomTableRow.model.js').default;

        row = new BomTableRow();
    });

    describe('[METHOD] getFields', () => {
        it('Should return the properties as an array', () => {
            row.displayProperties = {
                x: '1',
                y: '2',
                z: '3'
            };

            expect(row.getFields().length).to.equal(3);
        });
    });

    describe('[METHOD] processFields', () => {
        it('Should update the fieldsWithErrors map', () => {
            let fields = [{
                id: '1',
                serverError: 'err'
            }, {
                id: '2',
                serverError: 'err'
            }, {
                id: '3',
                serverError: 'err'
            }];
            row.fieldsWithErrors.add(fields[0]);
            row.fieldsWithErrors.add(fields[1]);

            let getFieldsStub = sinon.stub(row, 'getFields');
            getFieldsStub.returns(fields);

            fields[0].serverError = null;
            row.processFields();

            expect(row.fieldsWithErrors.has(fields[0])).to.be.false;
            expect(row.fieldsWithErrors.has(fields[1])).to.be.true;
            expect(row.fieldsWithErrors.has(fields[2])).to.be.true;

            getFieldsStub.restore();
        });
    });

    describe('[METHOD] clearRowErrors', () => {
        it('Should clear the errors', () => {
            row.rowErrors = [{}, {}];

            row.clearRowErrors();

            expect(row.rowErrors.length).to.equal(0);
        });
    });

    describe('[METHOD] addRowErrors', () => {
        it('Should add the errors', () => {
            row.rowErrors = [{}, {}];

            row.addRowErrors([{}, {}]);

            expect(row.rowErrors.length).to.equal(4);
        });
    });

    describe('[METHOD] hasErrors', () => {
        it('Should return true if there are row errors', () => {
            row.rowErrors = [{}, {}];
            expect(row.hasErrors()).to.be.true;
        });

        it('Should return true if there are row errors and field errors', () => {
            row.rowErrors = [{}, {}];
            row.fieldsWithErrors.add({});
            expect(row.hasErrors()).to.be.true;
        });

        it('Should return true if there are no row errors and field errors', () => {
            row.fieldsWithErrors.add({});
            expect(row.hasErrors()).to.be.true;
        });

        it('Should return flase if there are no row errors and not field errors', () => {
            expect(row.hasErrors()).to.be.false;
        });
    });

    describe('[METHOD] updateRevisionField', () => {
        let semanticsStub;
        beforeEach(() => {
            semanticsStub = sinon.stub(row, 'getFieldWithSemantics');
        });

        afterEach(() => {
            semanticsStub.restore();
        });

        it('Should do nothing if the revision field does not exist', () => {
            semanticsStub.returns(null);
            row.updateRevisionField(mockRevisionsData.versions);
        });

        it('Should assign the provided versions as options on the revision field and update the value', () => {
            let field = {
                value: {
                    title: mockRevisionsData.versions[1].version
                }
            };
            semanticsStub.returns(field);

            row.updateRevisionField(mockRevisionsData.versions);

            expect(field.options.length).to.equal(mockRevisionsData.versions.length);
            mockRevisionsData.versions.forEach((version, index) => {
                expect(field.options[index].title, `version${version.versionNumber} version title`).to.equal(version.version);
                expect(field.options[index].version, `version${version.versionNumber} version object`).to.equal(version);
            });

            expect(field.value).to.equal(field.options[1]);
        });
    });

    describe('[METHOD] hasLoadedRevisions', () => {
        let semanticsStub;
        beforeEach(() => {
            semanticsStub = sinon.stub(row, 'getFieldWithSemantics');
        });

        afterEach(() => {
            semanticsStub.restore();
        });

        it('Should return false if there is no revision field', () => {
            semanticsStub.returns(null);
            expect(row.hasLoadedRevisions()).to.be.false;
        });

        it('Should return false if there is a revision field with no revisions', () => {
            let field = {};
            semanticsStub.returns(field);
            expect(row.hasLoadedRevisions()).to.be.false;
        });

        it('Should return false if there is a revision field with loaded revisions', () => {
            let field = {
                options: ['revA']
            };
            semanticsStub.returns(field);
            expect(row.hasLoadedRevisions()).to.be.true;
        });
    });
});
