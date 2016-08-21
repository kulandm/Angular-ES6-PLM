System.registerModule("com/autodesk/components/workspaceItem/viewBom/bomItemNumber.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/bomItemNumber.directive.js";
  function BomItemNumber() {
    return {
      restrict: 'E',
      templateUrl: 'build/components/workspaceItem/viewBom/bomItemNumber.html',
      scope: {
        fieldData: '=',
        expandRow: '&',
        collapseRow: '&',
        isExpandable: '=',
        isCollapsed: '=',
        editView: '@'
      },
      link: function(scope, element, attrs) {
        scope.internalExpandRow = function(event) {
          event.stopPropagation();
          scope.expandRow();
        };
        scope.internalCollapseRow = function(event) {
          event.stopPropagation();
          scope.collapseRow();
        };
        if (scope.fieldData && angular.isUndefined(scope.fieldData.originalValue)) {
          var $__2 = scope.fieldData.value,
              depth = $__2.depth,
              itemNumber = $__2.itemNumber;
          scope.fieldData.originalValue = {
            depth: depth,
            itemNumber: itemNumber
          };
        }
        scope.$watch('fieldData', function(newVal) {
          if (newVal && angular.isUndefined(scope.fieldData.originalValue)) {
            var $__3 = scope.fieldData.value,
                depth = $__3.depth,
                itemNumber = $__3.itemNumber;
            scope.fieldData.originalValue = {
              depth: depth,
              itemNumber: itemNumber
            };
          }
        });
      }
    };
  }
  var $__default = BomItemNumber;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/bomItemNumber.directive.js
