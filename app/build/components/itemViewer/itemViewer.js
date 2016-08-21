System.registerModule("com/autodesk/components/itemViewer/itemViewer.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemViewer/itemViewer.js";
  var ItemViewerController = System.get("com/autodesk/components/itemViewer/itemViewer.controller.js").default;
  var ItemViewerDirective = System.get("com/autodesk/components/itemViewer/itemViewer.directive.js").default;
  angular.module(__moduleName, []).controller('ItemViewerController', ItemViewerController).directive('itemViewer', ItemViewerDirective);
  return {};
});
//# sourceURL=com/autodesk/components/itemViewer/itemViewer.js
