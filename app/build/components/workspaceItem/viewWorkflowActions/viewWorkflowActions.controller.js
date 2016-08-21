System.registerModule("com/autodesk/components/workspaceItem/viewWorkflowActions/viewWorkflowActions.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewWorkflowActions/viewWorkflowActions.controller.js";
  var ViewWorkflowActionsController = function() {
    function ViewWorkflowActionsController($scope, $rootScope, $stateParams, $location, $mdDialog, $http, FlyoutService, EventService, ModelsManager, _) {
      var $__2 = this;
      this._ = _;
      this.$http = $http;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$location = $location;
      this.$mdDialog = $mdDialog;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.FlyoutService = FlyoutService;
      this.workspaceId = $scope.workspaceId;
      this.itemId = $location.search().itemId;
      this.history = [];
      var itemListenerId = this.EventService.listen('itemInstance:*:done', function(event, obj) {
        $__2.itemId = obj.getId();
        $__2.workspaceId = obj.workspaceObj.getId();
        initMxWorkflowMap('plmlib/mxGraph/config/workflowmap.xml', $__2.itemId, $__2.workspaceId, $__2);
        $__2.fetchHistory();
      });
      this.ModelsManager.getItem($scope.itemId);
      $scope.$on('$destroy', function() {
        $__2.EventService.unlisten(itemListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewWorkflowActionsController, {
      init: function() {},
      openUserProfile: function(event, userId) {
        this.FlyoutService.open({
          flyoutClass: 'user-profile-flyout',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          template: '<user-profile-summary user-id="' + userId + '"></user-profile-summary>'
        });
      },
      fetchHistory: function() {
        var $__2 = this;
        this.history = [];
        this.$http.get('/api/rest/v1/workspaces/' + this.workspaceId + '/items/' + this.itemId + '/workflows/history/?_=' + (new Date()).getTime()).then(function(data) {
          if (data.data && data.data.list && data.data.list.historySteps) {
            $__2._.each(data.data.list.historySteps, function(step) {
              $__2.history.push(step);
            });
          }
        });
      },
      performTransition: function(selectedTransition, cell) {
        var $__2 = this;
        var transitionListenerId = this.EventService.listen('transitions:' + selectedTransition + ':done', function(event, obj) {
          $__2.EventService.unlisten(transitionListenerId);
          $('#mxGraph svg').remove();
          initMxWorkflowMap('plmlib/mxGraph/config/workflowmap.xml', $__2.itemId, $__2.workspaceId, $__2);
          $__2.fetchHistory();
        });
        this.EventService.send('transitions:' + selectedTransition + ':change', selectedTransition, cell);
      },
      showPerformersTable: function(transitionsForCurrentState, headerString) {
        var $__2 = this;
        this.performersModalHeader = headerString;
        this.transitionGroups = [];
        this._.each(transitionsForCurrentState, function(currentTransition) {
          if (currentTransition.transitionID !== -99) {
            var performers = [];
            if (currentTransition.availablePerformers.length > 0) {
              $__2._.each(currentTransition.availablePerformers, function(performer) {
                performers.push({
                  text: performer.firstName + ' ' + performer.lastName,
                  link: performer.ID
                });
              });
            } else {
              performers.push({text: $__2.$rootScope.bundle.text.noMatches});
            }
            $__2.transitionGroups.push({
              title: currentTransition.getAttribute('shortName'),
              performers: performers
            });
          }
        });
        this.$mdDialog.show({
          templateUrl: 'performersModal.html',
          controller: function($scope, $mdDialog) {
            $scope.performersModalHeader = $__2.performersModalHeader;
            $scope.transitionGroups = $__2.transitionGroups;
            $scope.ok = function() {
              $mdDialog.hide();
            };
          }
        }).then(function() {}, function() {});
      },
      isViewState: function() {
        return (this.$location.search().mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewWorkflowActionsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewWorkflowActions/viewWorkflowActions.controller.js
