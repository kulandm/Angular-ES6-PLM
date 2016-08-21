System.registerModule("com/autodesk/components/workspaceItem/changeOwner/editAdditionalOwners.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/changeOwner/editAdditionalOwners.controller.js";
  var EditAdditionalOwnersController = function() {
    function EditAdditionalOwnersController($scope, $rootScope, $mdDialog, RESTWrapperService, App, ownershipObj, OWNER_TYPE, NotificationService, NotificationTypes, _) {
      var $__2 = this;
      this.$mdDialog = $mdDialog;
      this.$rootScope = $rootScope;
      this.owners = ownershipObj.getFullList().ownership.owners;
      this.RESTWrapperService = RESTWrapperService;
      this.Ownership = ownershipObj;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      var app = new App();
      this._ = _;
      this.originalUsers = this.owners.filter(function(item) {
        return item.ownerType === OWNER_TYPE.ADDITIONAL_USER;
      });
      this.originalGroups = this.owners.filter(function(item) {
        return item.ownerType === OWNER_TYPE.ADDITIONAL_GROUP;
      });
      this.selectedUsers = [];
      this.selectedGroups = [];
      this.modified = false;
      $scope.$watchGroup([(this, function(selectedUsers) {
        return $__2.selectedUsers.length;
      }).bind(this), (this, function(selectedGroups) {
        return $__2.selectedGroups.length;
      }).bind(this)], (function() {
        var originalUsers = _.pluck($__2.originalUsers, 'detailsLink');
        var selectedUsers = _.pluck($__2.selectedUsers, '__self__');
        var originalGroups = _.pluck($__2.originalGroups, 'detailsLink');
        var selectedGroups = _.pluck($__2.selectedGroups, '__self__');
        $__2.modified = _.difference(originalUsers, selectedUsers).length > 0 || _.difference(selectedUsers, originalUsers).length > 0 || _.difference(originalGroups, selectedGroups).length > 0 || _.difference(selectedGroups, originalGroups).length > 0;
      }).bind(this));
      RESTWrapperService.get(app.getUserLink(''), [], {
        limit: 1000,
        offset: 0,
        mappedOnly: false
      }, {}, {Accept: 'application/vnd.autodesk.plm.users.bulk+json'}).then(function(users) {
        $__2.users = users.items;
        $__2.selectedUsers = $__2.users.filter(function(item) {
          return $__2.originalUsers.findIndex(function(user) {
            return user.detailsLink === item.__self__;
          }) !== -1;
        });
      });
      RESTWrapperService.get(app.getGroupsLinkV3()).then(function(groupsObj) {
        $__2.groups = groupsObj.groups.map(function(group) {
          group.displayName = group.shortName;
          return group;
        });
        $__2.selectedGroups = $__2.groups.filter(function(item) {
          return $__2.originalGroups.findIndex(function(group) {
            return group.detailsLink === item.__self__;
          }) !== -1;
        });
      });
    }
    return ($traceurRuntime.createClass)(EditAdditionalOwnersController, {
      triggerSave: function() {
        var $__2 = this;
        this.Ownership.editAdditionalOwners(this.owners, this.selectedUsers, this.selectedGroups).then(function() {
          $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + $__2.$rootScope.bundle.notification.changedAdditionalOwners.success));
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
  var $__default = EditAdditionalOwnersController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/changeOwner/editAdditionalOwners.controller.js
