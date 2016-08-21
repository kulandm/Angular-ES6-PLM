'use strict';

describe('[CONTROLLER] ViewBomController', function () {

	// Controller Under Test Handle
	var viewBomController = null;

	// Service Injection Handles
	var $controller = null;
	var $httpBackend = null;
	var $scope = null;
	var $rootScope = null;
	var $compile = null;
	var $state = null;
	var $stateParams = null;
	var $location = null;
	var LinkableItem = null;
	var EventService = null;
	var FlyoutService = null;
	var RESTWrapperService = null;
	var PLMPermissions = null;
	var MockModelsManager = null;
	var $provide = null;
	var BomDataController = null;
	var BomTable = null;
	var BomExporter = null;

	// Mock Object Handles
	var mockModelsManager = null;
	var mockItemObj = null;
	var mockUserObj = null;
	var relatedWorkspacesObj = null;
	var mockEnabledFeatures = null;
	var mockUserPermissionsObj = null;
	var mockLocationObj = null;
	var mockViewDefinitionObj = null;
	var mockGridApiObj = null;
	var mockLinkableItemObj = null;
	var mockLinkableItemsObj = null;
	var mockBomPathObj = null;
	var mockAddableLinkableItemsList = null;
	var mockUnaddableLinkableItemsList = null;
	var mockBomAddItemSuccessResponse = null;
	var mockLocalUserStorageService = null;

	// Mock Data Handles
	var mockItemData = null;
	var mockBomAddItemErrorData = null;
	var mockLocationSearchResult = null;
	var mockBomChangeCompiledData = null;
	var mockCompiledChangeDataWithErrors = null;
	var mockBomChangeTypeData = null;
	var mockBomChangeListTypeData = null;
	var mockBomChangeData = null;
	var mockBomChangeListTypeData = null;

	let mockViewDefinitionData = null;
	let mockViewDefinitionFieldData = null;

	let MockViewDefinitionsObj = null;
	let MockViewDefinitionObj = null;
	let MockViewDefinitionFieldObj = null;

	// Load the modules used by the controller
	beforeEach(module('com/autodesk/EventService.js', 'plm360', 'plm360.permissions', 'plm360.models', 'plm360.mockData', 'plm360.mockObjects'));

	beforeEach(module(($provide) => {
		$provide.value('moment', moment);
	}));

	/**
	 * Setup for each test cases
	 */
	beforeEach(function () {
		inject(function ($injector, _$controller_, _$location_, _$rootScope_, _$compile_, _$state_, _$stateParams_, _EventService_, _FlyoutService_, _$httpBackend_, _LinkableItem_, _PLMPermissions_, _BomDataController_, _BomTable_, _BomExporter_, MockModelsManager, MockLocalizationData, MockBomChangeData, MockItemObj, MockItemData, MockBomLinkableItemsData, MockViewDefinitionData, MockBomAddItemSuccessResponse, MockBomAddItemErrorData, MockGridApiObj, MockLocationObj, MockLinkableItemObj, MockLinkableItemsObj, MockUserPermissionsObj, MockUserObj, MockBomChangeCompiledData, MockBomPathObj, MockCompiledChangeDataWithErrors, MockBomChangeTypeData, MockBomChangeListTypeData) {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			$state = _$state_;
			$scope = $rootScope.$new();
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			EventService = _EventService_;
			FlyoutService = _FlyoutService_;

			LinkableItem = _LinkableItem_;
			$compile = _$compile_;
			PLMPermissions = _PLMPermissions_;
			$location = _$location_;
			BomDataController = _BomDataController_;
			BomTable = _BomTable_;
			BomExporter = _BomExporter_;

			// Set Mock Data Handles
			mockItemData = MockItemData;
			mockBomAddItemErrorData = MockBomAddItemErrorData;
			mockBomAddItemSuccessResponse = MockBomAddItemSuccessResponse;
			mockBomChangeCompiledData = MockBomChangeCompiledData;
			mockBomChangeData = MockBomChangeData;
			mockCompiledChangeDataWithErrors = MockCompiledChangeDataWithErrors;
			mockBomChangeTypeData = MockBomChangeTypeData;
			mockBomChangeListTypeData = MockBomChangeListTypeData;

			// Create Mock Objects
			mockModelsManager = new MockModelsManager();
			mockItemObj = new MockItemObj();
			mockUserPermissionsObj = new MockUserPermissionsObj();

			mockUserObj = new MockUserObj();
			mockUserObj.getDateFormat.returns('dd/mm/yyyy');

			mockGridApiObj = new MockGridApiObj();
			mockLocationObj = new MockLocationObj();
			mockLinkableItemObj = new MockLinkableItemObj();
			mockBomPathObj = new MockBomPathObj();

			// View definitions
			mockViewDefinitionData = $injector.get('MockViewDefinitionData');
			mockViewDefinitionFieldData = $injector.get('MockViewDefinitionFieldData');

			MockViewDefinitionsObj = $injector.get('MockViewDefinitionsObj');
			MockViewDefinitionObj = $injector.get('MockViewDefinitionObj');
			MockViewDefinitionFieldObj = $injector.get('MockViewDefinitionFieldObj');

			mockViewDefinitionObj = new MockViewDefinitionObj();
			mockViewDefinitionObj.getId.returns(mockViewDefinitionData.basicData.id);
			mockViewDefinitionObj.getTitle.returns(mockViewDefinitionData.basicData.name);

			let field1 = new MockViewDefinitionFieldObj();
			let field2 = new MockViewDefinitionFieldObj();
			field1.getName.returns(mockViewDefinitionFieldData.systemField.name);
			field1.getTypeId.returns(4);
			field1.getUrn.returns(mockViewDefinitionFieldData.systemField.__self__.urn);
			field1.getFieldSemantics.returns('$$DESCRIPTOR');
			field2.getName.returns(mockViewDefinitionFieldData.itemDetailsField.name);
			field2.getTypeId.returns(28);
			field2.getUrn.returns(mockViewDefinitionFieldData.itemDetailsField.__self__.urn);
			field2.getFieldSemantics.returns('$$BASIC');

			mockViewDefinitionObj.getField.withArgs(mockViewDefinitionFieldData.systemField.__self__.urn).returns(field1);
			mockViewDefinitionObj.getField.withArgs(mockViewDefinitionFieldData.itemDetailsField.__self__.urn).returns(field2);
			mockViewDefinitionObj.getFields.returns([field1, field2]);
			mockViewDefinitionObj.getEdgeFields.returns([field1]);
			mockViewDefinitionObj.getNodeFields.returns([field2]);

			mockAddableLinkableItemsList = MockBomLinkableItemsData.itemLists[0].map(function (item) {
				item.ref = new LinkableItem(item.ref.json);
				return item;
			});
			mockUnaddableLinkableItemsList = MockBomLinkableItemsData.itemLists[1].map(function (item) {
				item.ref = new LinkableItem(item.ref.json);
				return item;
			});

			mockLocationSearchResult = {
				itemId: 'urn`adsk,plm`tenant,workspace,item`DEVINDMACHINEVIEW,8,2887',
				tab: '',
				view: '',
				mode: 'view'
			};
			mockLocationObj.search.returns(mockLocationSearchResult);

			mockEnabledFeatures = {
				fetch: sinon.stub(),
				getDisplayableData: sinon.stub()
			};
			mockEnabledFeatures.getDisplayableData.returns({
				data: []
			});

			relatedWorkspacesObj = {
				getFullList: sinon.stub()
			};
			relatedWorkspacesObj.getFullList.returns([]);

			// Populate some mock data on objects
			$rootScope.bundle = MockLocalizationData;
			$stateParams = {
				workspaceId: 8,
				itemId: 'urn`adsk,plm`tenant,workspace,item`DEVINDMACHINEVIEW,8,2887'
			};

			// Set Item Properties and Responses
			mockItemObj.json = MockItemData.createItemData;
			mockItemObj.getFullList.returns(mockItemObj.json);
			mockItemObj.getId.returns('2887');
			mockItemObj.getUrn.returns(mockItemObj.json.urn);
			mockItemObj.getWorkspaceObj.returns(mockItemObj.workspaceObj);
			mockItemObj.workspaceObj.getId.returns($stateParams.workspaceId);
			mockItemObj.getBomNestedLink.returns(mockItemObj.json.nestedBom.link.replace(/^\//, ''));

			mockUserPermissionsObj.hasPermission.returns(true);

			// Set Responses
			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.expect('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
		});

		let BomGraph = System.get('com/autodesk/models/bomGraph/bomGraph.model.js').default;
		let BomConfigurationStateMachine = System.get('com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js').default;

		let MockDataController = function (itemId) {
			let instance = sinon.createStubInstance(BomDataController);
			instance.configurationStateMachine = sinon.createStubInstance(BomConfigurationStateMachine);
			instance.getConfigurationStateMachine.returns(instance.configurationStateMachine);

			instance.bomGraph = sinon.createStubInstance(BomGraph);
			instance.getGraph.returns(instance.bomGraph);

			instance.bomTable = sinon.createStubInstance(BomTable);
			instance.getTable.returns(instance.bomTable);
			instance.bomTable.changeTracker = {
				getMinimalLists: sinon.stub(),
				hasPendingChanges: sinon.stub()
			};

			instance.currentViewDef = mockViewDefinitionObj;
			instance.getCurrentViewDef.returns(instance.currentViewDef);

			instance.viewDefs = new MockViewDefinitionsObj();
			instance.getViewDefs.returns(instance.viewDefs);

			instance.init.returns(Promise.resolve());
			instance.getItemObj.returns(mockItemObj);

			return instance;
		};

		mockLocalUserStorageService = {
			set: sinon.stub(),
			canUseLocalStorage: sinon.stub()
		};

		let MockBomExporter = sinon.stub(BomExporter);

		/**
		 * Initialize the controller with our parameters of dependencies
		 */
		viewBomController = $controller('ViewBomController', {
			$rootScope: $rootScope,
			$scope: $scope,
			$compile: $compile,
			$state: $state,
			$stateParams: $stateParams,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			EventService: EventService,
			FlyoutService: FlyoutService,
			BomDataController: MockDataController,
			BomExporter: MockBomExporter,
			LocalUserStorageService: mockLocalUserStorageService
		});
		viewBomController.tableDataApi = mockGridApiObj;
	});

	describe('[STATE] init steady state', () => {
		/*
		 * Current missing tests for:
		 *	 viewBomController.populateRelatedWorkspaces
		 */

		afterEach(() => {
			// Clean up lingering listeners
			EventService.send(`userPermissions:${$stateParams.workspaceId}~PLMAutoTest:done`, mockUserPermissionsObj);
			EventService.send('currentUser:currentUser:done', mockUserObj);
			EventService.send('enabledFeatures:x:done', mockEnabledFeatures);
			EventService.send(`relatedWorkspaces:${$stateParams.workspaceId}:done`, relatedWorkspacesObj);
		});

		it('Has the correct initial properties set', () => {
			expect(viewBomController.itemId).to.equal(mockLocationSearchResult.itemId);
			expect(viewBomController.bomApiDateFormat).to.equal('YYYY-MM-DD');
			expect(viewBomController.userDefinedDateFormat, 'initial user date format').to.equal('MM/DD/YYYY');
			expect(viewBomController.initComplete).to.be.false;
			expect(viewBomController.currentMode).to.equal(mockLocationSearchResult.mode);
		});

		it('Has the correct user date format after the user is loaded', () => {
			expect(viewBomController.userDefinedDateFormat).to.not.equal(mockUserObj.getDateFormat().toUpperCase());
			EventService.send('currentUser:currentUser:done', mockUserObj);
			expect(viewBomController.userDefinedDateFormat).to.equal(mockUserObj.getDateFormat().toUpperCase());
		});

		it('Has the correct permission object', () => {
			expect(viewBomController.userPermissionsObj).to.not.equal(mockUserPermissionsObj);
			EventService.send('userPermissions:8~PLMAutoTest:done', mockUserPermissionsObj);
			expect(viewBomController.userPermissionsObj).to.equal(mockUserPermissionsObj);
		});

		it('Sets the ui permissions', () => {
			expect(viewBomController.uiPermissions).to.be.defined;
			expect(viewBomController.uiPermissions).to.not.equal(null);
		});

		it('redirects to item details view when there is no view bom permission', () => {
			let stateStub = sinon.stub($state, 'go');

			mockUserPermissionsObj.hasPermission.returns(false);
			viewBomController.init();

			expect($state.go).to.not.have.been.calledWith('details');
			EventService.send('userPermissions:8~PLMAutoTest:done', mockUserPermissionsObj);
			expect($state.go).to.have.been.calledWith('details');

			stateStub.restore();
		});
	});

	describe('[After init]', () => {
		/*
		 * Current missing tests for:
		 *	 viewBomController.triggerAdd
		 */

		beforeEach(() => {
			EventService.send(`userPermissions:${$stateParams.workspaceId}~PLMAutoTest:done`, mockUserPermissionsObj);
			EventService.send('currentUser:currentUser:done', mockUserObj);
			EventService.send('enabledFeatures:x:done', mockEnabledFeatures);
			EventService.send(`relatedWorkspaces:${$stateParams.workspaceId}:done`, relatedWorkspacesObj);
		});

		describe('[METHOD] getGraph', () => {
            it('Returns the graph', () => {
                expect(viewBomController.getGraph()).to.equal(viewBomController.bomDataController.getGraph());
            });
        });

        describe('getTable', () => {
            it('Returns the table', () => {
                expect(viewBomController.getTable()).to.equal(viewBomController.bomDataController.getTable());
            });
        });

        describe('getConfigurationStateMachine', () => {
            it('Returns the state machine', () => {
                expect(viewBomController.getConfigurationStateMachine()).to.equal(viewBomController.bomDataController.getConfigurationStateMachine());
            });
        });

        describe('getViewDefs', () => {
            it('Returns the view definitions', () => {
                expect(viewBomController.getViewDefs()).to.equal(viewBomController.bomDataController.getViewDefs());
            });
        });

        describe('getCurrentViewDef', () => {
            it('Returns the current view definition', () => {
                expect(viewBomController.getCurrentViewDef()).to.equal(viewBomController.bomDataController.getCurrentViewDef());
            });
        });

		describe('[METHOD] buildBomUIPermissions', () => {
			let setPermissionReturn = (add, edit, remove, hasOverrideLockPermission, hasOverrideRevisionPermission) => {
				mockUserPermissionsObj.hasPermission.withArgs(PLMPermissions.ADD_BOM).returns(add);
				mockUserPermissionsObj.hasPermission.withArgs(PLMPermissions.EDIT_BOM).returns(edit);
				mockUserPermissionsObj.hasPermission.withArgs(PLMPermissions.DELETE_BOM).returns(remove);
				mockUserPermissionsObj.hasPermission.withArgs(PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS).returns(hasOverrideLockPermission);
				mockUserPermissionsObj.hasPermission.withArgs(PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS).returns(hasOverrideRevisionPermission);
			};

			let setItemPermissionReturn = (isItemLocked, isItemReleased) => {
				mockItemObj.isLocked.returns(isItemLocked);
				mockItemObj.isReleased.returns(isItemReleased);
			};

			let checkPermVisibilityExpectations = (perms, add, edit, remove) => {
				expect(perms.addButtonVisibile, 'add visible').to.equal(add);
				expect(perms.editButtonVisibile, 'edit visible').to.equal(edit);
				expect(perms.removeButtonVisibile, 'remove visible').to.equal(remove);
			};

			let checkPermDisabledExpectation = (perms, disabled, testQualifier) => {
				expect(perms.editDisabled, `${testQualifier + ': '}Editing disabled`).to.equal(disabled);
			};

			it('Should by default give every permission', () => {
				let perms = viewBomController.buildBomUIPermissions();
				checkPermVisibilityExpectations(perms, true, true, true);
				checkPermDisabledExpectation(perms, false);
			});

			describe('[Button visibility]', () => {
				it('Should return correct visibility when permissions are enabled', () => {
					setPermissionReturn(true, true, true);
					setItemPermissionReturn(true, true);

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermVisibilityExpectations(perms, true, true, true);
				});

				it('Should return correct visibility when permissions are disabled', () => {
					setPermissionReturn(false, false, false);
					setItemPermissionReturn(true, true);

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermVisibilityExpectations(perms, false, false, false);
				});

				it('Should return edit visible if add is allowed', () => {
					setPermissionReturn(true, false, false);
					setItemPermissionReturn(true, true);

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermVisibilityExpectations(perms, true, true, false);
				});

				it('Should return edit visible if edit is allowed', () => {
					setPermissionReturn(false, true, false);
					setItemPermissionReturn(true, true);

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermVisibilityExpectations(perms, false, true, false);
				});

				it('Should return edit visible if remove is allowed', () => {
					setPermissionReturn(false, false, true);
					setItemPermissionReturn(true, true);

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermVisibilityExpectations(perms, false, true, true);
				});
			});

			describe('[Buttons enabled]', () => {
				let overridesMap = new Map();
				overridesMap.set('No overrides', {
					workflowOverride: false,
					revisionOverride: false
				});
				overridesMap.set('Only workflow override', {
					workflowOverride: true,
					revisionOverride: false
				});
				overridesMap.set('Only revison override', {
					workflowOverride: false,
					revisionOverride: true
				});
				overridesMap.set('Workflow and revision overrides', {
					workflowOverride: true,
					revisionOverride: true
				});

				let setOverridePermissions = (overridesKey) => {
					let overrides = overridesMap.get(overridesKey);
					setPermissionReturn(true, true, true, overrides.workflowOverride, overrides.revisionOverride);
				};

				it('Should return edit enabled if the item is working and unlocked (no matter what overrides)', () => {
					setItemPermissionReturn(false, false);
					overridesMap.forEach((overrides, key) => {
						setOverridePermissions(key);

						let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

						checkPermDisabledExpectation(perms, false, key);
					});
				});

				it('Should return edit disabled if the item is working and locked, and the user does not have any override permissions', () => {
					setItemPermissionReturn(true, false);
					setOverridePermissions('No overrides');

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermDisabledExpectation(perms, true);
				});

				it('Should return edit enabled if the item is working and locked, and the user has any combination of the overrides', () => {
					setItemPermissionReturn(true, false);

					let overrideCombinations = ['Only workflow override', 'Only revison override', 'Workflow and revision overrides'];
					overrideCombinations.forEach((key) => {
						setOverridePermissions(key);

						let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

						checkPermDisabledExpectation(perms, false, key);
					});
				});

				it('Should return edit disabled if the item is released, and the user has no overrides', () => {
					setItemPermissionReturn(false, true);
					setOverridePermissions('No overrides');

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermDisabledExpectation(perms, true);
				});

				it('Should return edit disabled if the item is released, and the user only has workflow overrides', () => {
					setItemPermissionReturn(false, true);
					setOverridePermissions('Only workflow override');

					let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

					checkPermDisabledExpectation(perms, true);
				});

				it('Should return edit enabled if the item is released, and the user has revison override', () => {
					setItemPermissionReturn(false, true);

					let overrideCombinations = ['Only revison override', 'Workflow and revision overrides'];
					overrideCombinations.forEach((key) => {
						setOverridePermissions(key);

						let perms = viewBomController.buildBomUIPermissions(mockUserPermissionsObj, mockItemObj);

						checkPermDisabledExpectation(perms, false, key);
					});
				});
			});
		});

		describe('[METHOD] changeView', () => {
			let loadBomStub;
			beforeEach(() => {
				loadBomStub = sinon.stub(viewBomController, 'loadBom');
				viewBomController.bomDataController.viewDefs.buildViewStorageKey.returnsArg(0);
				mockLocalUserStorageService.canUseLocalStorage.returns(false);
			});

			afterEach(() => {
				loadBomStub.restore();
			});

			it('should update the config and reinit the bom if the view is not the current view', () => {
				mockLocalUserStorageService.canUseLocalStorage.returns(true);

				// ----- Given -----
				// A view we will select
				let view = {};
				view.id = '3';

				// that is not the currently selected view
				viewBomController.bomDataController.configurationStateMachine.viewDefId = '2';

				// ----- When -----
				// we change the view to the new view
				viewBomController.changeView(view);

				// ----- Then -----
				// we should be updating the bom state machine
				expect(viewBomController.bomDataController.configurationStateMachine.viewChanged.calledOnce).to.be.true;
				expect(viewBomController.bomDataController.configurationStateMachine.viewChanged.calledWith(view.id));

				// and reinitalizing the bom
				expect(loadBomStub.calledOnce).to.be.true;

				// And update thee saved view
				expect(mockLocalUserStorageService.set.calledOnce).to.be.true;
				expect(mockLocalUserStorageService.set.calledWith($stateParams.workspaceId.toString(), view.id)).to.be.true;
			});

			it('should not update the saved view if the view is the same', () => {
				mockLocalUserStorageService.canUseLocalStorage.returns(true);
				let view = {};
				view.id = '1';
				viewBomController.bomDataController.configurationStateMachine.viewDefId = '1';

				viewBomController.changeView(view);

				// And update thee saved view
				expect(mockLocalUserStorageService.set.called).to.be.false;
			});

			it('should ignore the request if the view is the current view', () => {
				// ----- Given -----
				// A view we will select
				let view = {};
				view.id = '1';

				// that is the currently selected view
				viewBomController.bomDataController.configurationStateMachine.viewDefId = '1';

				// ----- When -----
				// we attempt to change the view to the new view
				viewBomController.changeView(view);

				// ----- Then -----
				// we should not be updating the bom state machine
				expect(viewBomController.bomDataController.configurationStateMachine.viewChanged.called).to.be.false;

				// and we should not be reinitalizing the bom
				expect(loadBomStub.called).to.be.false;

				// And we should not update the saved view
				expect(mockLocalUserStorageService.set.called).to.be.false;
			});
		});

		describe('[METHOD] enterEditMode', () => {
			let emitSpy;
			beforeEach(() => {
				emitSpy = sinon.spy(viewBomController.$scope, '$emit');
			});

			afterEach(() => {
				emitSpy.restore();
			});

			it('Should take the bom into edit mode and activate navigation guard', () => {
				// explicitly set the current bom mode to view
				viewBomController.currentMode = 'view';
				viewBomController.enterEditMode();

				// check if the mode has been switched to edit
				expect(viewBomController.currentMode).to.equal('edit');
				expect(emitSpy.calledOnce).to.be.true;
			});

			it('should do nothing if the bom is already in edit mode', () => {
				// explicitly set the current bom mode to edit
				viewBomController.currentMode = 'edit';
				viewBomController.enterEditMode();

				// Should not reactivate the notification listener
				expect(emitSpy.calledOnce).to.be.false;
			});
		});

		describe('[METHOD] loadEditableItemRevisions', () => {
			it('Should exclude the correct revisions', () => {
				let loadStub = viewBomController.bomDataController.loadItemRevisions;

				expect(loadStub.called).to.be.false;
				viewBomController.loadEditableItemRevisions();
				expect(loadStub.calledOnce).to.be.true;

				let excluded = loadStub.args[0][1];

				expect(excluded.length).to.equal(2);
				expect(excluded).to.contain('UNRELEASED');
				expect(excluded).to.contain('WORKING');
			});
		});

		describe('[METHOD] formatDate', function () {
			var apiDateFormat = 'YYYY-MM-DD'; // current date format of bom api

			it('should convert a date object to bom api date format', function () {
				var dateObj = new Date(2000, 11, 31); // Month is 0-indexed
				var expected = '2000-12-31';
				expect(viewBomController.formatDate(dateObj, apiDateFormat)).to.equal(expected);
			});

			it('should reformat a date that is in bom api date format to a user defined date format', function () {
				var dateStr = '2000-12-31';
				var userFormat = 'DD-MM-YYYY';
				expect(viewBomController.formatDate(dateStr, userFormat, apiDateFormat)).to.equal('31-12-2000');
			});

			it('should reformat a date that is in user defined format to bom api date format', function () {
				var dateStr = '12:20:1931';
				var userFormat = 'MM:DD:YYYY';
				expect(viewBomController.formatDate(dateStr, apiDateFormat, userFormat)).to.equal('1931-12-20');
			});
		});

		describe('[METHOD] getViewTitle', () => {
			it('should return the title of the current view definition if it exists', () => {
				viewBomController.bomDataController.currentViewDef.getTitle.returns('Test');
				expect(viewBomController.getViewTitle()).to.equal('Test');
			});

			it('Should return the empty string if the current view def is null', () => {
				viewBomController.bomDataController.getCurrentViewDef.returns(null);
				expect(viewBomController.getViewTitle()).to.equal('');
			});
		});

		describe('[METHOD] getViewDate', () => {
			it('should return undefined if effective date is not set', () => {
				viewBomController.bomDataController.configurationStateMachine.effectiveDate = null;
				expect(viewBomController.getViewDate()).to.be.undefined;
			});

			it('Should return localized today date if the effective date is today', () => {
				viewBomController.bomDataController.configurationStateMachine.effectiveDate = moment();
				expect(viewBomController.getViewDate()).to.equal($rootScope.bundle.bom.header.today);
			});

			it('Should return the result of formatDate for the effective date, based on the current date format', () => {
				let formatStub = sinon.stub(viewBomController, 'formatDate');

				let date = moment().add(2, 'days');
				formatStub.withArgs(date, viewBomController.userDefinedDateFormat).returns('Some Date');

				viewBomController.bomDataController.configurationStateMachine.effectiveDate = date;

				expect(viewBomController.getViewDate()).to.equal('Some Date');
			});
		});

		describe('[METHOD] getViewBias', () => {
			it('should return undefined if bias is not set', () => {
				viewBomController.bomDataController.configurationStateMachine.revisionBias = null;
				expect(viewBomController.getViewBias()).to.be.undefined;
			});

			it('should return the name of the current bias', () => {
				viewBomController.bomDataController.configurationStateMachine.revisionBias = 'working';

				sinon.stub(viewBomController.BiasService, 'getBiasName');
				viewBomController.BiasService.getBiasName.withArgs('working').returns('WORKING BIAS');
				expect(viewBomController.getViewBias()).to.equal('WORKING BIAS');

				viewBomController.BiasService.getBiasName.restore();
			});
		});

		describe('[METHOD] getToolTipText', () => {
			it('should return the tooltip for the current header', () => {
				let viewTitleStub = sinon.stub(viewBomController, 'getViewTitle');
				let viewDateStub = sinon.stub(viewBomController, 'getViewDate');
				let viewBiasStub = sinon.stub(viewBomController, 'getViewBias');

				let title = 'A View Title';
				let date = 'Some-Date-String';
				let bias = 'WORKING';

				viewTitleStub.returns(title);
				viewDateStub.returns(date);
				viewBiasStub.returns(bias);

				expect(viewBomController.getTooltipText()).to.equal(`${title} as of ${date} using the ${bias} configuration`);

				viewTitleStub.restore();
				viewDateStub.restore();
				viewBiasStub.restore();

			});
		});

		describe('[METHOD] changeBomConfiguration', () => {
			let loadBomStub, formatDateStub, configChangedStub, getEffectiveDateStub;

			beforeEach(() => {
				loadBomStub = sinon.stub(viewBomController, 'loadBom');
				formatDateStub = sinon.stub(viewBomController, 'formatDate');
				getEffectiveDateStub = viewBomController.bomDataController.configurationStateMachine.getEffectiveDate;
				configChangedStub = viewBomController.bomDataController.configurationStateMachine.configurationChanged;
			});

			afterEach(() => {
				loadBomStub.restore();
				formatDateStub.restore();
			});

			it('should do nothing if neither the date nor the bias has changed', () => {
				let config = {
					effectiveDate: 'Some Date',
					bias: 'working'
				};

				formatDateStub.withArgs(config.effectiveDate, sinon.match.any).returns(config.effectiveDate);
				getEffectiveDateStub.returns(config.effectiveDate);
				viewBomController.bomDataController.configurationStateMachine.revisionBias = 'working';

				viewBomController.changeBomConfiguration(config);

				expect(configChangedStub.called, 'configChanged').to.be.false;
				expect(loadBomStub.calledOnce, 'loadBom').to.be.false;
			});

			it('should request a state change if the date has changed', () => {
				let config = {
					effectiveDate: 'Some Date',
					bias: 'working'
				};

				formatDateStub.withArgs(config.effectiveDate, sinon.match.any).returns(config.effectiveDate);
				getEffectiveDateStub.returns('Some other Date');
				viewBomController.bomDataController.configurationStateMachine.revisionBias = 'working';

				viewBomController.changeBomConfiguration(config);

				expect(configChangedStub.calledOnce && configChangedStub.calledWith(config.effectiveDate, config.bias), 'configChanged').to.be.true;
				expect(loadBomStub.calledOnce, 'loadBom').to.be.true;
			});

			it('should request a state change if the bias has changed', () => {
				let config = {
					effectiveDate: 'Some Date',
					bias: 'working'
				};

				formatDateStub.withArgs(config.effectiveDate, sinon.match.any).returns(config.effectiveDate);
				getEffectiveDateStub.returns('Some Date');
				viewBomController.bomDataController.configurationStateMachine.revisionBias = 'released';

				viewBomController.changeBomConfiguration(config);

				expect(configChangedStub.calledOnce && configChangedStub.calledWith(config.effectiveDate, config.bias), 'configChanged').to.be.true;
				expect(loadBomStub.calledOnce, 'loadBom').to.be.true;
			});

			it('should request a state change if both the bias and date have changed', () => {
				let config = {
					effectiveDate: 'Some Date',
					bias: 'working'
				};

				formatDateStub.withArgs(config.effectiveDate, sinon.match.any).returns(config.effectiveDate);
				getEffectiveDateStub.returns('Some other Date');
				viewBomController.bomDataController.configurationStateMachine.revisionBias = 'released';

				viewBomController.changeBomConfiguration(config);

				expect(configChangedStub.calledOnce && configChangedStub.calledWith(config.effectiveDate, config.bias), 'configChanged').to.be.true;
				expect(loadBomStub.calledOnce, 'loadBom').to.be.true;
			});
		});

		describe('[METHOD] prepareChanges', () => {
			let trackerStub, edgeStub;
			beforeEach(() => {
				trackerStub = viewBomController.bomDataController.bomTable.changeTracker.getMinimalLists;
				edgeStub = viewBomController.bomDataController.bomGraph.getEdge;

				edgeStub.withArgs('346').returns({
					link: mockBomChangeCompiledData.allChangesMap.get('346').enhancedWithLink
				});
				edgeStub.withArgs('347').returns({
					link: mockBomChangeCompiledData.allChangesMap.get('347').enhancedWithLink
				});
				edgeStub.withArgs('349').returns({
					link: mockBomChangeCompiledData.allChangesMap.get('349').enhancedWithLink
				});
			});

			it('Should return the changes as a list', () => {
				let map = mockBomChangeCompiledData.allChangesMap;
				trackerStub.returns(map);

				let preparedChanges = viewBomController.prepareChanges();

				expect(preparedChanges.length).to.equal(4);
				expect(preparedChanges).to.include(map.get('346'));
				expect(preparedChanges).to.include(map.get('347'));
				expect(preparedChanges).to.include(map.get('348'));
				expect(preparedChanges).to.include(map.get('349'));
			});

			it('Should add the edge link to changes of type edit', () => {
				let map = mockBomChangeCompiledData.editMap;
				trackerStub.returns(map);

				let preparedChanges = viewBomController.prepareChanges();

				expect(preparedChanges.length).to.equal(1);
				expect(preparedChanges[0]).to.equal(map.get('346'));
				expect(preparedChanges[0].payload.__self__).to.equal(map.get('346').enhancedWithLink);
			});

			it('Should add the edge link to changes of type remove', () => {
				let map = mockBomChangeCompiledData.removeMap;
				trackerStub.returns(map);

				let preparedChanges = viewBomController.prepareChanges();

				expect(preparedChanges.length).to.equal(1);
				expect(preparedChanges[0]).to.equal(map.get('349'));
				expect(preparedChanges[0].payload.__self__).to.equal(map.get('349').enhancedWithLink);
			});
		});

		describe('[METHOD] listenForChangeResponses', () => {
			it('Should send a saveCompleted message when all saves finish, with the passing saves and failing saves seperated', () => {
				let sendSpy = sinon.spy(viewBomController.EventService, 'send');
				let addChangeNotificationSpy = sinon.stub(viewBomController, 'addChangeNotification');
				let changes = mockBomChangeCompiledData.allChangesMap;

				let goodChangeA = changes.get('346');
				let goodChangeB = changes.get('348');
				let goodChangeC = changes.get('349');
				let badChange = changes.get('347');
				badChange.addErrors = sinon.stub();

				viewBomController.listenForChangeResponses([goodChangeA, goodChangeB, goodChangeC, badChange]);
				viewBomController.EventService.send('bomNestedItem:346:editDone');
				viewBomController.EventService.send('bomNestedItem:348:addDone');
				viewBomController.EventService.send('bomNestedItem:349:removeDone');
				expect(addChangeNotificationSpy.calledWithExactly(goodChangeA, viewBomController.NotificationTypes.SUCCESS)).to.be.true;
				expect(addChangeNotificationSpy.calledWithExactly(goodChangeB, viewBomController.NotificationTypes.SUCCESS)).to.be.true;
				expect(addChangeNotificationSpy.calledWithExactly(goodChangeC, viewBomController.NotificationTypes.SUCCESS)).to.be.true;

				viewBomController.EventService.send('bomNestedItem:347:editFailed', 'Error Message');
				expect(addChangeNotificationSpy.calledWithExactly(badChange, viewBomController.NotificationTypes.ERROR)).to.be.true;
				expect(badChange.addErrors.calledWith('Error Message')).to.be.true;

				expect(sendSpy.calledWithExactly('bomNestedItem:saveCompleted', {
					successes: [goodChangeA, goodChangeB, goodChangeC],
					failures: [badChange]
				})).to.be.true;

				sendSpy.restore();
				addChangeNotificationSpy.restore();
			});
		});

		describe('[METHOD] listenForSaveCompletion', () => {
			let stateChangeStub, reapplyStub, reapplyAddStub, reloadStub;
			beforeEach(() => {
				stateChangeStub = sinon.stub(viewBomController, 'enterViewMode');
				reapplyStub = sinon.stub(viewBomController, 'handleFailedChangeToRowOnLoad');
				reapplyAddStub = sinon.stub(viewBomController, 'handleFailedAdd');
				reloadStub = sinon.stub(viewBomController, 'reloadCurrentBom');
			});

			afterEach(() => {
				stateChangeStub.restore();
				reapplyStub.restore();
				reapplyAddStub.restore();
				reloadStub.restore();
			});

			// Should be changed once we implement persisting failed changes
			it('Should enter view mode when the save completes with no failed saves', () => {
				viewBomController.listenForSaveCompletion();
				viewBomController.EventService.send('bomNestedItem:saveCompleted', {
					success: ['a', 'b', 'c'],
					failures: []
				});
				expect(stateChangeStub.calledOnce).to.be.true;
			});

			it('Should mark changes to persist if they failed', () => {
				let successfulChanges = [];
				successfulChanges[0] = {
					changeType: 'edit',
					id: 'changeC'
				};

				let failedChanges = [];
				failedChanges[0] = {
					changeType: 'edit',
					drivingChanges: new Map(),
					id: 'changeA'
				};
				failedChanges[1] = {
					changeType: 'edit',
					drivingChanges: new Map(),
					id: 'changeB'
				};

				reapplyStub.withArgs(failedChanges[0]);
				reapplyStub.withArgs(failedChanges[1]);
				reapplyStub.withArgs(successfulChanges[0]);

				viewBomController.listenForSaveCompletion();
				viewBomController.EventService.send('bomNestedItem:saveCompleted', {
					success: [],
					failures: failedChanges
				});

				expect(reapplyStub.withArgs(failedChanges[0]).calledOnce).to.be.true;
				expect(reapplyStub.withArgs(failedChanges[1]).calledOnce).to.be.true;
				expect(reapplyStub.withArgs(successfulChanges[0]).callCount).to.equal(0);
				expect(reloadStub.calledOnce).to.be.true;

				// The state should not change
				expect(stateChangeStub.callCount).to.equal(0);
			});

			it('Should reapply remove changes that failed ', () => {
				let failedRemove = {
					changeType: 'remove',
					drivingChanges: new Map(),
					id: 'iFailedToRemove'
				};
				reapplyStub.withArgs(failedRemove);

				viewBomController.listenForSaveCompletion();

				viewBomController.EventService.send('bomNestedItem:saveCompleted', {
					success: [],
					failures: [failedRemove]
				});

				expect(reapplyStub.withArgs(failedRemove).calledOnce).to.be.true;
				expect(reloadStub.calledOnce).to.be.true;

				// The state should not change
				expect(stateChangeStub.callCount).to.equal(0);
			});
		});

		describe('[METHOD] handleFailedChangeToRowOnLoad', () => {
			let reapplyStub, consumeStub, change;
			beforeEach(() => {
				reapplyStub = viewBomController.bomDataController.bomTable.reapplyChange;
				consumeStub = viewBomController.bomDataController.bomTable.consumeErrors;

				change = {
					edgeId: '111',
					getErrors: () => {}
				};
			});

			it('Should reapply the change when notified that the row has loaded', () => {
				reapplyStub.withArgs(change);

				viewBomController.handleFailedChangeToRowOnLoad(change);

				// Change should not be reapplied until the row has loaded
				expect(reapplyStub.withArgs(change).callCount).to.equal(0);
				viewBomController.EventService.send('bomTableRow:111:created');
				expect(reapplyStub.withArgs(change).calledOnce).to.be.true;
			});

			it('Should apply the errors to the row', () => {
				viewBomController.handleFailedChangeToRowOnLoad(change);

				// Errors should not be applied until the row has loaded
				expect(consumeStub.called).to.be.false;
				viewBomController.EventService.send('bomTableRow:111:created');
				expect(reapplyStub.calledOnce).to.be.true;
			});
		});

		describe('[METHOD] handleFailedAdd', function () {
			let reapplyStub, compiledAddChange, consumeStub, change;
			beforeEach(() => {
				reapplyStub = viewBomController.bomDataController.bomTable.reapplyChange;
				consumeStub = viewBomController.bomDataController.bomTable.consumeErrors;

				compiledAddChange = {
					edgeId: 'Temp@2345',
					changeType: 'add',
					getErrors: () => {}
				};
			});

			it('it should re-add the bom row to the table and put the bom chagne add back in the queue ', function () {
				reapplyStub.withArgs(compiledAddChange);

				viewBomController.handleFailedAdd(compiledAddChange);

				expect(reapplyStub.withArgs(compiledAddChange).callCount).to.equal(0);

				viewBomController.EventService.send('bomTableTopLineHasBeen:true:Expanded');
				expect(reapplyStub.withArgs(compiledAddChange).calledOnce).to.be.true;
			});

			it('Should apply the errors to the row', () => {
				viewBomController.handleFailedAdd(compiledAddChange);

				viewBomController.EventService.send('bomTableTopLineHasBeen:true:Expanded');
				expect(consumeStub.calledOnce).to.be.true;
			});
		});

		describe('[METHOD] persistChange', () => {
			let sendStub;
			beforeEach(() => {
				sendStub = sinon.stub(viewBomController.EventService, 'send');
			});

			afterEach(() => {
				sendStub.restore();
			});

			it('Should pass the correct arguments when persisting an edit', () => {
				let change = mockBomChangeCompiledData.editMap.get('346');
				viewBomController.persistChange(change);

				expect(sendStub.calledWithExactly(sinon.match.any, change.payload));
			});

			it('Should pass the correct arguments when persisting an add', () => {
				let config = {};
				viewBomController.bomDataController.configurationStateMachine.getFullConfiguration.returns(config);

				let change = mockBomChangeCompiledData.addMap.get('348');
				viewBomController.persistChange(change);

				expect(config.rootItem, 'Config augmented').to.equal(mockItemObj.getId());
				expect(sendStub.calledWithExactly(sinon.match.any, mockItemObj.getBomNestedLink(), change.payload, config));
			});

			it('Should pass the correct arguments when persisting an remove', () => {
				let change = mockBomChangeCompiledData.removeMap.get('349');
				viewBomController.persistChange(change);

				expect(sendStub.calledWithExactly(sinon.match.any, change.payload));
			});
		});

		describe('[METHOD] isViewState', function () {
			it('Should return true if the current mode is the view state', () => {
				viewBomController.currentMode = 'view';
				expect(viewBomController.isViewState()).to.be.true;
			});

			it('Should return true if the current mode is not the view state', () => {
				viewBomController.currentMode = 'someOtherState';
				expect(viewBomController.isViewState()).to.be.false;
			});
		});

		describe('[METHOD] respondToBomLoad', () => {
			let sendStub, uiPermissionsStub;
			beforeEach(() => {
				sendStub = sinon.stub(viewBomController.EventService, 'send');
				uiPermissionsStub = sinon.stub(viewBomController, 'buildBomUIPermissions');
			});

			afterEach(() => {
				sendStub.restore();
				uiPermissionsStub.restore();
			});

			it('Should update the header with the new item details if provided a root id', () => {
				let rootId = 'someRootId';

				expect(sendStub.called).to.be.false;
				viewBomController.respondToBomLoad(rootId);
				expect(sendStub.calledOnce).to.be.true;
				expect(sendStub.calledWith('itemViewer:setNewItem', rootId)).to.be.true;
			});

			it('Should not update the header if not provided a root id', () => {
				expect(sendStub.called).to.be.false;
				viewBomController.respondToBomLoad();
				expect(sendStub.called).to.be.false;
			});

			it('Should rebuild the ui permissions', () => {
				expect(uiPermissionsStub.called).to.be.false;
				viewBomController.respondToBomLoad();
				expect(uiPermissionsStub.calledOnce).to.be.true;
			});
		});

		describe('[METHOD] shouldBomRowBeDisabled', function () {
			it('should return true if the given tree level is greater than 1 and the bom is in edit mode', function () {
				expect(viewBomController.shouldBomRowBeDisabled(2)).to.be.true;
			});

			it('should return false if the given tree level is less then 2 and the bom is in edit mode', function () {
				expect(viewBomController.shouldBomRowBeDisabled(1)).to.be.false;
			});

			it('should return false if the given tree level is greater than 1 and the bom is in view mode', function () {
				expect(viewBomController.shouldBomRowBeDisabled(0)).to.be.true;
			});
		});

		describe('[METHOD] isCellEditable', () => {
			let row, cellData, viewDefField, isBeingRemovedStub;
			beforeEach(() => {
				isBeingRemovedStub = sinon.stub(viewBomController, 'isRowMarkedForRemoval');
				row = {
					depth: 0
				};
				isBeingRemovedStub.returns(false);

				cellData = {
					getFieldId: sinon.stub()
				};

				cellData.getFieldId.returns('someId');

				viewDefField = new MockViewDefinitionFieldObj();
				viewBomController.bomDataController.currentViewDef.getField.withArgs('someId').returns(viewDefField);
			});

			afterEach(() => {
				isBeingRemovedStub.restore();
			});

			it('Should always return false when the cells are coming from a row with depth 0 or > 1 even if they are edge Fields', () => {
				expect(viewBomController.isCellEditable(row, cellData), 'depth 0').to.be.false;
				row.depth = 2;
				expect(viewBomController.isCellEditable(row, cellData), 'depth 2').to.be.false;
			});

			it('Should always return false when the cells are coming from a row that is being removed', () => {
				row.depth = 1;
				isBeingRemovedStub.returns(true);
				expect(viewBomController.isCellEditable(row, cellData), 'depth 1').to.be.false;
				row.depth = 2;
				expect(viewBomController.isCellEditable(row, cellData), 'depth 2').to.be.false;
			});

			it('Should return true if the the cell is the item number cell on a row with depth 1', () => {
				cellData.getFieldId.returns('$$BOM_ITEM_NUMBER');

				expect(viewBomController.isCellEditable(row, cellData)).to.be.false;
				row.depth = 1;
				expect(viewBomController.isCellEditable(row, cellData)).to.be.true;
			});

			it('Should return false if the the cell is a filtered picklist', () => {
				row.depth = 1;
				row.isNewlyAdded = false;
				cellData.typeId = viewBomController.FieldTypes.PICKLIST_FILTERED;
				viewDefField.isAlwaysEditable.returns(true);

				expect(viewBomController.isCellEditable(row, cellData)).to.be.false;
			});

			it('Should return the viewDefs isAlwaysEditable if the cell is on an existing row with depth 1', () => {
				row.depth = 1;
				row.isNewlyAdded = false;
				viewDefField.isAlwaysEditable.returns(false);

				expect(viewBomController.isCellEditable(row, cellData)).to.be.false;
				viewDefField.isAlwaysEditable.returns(true);
				expect(viewBomController.isCellEditable(row, cellData)).to.be.true;
			});

			it('Should return the viewDefs isEditableOnCreate if the cell is on a new row with depth 1', () => {
				row.depth = 1;
				row.isNewlyAdded = true;
				viewDefField.isEditableOnCreate.returns(false);

				expect(viewBomController.isCellEditable(row, cellData)).to.be.false;
				viewDefField.isEditableOnCreate.returns(true);
				expect(viewBomController.isCellEditable(row, cellData)).to.be.true;
			});
		});

		describe('[METHOD] addChangeNotification', () => {
			let addChange, editChange, removeChange, addNotificationStub, getNodeStub;
			beforeEach(() => {
				addNotificationStub = sinon.stub(viewBomController.NotificationService, 'addNotification');

				editChange = mockBomChangeData.data[0];
				addChange = mockBomChangeData.data[2];
				removeChange = mockBomChangeData.data[4];

				getNodeStub = viewBomController.bomDataController.bomGraph.getNodeForEdge;
				getNodeStub.returns({
					item: {
						title: 'some title'
					}
				});
			});

			afterEach(() => {
				addNotificationStub.restore();
			});

			it('Should add a passing edit notification correctly', () => {
				viewBomController.addChangeNotification(editChange, viewBomController.NotificationTypes.SUCCESS);
				let expectedMessage = 'some title - Edited Successfully';

				expect(addNotificationStub.calledOnce).to.be.true;
				expect(addNotificationStub.calledWith(viewBomController.NotificationTypes.SUCCESS, expectedMessage)).to.be.true;
			});

			it('Should add a failing edit notification correctly', () => {
				viewBomController.addChangeNotification(editChange, viewBomController.NotificationTypes.ERROR);
				let expectedMessage = 'some title - Has error. Failed to update.';

				expect(addNotificationStub.calledOnce).to.be.true;
				expect(addNotificationStub.calledWith(viewBomController.NotificationTypes.ERROR, expectedMessage)).to.be.true;
			});

			it('Should add a passing add notification correctly', () => {
				viewBomController.addChangeNotification(addChange, viewBomController.NotificationTypes.SUCCESS);
				let expectedMessage = `${addChange.payload.item.title} - Added Successfully`;

				expect(addNotificationStub.calledOnce).to.be.true;
				expect(addNotificationStub.calledWith(viewBomController.NotificationTypes.SUCCESS, expectedMessage)).to.be.true;
			});

			it('Should add a failing add notification correctly', () => {
				viewBomController.addChangeNotification(addChange, viewBomController.NotificationTypes.ERROR);
				let expectedMessage = `${addChange.payload.item.title} - Has Error. Failed To add`;

				expect(addNotificationStub.calledOnce).to.be.true;
				expect(addNotificationStub.calledWith(viewBomController.NotificationTypes.ERROR, expectedMessage)).to.be.true;
			});

			it('Should add a passing remove notification correctly', () => {
				viewBomController.addChangeNotification(removeChange, viewBomController.NotificationTypes.SUCCESS);
				let expectedMessage = 'some title - Removed Successfully';

				expect(addNotificationStub.calledOnce).to.be.true;
				expect(addNotificationStub.calledWith(viewBomController.NotificationTypes.SUCCESS, expectedMessage)).to.be.true;
			});

			it('Should add a failing remove notification correctly', () => {
				viewBomController.addChangeNotification(removeChange, viewBomController.NotificationTypes.ERROR);
				let expectedMessage = 'some title - Has Error. Failed To Remove';

				expect(addNotificationStub.calledOnce).to.be.true;
				expect(addNotificationStub.calledWith(viewBomController.NotificationTypes.ERROR, expectedMessage)).to.be.true;
			});
		});

		describe('[METHOD] triggerRemove', () => {
			let enterEditModeStub, queueSelectedRowsStub;
			beforeEach(() => {
				enterEditModeStub = sinon.stub(viewBomController, 'enterEditMode');
				queueSelectedRowsStub = viewBomController.bomDataController.bomTable.queueSelectedRowsForRemoval;
			});

			afterEach(() => {
				enterEditModeStub.restore();
			});

			it('Should tell the table to queue selected rows for removal', () => {
				viewBomController.triggerRemove();
				expect(queueSelectedRowsStub.calledOnce).to.be.true;
			});

			it('Should enter edit mode', () => {
				viewBomController.triggerRemove();
				expect(enterEditModeStub.calledOnce).to.be.true;
			});
		});

		describe('[METHOD] viewAttachments', () => {
			it('Should open a view attached items flyout', () => {
				sinon.spy(FlyoutService, 'open');
				let event = new Event('click', {});

				viewBomController.viewAttachments(event);
				expect(FlyoutService.open).to.be.calledOnce;
			});
		});

		describe('[METHOD] isDirty', () => {
			let isEditStub, hasPendingChangesStub;

			beforeEach(() => {
				isEditStub = sinon.stub(viewBomController, 'isEditState');
				hasPendingChangesStub = viewBomController.bomDataController.bomTable.changeTracker.hasPendingChanges;
			});

			afterEach(() => {
				isEditStub.restore();
			});

			it('Should only return true when the bom is in edit mode and has pending changes', () => {
				isEditStub.returns(true);
				hasPendingChangesStub.returns(true);

				expect(viewBomController.isDirty()).to.be.true;
			});
			it('Should return false when the bom is in edit mode and has no pending changes', () => {
				isEditStub.returns(true);
				hasPendingChangesStub.returns(false);

				expect(viewBomController.isDirty()).to.be.false;
			});
			it('Should return false when the bom is in not in edit mode and has pending changes', () => {
				isEditStub.returns(false);
				hasPendingChangesStub.returns(true);

				expect(viewBomController.isDirty()).to.be.false;
			});
			it('Should return false when the bom is in not edit mode and has no pending changes', () => {
				isEditStub.returns(false);
				hasPendingChangesStub.returns(true);

				expect(viewBomController.isDirty()).to.be.false;
			});
		});

		describe('[METHOD] isRowMarkedForRemoval', () => {
			let rowEditStateStub, affectedRow, response;

			beforeEach(() => {
				rowEditStateStub = viewBomController.bomDataController.bomTable.getRowEditState;
				affectedRow = {
					edgeId : 'SomeEdgeId'
				};
				response = {
					changeType : mockBomChangeListTypeData.NOCHANGE
				};
			});

			it('Should return false if there are no changes to the row', () => {
				rowEditStateStub.returns({response});

				expect(viewBomController.isRowMarkedForRemoval(affectedRow)).to.be.false;
			});
			it('Should return false if the row is a newly added one', () => {
				response.changeType = mockBomChangeListTypeData.ADD;
				rowEditStateStub.returns({response});

				expect(viewBomController.isRowMarkedForRemoval(affectedRow)).to.be.false;
			});
			it('Should return false if the row is a newly added one', () => {
				response.changeType = mockBomChangeListTypeData.EDIT;
				rowEditStateStub.returns(response);

				expect(viewBomController.isRowMarkedForRemoval(affectedRow)).to.be.false;
			});
			it('Should only return true if the row is a marked to be removed', () => {
				response.changeType = mockBomChangeListTypeData.REMOVE;
				rowEditStateStub.returns(response);

				expect(viewBomController.isRowMarkedForRemoval(affectedRow)).to.be.true;
			});
		});

		describe('[METHOD] isNewlyAddedRow', () => {
			it('Should return the isNewlyAdded property of the row', () => {
				let row = {
					isNewlyAdded: false
				};

				expect(viewBomController.isNewlyAddedRow(row)).to.be.false;
				row.isNewlyAdded = true;
				expect(viewBomController.isNewlyAddedRow(row)).to.be.true;
			});
		});

		describe('[METHOD] exportBom', () => {
			it('Should export the bom', () => {
				viewBomController.bomDataController.configurationStateMachine.getEffectiveDate.returns('1999-01-21');
				viewBomController.bomDataController.configurationStateMachine.getRevisionBias.returns('working');
				viewBomController.bomDataController.currentViewDef.getTitle.returns('Test view');

				let config = {
					viewTitle: 'Test view',
					date: '1999-01-21',
					bias: 'working'
				};

				expect(viewBomController.BomExporter.exportBom.called).to.be.false;
				viewBomController.exportBom();
				expect(viewBomController.BomExporter.exportBom.calledOnce).to.be.true;
				expect(viewBomController.BomExporter.exportBom.calledWith(sinon.match.any, mockItemObj, sinon.match(config))).to.be.true;
			});
		});
	});
});
