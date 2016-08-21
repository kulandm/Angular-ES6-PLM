System.registerModule("com/autodesk/models/bomAttachment/bomAttachment.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomAttachment/bomAttachment.js";
  var BomBulkAttachmentFactory = System.get("com/autodesk/models/bomAttachment/bomBulkAttachment.model.js").default;
  var BomBulkAttachmentListeners = System.get("com/autodesk/models/bomAttachment/bomBulkAttachmentListeners.service.js").default;
  var BomBulkAttachmentLoader = System.get("com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js").default;
  angular.module(__moduleName, []).factory('BomBulkAttachment', BomBulkAttachmentFactory).service('BomBulkAttachmentListeners', BomBulkAttachmentListeners).service('BomBulkAttachmentLoader', BomBulkAttachmentLoader);
  return {};
});
//# sourceURL=com/autodesk/models/bomAttachment/bomAttachment.js
