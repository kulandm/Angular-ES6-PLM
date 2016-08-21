'use strict';

describe('ViewMilestonesController', function () {

	var $controllerConstructor;
	var state;
	var $timeout;
	var $q;

	var PermissionService;
	var EventService;
	var mockWorkspaceObj;
	var mockItemObj;
	var mockUserObj;
	var mockMilestonesObj;
	var mockUserProfileData;
	var mockStatesData;
	var mockViewMilestonesData;
	var mockLocationObj;
	var $provide;

	var ctrl;

	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.models',
		'plm360.mockData',
		'plm360.mockObjects',
		'plm360.permissions', 
		function (_$provide_) {
			$provide = _$provide_;
		}
	));

	// Setup for each test
	beforeEach(function () {
		inject(function (
			$controller,
			$httpBackend,
			$rootScope,
			$state,
			$stateParams,
			_$timeout_,
			_$q_,
			_,
			_PermissionService_,
			_EventService_,
			PLMPermissions,
			MockModelsManager,
			MockWorkspaceObj,
			MockItemObj,
			MockUserObj,
			MockMilestonesObj,
			MockUserProfile,
			MockStatesData,
			MockLocationObj,
			MockViewMilestonesData,
			MockLocalizationData
		) {
			$provide.value('moment', moment);

			$controllerConstructor = $controller;
			$timeout = _$timeout_;
			$q = _$q_;
			EventService = _EventService_;
			PermissionService = _PermissionService_;

			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.expectGET('build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expectGET('components/mainDashboard/mainDashboard.html').respond(200, '');

			$rootScope.bundle = MockLocalizationData;

			mockWorkspaceObj = new MockWorkspaceObj();
			mockItemObj = new MockItemObj();
			mockItemObj.workspaceObj = new MockWorkspaceObj();
			mockUserObj = new MockUserObj();
			mockMilestonesObj = new MockMilestonesObj();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: '42',
				tab: '',
				view: '',
				mode: ''
			});

			mockUserProfileData = MockUserProfile;
			mockStatesData = MockStatesData;
			mockViewMilestonesData = MockViewMilestonesData;

			state = {
				params: {
					workspaceId: 42,
					itemId: 42
				},
				is: function () {},
				go: function () {}
			};

			mockItemObj.workspaceObj.getId.returns('42');
			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
			mockMilestonesObj.getFullList.returns(MockViewMilestonesData);

			ctrl = $controller('ViewMilestonesController', {
				$scope: $rootScope.$new(),
				$rootScope: $rootScope,
				$state: state,
				$stateParams: state.params,
				$location: mockLocationObj,
				EventService: EventService,
				PermissionService: PermissionService,
				PLMPermissions: PLMPermissions,
				ModelsManager: new MockModelsManager(),
				_: _,
				moment: moment
			});
		});
	});

	it('initializes the milestones table with seven columns in view mode', function () {
		// Workflow State, Milestone Event, Target Date, Status, Days From,
		// Warning Days Before, Workflow Progress
		expect(ctrl.tableColumns.length).to.equal(7);
	});

	it('initializes the milestones table with data', function () {
		EventService.send('itemInstance:42:done', mockItemObj);
		EventService.send('itemState:42:done', mockItemObj);
		EventService.send('milestones:42:done', mockMilestonesObj);

		expect(ctrl.tableData.length).to.equal(7);
		expect(ctrl.tableData[0].item.title).to.equal('Coolest Phone Ever - ');

		// Check that the computed fields have been added
		expect(ctrl.tableData[0]).to.include.keys('daysFrom', 'status');
	});

	it('initializes the workspaceId', function () {
		EventService.send('itemInstance:42:done', mockItemObj);
		EventService.send('itemState:42:done', mockStatesData);

		expect(ctrl.StatesObj.length).to.equal(9);
	});

	it('initializes the date format', function () {
		EventService.send('currentUser:currentUser:done', mockUserObj);

		expect(ctrl.dateFormat.date).to.equal('MM/dd/yyyy');
	});

	it('displays the appropriate columns in edit mode', function () {
		state.params.editItem = true;
		EventService.send('state:change:done', {name: 'milestone'});

		// Workflow State, Milestone Event, Checkbox, Target Date,
		// Warning Days Before, Workflow Progress
		expect(ctrl.tableColumns.length).to.equal(6);
	});

	it('redirects to item details view when there is no view milestones permission', function () {
		sinon.spy(state, 'go');
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(false));

		EventService.send('itemInstance:42:done', mockItemObj);
		$timeout.flush();

		expect(state.go).to.have.been.calledWith('details');
	});
});
