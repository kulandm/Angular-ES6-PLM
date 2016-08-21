System.registerModule("com/autodesk/components/workspaceItem/commandBar/commandBar.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/commandBar/commandBar.js";
  var CommandBarController = System.get("com/autodesk/components/workspaceItem/commandBar/commandBar.controller.js").default;
  var CommandBarDirective = System.get("com/autodesk/components/workspaceItem/commandBar/commandBar.directive.js").default;
  angular.module(__moduleName, []).controller('CommandBarController', CommandBarController).directive('commandBar', CommandBarDirective);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/commandBar/commandBar.js
