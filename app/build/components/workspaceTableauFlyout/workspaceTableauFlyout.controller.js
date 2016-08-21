System.registerModule("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.controller.js";
  var WorkspaceTableauFlyoutController = function() {
    function WorkspaceTableauFlyoutController($scope, $rootScope, $timeout, $compile, $q, LocalizationService, ModelsManager, EventService, NotificationService, NotificationTypes, UrnParser, _, FlyoutService) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$compile = $compile;
      this.FlyoutService = FlyoutService;
      this.$q = $q;
      this._ = _;
      this.LocalizationService = LocalizationService;
      this.EventService = EventService;
      this.NotificationService = NotificationService;
      this.ModelsManager = ModelsManager;
      this.UrnParser = UrnParser;
      this.NotificationTypes = NotificationTypes;
      this.flyoutInstance = null;
      $scope.$on('$destroy', function() {});
    }
    return ($traceurRuntime.createClass)(WorkspaceTableauFlyoutController, {
      open: function() {
        var $__3 = this;
        var that = this;
        this.flyoutInstance = this.FlyoutService.open({
          templateUrl: 'build/components/workspaceTableauFlyout/workspaceTableauFlyoutBox.html',
          scope: this.$scope,
          anchorEl: angular.element(document.querySelectorAll('.workspace-tableau')[0]),
          showArrow: false,
          flyoutClass: 'workspace-tableau-tooltip',
          backdropOption: 1,
          controllerAs: 'flyoutCtrl',
          controller: 'WorkspaceTableauFlyoutBox',
          resolve: {ParentController: function() {
              return $__3;
            }}
        });
        this.flyoutInstance.closed.then(function(result) {}, function() {});
      },
      saveWorkspaceTableau: function(currentConfiguration) {
        this.EventService.send(this.callback, currentConfiguration);
      }
    }, {});
  }();
  var $__default = WorkspaceTableauFlyoutController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.controller.js
