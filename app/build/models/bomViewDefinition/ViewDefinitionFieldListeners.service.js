System.registerModule("com/autodesk/models/bomViewDefinition/ViewDefinitionFieldListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomViewDefinition/ViewDefinitionFieldListeners.service.js";
  var ViewDefinitionFieldListeners = function() {
    function ViewDefinitionFieldListeners(ViewDefinitionField, BomMessageService, EventService) {
      this.ViewDefinitionField = ViewDefinitionField;
      this.BomMessageService = BomMessageService;
      this.EventService = EventService;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(ViewDefinitionFieldListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('viewDefinitionField:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, viewDefFieldLink) {
        for (var args = [],
            $__3 = 2; $__3 < arguments.length; $__3++)
          args[$__3 - 2] = arguments[$__3];
        var $__2 = this;
        this.ViewDefinitionField.fetch(viewDefFieldLink, args).then(function(viewDefField) {
          $__2.EventService.send($__2.BomMessageService.getViewDefFieldRecievedMessage(event.split(':')[1]), viewDefField);
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('ViewDefinitionFieldListeners', ['ViewDefinitionField', 'BomMessageService', 'EventService', ViewDefinitionFieldListeners]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomViewDefinition/ViewDefinitionFieldListeners.service.js
