System.registerModule("com/autodesk/models/bomAttachment/bomBulkAttachmentListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomAttachment/bomBulkAttachmentListeners.service.js";
  var BomBulkAttachmentListeners = function() {
    function BomBulkAttachmentListeners(BomMessageService, EventService, BomBulkAttachment) {
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.BomBulkAttachment = BomBulkAttachment;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(BomBulkAttachmentListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('bomBulkAttachment:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, itemUrnList, link, params) {
        var $__2 = this;
        this.BomBulkAttachment.fetch(itemUrnList.list, link, params).then(function(response) {
          $__2.EventService.send($__2.BomMessageService.getBulkAttachmentRecivedMessage($__2.BomMessageService.extractEventId(event)), response);
        });
      }
    }, {});
  }();
  BomBulkAttachmentListeners.$inject = ['BomMessageService', 'EventService', 'BomBulkAttachment'];
  var $__default = BomBulkAttachmentListeners;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomAttachment/bomBulkAttachmentListeners.service.js
