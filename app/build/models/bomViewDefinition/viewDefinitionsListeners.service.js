System.registerModule("com/autodesk/models/bomViewDefinition/viewDefinitionsListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomViewDefinition/viewDefinitionsListeners.service.js";
  var ViewDefinitionsListeners = function() {
    function ViewDefinitionsListeners(ViewDefinitions, BomMessageService, EventService) {
      this.ViewDefinitions = ViewDefinitions;
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(ViewDefinitionsListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('viewDefinitions:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, viewDefsLink) {
        for (var args = [],
            $__3 = 2; $__3 < arguments.length; $__3++)
          args[$__3 - 2] = arguments[$__3];
        var $__2 = this;
        this.ViewDefinitions.fetch(viewDefsLink, args).then(function(obj) {
          $__2.EventService.send($__2.BomMessageService.getViewDefinitionsReceivedMessage(event.split(':')[1]), obj);
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('ViewDefinitionsListeners', ['ViewDefinitions', 'BomMessageService', 'EventService', ViewDefinitionsListeners]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomViewDefinition/viewDefinitionsListeners.service.js
