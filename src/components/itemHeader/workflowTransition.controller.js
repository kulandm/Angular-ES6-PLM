'use strict';

/**
 * @ngdoc object
 * @name Controllers.WorkflowTransitionController
 *
 * @description This controller is responsible for managing the workflow
 * transition flyout. It is used with {@link #Controllers.ItemHeaderController}.
 *
 */
class WorkflowTransitionController {
	/*
	 * @ngdoc method
	 * @name Controllers.WorkflowTransitionController#constructor
	 * @methodOf Controllers.WorkflowTransitionController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $location, $timeout, $flyoutInstance, ItemObj, ModelsManager, EventService, NotificationService, NotificationTypes, AnchorElWidth, WorkflowTransitionFormDefaultWidth, MaxCommentsLength, ParentController, _) {
		/**
		 * @ngdoc property
		 * @name Controllers.WorkflowTransitionController#transition
		 * @propertyOf Controllers.WorkflowTransitionController
		 * @description The workflow transition associated with this controller.
		 */
		$scope.transition = {};

		/**
		 * @ngdoc property
		 * @name Controllers.WorkflowTransitionController#minWidth
		 * @propertyOf Controllers.WorkflowTransitionController
		 * @description A min width of the form. The minimum width will be based
		 * on the comments type and anchor width.
		 */
		$scope.minWidth = `${$scope.transition.comments === 'DISABLED' ?
			AnchorElWidth : WorkflowTransitionFormDefaultWidth}px`;

		/**
		 * @ngdoc property
		 * @name Controllers.WorkflowTransitionController#maxCommentsLength
		 * @propertyOf Controllers.WorkflowTransitionController
		 * @description The maximum allowed length for the comments.
		 */
		$scope.maxCommentsLength = MaxCommentsLength;

		/**
		 * @ngdoc property
		 * @name Controllers.WorkflowTransitionController#UserObj
		 * @propertyOf Controllers.WorkflowTransitionController
		 * @description The user object
		 */
		$scope.UserObj = {};

		/**
		 * @ngdoc property
		 * @name Controllers.WorkflowTransitionController#hasDelegators
		 * @propertyOf Controllers.WorkflowTransitionController
		 * @description True, if there are available delegators
		 */
		$scope.hasDelegators;

		/**
		 * @ngdoc method
		 * @name Controllers.WorkflowTransitionController#itemTransitionsListenerId
		 * @methodOf Controllers.WorkflowTransitionController
		 * @description `private` Helper method to retrieve a list of transitions (DRY)
		 */
		let itemTransitionsListenerId = EventService.listen(`itemTransitions:${$location.search().itemId}:done`, (event, transitionsObj) => {
			EventService.unlisten(itemTransitionsListenerId);

			/**
			 * @ngdoc property
			 * @name Controllers.WorkflowTransitionController#workflowTransitions
			 * @propertyOf Controllers.WorkflowTransitionController
			 * @description The possible transitions.
			 */
			$scope.workflowTransitions = transitionsObj.transitions;

			// Check if there is any delegators by using the first transition
			$scope.hasDelegators = transitionsObj.transitions[0] &&
				transitionsObj.transitions[0].delegatorUsers.length > 0;

			$timeout(() => {
				$('#workflow-transition-select.ui.single.dropdown').dropdown({
					onChange: (value, text, $choice) => {  // data-value, text, html ele
						_.each($scope.workflowTransitions, (transition) => {
							if (transition.__self__ === value) {
								$scope.$apply(() => {
									$scope.transition = transition;
								});
							}
						});
					}
				});
			}, 0);
		});

		/**
		 * @ngdoc method
		 * @name Controllers.WorkflowTransitionController#userListenerId
		 * @methodOf Controllers.WorkflowTransitionController
		 * @description `private` Helper method to retrieve user object
		 */
		let userListenerId = EventService.listen('currentUser:currentUser:done', (event, userObj) => {
			EventService.unlisten(userListenerId);

			// Assigns to this object
			$scope.UserObj = userObj;
			ModelsManager.getTransitionsByLink($location.search().itemId, ItemObj.getTransitionsLink());
		});

		ModelsManager.getCurrentUser();

		/**
		 * @ngdoc method
		 * @name Controllers.WorkflowTransitionController#cancelTransition
		 * @methodOf Controllers.WorkflowTransitionController
		 * @description Closes the workflow transition flyout.
		 */
		$scope.cancelTransition = function () {
			$flyoutInstance.cancel();
		};

		/**
		 * @ngdoc method
		 * @name Controllers.WorkflowTransitionController#proceedTransition
		 * @methodOf Controllers.WorkflowTransitionController
		 * @description Check the validity of the form and closes the flyout if valid.
		 */
		$scope.proceedTransition = function () {
			// Comments are invalid and required
			if ($scope.workflowActionForm.comments.$invalid &&
				$scope.workflowActionForm.comments.$error.required) {
				NotificationService.addNotification(
					NotificationTypes.ERROR,
					`${$rootScope.bundle.transition.commentsRequired}`
				);
			}

			if ($scope.workflowActionForm.$valid) {
				ParentController.proceedTransition({
					comments: $scope.comments,
					transition: $scope.transition,
					selectedUserImpersonation: $scope.selectedUserImpersonation
				}).then(() => {
					$flyoutInstance.close();
					NotificationService.showNotifications();
				}, (error) => {
					NotificationService.showNotifications(
						document.querySelector('.workflow-flyout'));
				});
			} else {
				// Show error notifications (from before transition)
				NotificationService.showNotifications(
					document.querySelector('.workflow-flyout'));
			}
		};

		/**
		 * @ngdoc method
		 * @name Controllers.WorkflowTransitionController#setChosenActAsUser
		 * @methodOf Controllers.WorkflowTransitionController
		 * @description It sets the values of the chosen act as user
		 *
		 * @param {String} Will be the string passed while selecting the user
		 */
		$scope.setChosenActAsUser = function (chosenActAsUser) {
			$scope.selectedUserImpersonation = chosenActAsUser;
		};

		/**
		 * @ngdoc method
		 * @name Controllers.WorkflowTransitionController#isCommentsRequiredAndInvalid
		 * @methodOf Controllers.WorkflowTransitionController
		 * @description True, if required comments have been filled in.
		 */
		$scope.isCommentsRequiredAndInvalid = function () {
			return $scope.transition.comments === 'REQUIRED' && !$scope.comments;
		};
	}
}

export default WorkflowTransitionController;
