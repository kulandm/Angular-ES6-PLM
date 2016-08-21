System.registerModule("com/autodesk/models/configurations/configurationsListeners.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/configurations/configurationsListeners.service.js";
  var ConfigurationsListeners = function() {
    function ConfigurationsListeners(EventService, Configurations) {
      this.EventService = EventService;
      this.Configurations = Configurations;
      this.getListener = this.registerGetListener();
    }
    return ($traceurRuntime.createClass)(ConfigurationsListeners, {
      registerGetListener: function() {
        var $__2 = this;
        return this.EventService.listen('configurations:*:get', function(event) {
          var $__4;
          for (var args = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            args[$__3 - 1] = arguments[$__3];
          ($__4 = $__2).respondToGetListener.apply($__4, $traceurRuntime.spread([event], args));
        });
      },
      respondToGetListener: function(event, link, params) {
        var $__2 = this;
        this.Configurations.fetch(link, params).then(function(obj) {
          $__2.EventService.send(("configurations:" + event.split(':')[1] + ":done"), obj);
        });
      }
    }, {});
  }();
  ConfigurationsListeners.$inject = ['EventService', 'Configurations'];
  var $__default = ConfigurationsListeners;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/configurations/configurationsListeners.service.js
