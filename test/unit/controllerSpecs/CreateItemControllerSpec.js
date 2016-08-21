'use strict';

/**
  * The basic unit tests for create item. This should be updated when we will support full create.
  */
describe('CreateItemController', function () {
	var $controller = null;
	var controller = null;
	var $rootScope = null;
	var scope = null;
	var $log = null;
	var $q = null;
	var EventService = null;
	var FlyoutService = null;
	var mockModelsManager = null;
	var mockWorkspaceObj = null;
	var mockItemObj = null;
	var mockWorkspaceData = null;
	var mockViewDetailsFieldsData = null;
	var mockCreateTypes = null;

	beforeEach(module(
		'plm360',
		'com/autodesk/flyout.js',
		'plm360.models',
		'plm360.mockData',
		'plm360.mockObjects',
		'plm360.permissions'
	));

	beforeEach(function () {
		inject(function (
			_$controller_,
			_$rootScope_,
			$httpBackend,
			_$log_,
			_$q_,
			_EventService_,
			_FlyoutService_,
			MockModelsManager,
			MockWorkspaceObj,
			MockItemObj,
			MockWorkspaceData,
			MockViewDetailsFieldsData,
			MockLocalizationData,
			MockCreateTypes
		) {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			scope = $rootScope.$new();
			$log = _$log_;
			$q = _$q_;

			$httpBackend.expect('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json')
				.respond(MockLocalizationData);

			mockModelsManager = new MockModelsManager();
			mockWorkspaceObj = new MockWorkspaceObj();
			mockItemObj = new MockItemObj();

			mockWorkspaceData = MockWorkspaceData;
			mockViewDetailsFieldsData = MockViewDetailsFieldsData;
			mockCreateTypes = MockCreateTypes;
			EventService = _EventService_;
			FlyoutService = _FlyoutService_;

			scope.createType = mockCreateTypes.CONTEXTUAL;
			scope.selectedWorkspace = mockWorkspaceObj;
			scope.selectedWorkspace.getId.returns('111');
			scope.unsupportedFields = {
				hasUnsupported: false
			};

			mockWorkspaceObj.getFullList.returns(mockWorkspaceData[0]);
			mockWorkspaceObj.getViewDetailsFieldsData.returns($q.when(mockViewDetailsFieldsData));

			controller = $controller('CreateItemController', {
				$rootScope: $rootScope,
				$scope: scope,
				$log: $log,
				ModelsManager: mockModelsManager,
				EventService: EventService,
				FlyoutService: FlyoutService,
				CreateTypes: mockCreateTypes
			});
		});
	});

	it('initialises the in-contextual create type properly', function () {
		expect(controller.contextualCreate).to.be.true;
		expect(controller.quickCreate).to.be.false;
	});

	it('fetches the fields based on the selected workspace', function () {
		expect(controller.workspaceId).to.equal('111');

		EventService.send('workspaceInstance:111:done', mockWorkspaceObj);
		scope.$digest();
		expect(scope.formFields).to.equal(mockViewDetailsFieldsData);
	});

	it('initialises field variables if field meta data is defined', function () {
		EventService.send('workspaceInstance:111:done', mockWorkspaceObj);
		scope.$digest();

		var fields = scope.formFields[0].fields[0];
		var mockFieldMetadata = mockViewDetailsFieldsData[0].fields[0].fieldMetadata;
		
		expect(fields.options).to.equal(mockFieldMetadata.picklistPayload);
		expect(fields.metadata).to.equal(mockFieldMetadata);
		expect(fields.metadata.dataTypeId).to.equal(23); // dataTypeId must be an integer
		expect(fields.value).to.equal('');
	});
	
	it('initialises field variables inside a matrix if present', function () {
		EventService.send('workspaceInstance:111:done', mockWorkspaceObj);
		scope.$digest();

		var fields = scope.formFields[3].fields[0];
		
		expect(fields.type).to.equal('MATRIX');
		expect(fields.definition.fields).to.have.length(2);
		expect(fields.definition.fields[0]).to.have.length(2);
		expect(fields.definition.fields[1]).to.have.length(2);
	});

	it('throws an error when no fields are fetched', function () {
		mockWorkspaceObj.getViewDetailsFieldsData.returns($q.reject({}));
		EventService.send('workspaceInstance:111:done', mockWorkspaceObj);
		scope.$digest();

		expect($log.error.logs[0]).to.contain('Problem fetching field definitions for workspace 111.');
	});

	it('sets default value as value for a field, if any', function () {
		var editedViewDetailsFieldsData = mockViewDetailsFieldsData;
		editedViewDetailsFieldsData[0].fields[0].fieldMetadata.defaultValue = 'default';
		editedViewDetailsFieldsData[0].fields[0].fieldMetadata.picklist = null;
		mockWorkspaceObj.getViewDetailsFieldsData.returns($q.when(editedViewDetailsFieldsData));

		EventService.send('workspaceInstance:111:done', mockWorkspaceObj);
		scope.$digest();

		var fields = scope.formFields[0].fields[0];
		var mockFieldMetadata = mockViewDetailsFieldsData[0].fields[0].fieldMetadata;

		expect(fields.value).to.equal('default');
	});

	it('parses the field link to get field ID', function () {
		expect(controller.parseTypeId('/api/v3/field-types/11')).to.equal('11');
	});
	
	it('checks for a section visibility being true when containing at least 1 field', function () {
		expect(controller.parseSectionVisibility(mockViewDetailsFieldsData, mockViewDetailsFieldsData[1])).to.be.true;
	});
	
	it('checks for the section visibility being false when containing no fields', function () {
		expect(controller.parseSectionVisibility(mockViewDetailsFieldsData, mockViewDetailsFieldsData[2])).to.be.false;
	});
	
	it('checks for the correct section index being set', function () {
		controller.parseSectionVisibility(mockViewDetailsFieldsData, mockViewDetailsFieldsData[1]);
		
		expect(controller.sectionIndex).to.equal(2);
	});
	
	it('checks for locked state of sections', function () {
		expect(controller.isSectionEditable(mockViewDetailsFieldsData[0])).to.be.true;
		expect(controller.isSectionEditable(mockViewDetailsFieldsData[2])).to.be.false;
	});

	it('changes the selected workspace', function () {
		expect(scope.selectedWorkspace.getId()).to.equal('111');

		mockWorkspaceObj.getId.returns('200');
		controller.onWorkspaceChange(mockWorkspaceObj);
		scope.$digest();

		expect(scope.selectedWorkspace.getId()).to.equal('200');
	});
});
