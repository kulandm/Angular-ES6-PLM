System.registerModule("com/autodesk/components/workspaceItem/viewMilestones/viewMilestones.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewMilestones/viewMilestones.controller.js";
  var fieldDefinitions;
  var STATE = new WeakMap();
  var LOCATION = new WeakMap();
  var ViewMilestonesController = function() {
    function ViewMilestonesController($scope, $rootScope, $state, $location, $stateParams, ModelsManager, EventService, PermissionService, PLMPermissions, moment, $timeout) {
      var $__3 = this;
      STATE.set(this, $state);
      LOCATION.set(this, $location);
      this.$timeout = $timeout;
      this.ModelsManager = ModelsManager;
      this.moment = moment;
      var itemListenerId;
      var currentUserListenerId;
      var milestoneListenerId;
      var stateChangeListenerId;
      var transitionTakePlace = null;
      fieldDefinitions = [{
        field: 'workflowState.value.selected.name',
        displayName: $rootScope.bundle.milestone.state,
        cellTemplate: 'workflowStateTemplate',
        dataTypeId: 20,
        parseValue: function(value) {
          var selectedObj = _.find($__3.StatesObj, function(state) {
            return state.name === value.title;
          });
          return {
            selected: selectedObj,
            options: $__3.StatesObj
          };
        }
      }, {
        field: 'type.value.selected',
        displayName: $rootScope.bundle.milestone.event,
        cellTemplate: 'milestoneEventTemplate',
        dataTypeId: 20,
        parseValue: function(value) {
          var localizedValue = (value.link === '/api/v3/milestone-types/ENTER' ? $rootScope.bundle.milestone.enter : $rootScope.bundle.milestone.exit);
          return {
            selected: localizedValue,
            options: [$rootScope.bundle.milestone.enter, $rootScope.bundle.milestone.exit]
          };
        }
      }, {
        field: 'shift',
        cellTemplate: 'checkboxTemplate',
        dataTypeId: 9
      }, {
        field: 'date.value',
        displayName: $rootScope.bundle.milestone.target,
        cellTemplate: 'dateTemplate',
        dataTypeId: 3
      }, {
        field: 'status',
        displayName: $rootScope.bundle.milestone.status,
        cellTemplate: 'statusTemplate'
      }, {
        field: 'daysFrom',
        displayName: $rootScope.bundle.milestone.daysFrom,
        cellTemplate: 'daysFromTemplate'
      }, {
        field: 'warnThreshold.value',
        displayName: $rootScope.bundle.milestone.warning,
        dataTypeId: 4,
        cellTemplate: 'warnTemplate'
      }, {
        field: 'progress.value',
        displayName: $rootScope.bundle.milestone.progress,
        dataTypeId: 4,
        cellTemplate: 'progressTemplate',
        parseValue: function(value) {
          return value ? (value + "%") : '';
        }
      }];
      this.MilestoneObj = null;
      this.StatesObj = [];
      this.workspaceId = $stateParams.workspaceId;
      this.itemId = $location.search().itemId;
      this.viewPermission = PLMPermissions.VIEW_MILESTONES;
      this.addPermission = PLMPermissions.ADD_MILESTONES;
      this.editPermission = PLMPermissions.EDIT_MILESTONES;
      this.tableColumns = [];
      this.tableData = [];
      this.dateFormat = {
        date: 'yyyy',
        dateAndHour: 'yyyy hh:mm a'
      };
      this.edit = {isEdit: angular.isDefined($state.params.editItem)};
      itemListenerId = EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, itemObj) {
        EventService.unlisten(itemListenerId);
        $__3.workspaceId = itemObj.workspaceObj.getId();
        var milestoneStatesListenerId = EventService.listen(("itemState:" + $__3.workspaceId + ":done"), function(event, data) {
          EventService.unlisten(milestoneStatesListenerId);
          $__3.parseWorkflowStates(data.json);
          milestoneListenerId = EventService.listen(("milestones:" + $__3.itemId + ":done"), function(event, milestoneObj) {
            $__3.parseMilestonesData(milestoneObj);
            if (!transitionTakePlace) {
              transitionTakePlace = EventService.listen(("itemTransitions:" + $__3.itemId + ":done"), function(event, itemObj) {
                $__3.loadMilestones();
              });
            }
          });
          ModelsManager.getMilestones($__3.itemId);
        });
        PermissionService.checkPermissionByItem(itemObj, $__3.viewPermission).then(function(hasViewPermission) {
          if (!hasViewPermission) {
            $state.go('details', {
              tab: 'details',
              view: $location.search().view,
              mode: 'view',
              itemId: $location.search().itemId
            });
          }
        });
        ModelsManager.getWorkflowStates($__3.workspaceId);
      });
      currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
        EventService.unlisten(currentUserListenerId);
        $__3.dateFormat.date = UserObj.getDateFormat();
        $__3.dateFormat.dateAndHour = (UserObj.getDateFormat() + " hh:mm a");
      });
      stateChangeListenerId = EventService.listen('state:change:done', function() {
        $__3.edit.isEdit = angular.isDefined($state.params.editItem);
        $__3.loadMilestones();
      });
      this.setupTableColumns();
      this.$timeout(function() {
        window.dispatchEvent(new Event('resize'));
      }, 2000);
      ModelsManager.getItem(this.itemId);
      $scope.$on('$destroy', function() {
        EventService.unlisten(itemListenerId);
        EventService.unlisten(currentUserListenerId);
        EventService.unlisten(milestoneListenerId);
        EventService.unlisten(stateChangeListenerId);
        EventService.unlisten(transitionTakePlace);
      });
    }
    return ($traceurRuntime.createClass)(ViewMilestonesController, {
      setupTableColumns: function() {
        var $__3 = this;
        this.tableColumns = _.filter(fieldDefinitions, function(column) {
          var isCheckboxCol = column.dataTypeId === 9 ? true : false;
          return $__3.edit.isEdit ? column.dataTypeId : !isCheckboxCol;
        });
      },
      parseWorkflowStates: function(statesObj) {
        var $__3 = this;
        _.each(statesObj, function(state) {
          $__3.StatesObj.push(_.pick(state, '__self__', 'customLabel', 'description', 'locked', 'managed', 'name'));
        });
      },
      parseMilestonesData: function(milestoneObj) {
        var $__3 = this;
        this.MilestoneObj = milestoneObj;
        this.tableData = _.map(this.MilestoneObj.getFullList(), function(milestone) {
          var millisecondsFrom = milestone.actualCompleteDate ? $__3.moment(milestone.actualCompleteDate).toDate() - new Date(milestone.date) : new Date() - new Date(milestone.date);
          milestone.daysFrom = Math.floor(millisecondsFrom / 1000 / 60 / 60 / 24);
          milestone.status = !!milestone.actualCompleteDate;
          _.each(fieldDefinitions, function(fieldDefinition) {
            if (fieldDefinition.cellTemplate === 'daysFromTemplate' || fieldDefinition.cellTemplate === 'statusTemplate') {
              return;
            }
            var field = fieldDefinition.field.match(/[^.]*/)[0];
            var value;
            if (fieldDefinition.parseValue) {
              value = fieldDefinition.parseValue(milestone[field]);
            } else {
              value = milestone[field];
            }
            milestone[field] = {
              triggerEdit: $__3.triggerEdit,
              edit: $__3.edit,
              isEditActive: false,
              value: value,
              originalValue: value,
              metadata: {dataTypeId: fieldDefinition.dataTypeId}
            };
            if (field === 'workflowState') {
              var selectedState = milestone[field].value.selected;
              milestone[field].originalValue = {selected: selectedState};
              milestone[field].workflowStateChanged = function() {
                console.log('state is changed');
              };
            }
            if (field === 'type') {
              var selectedType = milestone[field].value.selected;
              milestone[field].originalValue = {selected: selectedType};
              milestone[field].typeChanged = function() {
                console.log('type is changed');
              };
            }
          });
          return milestone;
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
      triggerSave: function() {
        LOCATION.get(this).search({
          tab: LOCATION.get(this).search().tab,
          view: LOCATION.get(this).search().view,
          mode: 'view',
          itemId: LOCATION.get(this).search().itemId
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
      isViewState: function() {
        return (LOCATION.get(this).search().mode === 'view');
      },
      loadMilestones: function() {
        this.setupTableColumns();
        this.ModelsManager.getMilestones(this.itemId);
      }
    }, {});
  }();
  var $__default = ViewMilestonesController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewMilestones/viewMilestones.controller.js
