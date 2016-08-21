System.registerModule("com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.js";
  var ViewAttachmentsController = System.get("com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.controller.js").default;
  System.get("com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js");
  System.get("com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js");
  System.get("com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js");
  angular.module(__moduleName, ['com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js', 'com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js', 'com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js']).controller('ViewAttachmentsController', ViewAttachmentsController);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.js
