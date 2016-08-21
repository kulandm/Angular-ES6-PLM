/**
 * @ngdoc object
 * @name Controllers.workspaceItem.CommandBarController
 *
 * @description This controller is attached to CommandBarDirective
 *
 * ##Dependencies
 *
 */

class CommandBarController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.CommandBarController#constructor
	 * @methodOf Controllers.workspaceItem.CommandBarController
	 * @description The class constructor.
	 */
	constructor($scope, EventService) {
		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.CommandBarController#EventService
		 * @propertyOf Controllers.workspaceItem.CommandBarController
		 * @description Reference of EventService.
		 */
		this.EventService = EventService;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.CommandBarController#parentCtrl
		 * @propertyOf Controllers.workspaceItem.CommandBarController
		 * @description `private` Reference to the parent controller
		 *
		 * *** PLEASE NOTE ***
		 * *** DO NOT DO THIS ***
		 * This is a dirty workaround for the fact that we can't easily refer to
		 * the parent's scope when using ES6, and having this commandBar directive
		 * set with scope: false $parent doesn't work, and using ng-controller
		 * creates a new instance of the controller
		 */
		this.parentCtrl = $scope.parentCtrl;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.CommandBarController#toggleSummaryPanel
	 * @methodOf Controllers.workspaceItem.CommandBarController
	 * @description Broadcasts an event to toggle the summary panel (right side)
	 */
	triggerSummary() {
		this.EventService.send('itemInstance:triggerSummary');
	}
}

export default CommandBarController;
