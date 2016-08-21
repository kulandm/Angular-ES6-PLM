System.registerModule("com/autodesk/models/bomViewDefinition/viewDefinitionListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomViewDefinition/viewDefinitionListeners.service.js";
  var ViewDefinitionListeners = function() {
    function ViewDefinitionListeners(ViewDefinition, BomMessageService, EventService) {
      this.ViewDefinition = ViewDefinition;
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(ViewDefinitionListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('viewDefinition:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, viewDefLink) {
        for (var args = [],
            $__3 = 2; $__3 < arguments.length; $__3++)
          args[$__3 - 2] = arguments[$__3];
        var $__2 = this;
        this.ViewDefinition.fetch(viewDefLink, args).then(function(obj) {
          $__2.EventService.send($__2.BomMessageService.getViewDefinitionReceivedMessage(event.split(':')[1]), obj);
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('ViewDefinitionListeners', ['ViewDefinition', 'BomMessageService', 'EventService', ViewDefinitionListeners]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomViewDefinition/viewDefinitionListeners.service.js
