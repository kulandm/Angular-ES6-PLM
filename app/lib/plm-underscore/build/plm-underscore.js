System.registerModule("com/autodesk/UnderscoreService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/UnderscoreService.js";
  var $__default = angular.module(__moduleName, []).factory('_', function() {
    return window._;
  });
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/UnderscoreService.js
