System.get('com/autodesk/filters.js');

'use strict';

// TODO: add unit tests for revision controller workspaces
describe('ItemViewerController', function () {
	let $controller = null;
	let $scope = null;
	let $rootScope = null;
	let $state = null;
	let $q = null;
	let $filter = null;
	let $timeout = null;
	let $httpBackend = null;
	let $mdDialog = null;
	let EventService = null;
	let NotificationService = null;
	let NotificationTypes = null;
	let PLMPermissions = null;
	let underscore = null;
	let controller = null;
	let mockModelsManager = null;
	let mockLocationObj = null;
	let mockItemObj = null;
	let mockTransitionData = null;
	let mockItemData = null;
	let mockWorkspaceObj = null;
	let mockUserPermissionsObj = null;
	let mockLinkedToWorkspacesObj = null;
	let mockLinkedToWorkspacesData = null;
	let permissionService = null;
	let LocalizationService = null;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'com/autodesk/components/itemViewer/itemViewer.js',
		'plm360', 'plm360.models', 'com/autodesk/filters.js', 'plm360.mockObjects', 'plm360.mockData', 'plm360.permissions'));

	beforeEach(function () {
		permissionService = sinon.stub({
			hasPermissions: function () {}
		});

		LocalizationService = sinon.stub({
			init: function () {},
			translate: function () {}
		});

		module(function ($provide) {
			$provide.value('LocalizationService', LocalizationService);
		});

		inject(function (
			_$controller_,
			_$rootScope_,
			_$state_,
			_$q_,
			_$filter_,
			_$timeout_,
			_$mdDialog_,
			$httpBackend,
			MockModelsManager,
			MockLocationObj,
			_EventService_,
			_LocalizationService_,
			_NotificationService_,
			_NotificationTypes_,
			_PLMPermissions_,
			_,
			MockLocalizationData,
			MockItemObj,
			MockTransitionData,
			MockItemData,
			MockWorkspaceObj,
			MockUserPermissionsObj,
			MockLinkedToWorkspacesObj,
			MockLinkedToWorkspacesData,
			MockWorkspacesData
		) {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			$scope = _$rootScope_.$new();
			$state = _$state_;
			$q = _$q_;
			$filter = _$filter_;
			$timeout = _$timeout_;
			$mdDialog = _$mdDialog_;
			$httpBackend = $httpBackend;
			EventService = _EventService_;
			NotificationService = _NotificationService_;
			LocalizationService= _LocalizationService_;
			NotificationTypes = _NotificationTypes_;
			PLMPermissions = _PLMPermissions_;
			underscore = _;

			mockModelsManager = new MockModelsManager();
			mockLocationObj = new MockLocationObj();
			mockUserPermissionsObj = new MockUserPermissionsObj();
			mockItemObj = new MockItemObj();
			mockItemData = MockItemData;
			mockTransitionData = mockTransitionData;

			mockItemObj.workspaceObj = new MockWorkspaceObj();
			mockItemObj.workspaceObj.getId.returns('10');
			mockItemObj.workspaceObj.getTypeId.returns('6'); // Revision Controlled Workspace Type
			mockItemObj.getWorkspaceObj.returns(mockItemObj.workspaceObj);
			mockItemObj.getItemTitle.returns('Test Title');
			mockItemObj.isWorking.returns(true);
			mockItemObj.getFullList.returns({
				title: '',
				deleted: true,
				itemLocked: true
			});

			mockLocationObj.search.returns({
				itemId: '10',
				tab: 'workspace-item-details',
				mode: '',
				view: 'split'
			});

			var locD = $q.defer();
			locD.resolve();
			LocalizationService.init.returns($q.when('dummy value'));
			LocalizationService.translate.returns('No Data');
			sinon.stub($state, 'reload');

			$httpBackend.expect('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$rootScope.bundle = MockLocalizationData;

			mockWorkspaceObj = new MockWorkspaceObj();
			mockLinkedToWorkspacesObj = new MockLinkedToWorkspacesObj();
			mockLinkedToWorkspacesData = MockLinkedToWorkspacesData;

			mockWorkspaceObj.getFullList.returns(MockWorkspacesData);
			mockWorkspaceObj.getSimpleList.returns([{id: 1, icon: null}, {id: 10, icon: null}]); // TODO review this.
			mockWorkspaceObj.getId.returns(MockWorkspacesData.sections[0].id);
			mockLinkedToWorkspacesObj.getRevisioningWorkspaces.returns([MockLinkedToWorkspacesData.workspaces[1]]);

			permissionService.hasPermissions.returns(Promise.resolve(true));
		});

		controller = $controller('ItemViewerController', {
			$scope: $scope,
			$rootScope: $rootScope,
			$state: $state,
			$location: mockLocationObj,
			$stateParams: {
				workspaceId: 1,
				itemId: 10
			},
			$q: $q,
			$filter: $filter,
			ModelsManager: mockModelsManager,
			EventService: EventService,
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes,
			_: underscore,
			PLMPermissions: PLMPermissions,
			PermissionService: permissionService,
			$mdDialog: $mdDialog,
			LocalizationService: LocalizationService
		});
	});

	it('goToTab should call location.search', function () {
		$timeout.flush();
		controller.goToTab('details', 'details');

		expect(mockLocationObj.search).to.be.called;
	});

	it('getActiveTab should call location.search', function () {
		$timeout.flush();
		controller.getActiveTab('workspace-item-details', 'details');

		expect(mockLocationObj.search).to.be.called;
	});

	it('getActiveTab with optional parameter should call location.search', function () {
		$timeout.flush();
		controller.getActiveTab('named-relationships', 'details', 'AML');

		expect(mockLocationObj.search).to.be.called;
	});

	it('gotoItemsList should call location.search', function () {
		$timeout.flush();
		controller.gotoItemsList();

		expect(mockLocationObj.search).to.be.called;
	});

	it('should test the proceed transition', function () {
		sinon.spy(EventService, 'send');
		$timeout.flush();

		var resultObj = {
			comments: 'dummy comments',
			transition: mockTransitionData,
			selectedUserImpersonation: {
				link: '/api/v3/users/PLMAutoTest'
			}
		};

		mockItemObj.performTransition.returns($q.when(''));
		controller.currentItemObj = mockItemObj;
		controller.proceedTransition(resultObj);
		expect(EventService.send).to.have.been.calledWith('itemInstance:10:performTransition');

		EventService.send('itemInstance:10:performTransitionDone', true);
		expect(controller.processingTransition).to.equal(false);
	});

	it.skip('should call the initPanel when the save and close action is triggerred from the quick create ECO', function () {
		sinon.stub(controller, 'initPanel');
		controller.init();
		EventService.send('itemAddedToECO:done', true);
		$rootScope.$digest();
		expect(controller.initPanel).to.be.calledOnce;
	});

	it('initPanelAndReload should work properly', function () {
		sinon.stub(controller, 'initPanel');
		controller.initPanelAndReload();
		expect(controller.initPanel).to.be.calledOnce;
		expect($state.reload).to.be.calledOnce;
	});

	it('should call the proceedTransition method with false', function () {
		var resultObj = {
			comments: 'dummy comments',
			transition: mockTransitionData,
			selectedUserImpersonation: {
				link: '/api/v3/users/PLMAutoTest'
			}
		};

		mockItemObj.performTransition.returns($q.when(''));
		controller.currentItemObj = mockItemObj;
		controller.proceedTransition(resultObj);

		EventService.send('itemInstance:10:performTransitionDone', false);
		expect(controller.processingTransition).to.equal(false);
	});

	it('navigateToRoamer should take to the Roamer Tree View', function () {
		controller.navigateToRoamer();

		expect(controller.navigateToRoamer).to.be.defined;
		expect(typeof controller.navigateToRoamer).to.equal('function');
	});

	it('sets the \'isItemAdded\' flag after checking for revision controlled workspace', function () {
		$timeout.flush();
		controller.initPanel();

		expect(controller.isItemAdded).to.be.undefined;

		EventService.send('itemInstance:10:done', mockItemObj);

		expect(controller.isItemAdded).to.be.true;
	});

	it('gets all workspaces for the workspace sections', function () {
		expect(controller.workspaceSections).to.be.undefined;
		controller.init();
		EventService.send('workspaces:all:done', mockWorkspaceObj);

		expect(controller.workspaceSections).to.be.defined;
		expect(controller.workspaceSections).to.have.length(3);
	});

	it('gets the list of permitted workspaces and sets the \'isCreatePermitted\' flag', function () {
		$timeout.flush();
		controller.initPanel();

		EventService.send('itemInstance:10:done', mockItemObj);
		EventService.send('linkedToWorkspaces:10:done', mockLinkedToWorkspacesObj);
		EventService.send('workspaceInstance:9:done', mockWorkspaceObj);

		return controller.linkedToWorkspaces.then(function (result) {
			expect(result).to.deep.equal([mockWorkspaceObj]);
			expect(controller.isCreatePermitted).to.be.true;
		});
	});

	it('resets the \'isCreatePermitted\' flag to false (for non-revision controlled workspaces)', () => {
		$timeout.flush();
		controller.isCreatePermitted = true;
		controller.initPanel();

		EventService.send('itemInstance:10:done', mockItemObj);
		expect(controller.isCreatePermitted).to.be.false;
	});

	it('sets the \'isCreatePermitted\' flag as false when there are no permitted workspaces', function () {
		$timeout.flush();
		controller.initPanel();

		permissionService.hasPermissions.returns(Promise.resolve(false));

		EventService.send('itemInstance:10:done', mockItemObj);
		EventService.send('linkedToWorkspaces:10:done', mockLinkedToWorkspacesObj);
		EventService.send('workspaceInstance:9:done', mockWorkspaceObj);

		return controller.linkedToWorkspaces.then(function (result) {
			expect(result).to.be.empty;
			expect(controller.isCreatePermitted).to.be.false;
		});
	});

	it('sets the \'isCreatePermitted\' flag as true when there are some permitted workspaces', function () {
		$timeout.flush();
		controller.initPanel();

		mockLinkedToWorkspacesObj.getRevisioningWorkspaces.returns([
			mockLinkedToWorkspacesData.workspaces[1],
			mockLinkedToWorkspacesData.workspaces[2]
		]);

		EventService.send('itemInstance:10:done', mockItemObj);
		EventService.send('linkedToWorkspaces:10:done', mockLinkedToWorkspacesObj);

		permissionService.hasPermissions.returns(Promise.resolve(false));
		EventService.send('workspaceInstance:99:done', mockWorkspaceObj);

		permissionService.hasPermissions.returns(Promise.resolve(true));
		EventService.send('workspaceInstance:9:done', mockWorkspaceObj);

		return controller.linkedToWorkspaces.then(function () {
			expect(controller.isCreatePermitted).to.be.true;
		});
	});

	it('triggers the create dialog', function () {
		$timeout.flush();
		controller.initPanel();
		EventService.send('itemInstance:10:done', mockItemObj);

		var spy = sinon.spy($mdDialog, 'show');

		controller.triggerCreate();

		expect(spy.called).to.be.true;
	});

	it('updates \'isArchived\' to true', () => {
		$timeout.flush();
		controller.initPanel();
		EventService.send('itemInstance:10:done', mockItemObj);

		expect(controller.isArchived).to.be.true;
	});

	it('updates \'isLocked\' to true', () => {
		$timeout.flush();
		controller.initPanel();
		EventService.send('itemInstance:10:done', mockItemObj);

		expect(controller.isLocked).to.be.true;
	});

	it('updates \'isWorkingVersion\' to true', () => {
		$timeout.flush();
		controller.initPanel();
		EventService.send('itemInstance:10:done', mockItemObj);

		expect(controller.isWorkingVersion).to.be.true;
	});

	it('checks for permissions needed for archive/unarchive', () => {
		$timeout.flush();
		controller.initPanel();
		EventService.send('itemInstance:10:done', mockItemObj);
		EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
		expect(mockUserPermissionsObj.hasPermission).to.be.called;
	});

	it('checks workspace transition dropdown is visible when workflow transitions are available', () => {
		controller.initPanel();
		EventService.send('itemInstance:10:done', mockItemObj);
		controller.workspaceTypeId = 2;
		$rootScope.$digest();
		$timeout.flush();
		EventService.send('itemTransitions:10:done', {
			transitions: [{
				name: 'State',
				customLabel: 'State Label'
			}]
		});
		expect(controller.isWorkspaceWithWorkflow).to.equal(true);
	});

	describe('[isArchiveDisabled]', () => {
		it('disables archive/unarchive if item is locked and user does not have override workflow lock', () => {
			controller.isLocked = true;
			controller.hasOverrideWorkflowLock = false;

			expect(controller.isArchiveDisabled()).to.equal(true);
		});

		it('disables archive/unarchive if item is released and user does not have override revision lock', () => {
			controller.isLocked = false;
			controller.isWorkingVersion = false;
			controller.hasOverrideRevisionLock = false;

			expect(controller.isArchiveDisabled()).to.equal(true);
		});

		it('enables archive/unarchive if item is neither locked nor released', () => {
			controller.isLocked = false;
			controller.isWorkingVersion = true;

			expect(controller.isArchiveDisabled()).to.equal(false);
		});
	});

	it('adds notification for archive', function () {
		$timeout.flush();
		controller.initPanel();

		sinon.stub(EventService, 'send');
		sinon.spy(NotificationService, 'addNotification');
		controller.currentItemObj = mockItemObj;
		controller.triggerArchive(true);

		expect(NotificationService.addNotification).to.be.calledWith(
			'success',
			'Test Title - Archived Successfully.'
		);
	});

	it('adds notification for unarchive', function () {
		$timeout.flush();
		controller.initPanel();

		sinon.stub(EventService, 'send');
		sinon.spy(NotificationService, 'addNotification');
		controller.currentItemObj = mockItemObj;
		controller.triggerArchive(false);

		expect(NotificationService.addNotification).to.be.calledWith(
			'success',
			'Test Title - Unarchived Successfully.'
		);
	});

	it('adds notification for bookmark', function () {
		$timeout.flush();
		controller.initPanel();

		sinon.stub(EventService, 'send');
		sinon.spy(NotificationService, 'addNotification');
		controller.currentItemObj = mockItemObj;
		controller.triggerBookmark('test id', true);

		expect(NotificationService.addNotification).to.be.calledWith(
			'success',
			'Test Title - Bookmarked Successfully.'
		);
	});

	it('adds notification for remove bookmark', function () {
		$timeout.flush();
		controller.initPanel();

		sinon.stub(EventService, 'send');
		sinon.spy(NotificationService, 'addNotification');
		controller.currentItemObj = mockItemObj;
		controller.triggerBookmark('test id', false);

		expect(NotificationService.addNotification).to.be.calledWith(
			'success',
			'Test Title - Bookmark Removed Successfully.'
		);
	});

	describe('[Method] isSeparatorNeeded', function () {
		let nullObject = null;
		let trueValue = true;
		let falseValue = false;
		let nonEmptyObject = {name: 'a name'};
		let response;

		describe('calling with number of params equal 1',function () {
			it('isSeparatorNeeded(null) should return false', function () {
				response = controller.isSeparatorNeeded(nullObject);
				expect(response).to.be.false;
			});
			it('isSeparatorNeeded(nonEmptyObject) should return false', function () {
				response = controller.isSeparatorNeeded(nonEmptyObject);
				expect(response).to.be.true;
			});
			it('isSeparatorNeeded(true) should return true', function () {
				response = controller.isSeparatorNeeded(trueValue);
				expect(response).to.be.true;
			});
			it('isSeparatorNeeded(false) should return false', function () {
				response = controller.isSeparatorNeeded(falseValue);
				expect(response).to.be.false;
			});
		});

		describe('calling with number of params equal 2',function () {
			it('isSeparatorNeeded(null,false) should return false', function () {
				response = controller.isSeparatorNeeded(nullObject,falseValue);
				expect(response).to.be.false;
			});
			it('isSeparatorNeeded(null,nonEmptyObject) should return true', function () {
				response = controller.isSeparatorNeeded(nullObject,nonEmptyObject);
				expect(response).to.be.true;
			});
			it('isSeparatorNeeded(nonEmptyObject,false) should return true', function () {
				response = controller.isSeparatorNeeded(nonEmptyObject,falseValue);
				expect(response).to.be.true;
			});
		});
	});
});
