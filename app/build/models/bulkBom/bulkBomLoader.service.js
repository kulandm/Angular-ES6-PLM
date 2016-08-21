System.registerModule("com/autodesk/models/bulkBom/bulkBomLoader.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bulkBom/bulkBomLoader.service.js";
  var BulkBomLoader = function() {
    function BulkBomLoader(BomMessageService, EventService, BulkBom, $q, UrnParser) {
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.BulkBom = BulkBom;
      this.$q = $q;
      this.UrnParser = UrnParser;
    }
    return ($traceurRuntime.createClass)(BulkBomLoader, {
      loadBulkBom: function(eventId, bulkBomEndPointLink) {
        var queryParameters = arguments[2] !== (void 0) ? arguments[2] : {};
        var $__2 = this;
        var deferredObj = this.$q.defer();
        eventId = this.UrnParser.encode(eventId);
        var fetchCompleteMessage = this.BomMessageService.getBulkBomFetchedSuccessMessage(eventId);
        var bulkBomLoaderListenerId = this.EventService.listen(fetchCompleteMessage, function(event, bulkBomObj) {
          $__2.EventService.unlisten(bulkBomLoaderListenerId);
          deferredObj.resolve(bulkBomObj);
        });
        this.requestForBulkBom(eventId, bulkBomEndPointLink, queryParameters);
        return deferredObj.promise;
      },
      requestForBulkBom: function(eventId, bulkBomEndPointLink, queryParameters) {
        this.EventService.send(("bulkBom:" + eventId + ":get"), bulkBomEndPointLink, queryParameters);
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('BulkBomLoader', ['BomMessageService', 'EventService', 'BulkBom', '$q', 'UrnParser', BulkBomLoader]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bulkBom/bulkBomLoader.service.js
