/**
 * @ngdoc object
 * @name Controllers.HelpMenuController
 *
 * @description This controller is attached to Fusion header help menu
 *		This should be removed after the unified component is provided
 *
 */
class HelpMenuController {
	/**
	 * @ngdoc method
	 * @name Controllers.HelpMenuController#constructor
	 * @methodOf Controllers.HelpMenuController
	 * @description Controller constructor
	 */
	constructor($rootScope, $scope, $document, $timeout, $flyoutInstance, $mdDialog, EventService, ModelsManager) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$scope.bundle = $rootScope.bundle;
		this.$document = $document;
		this.$timeout = $timeout;
		this.$flyoutInstance = $flyoutInstance;
		this.$mdDialog = $mdDialog;
		this.EventService = EventService;
		this.ModelsManager = ModelsManager;

		/**
		 * @ngdoc property
		 * @name Controllers.HelpMenuController#helpLinks
		 * @methodOf Controllers.HelpMenuController
		 * @description Links for various help options
		 */
		this.helpLinks = {};

		this.retrieveHelpLinks();

		// After the flyout has opened, add event that will close the flyout on click
		this.$flyoutInstance.opened.then(() => {
			this.addFlyoutCloserEvent();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.HelpMenuController#retrieveHelpLinks
	 * @propertyOf Controllers.HelpMenuController
	 * @description Retrieve the links for the help menu
	 */
	retrieveHelpLinks() {
		this.EventService.listen('configurations:tenant:done', (event, configurations) => {
			// Retrieves all the configurations from the endpoint
			this.helpLinks.helpLink = configurations.getConfig('helpLocation').title;
			this.helpLinks.adminEmail = configurations.getConfig('supportEmail').title;
		});
		this.ModelsManager.getConfigurations();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.HelpMenuController#getHelpLink
	 * @methodOf Controllers.HelpMenuController
	 * @description Returns the link to the help system
	 */
	getHelpLink() {
		return this.helpLinks.helpLink;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.HelpMenuController#getAdminEmail
	 * @methodOf Controllers.HelpMenuController
	 * @description Returns the email address of the admin
	 */
	getAdminEmail() {
		return this.helpLinks.adminEmail;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.HelpMenuController#openVignettesModal
	 * @methodOf Controllers.HelpMenuController
	 * @description Opens up the modal containing the
	 * vignettes.
	 */
	openVignettesModal() {
		this.$mdDialog.show({
			templateUrl: 'build/components/plmNavigation/vignettesModal.html',
			controller: 'VignettesModalController',
			controllerAs: 'vignetteseCtrl'
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.HelpMenuController#addFlyoutCloserEvent
	 * @methodOf Controllers.HelpMenuController
	 * @description Adds an event to close the dropdown on clicking anywhere on the page
	 *		It is called after a timeout, to make sure the element exists
	 *		Event will fire before anything else (to prevent things stopping propagation)
	 *			So it needs to close after a timeout to allow anything else to happen (button click, etc)
	 */
	addFlyoutCloserEvent() {
		this.$timeout(() => {
			let closeFlyout = () => {
				this.$timeout(() => {
					this.$flyoutInstance.close();
					this.$document[0].removeEventListener('click', closeFlyout, true);
				}, 0);
			};
			this.$document[0].addEventListener('click', closeFlyout, true);
		}, 0);
	}
}

HelpMenuController.$inject = ['$rootScope', '$scope', '$document', '$timeout', '$flyoutInstance', '$mdDialog', 'EventService', 'ModelsManager'];

export default HelpMenuController;
