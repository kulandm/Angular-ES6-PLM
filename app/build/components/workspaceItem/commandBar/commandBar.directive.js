System.registerModule("com/autodesk/components/workspaceItem/commandBar/commandBar.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/commandBar/commandBar.directive.js";
  function CommandBarDirective() {
    var directive = {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: 'CommandBarController',
      controllerAs: 'commandBarCtrl',
      templateUrl: 'build/components/workspaceItem/commandBar/commandBar.html',
      scope: {parentCtrl: '='},
      link: function(scope, element, attrs, commandBarCtrl) {}
    };
    return directive;
  }
  var $__default = CommandBarDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/commandBar/commandBar.directive.js
