System.registerModule("com/autodesk/components/workspaceItem/changeOwner/changeOwner.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/changeOwner/changeOwner.controller.js";
  var ChangeOwnerController = function() {
    function ChangeOwnerController($rootScope, $mdDialog, RESTWrapperService, App, NotificationService, NotificationTypes, ownershipObj) {
      var $__2 = this;
      this.$mdDialog = $mdDialog;
      this.$rootScope = $rootScope;
      this.owners = ownershipObj.getFullList().ownership.owners;
      this.RESTWrapperService = RESTWrapperService;
      this.Ownership = ownershipObj;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      var app = new App();
      this.isNotifyingOwnerByEmail = false;
      this.selectedOwner = {};
      RESTWrapperService.get(app.getUserLink(''), [], {
        limit: 1000,
        offset: 0,
        mappedOnly: false
      }, {}, {Accept: 'application/vnd.autodesk.plm.users.bulk+json'}).then(function(users) {
        $__2.users = users.items;
        $__2.selectedOwner = users.items.find(function(item) {
          return item.__self__ === $__2.owners[0].detailsLink;
        });
      });
    }
    return ($traceurRuntime.createClass)(ChangeOwnerController, {
      triggerSave: function() {
        var $__2 = this;
        this.Ownership.replaceOwner(this.owners, this.selectedOwner, this.isNotifyingOwnerByEmail).then(function() {
          $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + $__2.$rootScope.bundle.notification.changedOwner.success));
        }, function() {
          $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + $__2.$rootScope.bundle.notification.failureInOperation));
        }).then(function() {
          $__2.$mdDialog.hide();
          $__2.NotificationService.showNotifications();
        });
      },
      closeDialog: function() {
        this.$mdDialog.cancel();
      }
    }, {});
  }();
  var $__default = ChangeOwnerController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/changeOwner/changeOwner.controller.js
