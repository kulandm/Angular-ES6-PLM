System.get('com/autodesk/filters.js');

'use strict';

describe('ViewWorkflowController', () => {

	let $controller, $scope, $rootScope, $state, $timeout, $q, stateParams, filter, underscore;
	let EventService, PermissionService, PLMPermissions, UrnParser;
	let mockModelsManager, mockWorkflowObj, mockItemObj, mockUserObj, mockLocationObj;
	let mockViewWorkflowData, mockUserProfileData;
	let provide, ctrl;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'plm360',
		'com/autodesk/filters.js',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(() => {

		module($provide => {
			provide = $provide;
		});

		inject((
			$httpBackend,
			_$controller_,
			_$rootScope_,
			_$state_,
			_$timeout_,
			_$q_,
			_EventService_,
			_PermissionService_,
			_PLMPermissions_,
			_UrnParser_,
			_,
			MockModelsManager,
			MockWorkflowObj,
			MockWorkspaceObj,
			MockItemObj,
			MockUserObj,
			MockLocationObj,
			MockViewWorkflowData,
			MockWorkspaceData,
			MockUserProfile,
			MockLocalizationData
		) => {
			$controller = _$controller_;
			$scope = _$rootScope_.$new();
			$rootScope = _$rootScope_;
			$state = _$state_;
			$timeout = _$timeout_;
			$q = _$q_;
			EventService = _EventService_;
			PermissionService = _PermissionService_;
			PLMPermissions = _PLMPermissions_;
			UrnParser = _UrnParser_;
			underscore = _;

			$httpBackend.when('GET', 'lib/plm-localization/dist/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.expectGET('build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expectGET('components/workspaceItems/workspaceItems.html').respond(200, '');
			$httpBackend.expectGET('components/mainDashboard/mainDashboard.html').respond(200, '');

			$rootScope.bundle = MockLocalizationData;

			mockModelsManager = new MockModelsManager();
			mockWorkflowObj = new MockWorkflowObj();
			mockItemObj = new MockItemObj();
			mockItemObj.workspaceObj = new MockWorkspaceObj();
			mockItemObj.getWorkflowLink = () => {};
			mockUserObj = new MockUserObj();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: 'testurn',
				tab: '',
				view: '',
				mode: ''
			});

			mockViewWorkflowData = MockViewWorkflowData;
			mockUserProfileData = MockUserProfile;

			provide.value('UserProfileData', mockUserProfileData);
			provide.value('ViewWorkflowData', mockViewWorkflowData);

			stateParams = {
				workspaceId: 59,
				itemId: 2
			};

			mockWorkflowObj.getFullList.returns(mockViewWorkflowData);
			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
		});

		ctrl = $controller('ViewWorkflowController', {
			$scope: $scope,
			$rootScope: $rootScope,
			$state: $state,
			$stateParams: stateParams,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			EventService: EventService,
			PermissionService: PermissionService,
			FlyoutService: null,
			PLMPermissions: PLMPermissions,
			UrnParser: UrnParser,
			_: underscore
		});
	});

	it('initializes the workflow table with data', () => {
		EventService.send('workflow:testurn:done', mockWorkflowObj);

		// Column names:
		// 'Workflow Item', 'Workspace', 'Current State', 'Last Action',
		// 'Date of Last Action', 'Performed By', 'Created On', 'Created By'
		expect(ctrl.tableColumns.length).to.equal(8);
		expect(ctrl.tableData).to.have.length(2);
	});

	it('initializes the workspace data for each workflow item', () => {
		let urn6895 = 'urn`adsk,plm`tenant,workspace,item`TEST,111,6895';
		let urn6494 = 'urn`adsk,plm`tenant,workspace,item`TEST,200,6494';

		EventService.send('workflow:testurn:done', mockWorkflowObj);

		mockItemObj.workspaceObj.getDisplayName.returns('Change Orders');
		EventService.send(`itemInstance:${urn6895}:done`, mockItemObj);

		mockItemObj.workspaceObj.getDisplayName.returns('Change Request');
		EventService.send(`itemInstance:${urn6494}:done`, mockItemObj);

		expect(ctrl.tableData[0].itemWorkspace).to.equal('Change Orders');
		expect(ctrl.tableData[1].itemWorkspace).to.equal('Change Request');
	});

	it('does not have workflow state information if workflow-state is null', () => {
		let urn6494 = 'urn`adsk,plm`tenant,workspace,item`TEST,200,6494';

		EventService.send('workflow:testurn:done', mockWorkflowObj);

		mockItemObj.workspaceObj.getDisplayName.returns('Change Request');
		EventService.send(`itemInstance:${urn6494}:done`, mockItemObj);

		expect(ctrl.tableData[1].currentState).to.be.undefined;
		expect(ctrl.tableData[1].lastAction).to.be.undefined;
		expect(ctrl.tableData[1].dateOfLastAction).to.be.undefined;
		expect(ctrl.tableData[1].performedBy).to.be.undefined;
		expect(ctrl.tableData[1].createdOn).to.be.undefined;
		expect(ctrl.tableData[1].createdBy).to.be.undefined;
	});

	it('adds the revision information to the workflow item', () => {
		EventService.send('workflow:testurn:done', mockWorkflowObj);

		expect(ctrl.tableData[0].itemDisplayName.value).to.contain('[REV:w]');
	});

	it('has the link to the workflow item', () => {
		EventService.send('workflow:testurn:done', mockWorkflowObj);

		expect(ctrl.tableData[0].itemDisplayName.href).to.contain('tab=details');
		expect(ctrl.tableData[0].itemDisplayName.href).to.contain('workspaces/111/');
	});

	it('listens for the current user\'s date format', () => {
		EventService.send('currentUser:currentUser:done', mockUserObj);

		expect(ctrl.dateFormat.date).to.equal('MM/dd/yyyy');
	});

	it('redirects to item details view when there is no view workflow permission', () => {
		sinon.spy($state, 'go');
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(false));

		EventService.send('itemInstance:testurn:done', mockItemObj);
		$timeout.flush();

		expect($state.go).to.have.been.calledWith('details');
	});

	it('initiates flyout service successfully', () => {
		let flyoutServiceInitiated = false;

		ctrl = $controller('ViewWorkflowController', {
			$scope: $scope,
			$rootScope: $rootScope,
			$stateParams: stateParams,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			EventService: EventService,
			_: underscore,
			FlyoutService: {
				open: () => {
					flyoutServiceInitiated = true;
				}
			}
		});

		expect(flyoutServiceInitiated).to.be.false;
		ctrl.openFlyoutWindow({}, 'owner flyout name');
		expect(flyoutServiceInitiated).to.be.true;
	});
});
