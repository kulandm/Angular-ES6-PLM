System.registerModule("com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.controller.js";
  var ViewWipAttachmentsController = function() {
    function ViewWipAttachmentsController($scope, $state, $stateParams, $window, App, EventService, FileOverviewService, ModelsManager, PermissionService, PLMPermissions, RESTWrapperService, WipApiService, UrnParser, $mdDialog) {
      var $__2 = this;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$window = $window;
      this.EventService = EventService;
      this.FileOverviewService = FileOverviewService;
      this.WipApiService = WipApiService;
      this.$mdDialog = $mdDialog;
      this.itemLink = UrnParser.encode($stateParams.itemId);
      this.itemUrn = $stateParams.itemId;
      this.workspaceId;
      this.itemId;
      this.viewPermission = PLMPermissions.VIEW_ATTACHMENTS;
      this.addPermission = PLMPermissions.ADD_ATTACHMENTS;
      this.editPermission = PLMPermissions.EDIT_ATTACHMENTS;
      this.deletePermission = PLMPermissions.DELETE_ATTACHMENTS;
      this.selectedFiles = new Set();
      this.dateFormat = {
        date: 'yyyy',
        dateAndHour: 'yyyy hh:mm a'
      };
      this.attachmentsData = null;
      this.isItemLocked;
      this.isItemLoaded;
      this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
        EventService.unlisten($__2.currentUserListenerId);
        $__2.dateFormat.date = UserObj.getDateFormat();
        $__2.dateFormat.dateAndHour = (UserObj.getDateFormat() + " hh:mm a");
      });
      ModelsManager.getCurrentUser();
      this.itemListenerId = EventService.listen(("itemInstance:" + this.itemLink + ":done"), function(event, ItemObj) {
        $__2.workspaceId = ItemObj.workspaceObj.getId();
        $__2.itemId = ItemObj.getId();
        $__2.isItemLocked = ItemObj.isLocked();
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
      RESTWrapperService.get(new App().hubs.link).then(function(response) {
        FileOverviewService.setHost(response.items[0].links.link.href);
      });
      RESTWrapperService.get(new App().wipBase.link).then(function(response) {
        WipApiService.setHost(response.value);
      });
      $scope.$on('$destroy', function() {
        EventService.unlisten($__2.currentUserListenerId);
        EventService.unlisten($__2.itemListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewWipAttachmentsController, {
      triggerEdit: function() {
        this.$state.go('attachments', {
          tab: this.$stateParams.tab,
          view: this.$stateParams.view,
          mode: 'edit',
          itemId: this.$stateParams.itemId
        });
      },
      triggerSave: function() {
        var $__2 = this;
        this.EventService.send(("wipAttachment:" + this.itemId + ":save"));
        var saveDoneListener = this.EventService.listen(("wipAttachment:" + this.itemId + ":saveDone"), function() {
          $__2.EventService.unlisten(saveDoneListener);
          $__2.$state.go('attachments', {
            tab: $__2.$stateParams.tab,
            view: $__2.$stateParams.view,
            mode: 'view',
            itemId: $__2.$stateParams.itemId
          });
        });
      },
      triggerCancel: function() {
        this.$state.go('attachments', {
          tab: this.$stateParams.tab,
          view: this.$stateParams.view,
          mode: 'view',
          itemId: this.$stateParams.itemId
        });
      },
      triggerDownload: function() {
        this.EventService.send(("wipAttachment:" + this.itemId + ":download"));
      },
      setSelectedFiles: function(file) {
        this.selectedFiles.has(file) ? this.selectedFiles.delete(file) : this.selectedFiles.add(file);
      },
      isViewState: function() {
        return this.$stateParams.mode === 'view';
      },
      triggerFileBrowserDialog: function() {
        var $__2 = this;
        this.$mdDialog.show({
          templateUrl: 'components/wipFileBrowserDialog/wipFileBrowserDialog.html',
          controller: 'WipFileBrowserDialogController as wipFileBrowserDialogCtrl',
          locals: {
            workspaceId: this.workspaceId,
            itemId: this.itemId,
            itemUrn: this.itemUrn
          }
        }).then(function() {
          $__2.EventService.send(("wipAttachment:" + $__2.itemId + ":add"));
        });
      },
      triggerRemove: function() {
        this.EventService.send(("wipAttachment:" + this.itemId + ":remove"));
      }
    }, {});
  }();
  var $__default = ViewWipAttachmentsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.controller.js
