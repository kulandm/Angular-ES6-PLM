System.registerModule("com/autodesk/components/workspaceItem/viewActionNotifications/addActionNotifications.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewActionNotifications/addActionNotifications.controller.js";
  var AddActionNotificationsController = function() {
    function AddActionNotificationsController($scope, $location, $rootScope, $mdDialog, RelatedWorkspacesObj, EventService, ModelsManager, $stateParams, _, $q) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$mdDialog = $mdDialog;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.$stateParams = $stateParams;
      this._ = _;
      this.$q = $q;
      var that = this;
      this.workspaceId = $stateParams.workspaceId;
      this.itemId = $location.search().itemId;
      this.availableEventType = [{name: $rootScope.bundle.actionNotifications.state}, {name: $rootScope.bundle.actionNotifications.transition}];
      this.availableTransitions = null;
      this.availableStates = null;
      this.availableGroups = null;
      this.availableUsers = null;
      this.selectedEventType = $rootScope.bundle.actionNotifications.transition;
      this.selectedTransition = null;
      this.selectedState = null;
      this.selectedGroups = [];
      this.selectedUsers = [];
      this.getGroups();
      this.getWorkflowStates();
      this.getWorkflowTransitions();
      ModelsManager.getItem(this.itemId);
      this.actionNotificationList = {};
    }
    return ($traceurRuntime.createClass)(AddActionNotificationsController, {
      getGroups: function() {
        var $__2 = this;
        var availableGroupsListenerId = this.EventService.listen('availableGroups:done', function(event, data) {
          $__2.EventService.unlisten(availableGroupsListenerId);
          $__2.availableGroups = data.json.elements;
        });
        this.ModelsManager.getGroups();
      },
      getUsers: function() {
        var $__2 = this;
        var availableUsersListenerId = this.EventService.listen(("user:" + this.workspaceId + ":done"), function(event, data) {
          $__2.EventService.unlisten(availableUsersListenerId);
          $__2.availableUsers = data.json.elements;
        });
        this.ModelsManager.getUsers(this.workspaceId);
      },
      getWorkflowStates: function() {
        var $__2 = this;
        var itemListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, ItemObj) {
          $__2.EventService.unlisten(itemListenerId);
          $__2.ItemObj = ItemObj;
          $__2.workspaceId = ItemObj.workspaceObj.getId();
          var availableStatesListenerId = $__2.EventService.listen(("itemState:" + $__2.workspaceId + ":done"), function(event, data) {
            $__2.EventService.unlisten(availableStatesListenerId);
            $__2.availableStates = [];
            _.each(data.json, function(state, index) {
              $__2.availableStates.push({
                name: state.name,
                id: state.__self__.substr(state.__self__.lastIndexOf('/') + 1)
              });
            });
          });
          $__2.ModelsManager.getWorkflowStates($__2.workspaceId);
          $__2.getUsers();
        });
      },
      getWorkflowTransitions: function() {
        var $__2 = this;
        var itemListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, ItemObj) {
          $__2.EventService.unlisten(itemListenerId);
          $__2.workspaceId = ItemObj.workspaceObj.getId();
          var availableTransitionsListenerId = $__2.EventService.listen(("itemTransitions:" + $__2.workspaceId + ":done"), function(event, data) {
            $__2.EventService.unlisten(availableTransitionsListenerId);
            $__2.availableTransitions = [];
            _.each(data.transitions, function(transition, index) {
              $__2.availableTransitions.push({
                name: transition.name,
                id: transition.__self__.substr(transition.__self__.lastIndexOf('/') + 1)
              });
            });
          });
          $__2.ModelsManager.getWorkflowTransitions($__2.workspaceId);
        });
      },
      eventTypeChanged: function() {
        this.selectedTransition = null;
        this.selectedState = null;
      },
      close: function() {
        this.$mdDialog.hide();
      },
      saveAndClose: function() {
        var $__2 = this;
        this.actionNotificationList = {
          type: this.selectedEventType,
          'workflow-transition': this.selectedTransition,
          'workflow-state': this.selectedState,
          users: this.selectedUsers,
          groups: this.selectedGroups,
          item: this.ItemObj.json.id
        };
        var actionNotificationListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":actionNotificationDone"), function(event, flag) {
          $__2.EventService.unlisten(actionNotificationListenerId);
          $__2.$mdDialog.hide();
          if (flag) {
            $__2.EventService.send(("itemInstance:" + $__2.itemId + ":actionNotificationComplete"));
          }
        });
        this.EventService.send(("itemInstance:" + this.itemId + ":actionNotificationItem"), [this.ItemObj, this.actionNotificationList]);
      }
    }, {});
  }();
  var $__default = AddActionNotificationsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewActionNotifications/addActionNotifications.controller.js
