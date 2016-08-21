System.registerModule("com/autodesk/models/bomAttachment/bomAttachmentList.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomAttachment/bomAttachmentList.model.js";
  var BomAttachment = System.get("com/autodesk/models/bomAttachment/bomAttachment.model.js").default;
  var BomAttachmentList = function() {
    function BomAttachmentList() {
      var attachmentArray = arguments[0] !== (void 0) ? arguments[0] : [];
      var itemId = arguments[1];
      this.attachments = attachmentArray.map((function(attachment) {
        return new BomAttachment(attachment);
      }));
      this.itemId = itemId;
    }
    return ($traceurRuntime.createClass)(BomAttachmentList, {
      getAttachments: function() {
        return this.attachments;
      },
      getSize: function() {
        return this.attachments.length;
      },
      getItemId: function() {
        return this.itemId;
      }
    }, {});
  }();
  var $__default = BomAttachmentList;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomAttachment/bomAttachmentList.model.js
