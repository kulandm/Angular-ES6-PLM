'use strict';

describe('ViewGridController', function () {

	var $controllerConstructor, scope, rootScope, state, stateParams, q, eventService, underscore;
	var mockModelsManager, mockItemObj, mockUserObj, mockWorkspaceObj, mockGridObj, mockGridMetaObj, mockLocationObj;
	var mockViewGridData, mockViewGridMetaData, mockWorkspaceData, mockUserProfileData;
	var provide, ctrl;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.permissions',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(function () {

		module(function ($provide) {
			provide = $provide;
		});

		inject(function ($controller, $httpBackend, $rootScope, $state, $stateParams, $q, _, EventService, MockWorkspaceObj, MockUserObj, MockItemObj, MockGridObj, MockGridMetaObj, MockModelsManager, MockLocationObj, MockWorkspaceData, MockUserProfile, MockViewGridData, MockViewGridMetaData, MockLocalizationData) {
			$controllerConstructor = $controller;
			scope = $rootScope.$new();
			rootScope = $rootScope;
			state = $state;
			stateParams = $stateParams;
			q = $q;
			underscore = _;
			eventService = EventService;

			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);

			rootScope.bundle = MockLocalizationData;

			mockModelsManager = new MockModelsManager();
			mockWorkspaceObj = new MockWorkspaceObj();
			mockUserObj = new MockUserObj();
			mockItemObj = new MockItemObj();
			mockGridObj = new MockGridObj();
			mockGridMetaObj = new MockGridMetaObj();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: '2',
				tab: '',
				view: '',
				mode: ''
			});

			mockWorkspaceData = MockWorkspaceData;
			mockUserProfileData = MockUserProfile;
			mockViewGridData = MockViewGridData;
			mockViewGridMetaData = MockViewGridMetaData;

			provide.value('UserProfileData', mockUserProfileData);
			provide.value('ViewGridMetaData', mockViewGridMetaData);
			provide.value('ViewGridData', mockViewGridData);

			stateParams = {
				workspaceId: 59,
				itemId: 2
			};

			mockWorkspaceObj.getFullList.returns(mockWorkspaceData);
			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
			mockGridObj.getFullList.returns(mockViewGridData[0]);
			mockGridMetaObj.getFullList.returns(mockViewGridMetaData);
			mockGridMetaObj.fetchFieldDefinitions.returns(q.when(''));
		});

		ctrl = $controllerConstructor('ViewGridController', {
			$scope: scope,
			$rootScope: rootScope,
			$state: state,
			$stateParams: stateParams,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			EventService: eventService,
			_: underscore
		});
	});

	describe('iniitialize grid with \'addRow\'', function () {
		beforeEach(inject(function ($state) {
			state = $state;
			state.params = {
				addRow: 'addRow'
			};
			state.href = 'grid';
		}));

		it('initializes the grid with data', function () {
			eventService.send('grid:2:done', mockGridObj);

			expect(ctrl.gridData).to.not.equal(null);
			expect(ctrl.tableData).to.not.equal(null);

			eventService.send('gridMeta:2:done', mockGridMetaObj);

			// 'Checkbox', 'ID', 'Customer', 'Site'
			expect(ctrl.tableColumns.length).to.equal(4);
		});

		it('listens for grid validation errors', function () {
			eventService.send('grid:validationsErrors:present', {err: 'sth'});

			expect(ctrl.errors).to.not.equal(null);
		});

		it('listens for state change and calls the checkCurrentState method', function () {
			var spy = sinon.spy(ctrl, 'checkCurrentState');

			// TODO: Sending state:change:done is causing conflicts in other views
			// Figure out a workaround to listen for state changes?
			// eventService.send('state:change:done');

			// expect(spy.called).to.be.true;
		});

		it('saves data on save event', function () {
			eventService.send('grid:2:done', mockGridObj);
			eventService.send('gridMeta:2:done', mockGridMetaObj);

			// TODO: Save function currently not working, relook into test when save is ready
			// ctrl.triggerSave();

			// expect(ctrl.tableData[0].waiting).to.be.true;
			// eventService.send('grid:2:saveDone', true);
			// expect(ctrl.tableData[0].waiting).to.be.false;
		});

		it.skip('returns to the view state upon canceling edit', function () {
			eventService.send('grid:2:done', mockGridObj);
			eventService.send('gridMeta:2:done', mockGridMetaObj);

			var oldGrid = ctrl.tableData;

			ctrl.triggerEdit(true);
			ctrl.triggerCancel();

			var newGrid = ctrl.tableData;

			expect(newGrid).to.equal(oldGrid);
		});
	});

	describe('initialize grid without \'addRow\'', function () {
		beforeEach(inject(function ($state) {
			state = $state;
			state.params = {};
		}));

		it('parses grid data even if the \'addRow\' parameter is not defined', function () {
			eventService.send('grid:2:done', mockGridObj);
			eventService.send('gridMeta:2:done', mockGridMetaObj);

			expect(ctrl.tableData).to.not.equal(null);
		});
	});
});
