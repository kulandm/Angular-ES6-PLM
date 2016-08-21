'use strict';

describe('[MODEL] ViewDefinition', () => {
	// Model Handle
	let ViewDefinition, viewDef;

	let $rootScope, EventService, UrnParser, mockRESTWrapperService, mockBomMessageService, MockViewDefinitionFieldObj, mockViewDefinitionData, mockPromiseStubber;

	// mock data container
	let mockDataSet, mockBomUIFieldSemantics;

	let bomField, notBomField;

	let sandbox = sinon.sandbox.create();

	beforeEach(module(
		'com/autodesk/EventService.js',
		'com/autodesk/UrnParser.js',
		'com/autodesk/models/bomViewDefinition/viewDefinition.model.js',
		'plm360.mockObjects', 'plm360.mockData',
		($provide) => {
			$provide.value('RESTWrapperService', {
				get: () => {}
			});
			$provide.value('BomMessageService', {
				getViewDefFieldRecievedMessage: (urn) => {
					return `mockViewDefinitionField:${urn}:done`;
				},
				getViewDefFieldGetMessage: (urn) => {
					return `mockViewDefinitionField:${urn}:get`;
				}
			});
		}
	));

	beforeEach(() => {
		// Inject services and values that will be used
		inject((_$rootScope_, _RESTWrapperService_, _BomMessageService_, _EventService_, _UrnParser_, _ViewDefinition_, _MockViewDefinitionFieldObj_, MockViewDefinitionData, MockPromiseStubber, _MockBomUIFieldSemantics_) => {
			ViewDefinition = _ViewDefinition_;
			$rootScope = _$rootScope_;
			EventService = _EventService_;
			UrnParser = _UrnParser_;
			mockRESTWrapperService = _RESTWrapperService_;
			mockBomMessageService = _BomMessageService_;
			MockViewDefinitionFieldObj = _MockViewDefinitionFieldObj_;

			mockPromiseStubber = MockPromiseStubber;
			mockBomUIFieldSemantics = _MockBomUIFieldSemantics_;
			mockViewDefinitionData = MockViewDefinitionData;
			mockDataSet = mockViewDefinitionData;
		});

		viewDef = new ViewDefinition(mockDataSet.basicData);

		bomField = new MockViewDefinitionFieldObj();
		bomField.getUrn.returns(mockDataSet.basicData.fields[0].urn);
		bomField.isBomField.returns(true);
		bomField.getDisplayOrder.returns(2);

		notBomField = new MockViewDefinitionFieldObj();
		notBomField.getUrn.returns(mockDataSet.basicData.fields[1].urn);
		notBomField.isBomField.returns(false);
		notBomField.getDisplayOrder.returns(1);

		viewDef.fieldsArray = [notBomField, bomField];

		let fields = new Map();
		fields.set(bomField.getUrn(), bomField);
		fields.set(notBomField.getUrn(), notBomField);
		viewDef.fieldsMap = fields;
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('[METHOD] getLink', () => {
		it('Should return the correct value', () => {
			expect(viewDef.getLink()).to.equal(mockDataSet.basicData.__self__.link);
		});
	});

	describe('[METHOD] getUrn', () => {
		it('Should return the correct value', () => {
			expect(viewDef.getUrn()).to.equal(mockDataSet.basicData.__self__.urn);
		});
	});

	describe('[METHOD] getTitle', () => {
		it('Should return the correct value', () => {
			expect(viewDef.getTitle()).to.equal(mockDataSet.basicData.name);
		});
	});

	describe('[METHOD] isDefaultView', () => {
		it('Should return true if the view is default', () => {
            expect(viewDef.isDefaultView()).to.be.true;
        });

        it('Should return false if the view is not default', () => {
            let notDefaultView = new ViewDefinition(mockDataSet.notDefault);
            expect(notDefaultView.isDefaultView()).to.be.false;
        });
	});

	describe('[METHOD] hasAttachmentField', () => {
	    let fieldA, fieldB, getFieldsStub;
	    beforeEach(() => {
	        fieldA = {
	            getFieldSemantics: sinon.stub()
	        };
	        fieldB = {
	            getFieldSemantics: sinon.stub()
	        };
	        let fieldsArray = [fieldA, fieldB];
	        getFieldsStub = sandbox.stub(viewDef, 'getFields').returns(fieldsArray);
	    });

	    it('Should return false if the view does not have attachment', () => {
	        expect(viewDef.hasAttachmentField()).to.be.false;
	    });
	    it('Should return true if the view has attachment', () => {
	        fieldA.getFieldSemantics.returns(mockBomUIFieldSemantics.ATTACHMENTS);
	        expect(viewDef.hasAttachmentField()).to.be.true;
	    });
	});

	describe('[METHOD] getFieldWithSemantics', () => {
	    let fieldA, fieldB, getFieldsStub;

	    beforeEach(() => {
	        fieldA = {
	            getFieldSemantics: sinon.stub().returns(mockBomUIFieldSemantics.BOM_ITEM_NUMBER)
	        };
	        fieldB = {
	            getFieldSemantics: sinon.stub().returns(mockBomUIFieldSemantics.ATTACHMENTS)
	        };
	        let fieldsArray = [fieldA, fieldB];
	        getFieldsStub = sandbox.stub(viewDef, 'getFields').returns(fieldsArray);
	    });

	    it('Should get the field with the provided semantics from the ViewDefinition', () => {
	        let itemNumberField = viewDef.getFieldWithSemantics(mockBomUIFieldSemantics.BOM_ITEM_NUMBER);
	        expect(itemNumberField).to.equal(fieldA);

	        let attachmentField = viewDef.getFieldWithSemantics(mockBomUIFieldSemantics.ATTACHMENTS);
	        expect(attachmentField).to.equal(fieldB);
	    });
	});

	describe('[METHOD] getFields', () => {
		it('Should return an array of the fields', () => {
			let fields = viewDef.getFields();
			expect(fields.length).to.equal(2);
			expect(fields[0]).to.equal(notBomField);
			expect(fields[1]).to.equal(bomField);
		});
	});

	describe('[METHOD] getEdgeFields', () => {
		it('Should return an array of the bom fields', () => {
			let fields = viewDef.getEdgeFields();
			expect(fields.length).to.equal(1);
			expect(fields[0]).to.equal(bomField);
		});
	});

	describe('[METHOD] getNodeFields', () => {
		it('Should return an array of the fields that are not bom fields', () => {
			let fields = viewDef.getNodeFields();
			expect(fields.length).to.equal(1);
			expect(fields[0]).to.equal(notBomField);
		});
	});

	describe('[METHOD] loadFields', () => {
		it('Should load all the fields, and provided them in order', () => {
			let loadedBomFieldMessage = mockBomMessageService.getViewDefFieldRecievedMessage(bomField.getUrn());
			let loadedNotBomFieldMessage = mockBomMessageService.getViewDefFieldRecievedMessage(notBomField.getUrn());

			let response = viewDef.loadFields();
			EventService.send(loadedBomFieldMessage, bomField);
			EventService.send(loadedNotBomFieldMessage, notBomField);
			$rootScope.$apply();

			let fields = viewDef.getFields();
			expect(fields.length).to.equal(2);
			expect(fields[0]).to.equal(notBomField);
			expect(fields[1]).to.equal(bomField);
		});
	});

    describe('[METHOD] fetch', () => {
        it('Should return an instance of ViewDefinition with the correct properties', () => {
            let link = 'linkToViewDefinition';
            mockPromiseStubber.stubWithSuccess(mockRESTWrapperService, 'get', mockDataSet.basicData, [link, sinon.match.any, sinon.match.any, sinon.match.any]);
			mockPromiseStubber.stubWithSuccess(ViewDefinition.prototype, 'loadFields', null);

            let view = ViewDefinition.fetch(link);
            expect(view.getLink()).to.equal(mockDataSet.basicData.__self__.link);
        });
    });
});
