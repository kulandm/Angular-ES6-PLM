'use strict';

describe('HelpMenuController', () => {
	let menuCtrl;
	let $q, $timeout, EventService;
	let mockRootScope, mockScope, mockTemplateCache, mockDocument, mockFlyoutInstance, mockMdDialog, mockModelsManager;
	let openedDeferred, configurations;

	let HelpMenuCtrlClass = System.get('com/autodesk/components/fusionHeader/helpMenu.controller.js').default;

	beforeEach(module('com/autodesk/EventService.js'));

	beforeEach(() => {
		inject((_$q_, _$timeout_, _EventService_) => {
			$q = _$q_;
			$timeout = _$timeout_;
			EventService = _EventService_;
		});

		mockRootScope = {
			bundle: {}
		};
		mockScope = {};
		mockDocument = [{
			addEventListener: sinon.stub(),
			removeEventListener: sinon.stub()
		}];

		openedDeferred = $q.defer();
		mockFlyoutInstance = {
			close: sinon.stub(),
			opened: openedDeferred.promise
		};

		mockMdDialog = {
			show: sinon.stub()
		};

		mockModelsManager = {
			getConfigurations: sinon.stub()
		};
		configurations = {
			getConfig: sinon.stub()
		};
		configurations.getConfig.withArgs('supportEmail').returns({
			title: 'someEmail'
		});
		configurations.getConfig.withArgs('helpLocation').returns({
			title: 'someHelpLocation'
		});

		menuCtrl = new HelpMenuCtrlClass(mockRootScope, mockScope, mockDocument, $timeout, mockFlyoutInstance, mockMdDialog, EventService, mockModelsManager);
	});

	afterEach(() => {
		// Cleanup lingering listener
		EventService.send('configurations:tenant:done', configurations);
	});

	describe('[INIT]', () => {
		it('Should add the closer event after the menu opens', () => {
			expect(mockDocument[0].addEventListener).to.not.have.been.called;
			openedDeferred.resolve();
			expect(mockDocument[0].addEventListener).to.not.have.been.called;
			$timeout.flush();
			expect(mockDocument[0].addEventListener).to.have.been.calledOnce;
		});

		it('Should add the localization bundle to the scope', () => {
			expect(mockScope.bundle).to.equal(mockRootScope.bundle);
		});

		it('Should init help links as undefined', () => {
			expect(menuCtrl.helpLinks).to.exist;
			expect(menuCtrl.helpLinks.helpLink).to.be.undefined;
			expect(menuCtrl.helpLinks.adminEmail).to.be.undefined;
		});

		it('Should retrieve the help links', () => {
			expect(mockModelsManager.getConfigurations).to.have.been.calledOnce;
		});
	});

	describe('[METHOD] retrieveHelpLinks', () => {
		it('Should retrieve the help links', () => {
			mockModelsManager.getConfigurations.reset();

			menuCtrl.retrieveHelpLinks();
			expect(mockModelsManager.getConfigurations).to.have.been.calledOnce;
		});

		it('Should store the help links after their retrieval', () => {
			menuCtrl.retrieveHelpLinks();
			expect(menuCtrl.helpLinks.helpLink).to.be.undefined;
			expect(menuCtrl.helpLinks.adminEmail).to.be.undefined;
			EventService.send('configurations:tenant:done', configurations);

			expect(menuCtrl.helpLinks.helpLink).to.equal(configurations.getConfig('helpLocation').title);
			expect(menuCtrl.helpLinks.adminEmail).to.equal(configurations.getConfig('supportEmail').title);
		});
	});

	describe('[METHOD] getHelpLink', () => {
		it('Should return the help link', () => {
			menuCtrl.helpLinks.helpLink = 'someLinkToHelp';
			expect(menuCtrl.getHelpLink()).to.equal(menuCtrl.helpLinks.helpLink);
		});
	});

	describe('[METHOD] getAdminEmail', () => {
		it('Should return the admin emai', () => {
			menuCtrl.helpLinks.adminEmail = 'emailAddress@autodesk.com';
			expect(menuCtrl.getAdminEmail()).to.equal(menuCtrl.helpLinks.adminEmail);
		});
	});

	describe('[METHOD] openVignettesModal', () => {
		it('Should open the vignettes dialog', () => {
			expect(mockMdDialog.show).to.not.have.been.called;
			menuCtrl.openVignettesModal();
			expect(mockMdDialog.show).to.have.been.calledOnce;
		});
	});

	describe('[METHOD] addFlyoutCloserEvent', () => {
		it('Should add the capturing click listener after a delay', () => {
			let addStub = mockDocument[0].addEventListener.withArgs('click', sinon.match.func, true);
			menuCtrl.addFlyoutCloserEvent();
			expect(addStub).to.not.have.been.called;
			$timeout.flush();
			expect(addStub).to.have.been.calledOnce;
		});

		it('Should close the flyout instance after a delay once the event has been fired', () => {
			menuCtrl.addFlyoutCloserEvent();
			$timeout.flush();
			let eventFn = mockDocument[0].addEventListener.args[0][1];
			eventFn();
			expect(mockFlyoutInstance.close).to.not.have.been.called;
			$timeout.flush();
			expect(mockFlyoutInstance.close).to.have.been.calledOnce;
		});
	});
});
