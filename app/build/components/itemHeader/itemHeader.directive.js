System.registerModule("com/autodesk/components/itemHeader/itemHeader.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemHeader/itemHeader.directive.js";
  function ItemHeaderDirective() {
    var directive = {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: 'ItemHeaderController',
      controllerAs: 'itemHeader',
      templateUrl: 'build/components/itemHeader/itemHeader.html',
      scope: {
        workspaceId: '=',
        itemId: '='
      }
    };
    return directive;
  }
  var $__default = ItemHeaderDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/itemHeader/itemHeader.directive.js
