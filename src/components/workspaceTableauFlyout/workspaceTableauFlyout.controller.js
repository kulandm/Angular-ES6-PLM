/**
 * @ngdoc object
 * @name Controllers.WorkspaceTableauFlyoutController
 *
 * @description This controller is attached to view configuration directive for workspace items list view
 *
 * ##Dependencies
 *
 */
class WorkspaceTableauFlyoutController {

	/*
	 * @ngdoc method
	 * @name Controllers.WorkspaceTableauFlyoutController#constructor
	 * @methodOf Controllers.WorkspaceTableauFlyoutController
	 * @description The class constructor
	 */
	constructor($scope, $rootScope, $timeout, $compile, $q, LocalizationService, ModelsManager, EventService, NotificationService, NotificationTypes, UrnParser, _, FlyoutService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.$compile = $compile;
		this.FlyoutService = FlyoutService;
		this.$q = $q;
		this._ = _;
		this.LocalizationService = LocalizationService;
		this.EventService = EventService;
		this.NotificationService = NotificationService;
		this.ModelsManager = ModelsManager;
		this.UrnParser = UrnParser;
		// Constants
		this.NotificationTypes = NotificationTypes;

		/**
		 * @ngdoc property
		 * @name Controllers.WorkspaceTableauFlyoutController#flyoutInstance
		 * @propertyOf Controllers.WorkspaceTableauFlyoutController
		 * @description The instance of the flyout
		 */
		this.flyoutInstance = null;

		$scope.$on('$destroy', () => {
			// EventService.unlisten();
		});
	}

	/*
	 * @ngdoc method
	 * @name Controllers.WorkspaceTableauFlyoutController#open
	 * @methodOf Controllers.WorkspaceTableauFlyoutController
	 * @description bootstrapping
	 */

	open() {
		let that = this;

		this.flyoutInstance = this.FlyoutService.open({
			templateUrl: 'build/components/workspaceTableauFlyout/workspaceTableauFlyoutBox.html',
			scope: this.$scope,
			anchorEl: angular.element(document.querySelectorAll('.workspace-tableau')[0]),
			// placement: 'top-right',
			showArrow: false,
			flyoutClass: 'workspace-tableau-tooltip',
			backdropOption: 1,
			controllerAs: 'flyoutCtrl',
			controller: 'WorkspaceTableauFlyoutBox',
			resolve: {
				ParentController: () => this
			}
		});
		this.flyoutInstance.closed.then(result => {
		}, () => {
		});
	}

	/*
	 * @ngdoc method
	 * @name Controllers.WorkspaceTableauFlyoutController#saveWorkspaceTableau
	 * @methodOf Controllers.WorkspaceTableauFlyoutController
	 * @description bootstrapping
	 */
	saveWorkspaceTableau(currentConfiguration) {
		this.EventService.send(this.callback, currentConfiguration);
	}
}

export default WorkspaceTableauFlyoutController;
