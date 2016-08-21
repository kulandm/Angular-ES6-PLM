System.registerModule("com/autodesk/components/workspaceItem/viewWorkflow/viewWorkflow.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewWorkflow/viewWorkflow.controller.js";
  var ViewWorkflowController = function() {
    function ViewWorkflowController($scope, $rootScope, $state, $location, $stateParams, ModelsManager, EventService, FlyoutService, PermissionService, PLMPermissions, UrnParser, uiGridConstants, _) {
      var $__3 = this;
      this.$scope = $scope;
      this.$state = $state;
      this.$location = $location;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.UrnParser = UrnParser;
      this._ = _;
      this.itemLink = $location.search().itemId;
      this.tableColumns = [{
        displayName: $rootScope.bundle.workflow.workflow,
        field: 'itemDisplayName',
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        cellTemplate: 'linkTemplate',
        type: 'object',
        width: '30%'
      }, {
        displayName: $rootScope.bundle.workflow.workspace,
        field: 'itemWorkspace',
        width: '10%'
      }, {
        displayName: $rootScope.bundle.workflow.currentState,
        field: 'currentState',
        enableSorting: true,
        width: '10%'
      }, {
        displayName: $rootScope.bundle.workflow.lastAction,
        field: 'lastAction',
        width: '10%'
      }, {
        displayName: $rootScope.bundle.workflow.dateOfLastAction,
        field: 'dateOfLastAction',
        cellTemplate: 'dateTemplate',
        width: '10%'
      }, {
        displayName: $rootScope.bundle.workflow.performedBy,
        field: 'performedBy.val',
        cellTemplate: 'performUserLinkTemplate',
        width: '10%'
      }, {
        displayName: $rootScope.bundle.workflow.createdOn,
        field: 'createdOn',
        cellTemplate: 'dateTemplate',
        width: '10%'
      }, {
        displayName: $rootScope.bundle.workflow.createdBy,
        field: 'createdBy.val',
        cellTemplate: 'createUserLinkTemplate',
        width: '10%'
      }];
      this.tableData = [];
      this.itemQuantity = 100;
      this.viewPermission = PLMPermissions.VIEW_ASSOCIATED_WORKFLOW;
      this.dateFormat = {
        date: 'yyyy',
        dateAndHour: 'yyyy hh:mm a'
      };
      this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, userObj) {
        EventService.unlisten($__3.currentUserListenerId);
        $__3.dateFormat.date = userObj.getDateFormat();
        $__3.dateFormat.dateAndHour = (userObj.getDateFormat() + " hh:mm a");
      });
      this.itemListenerId = EventService.listen(("itemInstance:" + this.itemLink + ":done"), function(event, itemObj) {
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
        EventService.send(("workflow:" + $__3.itemLink + ":get"), itemObj.getWorkflowLink(), {});
      });
      this.workflowObjListenerId = EventService.listen(("workflow:" + this.itemLink + ":done"), function(event, workflowObj) {
        EventService.unlisten($__3.workflowObjListenerId);
        $__3.parseViewWorkflowItems(workflowObj.getFullList(), $__3.itemQuantity);
      });
      ModelsManager.getCurrentUser();
      ModelsManager.getItem(this.itemLink);
      $scope.$on('$destroy', function() {
        EventService.unlisten($__3.itemListenerId);
        EventService.unlisten($__3.currentUserListenerId);
        EventService.unlisten($__3.workflowObjListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewWorkflowController, {
      parseViewWorkflowItems: function(data, itemQuantity) {
        var $__3 = this;
        this.tableData = [];
        if (angular.isArray(data)) {
          this._.each(data, function(element, index) {
            var itemResourceId = $__3.UrnParser.encode(element.item.urn);
            var itemWs = element.item.urn.split('.').reverse()[1];
            var row = {};
            row.itemDisplayName = {
              value: element.item.version ? (element.item.title + " " + element.item.version) : ("" + element.item.title),
              href: $__3.$state.href('details', {
                workspaceId: itemWs,
                tab: 'details',
                view: 'full',
                mode: 'view',
                itemId: itemResourceId
              })
            };
            row.itemWorkspace = '';
            if (element['workflow-state'] !== null) {
              var performUserId = (element['last-workflow-history'].user.link).split('users/')[1];
              var createUserId = (element['first-workflow-history'].user.link).split('users/')[1];
              row.currentState = element['workflow-state'].title;
              row.lastAction = element['last-workflow-history'].workflowTransition.title;
              row.dateOfLastAction = element['last-workflow-history'].created;
              row.performedBy = {
                userId: performUserId,
                val: element['last-workflow-history'].user.title
              };
              row.createdOn = element['first-workflow-history'].created;
              row.createdBy = {
                userId: createUserId,
                val: element['first-workflow-history'].user.title
              };
            }
            $__3.tableData.push(row);
            var itemListenerId = $__3.EventService.listen(("itemInstance:" + itemResourceId + ":done"), function(event, ItemObj) {
              $__3.EventService.unlisten(itemListenerId);
              $__3.parseViewWorkflowItemsWorkspace(ItemObj.workspaceObj.getDisplayName(), index);
            });
            $__3.ModelsManager.getItem(itemResourceId);
          });
        }
      },
      parseViewWorkflowItemsWorkspace: function(name, index) {
        this.tableData[index].itemWorkspace = name;
      },
      openFlyoutWindow: function(event, userId) {
        this.FlyoutService.open({
          flyoutClass: 'user-profile-flyout',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          template: ("<user-profile-summary user-id=\"" + userId + "\"></user-profile-summary>")
        });
      },
      isViewState: function() {
        return this.$location.search().mode === 'view';
      }
    }, {});
  }();
  var $__default = ViewWorkflowController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewWorkflow/viewWorkflow.controller.js
