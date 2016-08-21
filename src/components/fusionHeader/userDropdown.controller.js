/**
 * @ngdoc object
 * @name Controllers.UserDropdownController
 * @description Controller for the user dropdown in the fusion menu
 */
class UserDropdownController {
	/**
	 * @ngdoc method
	 * @name Controllers.UserDropdownController#constructor
	 * @methodOf Controllers.UserDropdownController
	 * @description Controller constructor
	 *		Loads the information for the user dropdown
	 */
	constructor($document, $window, $state, AuthenticationService, EventService, ModelsManager) {
		this.$document = $document;
		this.$window = $window;
		this.$state = $state;
		this.AuthenticationService = AuthenticationService;
		this.EventService = EventService;
		this.ModelsManager = ModelsManager;

		/**
		 * @ngdoc property
		 * @name Controllers.UserDropdownController#userInfo
		 * @propertyOf Controllers.UserDropdownController
		 * @description The informatioon about the user,
		 *		intialized to default values
		 */
		this.userInfo = {
			userAvatar: {
				small: 'images/avatar_generic_x20.png',
				medium: 'images/avatar_generic_x50.png'
			},
			userDisplayName: '',
			userEmail: ''
		};

		this.loadUserDropdownInformation();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UserDropdownController#loadUserDropdownInformation
	 * @methodOf Controllers.UserDropdownController
	 * @description Loads the information for the user dropdown
	 */
	loadUserDropdownInformation() {
		let currentUserListenerId = this.EventService.listen('currentUser:currentUser:done', (event, userObj) => {
			this.EventService.unlisten(currentUserListenerId);
			this.userInfo.userAvatar = userObj.getProfileImage();
			this.userInfo.userDisplayName = userObj.getDisplayName();
			this.userInfo.userEmail = userObj.getEmail();
			this.userInfo.logOutAction = '/api/v3/users/' + userObj.getId() + '/authorizations';
		});
		this.ModelsManager.getCurrentUser();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UserDropdownController#logOut
	 * @methodOf Controllers.UserDropdownController
	 * @description Logs out from the application
	 */
	logOut() {
		this.AuthenticationService.requestLogout();
		this.$document[0].querySelector('#fusion-header-logOutForm').submit();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UserDropdownController#switchToClassic
	 * @methodOf Controllers.UserDropdownController
	 * @description Navigates to ClassicPLM after saving the interface style value as Classic PLM
	 */
	switchToClassic() {
		let userDefInterfaceSuccessListener = this.EventService.listen('currentUser:definterface:done', () => {
			this.EventService.unlisten(userDefInterfaceSuccessListener);
			this.EventService.unlisten(userDefInterfaceErrorListener);
			this.$state.go('classic');
		});
		let userDefInterfaceErrorListener = this.EventService.listen('currentUser:definterface:error', () => {
			this.EventService.unlisten(userDefInterfaceSuccessListener);
			this.EventService.unlisten(userDefInterfaceErrorListener);
		});
		this.ModelsManager.setCurrentUserDefInterface('ClassicPLM360');
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UserDropdownController#goToClassicProfile
	 * @methodOf Controllers.UserDropdownController
	 * @description Navigates to ClassicPLM user profile
	 */
	goToClassicProfile() {
		this.$window.location.href = '/profile.do';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UserDropdownController#goToClassicDelegations
	 * @methodOf Controllers.UserDropdownController
	 * @description Navigates to ClassicPLM delegations
	 */
	goToClassicDelegations() {
		this.$window.location.href = '/delegations.do';
	}
}

UserDropdownController.$inject = ['$document', '$window', '$state', 'AuthenticationService', 'EventService', 'ModelsManager'];

export default UserDropdownController;
