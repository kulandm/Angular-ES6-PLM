System.registerModule("com/autodesk/components/itemViewer/itemViewer.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemViewer/itemViewer.directive.js";
  function ItemViewerDirective() {
    var directive = {
      restrict: 'E',
      transclude: true,
      controller: 'ItemViewerController',
      controllerAs: 'itemViewerCtrl',
      templateUrl: 'build/components/itemViewer/itemViewer.html',
      scope: {},
      link: function(scope, element, attrs, itemViewerCtrl) {
        itemViewerCtrl.init(element);
      }
    };
    return directive;
  }
  var $__default = ItemViewerDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/itemViewer/itemViewer.directive.js
