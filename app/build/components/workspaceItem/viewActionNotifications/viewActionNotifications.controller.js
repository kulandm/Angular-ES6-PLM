System.registerModule("com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.controller.js";
  var LOCATION = new WeakMap();
  var ViewActionNotificationsController = function() {
    function ViewActionNotificationsController($scope, $window, $state, $stateParams, $location, $filter, $rootScope, $mdDialog, ModelsManager, EventService, PLMPermissions, uiGridConstants, _, $q) {
      var $__3 = this;
      this.$scope = $scope;
      this.$window = $window;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$location = $location;
      this.$filter = $filter;
      this.$rootScope = $rootScope;
      this.$mdDialog = $mdDialog;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.PLMPermissions = PLMPermissions;
      this._ = _;
      this.$q = $q;
      LOCATION.set(this, $location);
      var that = this;
      this.itemId = $location.search().itemId;
      var actionNotificationsListenerId;
      this.addStateName = 'action-notifications-view';
      this.editState = 'action-notifications-edit';
      this.viewStateName = 'action-notifications-view';
      this.addPermission = PLMPermissions.ADD_WORKFLOW_ITEMS;
      this.editPermission = PLMPermissions.EDIT_WORKFLOW_ITEMS;
      this.edit = (LOCATION.get(this).search().mode === 'edit');
      this.EventService.listen('state:change:done', function() {
        $__3.edit = (LOCATION.get($__3).search().mode === 'edit');
        $__3.init();
      });
      this.tableColumns = [];
      this.tableData = [];
      this.customVars = {
        availableEventType: [{name: $rootScope.bundle.actionNotifications.state}, {name: $rootScope.bundle.actionNotifications.transition}],
        availableTransitions: null,
        availableStates: null,
        availableGroups: null,
        availableUsers: null
      };
      ModelsManager.getItem(this.itemId);
      this.actionNotificationList = {};
      this.init = function() {
        this.tableColumns = [{
          displayName: '#',
          field: 'rowId',
          enableSorting: true,
          suppressRemoveSort: true,
          width: '5%'
        }, {
          displayName: $rootScope.bundle.actionNotifications.eventType,
          field: 'eventType',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: '15%',
          cellTemplate: 'eventTypeRenderer'
        }, {
          displayName: $rootScope.bundle.actionNotifications.notificationEvent,
          field: 'notificationEvent',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: '15%',
          cellTemplate: 'notificationEventRenderer'
        }, {
          displayName: $rootScope.bundle.actionNotifications.groupToNotify,
          field: 'groupToNotify',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: '30%',
          cellTemplate: 'groupsRenderer'
        }, {
          displayName: $rootScope.bundle.actionNotifications.userToNotify,
          field: 'userToNotify',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: '30%',
          cellTemplate: 'usersRenderer'
        }, {
          displayName: '',
          field: 'deleteActionNotification',
          enableSorting: false,
          cellTemplate: 'actionNotificationDeleteBtnRenderer',
          width: '5%'
        }];
        actionNotificationsListenerId = EventService.listen('actionNotification:' + $stateParams.itemId + ':done', function(event, ActionNotificationsObj) {
          that.parseViewActionNotificationsItems(ActionNotificationsObj.getFullList());
        });
        ModelsManager.getActionNotifications($stateParams.workspaceId, $stateParams.itemId);
        this.getGroups();
        this.getWorkflowStates();
        this.getWorkflowTransitions();
      };
      this.parseViewActionNotificationsItems = function(data) {
        if (angular.isDefined(data)) {
          _.each(data, function(element, index) {
            $q.all({
              notificationIdPromise: element.getNotificationId(),
              eventTypePromise: element.getEventType(),
              notificationEventPromise: element.getNotificationEvent(),
              notificationGroupsPromise: element.getNotificationGroups(),
              notificationUsersPromise: element.getNotificationUsers()
            }).then(function(promises) {
              that.tableData[index] = {
                rowId: promises.notificationIdPromise,
                eventType: {
                  selected: {name: promises.eventTypePromise},
                  eventTypeChanged: function(selectedEventType) {
                    that.tableData[index].notificationEvent.eventType = selectedEventType;
                  },
                  isEdit: that.edit
                },
                notificationEvent: {
                  selected: {
                    name: promises.notificationEventPromise.name,
                    id: promises.notificationEventPromise.id
                  },
                  isEdit: that.edit,
                  eventType: promises.eventTypePromise
                },
                groupToNotify: {
                  selected: {name: promises.notificationGroupsPromise},
                  isEdit: that.edit,
                  isOptionSelected: function(optionName) {
                    if (_.contains(promises.notificationGroupsPromise, optionName)) {
                      return 'selected';
                    }
                  }
                },
                userToNotify: {
                  selected: {name: promises.notificationUsersPromise},
                  isEdit: that.edit,
                  isOptionSelected: function(optionName) {
                    if (_.contains(promises.notificationUsersPromise, optionName)) {
                      return 'selected';
                    }
                  }
                },
                deleteActionNotification: {
                  ref: element,
                  link: function(event) {
                    this.ref.deleteActionNotification().then(function() {
                      that.EventService.send(("itemInstance:" + that.itemId + ":actionNotificationComplete"));
                    });
                  }
                }
              };
            });
          });
        }
      };
      this.actionNotificationSaveListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":actionNotificationComplete"), function() {
        that.tableData = [];
        ModelsManager.getActionNotifications($scope.workspaceId, $scope.itemId, $scope.sortingOrder, $scope.sortingColumn);
      }, true);
      $scope.$on('$destroy', function() {
        EventService.unlisten(actionNotificationsListenerId);
        EventService.unlisten(that.actionNotificationSaveListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewActionNotificationsController, {
      getGroups: function() {
        var $__3 = this;
        var availableGroupsListenerId = this.EventService.listen('availableGroups:done', function(event, data) {
          $__3.EventService.unlisten(availableGroupsListenerId);
          $__3.customVars.availableGroups = data.json.elements;
        });
        this.ModelsManager.getGroups();
      },
      getUsers: function() {
        var $__3 = this;
        var availableUsersListenerId = this.EventService.listen(("user:" + this.workspaceId + ":done"), function(event, data) {
          $__3.EventService.unlisten(availableUsersListenerId);
          $__3.customVars.availableUsers = data.json.elements;
        });
        this.ModelsManager.getUsers(this.workspaceId);
      },
      getWorkflowStates: function() {
        var $__3 = this;
        var itemListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, ItemObj) {
          $__3.EventService.unlisten(itemListenerId);
          $__3.ItemObj = ItemObj;
          $__3.workspaceId = ItemObj.workspaceObj.getId();
          var availableStatesListenerId = $__3.EventService.listen(("itemState:" + $__3.workspaceId + ":done"), function(event, data) {
            $__3.EventService.unlisten(availableStatesListenerId);
            $__3.customVars.availableStates = [];
            _.each(data.json, function(state, index) {
              $__3.customVars.availableStates.push({
                name: state.name,
                id: state.__self__.substr(state.__self__.lastIndexOf('/') + 1)
              });
            });
          });
          $__3.ModelsManager.getWorkflowStates($__3.workspaceId);
          $__3.getUsers();
        });
      },
      getWorkflowTransitions: function() {
        var $__3 = this;
        var itemListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, ItemObj) {
          $__3.EventService.unlisten(itemListenerId);
          $__3.workspaceId = ItemObj.workspaceObj.getId();
          var availableTransitionsListenerId = $__3.EventService.listen(("itemTransitions:" + $__3.workspaceId + ":done"), function(event, data) {
            $__3.EventService.unlisten(availableTransitionsListenerId);
            $__3.customVars.availableTransitions = [];
            _.each(data.transitions, function(transition, index) {
              $__3.customVars.availableTransitions.push({
                name: transition.name,
                id: transition.__self__.substr(transition.__self__.lastIndexOf('/') + 1)
              });
            });
          });
          $__3.ModelsManager.getWorkflowTransitions($__3.workspaceId);
        });
      },
      triggerCancel: function() {
        LOCATION.get(this).search({
          tab: LOCATION.get(this).search().tab,
          view: LOCATION.get(this).search().view,
          mode: 'view',
          itemId: LOCATION.get(this).search().itemId
        });
      },
      triggerEdit: function() {
        LOCATION.get(this).search({
          tab: LOCATION.get(this).search().tab,
          view: LOCATION.get(this).search().view,
          mode: 'edit',
          itemId: LOCATION.get(this).search().itemId
        });
      },
      isTableRowDirty: function(tableRow) {
        var propertyList = [];
        if (angular.isDefined(tableRow.lifecycle)) {
          propertyList.push(tableRow.lifecycle);
        }
        if (angular.isDefined(tableRow.effectivity)) {
          propertyList.push(tableRow.effectivity);
        }
        return _.some(propertyList, function(property) {
          return !_.isEqual(property.originalValue, property.value);
        });
      },
      triggerSave: function() {
        var $__3 = this;
        var saveCount = 0;
        var updateCount = 0;
        var modifiedItems = [];
        this._.each(this.tableData, function(tableRow, index) {
          $__3.actionNotificationList = {
            type: tableRow.eventType.selected.name,
            'workflow-state': tableRow.notificationEvent.selected.id,
            users: tableRow.userToNotify.selected,
            groups: tableRow.groupToNotify.selected,
            item: $__3.ItemObj.json.id
          };
          $__3.EventService.send(("itemInstance:" + $__3.itemId + ":actionNotificationItem"), [$__3.ItemObj, $__3.actionNotificationList]);
          var actionNotificationListenerId = $__3.EventService.listen(("itemInstance:" + $__3.itemId + ":actionNotificationDone"), function(event, flag) {
            $__3.EventService.unlisten(actionNotificationListenerId);
            if (flag) {
              $__3.triggerCancel();
              $__3.EventService.send(("itemInstance:" + $__3.itemId + ":actionNotificationComplete"));
            }
          });
        });
      },
      triggerAdd: function(event) {
        var $__3 = this;
        this.$mdDialog.show({
          controller: 'AddActionNotificationsController',
          templateUrl: 'build/components/workspaceItem/viewActionNotifications/addActionNotifications.html',
          controllerAs: 'addActionNotificationsCtrl',
          resolve: {RelatedWorkspacesObj: function() {
              return $__3.relatedWorkspacesObj;
            }}
        });
      },
      isViewState: function() {
        return (LOCATION.get(this).search().mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewActionNotificationsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.controller.js
