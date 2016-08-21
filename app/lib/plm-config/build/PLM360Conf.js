System.registerModule("com/autodesk/PLM360Conf.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/PLM360Conf.js";
  var $__default = angular.module(__moduleName, []).value('GlobalSettings', {
    debugLevel: 0,
    requestTimeout: 15000,
    devMode: 1
  });
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/PLM360Conf.js
