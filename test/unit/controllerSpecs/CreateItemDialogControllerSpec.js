'use strict';

/**
  * The basic unit tests for create item dialog.
  * This should be updated when we support full create.
  */
describe('CreateItemDialogController', function () {
	let controller = null;
	let $controllerConstructor = null;
	let rootScope = null;
	let scope = null;
	let state = null;
	let mdDialog = null;
	let timeout = null;
	let q = null;
	let eventService = null;
	let notificationService = null;
	let notificationTypes = null;
	let mockModelsManager = null;
	let mockWorkspaceObj = null;
	let mockItemObj = null;
	let mockWorkspacesList = null;
	let mockFieldTypes = null;
	let mockCreateTypes = null;
	let createType = null;
	let urnParser = null;
	let mockAffectedItemObj = null;
	let mockAffectedItemsObj = null;
	let mockAffectedItemsMetaObj = null;
	let mockViewAffectedItemsData = null;
	let mockViewAffectedItemsMetaData = null;
	let mockViewAffectedItemTransitionsData = null;

	let mockSaveResponse = sinon.stub({
		getFullList: function () {},
		location: 'api/v3/workspaces/9/items/2934'
	});

	let mockValidationUtil = sinon.stub({
		clearValidationErrors: function () {},
		mapValidationErrors: function () {}
	});

	mockSaveResponse.getFullList.returns({title: 'test title'});

	let mockSaveTypes = {
		save: 'Save & Close',
		saveCopy: 'Save & Copy',
		saveManage: 'Save & Manage',
		saveNew: 'Save & New',
		saveView: 'Save & View'
	};

	let mockFormFields = [{
		id: '\/api\/v3\/workspaces\/9\/sections\/18',
		displayName: 'Change Header',
		description: '',
		fields: [{
			__self__: '\/api\/v3\/workspaces\/9\/views\/1\/fields\/TITLE',
			name: 'Title',
			description: 'Test',
			type: {
				link: '\/api\/v3\/field-types\/4',
				title: 'Single Line Text',
				urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE.4',
				permissions: []
			},
			defaultValue: 'DEFAULT',
			unitOfMeasure: null,
			fieldLength: 50,
			fieldPrecision: null,
			displayOrder: 1,
			displayLength: 50,
			editability: 'ALWAYS',
			visibility: 'ALWAYS',
			derived: false,
			picklist: null,
			validators: '\/api\/v3\/workspaces\/9\/views\/1\/fields\/TITLE\/validators',
			value: '',
			visibleOnPreview: false,
			label: null,
			picklistFieldDefinition: null,
			metadata: {
				dataTypeId: 4,
				fieldTypeId: 4,
				nameKey: 'data.type.single.line',
				editFieldLength: true,
				editFieldPrecision: false,
				editDisplayLength: true,
				editCustomLookup: false,
				editEditable: true,
				editDefaultValue: true,
				editUOM: false,
				id: 4,
				selectionTypeDefault: false,
				title: 'Single Line Text'
			}
		}]
	}, {
		id: '\/api\/v3\/workspaces\/9\/sections\/21',
		displayName: 'Change Details',
		description: '',
		fields: []
	}];

	beforeEach(module(
		'plm360',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData',
		'plm360.permissions'
	));

	beforeEach(function () {
		inject(function (
			$controller,
			$rootScope,
			$httpBackend,
			$state,
			$mdDialog,
			$timeout,
			$q,
			UrnParser,
			EventService,
			NotificationService,
			NotificationTypes,
			PLMPermissions,
			MockModelsManager,
			MockWorkspaceObj,
			MockAffectedItemObj,
			MockAffectedItemsObj,
			MockAffectedItemsMetaObj,
			MockViewAffectedItemsData,
			MockViewAffectedItemsMetaData,
			MockViewAffectedItemTransitionsData,
			MockItemObj,
			MockItemData,
			MockLocalizationData,
			MockCreateTypes,
			MockFieldTypes
		) {
			rootScope = $rootScope;
			scope = rootScope.$new();
			$controllerConstructor = $controller;
			state = $state;
			mdDialog = $mdDialog;
			timeout = $timeout;
			q = $q;
			eventService = EventService;
			notificationService = NotificationService;
			notificationTypes = NotificationTypes;
			mockModelsManager = new MockModelsManager();
			mockWorkspaceObj = new MockWorkspaceObj();
			mockItemObj = new MockItemObj();
			mockCreateTypes = MockCreateTypes;
			mockFieldTypes = MockFieldTypes;
			urnParser = UrnParser;
			mockAffectedItemObj = new MockAffectedItemObj();
			mockAffectedItemsObj = new MockAffectedItemsObj();
			mockAffectedItemsMetaObj = new MockAffectedItemsMetaObj();
			mockViewAffectedItemsData = MockViewAffectedItemsData;
			mockViewAffectedItemsMetaData = MockViewAffectedItemsMetaData;
			mockViewAffectedItemTransitionsData = MockViewAffectedItemTransitionsData;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/dist/translations/localizationBundleGeneral.json')
				.respond(MockLocalizationData);
			$httpBackend.when('GET', 'lib/plm-notification/dist/notification.html')
				.respond(200);

			rootScope.bundle = MockLocalizationData;

			mockItemObj.associateAffectedItem.returns(q.when());
			mockItemObj.getItemTitle.returns('Item title');
			mockItemObj.getFullList.returns(MockItemData.createItemData);
			mockItemObj.getId.returns('2801');
			mockWorkspaceObj.getId.returns('8');
			mockWorkspacesList = [mockWorkspaceObj];

			mockViewAffectedItemsData = _.map(mockViewAffectedItemsData, function (affectedItem) {
				let mockAffectedItem = new MockAffectedItemObj(affectedItem);
				mockAffectedItem.json = affectedItem;
				mockAffectedItem.getObject.returns(affectedItem);
				mockAffectedItem.getLinkedFieldId.returns('EMAIL');
				mockAffectedItem.getId.returns('5763');
				return mockAffectedItem;
			});

			mockAffectedItemsObj.getFullList.returns(mockViewAffectedItemsData);
			mockAffectedItemsMetaObj.getFullList.returns(mockViewAffectedItemsMetaData);
			mockAffectedItemsMetaObj.getFieldId.returns('EMAIL');
			mockAffectedItemsMetaObj.getDataTypeId.returns('18');
			mockAffectedItemsMetaObj.getPicklistPayload.returns(q.when());

			createType = MockCreateTypes.CONTEXTUAL;

			controller = $controllerConstructor('CreateItemDialogController', {
				$rootScope: rootScope,
				$scope: scope,
				$state: state,
				$mdDialog: mdDialog,
				$q: q,
				ModelsManager: mockModelsManager,
				EventService: eventService,
				NotificationService: notificationService,
				NotificationTypes: notificationTypes,
				PLMPermissions: PLMPermissions,
				UrnParser: UrnParser,
				CurrentItem: mockItemObj,
				CurrentWorkspace: mockWorkspaceObj,
				AddWorkspaceList: mockWorkspacesList,
				FieldTypes: mockFieldTypes,
				CreateTypes: mockCreateTypes,
				createType: createType,
				ValidationUtil: mockValidationUtil
			});

			controller.formFields = mockFormFields;
		});
	});

	it('intializes the variables properly', function () {
		expect(controller.currentItem).to.equal(mockItemObj);
		expect(controller.currentWorkspace).to.equal(mockWorkspaceObj);
		expect(controller.workspacesList).to.equal(mockWorkspacesList);
		expect(controller.createType).to.equal(createType);
	});

	it('initializes the flag and filter for in-contextual create', function () {
		expect(controller.isContextualCreate).to.be.true;
		expect(controller.isQuickCreate).to.be.false;
		expect(controller.filterToApply).to.be.function;
		expect(controller.filterToApply.toString()).to.not.contain.string('requiredFieldsFilter');
	});

	it('initializes the flag and filter for quick create', function () {
		createType = mockCreateTypes.QUICK;

		controller = $controllerConstructor('CreateItemDialogController', {
			$rootScope: rootScope,
			$scope: scope,
			CurrentItem: mockItemObj,
			CurrentWorkspace: mockWorkspaceObj,
			AddWorkspaceList: mockWorkspacesList,
			CreateTypes: mockCreateTypes,
			createType: createType
		});

		expect(controller.isContextualCreate).to.be.false;
		expect(controller.isQuickCreate).to.be.true;
		expect(controller.filterToApply).to.be.function;
		expect(controller.filterToApply.toString()).to.contain.string('requiredFieldsFilter');
	});

	it('hides the dialog upon triggering close', function () {
		let spy = sinon.spy(mdDialog, 'hide');

		controller.close();

		expect(spy.called).to.be.true;
	});

	it('enables the save button by default if there are no fields', function () {
		controller.formFields = [];

		expect(controller.formFields).to.be.empty;
		expect(controller.isSaveDisabled()).to.be.false;
	});

	it('disables the save button by default if there are fields', function () {
		controller.formFields = mockFormFields;

		expect(controller.isFormFilled()).to.be.false;
		expect(controller.isSaveDisabled()).to.be.true;
	});

	it('resets field values back to default upon clearing', function () {
		expect(controller.formFields[0].fields[0].value).to.equal('');
		expect(controller.formFields[0].fields[0].defaultValue).to.equal('DEFAULT');

		controller.clearFields();

		expect(controller.formFields[0].fields[0].value).to.equal('DEFAULT');
		expect(controller.formFields[0].fields[0].defaultValue).to.equal('DEFAULT');
	});

	it('changes the save type accordingly', function () {
		let saveSpy = sinon.spy(controller, 'save');
		let saveCloseSpy = sinon.spy(controller, 'saveAndClose');
		let saveCopySpy = sinon.spy(controller, 'saveAndCopy');
		let saveManageSpy = sinon.spy(controller, 'saveAndManage');
		let saveNewSpy = sinon.spy(controller, 'saveAndNew');
		let saveViewSpy = sinon.spy(controller, 'saveAndView');

		controller.onSaveChange();
		expect(saveSpy.called).to.be.true;

		controller.selectedSaveType = mockSaveTypes.save;
		controller.onSaveChange();
		expect(saveCloseSpy.called).to.be.true;

		controller.selectedSaveType = mockSaveTypes.saveCopy;
		controller.onSaveChange();
		expect(saveCopySpy.called).to.be.true;

		controller.selectedSaveType = mockSaveTypes.saveManage;
		controller.onSaveChange();
		expect(saveManageSpy.called).to.be.true;

		controller.selectedSaveType = mockSaveTypes.saveNew;
		controller.onSaveChange();
		expect(saveNewSpy.called).to.be.true;

		controller.selectedSaveType = mockSaveTypes.saveView;
		controller.onSaveChange();
		expect(saveViewSpy.called).to.be.true;
	});

	it('closes the dialog after saving successfully for \'Save & Close\'', function () {
		let closeSpy = sinon.spy(controller, 'close');
		let stub = sinon.stub(controller, 'save');
		let promise = Promise.resolve([true, false]);
		stub.returns(promise);

		controller.saveAndClose();

		eventService.send('itemInstance:newItem:saveDone', mockSaveResponse, true);
		eventService.send('itemInstance:9@2934:done', mockItemObj);
		expect(controller.createdItemObj).to.be.defined;

		return promise.then(function () {
			expect(closeSpy.called).to.be.true;
		});
	});

	it('clears the fields after saving successfully for \'Save & New\'', function () {
		let promise = Promise.resolve();
		sinon.spy(controller, 'clearFields');
		sinon.stub(controller, 'save');
		controller.save.returns(promise);

		controller.saveAndNew();

		return promise.then(function () {
			expect(controller.clearFields).to.be.called;
		});
	});

	it('goes to the new item after saving successfully for \'Save & View\'', function () {
		let saveSpy = sinon.spy(controller, 'save');
		let goSpy = sinon.spy(state, 'go');
		let deferred = q.defer();

		controller.saveAndView();
		expect(saveSpy.called).to.be.true;

		eventService.send('itemInstance:newItem:saveDone', mockSaveResponse, true);
		mockItemObj.getWorkspaceObj.returns({
			getId: sinon.stub()
		});
		eventService.send('itemInstance:9@2934:done', mockItemObj);
		expect(controller.createdItemObj).to.be.defined;

		deferred.promise.then(function () {
			expect(goSpy).to.be.calledOnce;
			expect(goSpy).to.be.calledWith('details');
		});

		deferred.resolve(mockItemObj);
		scope.$digest();
	});

	it('adds the current item to the managed tab after saving successfully for \'Save & Manage\'', function () {
		sinon.stub(controller, 'save');
		sinon.stub(controller, 'addItem');
		sinon.stub(controller, 'clearFields');
		sinon.stub(controller, 'createManagedItemFormObj');

		controller.save.returns(Promise.resolve({
			getFullList: function () {
				return {
					title: 'test title'
				};
			}
		}));
		controller.addItem.returns(Promise.resolve());
		controller.createManagedItemFormObj.returns(Promise.resolve());

		let promise = controller.saveAndManage();

		return promise.then(function () {
			expect(controller.clearFields).to.be.called;
			expect(controller.isManagedView).to.be.true;
			expect(controller.managedViewHeading).to.equal('test title');
		});
	});

	it('views the managed tab after saving and adding successfully for \'Manage & View\'', function () {
		sinon.stub(controller, 'manage');
		sinon.spy(state, 'go');

		controller.createdItemObj = {
			getFullList: function () {
				return {
					urn: 'test urn'
				};
			},
			getWorkspaceObj: function () {
				return {
					getId: sinon.stub()
				};
			}
		};
		let promise = q.when();
		controller.manage.returns(promise);

		controller.manageAndView();
		scope.$digest();

		expect(state.go).to.be.calledOnce;
		expect(state.go).to.be.calledWith('affected-items');
	});

	it('validation error while saving a new item', function () {
		mockValidationUtil.clearValidationErrors.returns();
		mockValidationUtil.mapValidationErrors.returns();

		let mockErrorResponse = {
			data: [
				{code: 'errors.long'},
				{code: 'errors.float.precision'}
			],
			status: 400,
			statusText: 'Bad Request'
		};

		let promise = controller.save();

		eventService.send('itemInstance:newItem:saveDone', mockErrorResponse, false);

		scope.$digest();

		expect(promise).to.be.rejected;
	});

	describe('[canSaveManagedItem]', function () {
		it('indicates dirty state if form values are changed', function () {
			controller.managedItemFormObj = {
				to: {},
				lifecycle: {
					value: {value: 'New', link: 'New'},
					originalValue: {value: 'Old', link: 'Old'}
				},
				effectivity: {}
			};

			let canSave = controller.canSaveManagedItem();
			expect(canSave).to.be.true;
		});

		it('indicates non-dirty state if form values are not changed', function () {
			controller.managedItemFormObj = {
				to: {},
				lifecycle: {
					value: {value: 'Old', link: 'Old'},
					originalValue: {value: 'Old', link: 'Old'}
				},
				effectivity: {
					value: 'Old',
					originalValue: 'Old'
				}
			};

			let canSave = controller.canSaveManagedItem();
			expect(canSave).to.be.false;
		});

		it('checks that the \'To\' field is editable', function () {
			controller.managedItemFormObj = {
				to: {
					edit: true,
					value: 'A',
					originalValue: ''
				},
				lifecycle: {
					value: {value: 'Old', link: 'Old'},
					originalValue: {value: 'Old', link: 'Old'}
				}
			};

			let canSave = controller.canSaveManagedItem();
			expect(canSave).to.be.true;
		});
	});

	it('creates a form object from managed item model object', function () {
		controller.createdItemObj = mockItemObj;
		controller.createManagedItemFormObj().then(function (formObj) {
			expect(formObj.item.value).to.equal(mockViewAffectedItemsData[0].getObject().item.title + ' ' + mockViewAffectedItemsData[0].getObject().item.version);
			expect(formObj.lifecycle.selectedTransition.name).to.equal(mockViewAffectedItemsData[0].getObject().targetTransition.title);
		});

		let revisioningItemEncodedURN = urnParser.encode(controller.createdItemObj.getFullList().urn);
		let encodedURN = urnParser.encode(mockViewAffectedItemsData[0].json.urn);

		eventService.send('affectedItemsMeta:' + revisioningItemEncodedURN + ':done', mockAffectedItemsMetaObj);
		eventService.send('affectedItems:' + revisioningItemEncodedURN + ':done', mockAffectedItemsObj);
		eventService.send('affectedItem:' + encodedURN + ':done', mockViewAffectedItemsData[0]);
		eventService.send('affectedItemTransitions:' + mockViewAffectedItemsData[0].getId() + ':done', mockViewAffectedItemTransitionsData);

		scope.$digest();
	});

	describe('[Notifications]', function () {
		it('adds a success notification for \'Save & Close\'', function () {
			sinon.spy(notificationService, 'addNotification');
			sinon.spy(controller, 'save');
			let deferred = q.defer();

			controller.saveAndClose();

			eventService.send('itemInstance:newItem:saveDone', mockSaveResponse, true);
			eventService.send('itemInstance:9@2934:done', mockItemObj);

			expect(notificationService.addNotification).to.be.calledWith(
				'success',
				'Item title - Created Successfully'
			);
		});

		it('adds a success notification for \'Save & View\'', function () {
			sinon.spy(notificationService, 'addNotification');
			sinon.spy(controller, 'save');
			let deferred = q.defer();

			controller.saveAndView();

			eventService.send('itemInstance:newItem:saveDone', mockSaveResponse, true);
			eventService.send('itemInstance:9@2934:done', mockItemObj);
			expect(notificationService.addNotification).to.be.calledWith(
				'success',
				'Item title - Created Successfully'
			);
		});

		it('adds an error notification when saving a new item', function () {
			sinon.spy(notificationService, 'addNotification');
			mockValidationUtil.clearValidationErrors.returns();
			mockValidationUtil.mapValidationErrors.returns();

			let mockErrorResponse = {
				data: [
					{code: 'errors.long'},
					{code: 'errors.float.precision'}
				],
				status: 400,
				statusText: 'Bad Request'
			};

			controller.save();

			eventService.send('itemInstance:newItem:saveDone', mockErrorResponse, false);
			expect(notificationService.addNotification).to.be.calledWith(
				'error',
				'2 Errors - Please fix the errors below to save the item.'
			);
		});
	});
});
