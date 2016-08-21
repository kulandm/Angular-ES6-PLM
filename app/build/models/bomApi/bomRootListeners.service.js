System.registerModule("com/autodesk/models/bomApi/bomRootListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomApi/bomRootListeners.service.js";
  var BomRootListeners = function() {
    function BomRootListeners(BomRoot, BomMessageService, EventService) {
      this.BomRoot = BomRoot;
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(BomRootListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('bomRoot:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, eventId, params) {
        var $__2 = this;
        this.BomRoot.fetch(eventId, params).then(function(obj) {
          $__2.EventService.send($__2.BomMessageService.getBomTopLineReceivedMessage($__2.BomMessageService.extractEventId(event)), obj);
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('BomRootListeners', ['BomRoot', 'BomMessageService', 'EventService', BomRootListeners]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomApi/bomRootListeners.service.js
