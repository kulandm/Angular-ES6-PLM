'use strict';

describe('ViewAttachmentsController', function () {

	var $controller = null;
	var $state = null;
	var $timeout = null;
	var $q = null;
	var EventService = null;
	var PermissionService = null;
	var NotificationService = null;
	var mockItemObj = null;
	var mockWorkspaceObj = null;
	var mockUserObj = null;

	var ViewAttachmentsCtrl = null;

	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.models',
		'plm360.mockData',
		'plm360.mockObjects',
		'plm360.permissions'
	));

	// Setup for each test
	beforeEach(function () {
		inject(function (
			_$controller_,
			$httpBackend,
			$rootScope,
			_$state_,
			_$timeout_,
			_$q_,
			_,
			_EventService_,
			_PermissionService_,
			_NotificationService_,
			PLMPermissions,
			MockModelsManager,
			MockItemObj,
			MockWorkspaceObj,
			MockUserObj,
			MockUserProfile,
			MockLocalizationData,
			UrnParser
		) {
			$controller = _$controller_;
			$state = _$state_;
			$timeout = _$timeout_;
			$q = _$q_;
			EventService = _EventService_;
			PermissionService = _PermissionService_;
			NotificationService = _NotificationService_;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/dist/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.when('GET', 'components/workspaceItems/workspaceItems.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-notification/dist/notification.html')
				.respond(200);
			$httpBackend.when('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');

			$rootScope.bundle = MockLocalizationData;

			sinon.spy($state, 'go');

			mockItemObj = new MockItemObj();
			mockItemObj.workspaceObj = new MockWorkspaceObj;
			mockItemObj.getId.returns('88');
			mockItemObj.workspaceObj.getId.returns('8');
			mockItemObj.getFullList.returns({itemLocked: false});

			mockUserObj = new MockUserObj();
			mockUserObj.getId.returns(MockUserProfile.json.id);
			mockUserObj.getDisplayName.returns(MockUserProfile.json.displayName);
			mockUserObj.getDateFormat.returns(MockUserProfile.json.dateFormat);

			ViewAttachmentsCtrl = $controller('ViewAttachmentsController', {
				$scope: $rootScope.$new(),
				$rootScope: $rootScope,
				$state: $state,
				$stateParams: {
					itemId: '88',
					tab: '',
					view: '',
					mode: 'view'
				},
				ModelsManager: new MockModelsManager(),
				EventService: EventService,
				PermissionService: PermissionService,
				NotificationService: NotificationService,
				PLMPermissions: PLMPermissions,
				_: _,
				UrnParser: UrnParser
			});
		});
	});

	it('initializes the itemId and workspaceId', function () {
		EventService.send('itemInstance:88:done', mockItemObj);

		expect(ViewAttachmentsCtrl.workspaceId).to.equal('8');
		expect(ViewAttachmentsCtrl.itemId).to.equal('88');
	});

	it('initializes the user information', function () {
		EventService.send('currentUser:currentUser:done', mockUserObj);

		expect(ViewAttachmentsCtrl.userId).to.equal('PLMAutoTest');
		expect(ViewAttachmentsCtrl.userName).to.equal('PLMAutoTest Selenium1');
	});

	it('initializes the date format', function () {
		EventService.send('currentUser:currentUser:done', mockUserObj);

		expect(ViewAttachmentsCtrl.dateFormat.date).to.equal('MM/dd/yyyy');
	});

	it('redirects to item details view when there is no view attachments permission', function () {
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(false));

		EventService.send('itemInstance:88:done', mockItemObj);
		$timeout.flush();

		expect($state.go).to.have.been.calledWith('details');
	});

	describe('[showNotification]', function () {
		it('adds a success notification', function () {
			sinon.spy(NotificationService, 'addNotification');
			let response = [{type: 'success', message: 'successful'}];

			ViewAttachmentsCtrl.showNotification(response);
			expect(NotificationService.addNotification).to.be.calledWith(
				response[0].type,
				response[0].message
			);
		});

		it('adds an error notification', function () {
			sinon.spy(NotificationService, 'addNotification');
			let response = [{type: 'error', message: 'failed'}];

			ViewAttachmentsCtrl.showNotification(response);
			expect(NotificationService.addNotification).to.be.calledWith(
				response[0].type,
				response[0].message
			);
		});
	});
});
