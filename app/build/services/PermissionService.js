System.registerModule("com/autodesk/services/PermissionService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/PermissionService.js";
  var underscoreModule = System.get("com/autodesk/UnderscoreService.js").default;
  var eventServiceModule = System.get("com/autodesk/EventService.js").default;
  var PermissionService = function() {
    function PermissionService(ModelsManager, EventService, $q, PLMPermissions, WorkspaceTypes, _) {
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.$q = $q;
      this.PLMPermissions = PLMPermissions;
      this.WorkspaceTypes = WorkspaceTypes;
      this._ = _;
    }
    return ($traceurRuntime.createClass)(PermissionService, {
      hasPermissions: function(permissionList, workspaceId) {
        var $__4 = this;
        var deferObj = this.$q.defer();
        var userPermissionsListenerId = this.EventService.listen(("userPermissions:" + workspaceId + "~*:done"), function(event, userPermissionsObj) {
          $__4.EventService.unlisten(userPermissionsListenerId);
          var hasPermissions = $__4._.every(permissionList, function(permission) {
            return userPermissionsObj.hasPermission(permission);
          });
          deferObj.resolve(hasPermissions);
        }, true);
        var permissionErrorListenerId = this.EventService.listen(("workspaceInstance:" + workspaceId + ":permissionError"), function(event, workspaceId) {
          $__4.EventService.unlisten(permissionErrorListenerId);
          deferObj.resolve(false);
        }, true);
        this.ModelsManager.getWorkspace(workspaceId);
        return deferObj.promise;
      },
      checkPermissionByItem: function(itemObj, permission, applyLock, applyRevisionOverrideLock) {
        var $__4 = this;
        var deferObj = this.$q.defer();
        var workspaceTypeId = parseInt(itemObj.workspaceObj.getTypeId());
        var isWorkspaceWithWorkflow = workspaceTypeId === this.WorkspaceTypes.BASIC_WORKSPACE_WITH_WORKFLOW || workspaceTypeId === this.WorkspaceTypes.REVISIONING_WORKSPACE || workspaceTypeId === this.WorkspaceTypes.SUPPLIER_WITH_WORKFLOW;
        if (workspaceTypeId !== this.WorkspaceTypes.REVISION_CONTROLLED_WORKSPACE && applyLock && itemObj.getFullList().itemLocked === true) {
          this.hasPermissions([permission, this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS], itemObj.workspaceObj.getId()).then(function(hasPermission) {
            deferObj.resolve(hasPermission);
          });
        } else if (workspaceTypeId === this.WorkspaceTypes.REVISION_CONTROLLED_WORKSPACE && applyRevisionOverrideLock && (itemObj.getFullList().itemLocked === true || itemObj.getFullList().workingVersion === false)) {
          this.hasPermissions([permission, this.PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS], itemObj.workspaceObj.getId()).then(function(hasPermission) {
            deferObj.resolve(hasPermission);
          });
        } else if (applyLock && isWorkspaceWithWorkflow) {
          var itemTransitionsListenerId = this.EventService.listen(("itemTransitions:" + itemObj.getId() + ":done"), function(event, transitionsObj) {
            $__4.EventService.unlisten(itemTransitionsListenerId);
            $__4.EventService.unlisten(itemTransitionsFailedListenerId);
            if (transitionsObj.transitions && transitionsObj.transitions.length) {
              $__4.hasPermissions([permission], itemObj.workspaceObj.getId()).then(function(hasPermission) {
                deferObj.resolve(hasPermission);
              });
            } else {
              $__4.hasPermissions([permission, $__4.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS], itemObj.workspaceObj.getId()).then(function(hasPermission) {
                deferObj.resolve(hasPermission);
              });
            }
          });
          var itemTransitionsFailedListenerId = this.EventService.listen(("itemTransitions:" + itemObj.getId() + ":failed"), function(event, transitionsObj) {
            $__4.EventService.unlisten(itemTransitionsListenerId);
            $__4.EventService.unlisten(itemTransitionsFailedListenerId);
            $__4.hasPermissions([permission, $__4.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS], itemObj.workspaceObj.getId()).then(function(hasPermission) {
              deferObj.resolve(hasPermission);
            });
          });
          this.ModelsManager.getTransitionsByLink(itemObj.getId(), itemObj.getTransitionsLink());
        } else {
          this.hasPermissions([permission], itemObj.workspaceObj.getId()).then(function(hasPermission) {
            deferObj.resolve(hasPermission);
          });
        }
        return deferObj.promise;
      },
      checkPermissionByItemId: function(itemId, permission, applyLock, applyRevisionOverrideLock) {
        var $__4 = this;
        var deferObj = this.$q.defer();
        var itemListenerId = this.EventService.listen(("itemInstance:" + itemId + ":done"), function(event, itemObj) {
          $__4.EventService.unlisten(itemListenerId);
          $__4.checkPermissionByItem(itemObj, permission, applyLock, applyRevisionOverrideLock).then(function(hasPermission) {
            deferObj.resolve(hasPermission);
          });
        });
        return deferObj.promise;
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, [underscoreModule.name, eventServiceModule.name]).factory('PermissionService', ['ModelsManager', 'EventService', '$q', 'PLMPermissions', 'WorkspaceTypes', '_', function(ModelsManager, EventService, $q, PLMPermissions, WorkspaceTypes, _) {
    return new PermissionService(ModelsManager, EventService, $q, PLMPermissions, WorkspaceTypes, _);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/PermissionService.js
