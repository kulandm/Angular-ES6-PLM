System.registerModule("com/autodesk/components/confirmationDialog/confirmationDialog.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/confirmationDialog/confirmationDialog.controller.js";
  var ConfirmationDialogController = function() {
    function ConfirmationDialogController($scope, $mdDialog) {
      this.$scope = $scope;
      this.$mdDialog = $mdDialog;
      var that = this;
    }
    return ($traceurRuntime.createClass)(ConfirmationDialogController, {
      confirm: function() {
        this.$mdDialog.hide();
      },
      cancel: function() {
        this.$mdDialog.cancel();
      }
    }, {});
  }();
  var $__default = ConfirmationDialogController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/confirmationDialog/confirmationDialog.controller.js
