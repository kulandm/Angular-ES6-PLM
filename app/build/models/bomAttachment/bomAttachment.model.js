System.registerModule("com/autodesk/models/bomAttachment/bomAttachment.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomAttachment/bomAttachment.model.js";
  var BomAttachment = function() {
    function BomAttachment(attachmentData) {
      if (attachmentData) {
        this.__self__ = (typeof attachmentData.__self__ === 'undefined') ? null : attachmentData.__self__;
        this.createdBy = (typeof attachmentData.createdBy === 'undefined') ? null : attachmentData.createdBy;
        this.creationDate = (typeof attachmentData.creationDate === 'undefined') ? null : attachmentData.creationDate;
        this.lastModifiedBy = (typeof attachmentData.lastModifiedBy === 'undefined') ? null : attachmentData.lastModifiedBy;
        this.lastModifiedDate = (typeof attachmentData.lastModifiedDate === 'undefined') ? null : attachmentData.lastModifiedDate;
        this.pinningPolicy = (typeof attachmentData.pinningPolicy === 'undefined') ? null : attachmentData.pinningPolicy;
        this.attachmentId = (typeof attachmentData.attachmentId === 'undefined') ? null : attachmentData.attachmentId;
        this.tenant = (typeof attachmentData.tenant === 'undefined') ? null : attachmentData.tenant;
        this.itemId = (typeof attachmentData.itemId === 'undefined') ? null : attachmentData.itemId;
      }
      this.attachmentData = attachmentData;
    }
    return ($traceurRuntime.createClass)(BomAttachment, {
      getSelfLink: function() {
        return this.__self__;
      },
      getCreatedBy: function() {
        return this.createdBy;
      },
      getCreationDate: function() {
        return this.creationDate;
      },
      getLastModifier: function() {
        return this.lastModifiedBy;
      },
      getLastModificationDate: function() {
        return this.lastModifiedDate;
      },
      getPinningPolicy: function() {
        return this.pinningPolicy;
      },
      getAttachmentId: function() {
        return this.attachmentId;
      },
      getTenant: function() {
        return this.tenant;
      },
      getItemId: function() {
        return this.itemId;
      }
    }, {});
  }();
  var $__default = BomAttachment;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomAttachment/bomAttachment.model.js
