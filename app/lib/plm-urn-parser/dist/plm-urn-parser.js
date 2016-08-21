System.registerModule("com/autodesk/UrnParser.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/UrnParser.js";
  var UrnParser = function() {
    function UrnParser() {}
    return ($traceurRuntime.createClass)(UrnParser, {
      encode: function(urn) {
        return urn.replace(/:/g, '`').replace(/\./g, ',');
      },
      decode: function(urn) {
        return urn.replace(/`/g, ':').replace(/,/g, '.');
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('UrnParser', [function() {
    return new UrnParser();
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/UrnParser.js
