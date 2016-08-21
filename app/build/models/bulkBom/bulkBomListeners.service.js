System.registerModule("com/autodesk/models/bulkBom/bulkBomListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bulkBom/bulkBomListeners.service.js";
  var BulkBomListeners = function() {
    function BulkBomListeners(BulkBom, BomMessageService, EventService) {
      this.BulkBom = BulkBom;
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(BulkBomListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('bulkBom:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, link, params) {
        var $__2 = this;
        this.BulkBom.fetch(link, params).then(function(response) {
          $__2.EventService.send($__2.BomMessageService.getBulkBomFetchedSuccessMessage($__2.BomMessageService.extractEventId(event)), response);
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('BulkBomListeners', ['BulkBom', 'BomMessageService', 'EventService', BulkBomListeners]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bulkBom/bulkBomListeners.service.js
