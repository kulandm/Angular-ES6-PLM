System.registerModule("com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.controller.js";
  var ViewAttachmentsController = function() {
    function ViewAttachmentsController($scope, $rootScope, $stateParams, $state, ModelsManager, EventService, FlyoutService, NotificationService, PermissionService, NotificationTypes, PLMPermissions, _, UrnParser) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this._ = _;
      this.FlyoutService = FlyoutService;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.$stateParams = $stateParams;
      this.itemLink = UrnParser.encode($stateParams.itemId);
      this.workspaceId;
      this.itemId;
      this.userId;
      this.userName;
      this.viewPermission = PLMPermissions.VIEW_ATTACHMENTS;
      this.editPermission = PLMPermissions.EDIT_ATTACHMENTS;
      this.addPermission = PLMPermissions.ADD_ATTACHMENTS;
      this.deletePermission = PLMPermissions.DELETE_ATTACHMENTS;
      this.hasAddPermission;
      this.hasEditPermission;
      this.dateFormat = {
        date: 'yyyy',
        dateAndHour: 'yyyy hh:mm a'
      };
      this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
        EventService.unlisten($__2.currentUserListenerId);
        $__2.userId = UserObj.getId();
        $__2.userName = UserObj.getDisplayName();
        $__2.dateFormat.date = UserObj.getDateFormat();
        $__2.dateFormat.dateAndHour = (UserObj.getDateFormat() + " hh:mm a");
      });
      this.itemListenerId = EventService.listen(("itemInstance:" + this.itemLink + ":done"), function(event, ItemObj) {
        EventService.unlisten($__2.itemListenerId);
        $__2.workspaceId = ItemObj.workspaceObj.getId();
        $__2.itemId = ItemObj.getId();
        PermissionService.checkPermissionByItem(ItemObj, $__2.addPermission, true, true).then(function(hasAddPermission) {
          $__2.hasAddPermission = hasAddPermission;
        });
        PermissionService.checkPermissionByItem(ItemObj, $__2.editPermission, true, true).then(function(hasEditPermission) {
          $__2.hasEditPermission = hasEditPermission;
        });
        PermissionService.checkPermissionByItem(ItemObj, $__2.viewPermission).then(function(hasViewPermission) {
          if (!hasViewPermission) {
            EventService.send('forbiddenAccess:permissionDenied');
            $state.go('details', {
              tab: 'details',
              view: $stateParams.view,
              mode: 'view',
              itemId: UrnParser.encode($stateParams.itemId)
            });
          }
        });
        ModelsManager.getWorkspace($__2.workspaceId);
      });
      ModelsManager.getItem(this.itemLink);
      ModelsManager.getCurrentUser();
      $scope.$on('destroy', function() {
        EventService.unlisten($__2.currentUserListenerId);
        EventService.unlisten($__2.itemListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewAttachmentsController, {
      showUserInfo: function(event, userId) {
        this.FlyoutService.open({
          flyoutClass: 'user-profile-flyout',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          template: ("<user-profile-summary user-id=\"" + userId + "\"></user-profile-summary>")
        });
      },
      setSelectedRowInfo: function(fileInfo, isRowSelected) {
        this.fileInfo = fileInfo;
        this.status = fileInfo && fileInfo.fileStatus;
        this.showUndoFlag = (fileInfo && fileInfo.fileStatus) === 'Checked OUT';
        this.showRowActions = isRowSelected;
      },
      showNotification: function(responseList) {
        var $__2 = this;
        this._.each(responseList, function(response) {
          switch (response.type) {
            case $__2.NotificationTypes.SUCCESS:
              $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, response.message);
              break;
            case $__2.NotificationTypes.ERROR:
              $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, response.message);
              break;
            default:
              break;
          }
        });
        this.NotificationService.showNotifications();
      },
      isViewState: function() {
        return this.$stateParams.mode === 'view';
      }
    }, {});
  }();
  var $__default = ViewAttachmentsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.controller.js
