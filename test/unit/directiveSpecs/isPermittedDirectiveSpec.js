'use strict';

/**
 * Basic tests for is permitted directive.
 */
describe('isPermittedDirective', function () {
	var $rootScope, $stateParams, $compile, $timeout, $q, $httpBackend, el;
	var EventService, PermissionService, PLMPermissions;
	var mockItemObj;

	beforeEach(module(
		'plm360',
		'plmTemplates',
		'plm360.permissions',
		'plm360.mockData',
		'plm360.mockObjects'
	));

	beforeEach(inject(function (
		_$rootScope_,
		_$stateParams_,
		_$compile_,
		_$timeout_,
		_$q_,
		_$httpBackend_,
		_EventService_,
		_PermissionService_,
		_PLMPermissions_,
		MockItemObj,
		MockLocalizationData
	) {
		$rootScope = _$rootScope_;
		$stateParams = _$stateParams_;
		$compile = _$compile_;
		$timeout = _$timeout_;
		$q = _$q_;
		$httpBackend = _$httpBackend_;

		EventService = _EventService_;
		PermissionService = _PermissionService_;
		PLMPermissions = _PLMPermissions_;

		mockItemObj = new MockItemObj();

		$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json')
			.respond(MockLocalizationData);
	}));

	beforeEach(function () {
		$rootScope.viewItemPermission = PLMPermissions.VIEW_ITEMS;
		$stateParams = {
			itemId: '',
			workspaceId: ''
		};

		sinon.stub(PermissionService, 'hasPermissions');
		sinon.stub(PermissionService, 'checkPermissionByItemId');
	});

	it('initializes with stateParams workspace id with permissions', inject(function ($stateParams) {
		$stateParams.workspaceId = 'test workspace id';
		PermissionService.hasPermissions.returns($q.when(true));

		// Note: jQuery has to be used here to append the element to the DOM.
		// Based on the permissions, we can then test if the element is visible.
		var el = $compile('<div is-permitted="{{viewItemPermission}}">content</div>')($rootScope);
		$('body').append(el);
		$rootScope.$digest();

		expect($(el).closest('html').length).to.equal(1);
		expect(el.html()).to.equal('content');
	}));

	it('initializes with stateParams workspace id without permissions', inject(function ($stateParams) {
		$stateParams.workspaceId = 'test workspace id';
		PermissionService.hasPermissions.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}">content</div>')($rootScope);
		$('body').append(el);
		$rootScope.$digest();

		expect($(el).closest('html').length).to.equal(0);
	}));

	it('initializes with stateParams item id with permissions', inject(function ($stateParams) {
		$stateParams.workspaceId = undefined;
		$stateParams.itemId = 'test item id';
		PermissionService.checkPermissionByItemId.returns($q.when(true));

		var el = $compile('<div is-permitted="{{viewItemPermission}}">content</div>')($rootScope);
		$('body').append(el);
		$rootScope.$digest();

		expect($(el).closest('html').length).to.equal(1);
		expect(el.html()).to.equal('content');
	}));

	it('initializes with stateParams item id without permissions', inject(function ($stateParams) {
		$stateParams.itemId = 'test item id';
		PermissionService.checkPermissionByItemId.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}">content</div>')($rootScope);
		$('body').append(el);
		$rootScope.$digest();

		expect($(el).closest('html').length).to.equal(0);
	}));

	it('initializes with workspace id attribute with permissions', inject(function ($stateParams) {
		$stateParams.itemId = undefined;
		$rootScope.workspaceId = 'test workspace id';
		PermissionService.hasPermissions.returns($q.when(true));

		var el = $compile('<div is-permitted="{{viewItemPermission}} workspace-id="{{workspaceId}}">content</div>')($rootScope);
		$('body').append(el);
		$rootScope.$digest();

		expect($(el).closest('html').length).to.equal(1);
		expect(el.html()).to.equal('content');
	}));

	it('initializes with workspace id attribute without permissions', inject(function ($stateParams) {
		$rootScope.workspaceId = 'test workspace id';
		PermissionService.hasPermissions.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}" workspace-id="{{workspaceId}}">content</div>')($rootScope);
		$('body').append(el);
		$rootScope.$digest();

		expect($(el).closest('html').length).to.equal(0);
	}));

	it('initializes with apply locking true', inject(function ($stateParams) {
		$stateParams.itemId = 'test item id';
		PermissionService.checkPermissionByItemId.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}" apply-lock="true">content</div>')($rootScope);
		$rootScope.$digest();

		expect($rootScope.applyLock).to.equal(true);
	}));

	it('initializes with apply locking false', inject(function ($stateParams) {
		$stateParams.itemId = 'test item id';
		PermissionService.checkPermissionByItemId.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}" apply-lock="false">content</div>')($rootScope);
		$rootScope.$digest();

		expect($rootScope.applyLock).to.equal(false);
	}));

	it('initializes with apply revision override lock true', inject(function ($stateParams) {
		$stateParams.itemId = 'test item id';
		PermissionService.checkPermissionByItemId.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}" apply-revision-override-lock="true">content</div>')($rootScope);
		$rootScope.$digest();

		expect($rootScope.applyRevisionOverrideLock).to.equal(true);
	}));

	it('initializes with apply revision override lock false', inject(function ($stateParams) {
		$stateParams.itemId = 'test item id';
		PermissionService.checkPermissionByItemId.returns($q.when(false));

		var el = $compile('<div is-permitted="{{viewItemPermission}}" apply-revision-override-lock="false">content</div>')($rootScope);
		$rootScope.$digest();

		expect($rootScope.applyRevisionOverrideLock).to.equal(false);
	}));
});
