System.registerModule("com/autodesk/components/itemHeader/itemHeader.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemHeader/itemHeader.controller.js";
  var ItemHeaderController = function() {
    function ItemHeaderController($scope, $rootScope, $state, $stateParams, $q, $filter, ModelsManager, EventService, FlyoutService, PLMPermissions, _) {
      var that = this;
      this.$state = $state;
      this.$q = $q;
      this.$filter = $filter;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.PLMPermissions = PLMPermissions;
      this._ = _;
      this.workspaceId = $stateParams.workspaceId;
      this.itemId = $stateParams.itemId;
      this.workspaceIcon = '';
      this.workspacesListenerId = EventService.listen('workspaces:' + this.workspaceId + ':done', function(event, WorkspacesObj) {
        that.workspaceIcon = WorkspacesObj.getSectionIcon(that.workspaceId);
      });
      this.workspaceListenerId = '';
      this.ItemObj = null;
      this.itemData = {};
      this.itemListenerId = EventService.listen('itemInstance:' + this.itemId + ':done', function(event, itemObj) {
        that.ItemObj = itemObj;
        that.itemData = itemObj.getFullList();
      });
      this.UserObj = {getDateFormat: function() {
          return 'yyyy';
        }};
      this.hasViewWorkflowPermission = true;
      this.currentUserListenerId = this.EventService.listen('currentUser:currentUser:done', function(event, userObj) {
        that.UserObj = userObj;
        that.hasViewWorkflowPermission = that.UserObj.hasPermission(that.PLMPermissions.VIEW_WORKFLOW);
      });
      this.bundle = $rootScope.bundle;
      this.revisioningTranslationKeys = {
        OBSOLETE: $rootScope.bundle.revision.obsolete,
        PENDING: $rootScope.bundle.revision.pending,
        LATEST: $rootScope.bundle.revision.latest,
        SUPERSEDED: $rootScope.bundle.revision.superseded,
        UNRELEASED: $rootScope.bundle.revision.unreleased,
        WORKING: $rootScope.bundle.revision.working
      };
      $scope.$on('$destroy', function() {
        that.EventService.unlisten(that.workspacesListenerId);
        that.EventService.unlisten(that.itemListenerId);
        that.EventService.unlisten(that.currentUserListenerId);
        that.EventService.unlisten(that.itemArchiveListenerId);
        that.EventService.unlisten(that.itemUnarchiveListenerId);
        that.EventService.unlisten(that.transitionsListenerId);
      });
      this.itemArchiveListenerId = this.EventService.listen('item:archive:success', this.loadData, true);
      this.itemUnarchiveListenerId = this.EventService.listen('item:unarchive:success', this.loadData, true);
      this.transitionsListenerId = this.EventService.listen('transitions:*:change', function(event, selectedTransition, cell) {
        var transition = {};
        that._.each(that.workflowTransitions, function(workflowTransition) {
          var fromState = workflowTransition.fromState.link;
          fromState = fromState.substring(fromState.lastIndexOf('/') + 1);
          var toState = workflowTransition.toState.link;
          toState = toState.substring(toState.lastIndexOf('/') + 1);
          if (parseInt(fromState) === cell.fromState && parseInt(toState) === cell.toState) {
            transition = workflowTransition;
          }
        });
        that.workflowFlyout.selectedTransition = transition;
        that.changeWorkflowTransition(transition, selectedTransition);
      });
      this.loadData();
    }
    return ($traceurRuntime.createClass)(ItemHeaderController, {
      cancelTransition: function() {
        this.workflowFlyout.selectedTransition = null;
      },
      changeWorkflowTransition: function(selectedTransition, selectedTransitionId) {
        var that = this;
        this.workflowFlyout.selectedTransition = selectedTransition;
        var anchorEl = angular.element(document.querySelectorAll('#workflow-transition-control')[0]);
        var flyoutInstance = this.FlyoutService.open({
          templateUrl: 'build/components/itemHeader/workflowTransition.html',
          anchorEl: angular.element(document.querySelectorAll('#workflow-transition-control')[0]),
          placement: 'bottom-left',
          flyoutClass: 'workflow-flyout',
          controller: 'WorkflowTransitionController',
          resolve: {
            TransitionObj: function() {
              return selectedTransition;
            },
            AnchorElWidth: function() {
              return anchorEl[0].clientWidth;
            }
          }
        });
        flyoutInstance.closed.then(function(result) {
          that.proceedTransition(result, selectedTransitionId);
        }, function() {
          that.cancelTransition();
        });
      },
      changeRevision: function(revision) {
        var itemId = revision.id;
        $state.go('details', {
          workspaceId: this.workspaceId,
          itemId: itemId
        });
      },
      loadData: function() {
        var that = this;
        this.workspaceListenerId = this.EventService.listen('workspaceInstance:' + this.workspaceId + ':done', function(event, WorkspaceObj) {
          that.processWorkspaceObj(WorkspaceObj);
        });
        this.ModelsManager.getWorkspaces('workspaces:' + this.workspaceId + ':get');
        this.ModelsManager.getWorkspace(this.workspaceId);
        this.ModelsManager.getItem(this.workspaceId, this.itemId);
        this.ModelsManager.getCurrentUser();
      },
      fetchTransitions: function() {
        var that = this;
        this.ModelsManager.getTransitions(this.workspaceId, this.itemId);
        var itemTransitionsListenerId = this.EventService.listen('itemTransitions:' + this.itemId + ':done', function(event, TransitionsObj) {
          that.EventService.unlisten(itemTransitionsListenerId);
          that.workflowTransitions = that._.filter(TransitionsObj.transitions, function(transition) {
            return true;
          });
          if (TransitionsObj.transitions && TransitionsObj.transitions.length > 0) {
            that.currentStateName = TransitionsObj.transitions[0].fromState.title;
          } else {
            that.currentStateName = 'Not Found';
          }
        });
      },
      processWorkspaceObj: function(WorkspaceObj) {
        var that = this;
        this.workspaceTypeId = WorkspaceObj.getTypeId();
        this.EventService.unlisten(this.workspaceListenerId);
        switch (this.workspaceTypeId) {
          case 'BASIC_AND_WORKFLOW':
          case 'REVISIONING':
          case 'SUPPLIER_AND_WORKFLOW':
            this.workflowFlyout = {selectedTransition: null};
            this.fetchTransitions();
            break;
          case 'REVISION_CONTROLLED':
            this.ModelsManager.getRevisions(this.workspaceId, this.itemId);
            var itemRevisionsListenerId = this.EventService.listen('itemRevisions:' + this.itemId + ':done', function(event, RevisionsObj) {
              that.EventService.unlisten(itemRevisionsListenerId);
              that.revisioningData = RevisionsObj.json;
              that.revisionDropdownArr = that._.map(that.revisioningData.versions, function(value, index) {
                var obj = {
                  id: value.__self__.substr(value.__self__.indexOf('versions/') + 9),
                  effectiveDate: '',
                  description: ''
                };
                switch (value.status) {
                  case 'UNRELEASED':
                  case 'WORKING':
                    obj.description += that.revisioningTranslationKeys[value.status];
                    break;
                  default:
                    obj.description += value.lifecycle.title + ' ' + value.version + ' (' + that.revisioningTranslationKeys[value.status] + ')';
                    break;
                }
                if (angular.isDefined(value.effectivity.status)) {
                  obj.effectiveDate += that.revisioningTranslationKeys[value.effectivity.status];
                } else {
                  obj.effectiveDate += that.$filter('date')(value.effectivity.startDate, that.UserObj.getDateFormat());
                  if (angular.isDefined(value.effectivity.endDate)) {
                    obj.effectiveDate += ' - ' + that.$filter('date')(value.effectivity.endDate, that.UserObj.getDateFormat());
                  }
                }
                return obj;
              });
              that.selectedRevision = that._.find(that.revisionDropdownArr, function(value, index) {
                return (that.itemId.toString() === value.id);
              });
              that.revisionTagStr = that.itemData.fullItemDescriptor.substr(that.itemData.itemDescriptor.length);
            });
            break;
          case 'BASIC':
          case 'SUPPLIER':
          default:
            break;
        }
      }
    }, {});
  }();
  var $__default = ItemHeaderController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/itemHeader/itemHeader.controller.js
