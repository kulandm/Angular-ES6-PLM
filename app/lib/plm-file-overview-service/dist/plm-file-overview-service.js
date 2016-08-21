System.registerModule("com/autodesk/fileOverview.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fileOverview.js";
  var FileOverviewService = System.get("com/autodesk/fileOverview.service.js").default;
  var $__default = angular.module(__moduleName, []).service('FileOverviewService', ['$q', '$window', FileOverviewService]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fileOverview.js
;

System.registerModule("com/autodesk/fileOverview.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fileOverview.service.js";
  var FileOverviewService = function() {
    function FileOverviewService($q, $window) {
      this.$window = $window;
      this.hostDeferred = $q.defer();
    }
    return ($traceurRuntime.createClass)(FileOverviewService, {
      getHost: function() {
        return this.hostDeferred.promise;
      },
      setHost: function(host) {
        this.hostDeferred.resolve(host);
      },
      getFileOverviewLink: function(wipUrn, version, callback) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.getFileOverviewLinkWithHost(host, wipUrn, version, callback);
        });
      },
      getFileOverviewLinkWithHost: function(host, wipUrn, version, callback) {
        return callback ? (host + "/g/data/" + btoa(wipUrn) + "?callback=" + encodeURIComponent(callback) + "&version=" + version + "&user=plm") : (host + "/g/data/" + btoa(wipUrn) + "?version=" + version + "&user=plm");
      },
      getContainingFolderLink: function(wipFolderUrn) {
        return this.getHost().then(function(host) {
          return (host + "/g/folder/" + btoa(wipFolderUrn) + "?user=plm");
        });
      },
      getContainingFolderLinkWithHost: function(host, wipFolderUrn) {
        return (host + "/g/folder/" + btoa(wipFolderUrn) + "?user=plm");
      }
    }, {});
  }();
  var $__default = FileOverviewService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/fileOverview.service.js
