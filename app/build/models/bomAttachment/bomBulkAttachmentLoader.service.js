System.registerModule("com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js";
  var BomBulkAttachmentLoader = function() {
    function BomBulkAttachmentLoader(BomMessageService, EventService, $q) {
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.$q = $q;
    }
    return ($traceurRuntime.createClass)(BomBulkAttachmentLoader, {
      loadBulkAttachment: function(urnList, attachmentsEndPoint, queryParameters) {
        var $__2 = this;
        var deferredObj = this.$q.defer();
        var eventId = this.buildEventId(urnList);
        var attachMentsReievedMessage = this.BomMessageService.getBulkAttachmentRecivedMessage(eventId);
        var attachmentsListenerId = this.EventService.listen(attachMentsReievedMessage, function(event, bomAttachmentsObj) {
          $__2.EventService.unlisten(attachmentsListenerId);
          deferredObj.resolve(bomAttachmentsObj);
        });
        this.requestForAttachments(eventId, urnList, attachmentsEndPoint, queryParameters);
        return deferredObj.promise;
      },
      requestForAttachments: function(eventId, urnList, attachmentsEndPoint, queryParameters) {
        var urnListObj = {list: urnList};
        this.EventService.send(("bomBulkAttachment:" + eventId + ":get"), urnListObj, attachmentsEndPoint, queryParameters);
      },
      buildEventId: function() {
        var urnList = arguments[0] !== (void 0) ? arguments[0] : [];
        return urnList.map(function(urn) {
          return urn.split('.').pop();
        }).join(',');
      }
    }, {});
  }();
  BomBulkAttachmentLoader.$inject = ['BomMessageService', 'EventService', '$q'];
  var $__default = BomBulkAttachmentLoader;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomAttachment/bomBulkAttachmentLoader.service.js
