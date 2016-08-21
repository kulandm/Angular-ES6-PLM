System.registerModule("com/autodesk/models/configurations/configurations.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/configurations/configurations.js";
  var ConfigurationsFactory = System.get("com/autodesk/models/configurations/configurations.model.js").default;
  var ConfigurationsListeners = System.get("com/autodesk/models/configurations/configurationsListeners.service.js").default;
  angular.module(__moduleName, []).factory('Configurations', ConfigurationsFactory).service('ConfigurationsListeners', ConfigurationsListeners);
  return {};
});
//# sourceURL=com/autodesk/models/configurations/configurations.js
