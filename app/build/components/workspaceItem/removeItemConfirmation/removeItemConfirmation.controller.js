System.registerModule("com/autodesk/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.controller.js";
  var RemoveItemConfirmationController = function() {
    function RemoveItemConfirmationController($scope, $mdDialog, itemCount) {
      this.itemCount = itemCount;
      this.$mdDialog = $mdDialog;
      this.$scope = $scope;
    }
    return ($traceurRuntime.createClass)(RemoveItemConfirmationController, {
      confirm: function() {
        this.$mdDialog.hide();
      },
      cancel: function() {
        this.$mdDialog.cancel();
      }
    }, {});
  }();
  var $__default = RemoveItemConfirmationController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.controller.js
