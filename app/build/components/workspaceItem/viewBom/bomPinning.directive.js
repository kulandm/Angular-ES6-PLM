System.registerModule("com/autodesk/components/workspaceItem/viewBom/bomPinning.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/bomPinning.directive.js";
  function BomPinning() {
    var directive = {
      restrict: 'E',
      templateUrl: 'build/components/workspaceItem/viewBom/bomPinning.html',
      scope: {
        fieldData: '=',
        editView: '@',
        onToggle: '&'
      },
      link: function(scope, element, attrs) {
        scope.internalOnToggle = function() {
          scope.fieldData.value = scope.fieldData.value === 'true' ? 'false' : 'true';
          scope.onToggle();
        };
        scope.isPinned = function() {
          return scope.fieldData.value === 'true';
        };
      }
    };
    return directive;
  }
  var $__default = angular.module(__moduleName, []).directive('bomPinning', BomPinning);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/bomPinning.directive.js
