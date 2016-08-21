System.registerModule("com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.js";
  var ViewAttachedItemsController = System.get("com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.controller.js").default;
  System.get("com/autodesk/WipApiService.js");
  System.get("com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js");
  angular.module(__moduleName, ['com/autodesk/WipApiService.js', 'com/autodesk/components/wipAttachmentsList/wipAttachmentsList.js']).controller('ViewAttachedItemsController', ViewAttachedItemsController);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.js
