System.get('com/autodesk/filters.js');

'use strict';
/* TODO: need more test cases to test infinite scrolling and server sorting.*/
describe('ViewChangeLogController', function () {

	var $controllerConstructor, scope, $rootScope, $state, $timeout, $q, stateParams, filter, underscore;
	var EventService, PermissionService, PLMPermissions;
	var mockModelsManager, mockChangeLogObj, mockItemObj, mockUserObj, mockLocationObj;
	var mockUserProfileData, mockViewChangeLogData;
	var provide, ctrl;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'com/autodesk/components/workspaceItem/viewChangeLog/viewChangeLog.js',
		'plm360',
		'com/autodesk/filters.js',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(function () {

		module(function ($provide) {
			provide = $provide;
		});

		inject(function (
			$controller,
			$httpBackend,
			_$rootScope_,
			_$state_,
			$stateParams,
			$filter,
			_$timeout_,
			_$q_,
			_,
			_EventService_,
			_PermissionService_,
			_PLMPermissions_,
			MockLocationObj,
			MockLocalizationData,
			MockModelsManager,
			MockItemObj,
			MockUserObj,
			MockChangeLogObj,
			MockUserProfile,
			MockViewChangeLogData
		) {
			$controllerConstructor = $controller;
			$rootScope = _$rootScope_;
			scope = $rootScope.$new();
			$state = _$state_;
			stateParams = $stateParams;
			filter = $filter;
			$timeout = _$timeout_;
			$q = _$q_;
			underscore = _;
			EventService = _EventService_;
			PermissionService = _PermissionService_;
			PLMPermissions = _PLMPermissions_;

			$httpBackend.when('GET', 'lib/plm-localization/dist/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.expectGET('build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expectGET('components/workspaceItems/workspaceItems.html').respond(200, '');
			$httpBackend.expectGET('components/mainDashboard/mainDashboard.html').respond(200, '');

			$rootScope.bundle = MockLocalizationData;

			mockModelsManager = new MockModelsManager();
			mockChangeLogObj = new MockChangeLogObj();
			mockItemObj = new MockItemObj();
			mockUserObj = new MockUserObj();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: '1',
				tab: '',
				view: '',
				mode: ''
			});

			mockViewChangeLogData = MockViewChangeLogData;
			mockUserProfileData = MockUserProfile;

			provide.value('UserProfileData', mockUserProfileData);
			provide.value('ViewChangeLogData', mockViewChangeLogData);

			sinon.spy($state, 'go');
			stateParams = {
				workspaceId: 59,
				itemId: 1
			};

			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
			mockChangeLogObj.getFullList.returns(mockViewChangeLogData[0]);
		});

		ctrl = $controllerConstructor('ViewChangeLogController', {
			$scope: scope,
			$rootScope: $rootScope,
			$state: $state,
			$stateParams: stateParams,
			$filter: filter,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			EventService: EventService,
			PermissionService: PermissionService,
			PLMPermissions: PLMPermissions,
			_: underscore
		});
	});

	it('initializes the changelog table with data', function () {
		EventService.send('changeLog:1:done', mockChangeLogObj);

		expect(ctrl.tableData.columns).to.have.length(4);
		expect(ctrl.tableData.rows).to.have.length(2);
		expect(ctrl.tableData.rows[0].description).to.contain('description1');
		expect(ctrl.tableData.rows[0].description).to.contain('oldValue1');
		expect(ctrl.tableData.rows[0].description).to.contain('newValue1');
		expect(ctrl.tableData.rows[1].description).to.contain('oldValue2');
	});

	it('listens for the current user\'s date format', function () {
		EventService.send('currentUser:currentUser:done', mockUserObj);

		expect(ctrl.dateFormat).to.equal('MM/dd/yyyy');
	});

	it('redirects to item details view when there is no view change log permission', function () {
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(false));

		EventService.send('itemInstance:1:done', mockItemObj);
		$timeout.flush();

		expect($state.go).to.have.been.calledWith('details');
	});
});
