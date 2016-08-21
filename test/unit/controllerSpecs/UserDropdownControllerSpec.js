'use strict';

describe('UserDropdownController', () => {
	let userDropdownCtrl;
	let EventService;
	let mockDocument, mockWindow, mockState, mockAuthenticationService, mockModelsManager;
	let userData, mockLogoutForm;

	let UserDropdownCtrlClass = System.get('com/autodesk/components/fusionHeader/userDropdown.controller.js').default;

	beforeEach(module('com/autodesk/EventService.js'));

	beforeEach(() => {
		inject((_EventService_) => {
			EventService = _EventService_;
		});

		mockLogoutForm = {
			submit: sinon.stub()
		};
		mockDocument = [{
			querySelector: sinon.stub()
		}];
		mockDocument[0].querySelector.withArgs('#fusion-header-logOutForm').returns(mockLogoutForm);

		mockWindow = {
			location: {
				href: ''
			}
		};
		mockState = {
			go: sinon.stub()
		};
		mockAuthenticationService = {
			requestLogout: sinon.stub()
		};
		mockModelsManager = {
			getCurrentUser: sinon.stub(),
			setCurrentUserDefInterface: sinon.stub()
		};

		userData = {
			getProfileImage: sinon.stub(),
			getDisplayName: sinon.stub(),
			getEmail: sinon.stub(),
			getId: sinon.stub()
		};

		userDropdownCtrl = new UserDropdownCtrlClass(mockDocument, mockWindow, mockState, mockAuthenticationService, EventService, mockModelsManager);
	});

	afterEach(() => {
		// Cleanup lingering listener
		EventService.send('currentUser:currentUser:done', userData);
	});

	describe('[INIT]', () => {
		it('Should initialize the user info with default values', () => {
			expect(userDropdownCtrl.userInfo.userAvatar).to.deep.equal({
				small: 'images/avatar_generic_x20.png',
				medium: 'images/avatar_generic_x50.png'
			});
			expect(userDropdownCtrl.userInfo.userDisplayName).to.equal('');
			expect(userDropdownCtrl.userInfo.userEmail).to.equal('');
		});

		it('Should load the user information', () => {
			expect(mockModelsManager.getCurrentUser).to.have.been.calledOnce;
		});
	});

	describe('[METHOD] loadUserDropdownInformation', () => {
		it('Should load the user information', () => {
			mockModelsManager.getCurrentUser.reset();
			userDropdownCtrl.loadUserDropdownInformation();
			expect(mockModelsManager.getCurrentUser).to.have.been.calledOnce;
		});

		it('Should store the returned user data', () => {
			EventService.send('currentUser:currentUser:done', userData);

			userData.getProfileImage.returns('someImg');
			userData.getDisplayName.returns('myDisplayName');
			userData.getEmail.returns('myEmail');
			userData.getId.returns('myUserId');

			userDropdownCtrl.loadUserDropdownInformation();
			EventService.send('currentUser:currentUser:done', userData);
			expect(userDropdownCtrl.userInfo.userAvatar).to.equal(userData.getProfileImage());
			expect(userDropdownCtrl.userInfo.userDisplayName).to.equal(userData.getDisplayName());
			expect(userDropdownCtrl.userInfo.userEmail).to.equal(userData.getEmail());
			expect(userDropdownCtrl.userInfo.logOutAction).to.equal(`/api/v3/users/${userData.getId()}/authorizations`);
		});
	});

	describe('[METHOD] logOut', () => {
		it('Should request a logout', () => {
			expect(mockAuthenticationService.requestLogout).to.not.have.been.called;
			userDropdownCtrl.logOut();
			expect(mockAuthenticationService.requestLogout).to.have.been.calledOnce;
		});

		it('Should submit the logout form', () => {
			expect(mockLogoutForm.submit).to.not.have.been.called;
			userDropdownCtrl.logOut();
			expect(mockLogoutForm.submit).to.have.been.calledOnce;
		});
	});

	describe('[METHOD] switchToClassic', () => {
		it('Should set the interface style to class', () => {
			expect(mockModelsManager.setCurrentUserDefInterface).to.not.have.been.called;
			userDropdownCtrl.switchToClassic();
			expect(mockModelsManager.setCurrentUserDefInterface).to.have.been.calledOnce;
			expect(mockModelsManager.setCurrentUserDefInterface).to.have.been.calledWith('ClassicPLM360');

			// Cleanup
			EventService.send('currentUser:definterface:done');
		});
		it('Should change the state if change was succesful', () => {
			userDropdownCtrl.switchToClassic();
			expect(mockState.go).to.not.have.been.called;
			EventService.send('currentUser:definterface:done');
			expect(mockState.go).to.have.been.calledOnce;
		});

		it('Should not change the state if change was not succesful', () => {
			userDropdownCtrl.switchToClassic();
			expect(mockState.go).to.not.have.been.called;
			EventService.send('currentUser:definterface:error');
			expect(mockState.go).to.not.have.been.called;
		});
	});

	describe('[METHOD] goToClassicProfile', () => {
		it('Should change the location to the profile', () => {
			userDropdownCtrl.goToClassicProfile();
			expect(mockWindow.location.href).to.equal('/profile.do');
		});
	});

	describe('[METHOD] goToClassicDelegations', () => {
		it('Should change the location to the delegations', () => {
			userDropdownCtrl.goToClassicDelegations();
			expect(mockWindow.location.href).to.equal('/delegations.do');
		});
	});
});
