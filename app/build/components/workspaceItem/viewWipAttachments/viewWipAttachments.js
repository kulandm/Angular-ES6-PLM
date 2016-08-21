System.registerModule("com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.js";
  var ViewWipAttachmentsController = System.get("com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.controller.js").default;
  System.get("com/autodesk/cpdm.js");
  System.get("com/autodesk/WipApiService.js");
  System.get("com/autodesk/wipFileBrowser.js");
  System.get("com/autodesk/services/cpdmAttachmentsService.js");
  System.get("com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js");
  System.get("com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js");
  System.get("com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js");
  System.get("com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js");
  angular.module(__moduleName, ['com/autodesk/fileOverview.js', 'com/autodesk/WipApiService.js', 'com/autodesk/RESTWrapperService.js', 'com/autodesk/wipFileBrowser.js', 'com/autodesk/cpdm.js', 'com/autodesk/services/cpdmAttachmentsService.js', 'com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js', 'com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js', 'com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js', 'com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js']).controller('ViewWipAttachmentsController', ViewWipAttachmentsController);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.js
