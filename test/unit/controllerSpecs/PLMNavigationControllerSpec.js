'use strict';

/**
  * The basic unit tests for plmNavigationController.
  */
describe('PLMNavigationController', () => {

	let $controller = null;
	let scope = null;
	let $rootScope = null;
	let $q= null;
	let $mdDialog = null;
	let ModelsManager = null;
	let ctrl = null;
	let mockRESTWrapperService = null;
	let EventService = null;
	let $timeout = null;
	let mockUserObj = null;
	let app = null;
	let mockMdComponentRegistry = null;
	let NavigationPanels = System.get('com/autodesk/components/plmNavigation/plmNavigationPanels.js').default;

	let initCtrl = () => {
		ctrl = $controller('PLMNavigationController', {
			$scope: scope,
			$rootScope: $rootScope,
			RESTWrapperService: mockRESTWrapperService,
			EventService: EventService,
			$mdComponentRegistry: mockMdComponentRegistry
		});
	};

	beforeEach(module(
		'plm360',
		'com/autodesk/apiModelsManager.js',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(() => {

		inject((
			_$controller_,
			_$httpBackend_,
			_$rootScope_,
			_$timeout_,
			_ModelsManager_,
			App,
			_EventService_,
			MockRESTWrapperService,
			MockLocalizationData,
			MockUserObj,
			_$q_,
			_$mdDialog_
		) => {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			scope = $rootScope.$new();
			$q = _$q_;
			$mdDialog = _$mdDialog_;
			ModelsManager = _ModelsManager_;
			app = App;
			$timeout = _$timeout_;
			mockRESTWrapperService = new MockRESTWrapperService();
			EventService = _EventService_;
			mockUserObj = new MockUserObj();

			_$httpBackend_.when('GET', '/api/rest/v1/token').respond('');
			_$httpBackend_.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);

			$rootScope.bundle = MockLocalizationData;

			_$httpBackend_.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			_$httpBackend_.when('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');

			mockRESTWrapperService.get.returns($q.when([{}]));

			mockMdComponentRegistry = {
				when: sinon.stub()
			};
			let sidenavComponent = {
				isOpen: () => {},
				toggle: () => {}
			};
			mockMdComponentRegistry.when.withArgs('sidenav-content').returns($q.when(sidenavComponent));
		});
	});

	it('should enable the event integration icon', () => {
		let features = [{
			title: 'webhooks.publishevent'
		}];
		mockRESTWrapperService.get.withArgs('api/v3/tenant/enabled-features').returns($q.when(features));

		initCtrl();

		scope.$digest();
		expect(ctrl.$scope.enabledPLMJitterBitIntegration).to.be.true;
	});

	it('should not enable the event integration icon', () => {
		let features = [{
			title: 'different title'
		}];
		mockRESTWrapperService.get.withArgs('api/v3/tenant/enabled-features').returns($q.when(features));

		initCtrl();

		scope.$digest();
		expect(ctrl.$scope.enabledPLMJitterBitIntegration).to.be.false;
	});

	it('gets the datatab uri', () => {
		let response = {
			items: [{
				links: {
					link: {
						href: 'someurl'
					}
				}
			}]
		};
		mockRESTWrapperService.get.withArgs('api/v3/hubs?edition=business').returns($q.when(response));

		mockRESTWrapperService.get.withArgs('api/v3/tenant/enabled-features').returns($q.when([{
			title: 'customerEnvironment.A360'
		}, {
			title: 'wip.datatab'
		}]));

		initCtrl();

		scope.$digest();
		expect(ctrl.dataTabUri).to.equal('someurl/g/all_projects/active');
		expect(ctrl.dataTabTitle).to.equal('Data Tab');
	});

	it('does not get the datatab uri without wip.datatab feature enabled', () => {

		mockRESTWrapperService.get.withArgs('api/v3/tenant/enabled-features').returns($q.when([{
			title: 'customerEnvironment.A360'
		}]));

		initCtrl();

		scope.$digest();
		expect(ctrl.dataTabUri).to.equal('');
		expect(ctrl.dataTabTitle).to.equal('Temporarily Unavailable');
	});

	it('does not get the datatab uri without customerEnvironment.A360 feature enabled', () => {

		mockRESTWrapperService.get.withArgs('api/v3/tenant/enabled-features').returns($q.when([{
			title: 'wip.datatab'
		}]));

		initCtrl();

		scope.$digest();
		expect(ctrl.dataTabUri).to.equal('');
		expect(ctrl.dataTabTitle).to.equal('Temporarily Unavailable');
	});

	it('does not get the datatab uri when unavailable', () => {

		mockRESTWrapperService.get.withArgs('api/v3/hubs?edition=business').returns($q.when({}));

		initCtrl();

		scope.$digest();
		expect(ctrl.dataTabUri).to.equal('');
		expect(ctrl.dataTabTitle).to.equal('Temporarily Unavailable');
	});

	it('Should fetch the help links', () => {
		let fetchStub = sinon.stub(ModelsManager, 'getConfigurations');
		let configurations = {
			getConfig: sinon.stub()
		};
		configurations.getConfig.withArgs('supportEmail').returns({
			title: 'someEmail'
		});
		configurations.getConfig.withArgs('helpLocation').returns({
			title: 'someHelpLocation'
		});

		initCtrl();
		scope.$digest();

		EventService.send('configurations:tenant:done', configurations);
		expect(ctrl.helpLinks.helpLink).to.equal('someHelpLocation');
		expect(ctrl.helpLinks.adminEmail).to.equal('someEmail');
	});

	describe('getHelpLink', () => {
		it('Should return the link to the help', () => {
			initCtrl();
			scope.$digest();

			expect(ctrl.getHelpLink()).to.be.undefined;
			ctrl.helpLinks = {
				helpLink: 'someLink'
			};
			expect(ctrl.getHelpLink()).to.equal(ctrl.helpLinks.helpLink);
		});
	});

	describe('getAdminEmail', () => {
		it('Should return the email to the admin', () => {
			initCtrl();
			scope.$digest();

			expect(ctrl.getAdminEmail()).to.be.undefined;
			ctrl.helpLinks = {
				adminEmail: 'someEmail'
			};
			expect(ctrl.getAdminEmail()).to.equal(ctrl.helpLinks.adminEmail);
		});
	});

	describe('[Panel Navigation]', () => {
		beforeEach(() => {
			initCtrl();
			scope.$digest();
			$timeout.flush();

			sinon.stub(ctrl, 'isOpen');
			sinon.stub(ctrl, 'togglePanel');
		});

		it('Should init with the panel as the default panel', () => {
			expect(ctrl.currentPanel).to.equal(NavigationPanels.DEFAULT);
		});

		describe('[isAtPanel]', () => {
			it('Should return true if the panel matches', () => {
				expect(ctrl.isAtPanel(NavigationPanels.DEFAULT)).to.be.true;
			});

			it('Should return false if the panel does not match', () => {
				expect(ctrl.isAtPanel(NavigationPanels.HELP)).to.be.false;
			});
		});

		describe('[goToDefaultPanel]', () => {
			it('Should set the current panel to default', () => {
				ctrl.currentPanel = NavigationPanels.HELP;
				ctrl.goToDefaultPanel();
				expect(ctrl.isAtPanel(NavigationPanels.DEFAULT)).to.be.true;
			});

			it('Should unset any current categories', () => {
				ctrl.currentCategory = 'some category';
				ctrl.goToDefaultPanel();
				expect(ctrl.currentCategory).to.be.undefined;
			});
		});

		describe('[goBack]', () => {
			it('Should return the default category', () => {
				ctrl.currentPanel = NavigationPanels.HELP;
				ctrl.goBack();
				expect(ctrl.isAtPanel(NavigationPanels.DEFAULT)).to.be.true;
			});
		});

		describe('[goToInnerPanel]', () => {
			it('Should set the current panel', () => {
				ctrl.goToInnerPanel(NavigationPanels.HELP);
				expect(ctrl.isAtPanel(NavigationPanels.HELP)).to.be.true;
			});

			it('Should call togglePanel if the menu is closed', () => {
				ctrl.isOpen.returns(false);
				expect(ctrl.togglePanel.called).to.be.false;
				ctrl.goToInnerPanel(NavigationPanels.HELP);
				expect(ctrl.togglePanel.calledOnce).to.be.true;
			});

			it('Should not call togglePanel if the menu is open', () => {
				ctrl.isOpen.returns(true);
				expect(ctrl.togglePanel.called).to.be.false;
				ctrl.goToInnerPanel(NavigationPanels.HELP);
				expect(ctrl.togglePanel.called).to.be.false;
			});
		});

		describe('[closeMenu]', () => {
			it('Should close the menu and return to the default panel if the menu is open', () => {
				ctrl.isOpen.returns(true);
				ctrl.currentPanel = NavigationPanels.HELP;

				expect(ctrl.togglePanel.called).to.be.false;
				ctrl.closeMenu();
				expect(ctrl.togglePanel.calledOnce).to.be.true;
				expect(ctrl.isAtPanel(NavigationPanels.DEFAULT)).to.be.true;
			});

			it('Should do nothing if the panel is closed', () => {
				ctrl.isOpen.returns(false);
				expect(ctrl.togglePanel.called).to.be.false;
				ctrl.closeMenu();
				expect(ctrl.togglePanel.called).to.be.false;
			});
		});
	});

	describe('[interfaceStyleMandated]', () => {
		beforeEach(() => {
			mockUserObj.json = {
				id: 'plmautotest',
				active: 'Y',
				interfaceStyleMandated: false
			};

			initCtrl();
			scope.$digest();
		});

		it('should check the modified value of interfaceStyleMandated property', () => {
			expect(ctrl.interfaceStyleMandated).to.be.true;
			EventService.send('currentUser:currentUser:done', mockUserObj);
			expect(ctrl.interfaceStyleMandated).to.be.false;
		});
	});

	describe('[checkIfUserIsAllowedAdmin method]', () => {
		beforeEach(() => {
			mockUserObj.json = {
				id: 'plmautotest',
				active: 'Y',
				interfaceStyleMandated: false
			};

			initCtrl();
			scope.$digest();

			EventService.send('currentUser:currentUser:done', mockUserObj);
		});

		it('should check the starting value of isUserAllowedToAdmin property', () => {
			expect(ctrl.isUserAllowedToAdmin).to.be.false;
		});

		it('should not allow a PARTICIPANT license', () => {
			ctrl.checkIfUserIsAllowedAdmin();

			EventService.send('userProfile:userProfile:done', {licenseType: 'PARTICIPANT'});
			EventService.send('userTenantPermissions:plmautotest:get', {permissions: [{title: 'Administer Users'}]});

			$timeout.flush();

			expect(ctrl.isUserAllowedToAdmin).to.be.false;
		});

		it('should not allow an inactive user', () => {
			ctrl.currentUser.json.active = 'N';

			ctrl.checkIfUserIsAllowedAdmin();

			EventService.send('userProfile:userProfile:done', {licenseType: 'PROFESSIONAL'});
			EventService.send('userTenantPermissions:plmautotest:get', {permissions: [{title: 'Administer Users'}]});

			$timeout.flush();

			expect(ctrl.isUserAllowedToAdmin).to.be.false;
		});

		it('should not allow a user without "Administer Users" permission', () => {
			ctrl.checkIfUserIsAllowedAdmin();

			EventService.send('userProfile:userProfile:done', {licenseType: 'PROFESSIONAL'});
			EventService.send('userTenantPermissions:plmautotest:get', {permissions:[{title:'Unit Testing'}]});

			$timeout.flush();

			expect(ctrl.isUserAllowedToAdmin).to.be.false;
		});

		it('should allow an active user with a PROFESSIONAL license, with the "Administer Users" permission', () => {
			ctrl.checkIfUserIsAllowedAdmin();

			EventService.send('userProfile:userProfile:done', {licenseType: 'PROFESSIONAL'});
			EventService.send('userTenantPermissions:plmautotest:get', {permissions: [{title: 'Administer Users'}]});

			$timeout.flush();

			expect(ctrl.isUserAllowedToAdmin).to.be.true;
		});

		it('should not allow a user to see import without "Run Imports" permission', () => {
			ctrl.checkIfUserIsAllowedAdmin();

			EventService.send('userProfile:userProfile:done', {licenseType: 'PROFESSIONAL'});
			EventService.send('userTenantPermissions:plmautotest:get', {permissions: [{title:'Unit Testing'}]});

			$timeout.flush();

			expect(ctrl.isUserAllowedToImport).to.be.false;
		});

		it('should allow an active user to run import with the "Run Imports" permission', () => {
			ctrl.checkIfUserIsAllowedAdmin();

			EventService.send('userProfile:userProfile:done', {licenseType: 'PROFESSIONAL'});
			EventService.send('userTenantPermissions:plmautotest:get', {permissions: [{title:'Run Imports'}]});

			$timeout.flush();

			expect(ctrl.isUserAllowedToImport).to.be.true;
		});
	});

	describe('[openVignettesModal method]', () => {
		let closeMenuStub, showStub;

		beforeEach(() => {
			closeMenuStub = sinon.stub(ctrl, 'closeMenu');
			showStub = sinon.stub(ctrl.$mdDialog, 'show');
		});

		afterEach(() => {
			closeMenuStub.restore();
			showStub.restore();
		});

		it('Should close the menu', () => {
			ctrl.openVignettesModal();

			expect(closeMenuStub.calledOnce).to.be.true;
		});

		it('Should open the modal for vignettes', () => {
			ctrl.openVignettesModal();

			expect(closeMenuStub.calledOnce).to.be.true;
			expect(showStub.calledOnce).to.be.true;
		});
	});
});
