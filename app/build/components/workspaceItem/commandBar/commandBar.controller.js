System.registerModule("com/autodesk/components/workspaceItem/commandBar/commandBar.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/commandBar/commandBar.controller.js";
  var CommandBarController = function() {
    function CommandBarController($scope, EventService) {
      this.EventService = EventService;
      this.parentCtrl = $scope.parentCtrl;
    }
    return ($traceurRuntime.createClass)(CommandBarController, {triggerSummary: function() {
        this.EventService.send('itemInstance:triggerSummary');
      }}, {});
  }();
  var $__default = CommandBarController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/commandBar/commandBar.controller.js
