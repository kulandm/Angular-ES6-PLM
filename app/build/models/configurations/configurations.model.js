System.registerModule("com/autodesk/models/configurations/configurations.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/configurations/configurations.model.js";
  var Configurations = function() {
    function Configurations(json) {
      var $__2 = this;
      this.configurationsMap = new Map();
      if (json) {
        json.forEach(function(config) {
          $__2.configurationsMap.set($__2.getConfigKey(config), config);
        });
      }
      this.json = json;
    }
    return ($traceurRuntime.createClass)(Configurations, {
      getConfigKey: function(configObj) {
        return configObj.link.split('/').pop();
      },
      getConfig: function(key) {
        return this.configurationsMap.get(key);
      }
    }, {fetch: function(link, params) {
        return this.RESTWrapperService.get(link, null, params, null).then(function(payload) {
          return new Configurations(payload);
        });
      }});
  }();
  var ConfigurationsFactory = function(RESTWrapperService) {
    Configurations.RESTWrapperService = RESTWrapperService;
    return Configurations;
  };
  ConfigurationsFactory.$inject = ['RESTWrapperService'];
  var $__default = ConfigurationsFactory;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/configurations/configurations.model.js
