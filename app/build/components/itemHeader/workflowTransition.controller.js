System.registerModule("com/autodesk/components/itemHeader/workflowTransition.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemHeader/workflowTransition.controller.js";
  var WorkflowTransitionController = function() {
    function WorkflowTransitionController($scope, $rootScope, $location, $timeout, $flyoutInstance, ItemObj, ModelsManager, EventService, NotificationService, NotificationTypes, AnchorElWidth, WorkflowTransitionFormDefaultWidth, MaxCommentsLength, ParentController, _) {
      $scope.transition = {};
      $scope.minWidth = (($scope.transition.comments === 'DISABLED' ? AnchorElWidth : WorkflowTransitionFormDefaultWidth) + "px");
      $scope.maxCommentsLength = MaxCommentsLength;
      $scope.UserObj = {};
      $scope.hasDelegators;
      var itemTransitionsListenerId = EventService.listen(("itemTransitions:" + $location.search().itemId + ":done"), function(event, transitionsObj) {
        EventService.unlisten(itemTransitionsListenerId);
        $scope.workflowTransitions = transitionsObj.transitions;
        $scope.hasDelegators = transitionsObj.transitions[0] && transitionsObj.transitions[0].delegatorUsers.length > 0;
        $timeout(function() {
          $('#workflow-transition-select.ui.single.dropdown').dropdown({onChange: function(value, text, $choice) {
              _.each($scope.workflowTransitions, function(transition) {
                if (transition.__self__ === value) {
                  $scope.$apply(function() {
                    $scope.transition = transition;
                  });
                }
              });
            }});
        }, 0);
      });
      var userListenerId = EventService.listen('currentUser:currentUser:done', function(event, userObj) {
        EventService.unlisten(userListenerId);
        $scope.UserObj = userObj;
        ModelsManager.getTransitionsByLink($location.search().itemId, ItemObj.getTransitionsLink());
      });
      ModelsManager.getCurrentUser();
      $scope.cancelTransition = function() {
        $flyoutInstance.cancel();
      };
      $scope.proceedTransition = function() {
        if ($scope.workflowActionForm.comments.$invalid && $scope.workflowActionForm.comments.$error.required) {
          NotificationService.addNotification(NotificationTypes.ERROR, ("" + $rootScope.bundle.transition.commentsRequired));
        }
        if ($scope.workflowActionForm.$valid) {
          ParentController.proceedTransition({
            comments: $scope.comments,
            transition: $scope.transition,
            selectedUserImpersonation: $scope.selectedUserImpersonation
          }).then(function() {
            $flyoutInstance.close();
            NotificationService.showNotifications();
          }, function(error) {
            NotificationService.showNotifications(document.querySelector('.workflow-flyout'));
          });
        } else {
          NotificationService.showNotifications(document.querySelector('.workflow-flyout'));
        }
      };
      $scope.setChosenActAsUser = function(chosenActAsUser) {
        $scope.selectedUserImpersonation = chosenActAsUser;
      };
      $scope.isCommentsRequiredAndInvalid = function() {
        return $scope.transition.comments === 'REQUIRED' && !$scope.comments;
      };
    }
    return ($traceurRuntime.createClass)(WorkflowTransitionController, {}, {});
  }();
  var $__default = WorkflowTransitionController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/itemHeader/workflowTransition.controller.js
