System.registerModule("com/autodesk/services/UrlParser.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/UrlParser.js";
  var UrlParser = function() {
    function UrlParser() {}
    return ($traceurRuntime.createClass)(UrlParser, {parse: function(url) {
        if (angular.isDefined(window.URL) && angular.isDefined(window.URL.prototype)) {
          return new URL(url);
        } else {
          var anchor = document.createElement('a');
          anchor.href = url;
          return anchor;
        }
      }}, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('UrlParser', [function() {
    return new UrlParser();
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/UrlParser.js
