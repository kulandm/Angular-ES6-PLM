System.registerModule("com/autodesk/WipApiService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/WipApiService.js";
  var WipApiService = function() {
    function WipApiService($http, $q, TokenService) {
      this.$http = $http;
      this.TokenService = TokenService;
      this.hostDeferred = $q.defer();
    }
    return ($traceurRuntime.createClass)(WipApiService, {
      getWipEntitiesLink: function(wipHost) {
        return (wipHost + "/storage/v3/entities/get");
      },
      getWipFileLink: function(wipHost, fileUrn) {
        return (wipHost + "/storage/v3/lineages/" + fileUrn);
      },
      getWipSingleVersionLink: function(wipHost, versionUrn) {
        return (wipHost + "/storage/v3/versionedfiles/" + versionUrn);
      },
      getWipFileVersionsLink: function(wipHost, fileUrn) {
        return (wipHost + "/storage/v3/lineages/" + fileUrn + "/versions");
      },
      getWipFileDownloadLink: function(wipHost, versionUrn, filename) {
        var queryParam = filename ? ("?filename=" + filename) : '';
        return (wipHost + "/storage/v3/downloadurl/" + versionUrn + queryParam);
      },
      getWipFolderLink: function(wipHost, folderUrn) {
        return (wipHost + "/storage/v3/folders/" + folderUrn + "/contents?includeHidden=false&offset=0");
      },
      getHost: function() {
        return this.hostDeferred.promise;
      },
      setHost: function(host) {
        this.hostDeferred.resolve(host);
      },
      wipHttpRequest: function(config) {
        var $__2 = this;
        return this.TokenService.get().then(function(token) {
          config.headers = config.headers || {};
          config.headers.Authorization = ("Bearer " + token);
          config.method = config.method || 'GET';
          return $__2.$http(config);
        });
      },
      getFiles: function(lineageUrns) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.wipHttpRequest({
            url: $__2.getWipEntitiesLink(host),
            method: 'POST',
            data: lineageUrns
          });
        });
      },
      getWipFolder: function(folderUrn) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.wipHttpRequest({url: $__2.getWipFolderLink(host, folderUrn)});
        });
      },
      getWipFile: function(fileUrn) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.wipHttpRequest({url: $__2.getWipFileLink(host, fileUrn)});
        });
      },
      getWipFileVersions: function(lineageUrn) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.wipHttpRequest({url: $__2.getWipFileVersionsLink(host, lineageUrn)});
        });
      },
      getWipSingleVersion: function(versionUrn) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.wipHttpRequest({url: $__2.getWipSingleVersionLink(host, encodeURIComponent(versionUrn))});
        });
      },
      downloadFile: function(versionUrn, filename) {
        var $__2 = this;
        return this.getHost().then(function(host) {
          return $__2.wipHttpRequest({
            url: $__2.getWipFileDownloadLink(host, encodeURIComponent(versionUrn), filename),
            method: 'POST',
            transformResponse: function(data, headers) {
              return data;
            }
          });
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).service('WipApiService', ['$http', '$q', 'TokenService', function($http, $q, TokenService) {
    return new WipApiService($http, $q, TokenService);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/WipApiService.js
;

