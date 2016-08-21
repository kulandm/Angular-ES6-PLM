System.registerModule("com/autodesk/components/workspaceItem/viewProjectManagement/treeView.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewProjectManagement/treeView.directive.js";
  function TreeViewDirective() {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'ViewProjectManagementController',
      controllerAs: 'viewProjectManagementCtrl',
      scope: {
        rootNodes: '=',
        treeTitle: '@',
        displayField: '@',
        toggleNode: '&',
        treeSummary: '@'
      },
      templateUrl: 'build/components/workspaceItem/viewProjectManagement/treeView.html',
      link: function(scope) {
        scope.toggle = function(node) {
          if (node.isExpandable === true) {
            scope.toggleNode({
              collapsed: node.collapsed === true ? false : true,
              node: node
            });
          }
        };
      }
    };
    return directive;
  }
  var $__default = TreeViewDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewProjectManagement/treeView.directive.js
