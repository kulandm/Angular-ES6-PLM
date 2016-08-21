System.registerModule("com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.js";
  var ViewProjectManagementController = System.get("com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.controller.js").default;
  var AddLinkableItemsController = System.get("com/autodesk/components/workspaceItem/addLinkableItems/addLinkableItems.controller.js").default;
  angular.module(__moduleName, ['gantt', 'gantt.progress', 'gantt.tooltips']).controller('ViewProjectManagementController', ViewProjectManagementController).controller('AddLinkableItemsController', AddLinkableItemsController);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.js
