System.registerModule("com/autodesk/models/bomAttachment/bomBulkAttachment.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomAttachment/bomBulkAttachment.model.js";
  var BomAttachmentList = System.get("com/autodesk/models/bomAttachment/bomAttachmentList.model.js").default;
  var BomBulkAttachment = function() {
    function BomBulkAttachment(json) {
      var itemList = arguments[1] !== (void 0) ? arguments[1] : [];
      var $__3 = this;
      if (json) {
        this.attachmentLists = new Map();
        json.forEach(function(array) {
          var newList = new BomAttachmentList(array, array[0].itemId);
          $__3.attachmentLists.set(newList.getItemId(), newList);
        });
        this.itemUrnList = itemList;
      }
      this.json = json;
    }
    return ($traceurRuntime.createClass)(BomBulkAttachment, {
      getItemUrnList: function() {
        return this.itemUrnList;
      },
      getAttachmentLists: function() {
        return this.attachmentLists;
      }
    }, {fetch: function() {
        var itemUrnList = arguments[0] !== (void 0) ? arguments[0] : [];
        var attachmentsEndpoint = arguments[1];
        var params = arguments[2] !== (void 0) ? arguments[2] : {};
        var requestHeaders = {
          'Content-Type': 'application/vnd.autodesk.plm.attachments.bulk+json',
          Accept: 'application/vnd.autodesk.plm.attachments.bulk+json',
          skipCache: true
        };
        return this.RESTWrapperService.post(itemUrnList, attachmentsEndpoint, null, null, requestHeaders).then(function(response) {
          return new BomBulkAttachment(response, itemUrnList);
        });
      }});
  }();
  var BomBulkAttachmentFactory = function(RESTWrapperService) {
    BomBulkAttachment.RESTWrapperService = RESTWrapperService;
    return BomBulkAttachment;
  };
  BomBulkAttachmentFactory.$inject = ['RESTWrapperService'];
  var $__default = BomBulkAttachmentFactory;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomAttachment/bomBulkAttachment.model.js
