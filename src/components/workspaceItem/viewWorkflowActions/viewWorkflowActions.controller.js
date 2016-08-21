/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewWorkflowActionsController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/workflowMap.
 *
 * ##Dependencies
  *
 */

class ViewWorkflowActionsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowActionsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewWorkflowActionsController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $stateParams, $location, $mdDialog, $http, FlyoutService, EventService, ModelsManager, _) {
		this._ = _;
		this.$http = $http;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$location = $location;
		this.$mdDialog = $mdDialog;
		this.EventService = EventService;
		this.ModelsManager = ModelsManager;
		this.FlyoutService = FlyoutService;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowActionsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowActionsController
		 * @description The workspace Id of the current selected item
		 */
		this.workspaceId = $scope.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowActionsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowActionsController
		 * @description The item Id of the current selected item
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewWorkflowActionsController#history
		 * @propertyOf Controllers.workspaceItem.ViewWorkflowActionsController
		 * @description The history steps of the workflow
		 */
		this.history = [];

		var itemListenerId = this.EventService.listen('itemInstance:*:done', (event, obj) => {
			this.itemId = obj.getId();
			this.workspaceId = obj.workspaceObj.getId();
			// BAD BAD, DO NOT COPY
			/* global initMxWorkflowMap */
			initMxWorkflowMap('plmlib/mxGraph/config/workflowmap.xml', this.itemId, this.workspaceId, this);

			this.fetchHistory();
		});
		this.ModelsManager.getItem($scope.itemId);

		$scope.$on('$destroy', () => {
			this.EventService.unlisten(itemListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowActionsController#init
	 * @methodOf Controllers.workspaceItem.ViewWorkflowActionsController
	 * @description Initialization function
	 */
	init() {
	}

	/**
	 * @ngdoc method
	 * @name Controller.ViewWorkflowActionsController#openUserProfile
	 * @methodOf Controllers.workspaceItem.ViewWorkflowActionsController
	 * @description Open flyout window based on the given event and user ID.
	 *
	 * @param {Object} event the event object.
	 * @param {Number} userId The user ID
	 *
	 */
	openUserProfile(event, userId) {
		this.FlyoutService.open({
			flyoutClass: 'user-profile-flyout',
			scope: this.$scope,
			anchorEl: angular.element(event.target),
			template: '<user-profile-summary user-id="' + userId + '"></user-profile-summary>'
		});
	}

	/* ***********************************************
	* FROM THIS POINT ON, DO NOT COPY THE PATTERN - DOOM ERIC FOR THIS BAD STUFF
	* WE"LL CHANGE THIS ONCE WE HAVE PROPER ENDPOINTS AND RELATED STUFF
	*************************************************/
	fetchHistory() {
		this.history = [];
		this.$http.get('/api/rest/v1/workspaces/' + this.workspaceId + '/items/' + this.itemId + '/workflows/history/?_=' + (new Date()).getTime()).then((data) => {
			if (data.data && data.data.list && data.data.list.historySteps) {
				this._.each(data.data.list.historySteps, (step) => {
					this.history.push(step);
				});
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowActionsController#performTransition
	 * @methodOf Controllers.workspaceItem.ViewWorkflowActionsController
	 * @description Performs a transition when clicked on the workflow map
	 *
	 * @param {Integer} selectedTransition The ID of the transition to be performed
	 */
	performTransition(selectedTransition, cell) {
		var transitionListenerId = this.EventService.listen('transitions:' + selectedTransition + ':done', (event, obj) => {
			this.EventService.unlisten(transitionListenerId);

			/* global $ */
			$('#mxGraph svg').remove();
			initMxWorkflowMap('plmlib/mxGraph/config/workflowmap.xml', this.itemId, this.workspaceId, this);
			this.fetchHistory();
		});
		this.EventService.send('transitions:' + selectedTransition + ':change', selectedTransition, cell);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowActionsController#showPerformersTable
	 * @methodOf Controllers.workspaceItem.ViewWorkflowActionsController
	 * @description Construct the performers modal dialog
	 *
	 * @param {Array} transitionsForCurrentState The available transitions
	 * @param {String} headerString The string to put as the modal header
	 */
	showPerformersTable(transitionsForCurrentState, headerString) {
		this.performersModalHeader = headerString;

		this.transitionGroups = [];

		this._.each(transitionsForCurrentState, (currentTransition) => {
			if (currentTransition.transitionID !== -99) {
				let performers = [];
				if (currentTransition.availablePerformers.length > 0) {
					this._.each(currentTransition.availablePerformers, (performer) => {
						performers.push({
							text: performer.firstName + ' ' + performer.lastName,
							link: performer.ID
						});
					});
				} else {
					performers.push({
						text: this.$rootScope.bundle.text.noMatches
					});
				}
				this.transitionGroups.push({
					title: currentTransition.getAttribute('shortName'),
					performers: performers
				});
			}
		});

		// var modalInstance = this.$modal.open({
		// 	templateUrl: 'performersModal.html',
		// 	controller: function ($scope, $modalInstance, transitionGroups, performersModalHeader) {
		// 		$scope.performersModalHeader = performersModalHeader;
		// 		$scope.transitionGroups = transitionGroups;
		// 		$scope.ok = function () {
		// 			$modalInstance.close();
		// 		};
		// 	},
		// 	resolve: {
		// 		transitionGroups: () => {
		// 			return this.transitionGroups;
		// 		},
		// 		performersModalHeader: () => {
		// 			return this.performersModalHeader;
		// 		}
		// 	}
		// });
		this.$mdDialog.show({
			templateUrl: 'performersModal.html',
			controller: ($scope, $mdDialog) => {
				$scope.performersModalHeader = this.performersModalHeader;
				$scope.transitionGroups = this.transitionGroups;

				/**
				 * @ngdoc method
				 * @name Controllers.workspaceItem.ViewWorkflowActionsController#ok
				 * @methodOf Controllers.workspaceItem.ViewWorkflowActionsController
				 * @description Closes the dialog
				 */
				$scope.ok = function () {
					$mdDialog.hide();
				};
			}
		}).then(function () {
			// ok
		}, function () {
			// cancel
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewWorkflowController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewWorkflowController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (this.$location.search().mode === 'view');
	}
}

export default ViewWorkflowActionsController;
