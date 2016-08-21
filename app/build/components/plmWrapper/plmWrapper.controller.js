System.registerModule("com/autodesk/components/plmWrapper/plmWrapper.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/plmWrapper/plmWrapper.controller.js";
  var PLMWrapperController = function() {
    function PLMWrapperController($scope, $rootScope, EventService, _) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.EventService = EventService;
      this._ = _;
      var that = this;
      this.contentLoad = function() {
        that.EventService.send('contentLoad:done');
      };
      this.isFullPage = false;
    }
    return ($traceurRuntime.createClass)(PLMWrapperController, {}, {});
  }();
  var $__default = PLMWrapperController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/plmWrapper/plmWrapper.controller.js
