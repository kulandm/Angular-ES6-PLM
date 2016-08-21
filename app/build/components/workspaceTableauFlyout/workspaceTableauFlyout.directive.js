System.registerModule("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.directive.js";
  function WorkspaceTableauFlyoutDirective() {
    var directive = {
      restrict: 'E',
      transclude: true,
      controller: 'WorkspaceTableauFlyoutController',
      controllerAs: 'ctrl',
      templateUrl: 'build/components/workspaceTableauFlyout/workspaceTableauFlyout.html',
      scope: {
        columns: '=',
        callback: '='
      },
      bindToController: true
    };
    return directive;
  }
  var $__default = WorkspaceTableauFlyoutDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.directive.js
