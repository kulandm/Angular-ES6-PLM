System.registerModule("com/autodesk/fileSizeFilter.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/fileSizeFilter.js";
  function fileSizeFilter() {
    return function(size, precision) {
      if (isNaN(size)) {
        return '';
      }
      if (isNaN(parseFloat(size)) || !isFinite(size) || (size === 0) || (size < 1024)) {
        return '-';
      }
      if (!precision || precision < 0) {
        precision = 1;
      }
      var units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
      var number = Math.floor(Math.log(size) / Math.log(1024));
      return (size / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
  }
  return {};
});
//# sourceURL=com/autodesk/fileSizeFilter.js
;

System.registerModule("com/autodesk/wipFileBrowser.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileBrowser.controller.js";
  System.get('com/autodesk/UnderscoreService.js');
  System.get('com/autodesk/EventService.js');
  var WipFileBrowserController = function() {
    function WipFileBrowserController($scope, $rootScope, $document, $timeout, $q, EventService, _, WipSearchService, WipApiService) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$document = $document;
      this.$timeout = $timeout;
      this.EventService = EventService;
      this._ = _;
      this.WipSearchService = WipSearchService;
      this.WipApiService = WipApiService;
      this.$q = $q;
      this.wipFileBrowserListenerId;
      this.breadcrumbData = [];
      this.selectedFiles = new Set();
      this.isDataAvailable = true;
      this.tableColumns = [{
        field: 'item',
        displayName: '',
        cellTemplate: 'checkboxTemplate',
        enableColumnResizing: false,
        width: '60'
      }, {
        field: 'item',
        displayName: this.$rootScope.bundle.wip.attachments.name,
        cellTemplate: 'linkTemplate'
      }, {
        field: 'createdUserName',
        displayName: this.$rootScope.bundle.wip.attachments.owner
      }, {
        field: 'item.type',
        displayName: this.$rootScope.bundle.wip.attachments.type,
        width: '80'
      }, {
        field: 'size',
        displayName: this.$rootScope.bundle.wip.attachments.size,
        cellFilter: 'fileSizeFilter',
        width: '80'
      }, {
        field: 'lastModifiedTime',
        displayName: this.$rootScope.bundle.wip.attachments.lastUpdated,
        cellTemplate: 'dateTemplate'
      }];
      this.searchTableColumns = [{
        field: 'item',
        displayName: '',
        cellTemplate: 'checkboxTemplate',
        enableColumnResizing: false,
        width: '60'
      }, {
        field: 'item',
        displayName: this.$rootScope.bundle.wip.attachments.name,
        cellTemplate: 'linkTemplate'
      }, {
        field: 'fileLocation',
        displayName: this.$rootScope.bundle.wip.attachments.location
      }];
      this.tableData = [];
      this.searchTableData = [];
      EventService.send('wipFileBrowserItems:get');
      this.wipFileBrowserListenerId = EventService.listen("wipFileBrowserItems:done", function(event, itemObj) {
        $__2.parseWipFileBrowserContents(itemObj);
        $__2.isDataAvailable = $__2.tableData.length > 0;
      });
      $scope.$on('$destroy', function() {
        EventService.unlisten($__2.wipFileBrowserListenerId);
      });
    }
    return ($traceurRuntime.createClass)(WipFileBrowserController, {
      parseWipFileBrowserContents: function(wipFileBrowserContents) {
        var $__2 = this;
        this._.each(wipFileBrowserContents.getFolders(), function(folder, elementIndex) {
          $__2.tableData.push({
            item: {
              title: folder.title,
              type: 'Folder',
              urn: folder.urn
            },
            createdUserName: folder.createUserName,
            size: '',
            lastModifiedTime: folder.lastModifiedTime
          });
        });
        this._.each(wipFileBrowserContents.getVersionedFiles(), function(file, elementIndex) {
          $__2.tableData.push({
            item: {
              title: file.versionedFile.title,
              type: file.versionedFile.fileType,
              urn: file.lineage.urn,
              mimeType: file.versionedFile.mimeType
            },
            createdUserName: file.versionedFile.createUserName,
            size: file.versionedFile.fileSize,
            lastModifiedTime: file.versionedFile.lastModifiedTime
          });
        });
      },
      browseFolder: function(folderObj) {
        this.tableData = [];
        this.isDataAvailable = true;
        this.EventService.send('wipFileBrowserItems:get', folderObj);
        this.breadcrumbData.push(folderObj);
      },
      selectFile: function(fileObj) {
        if (fileObj.selected) {
          this.selectedFiles.add(fileObj);
        } else {
          this.selectedFiles.delete(this._.find($traceurRuntime.spread(this.selectedFiles), {urn: fileObj.urn}));
        }
      },
      isChecked: function(fileObj) {
        return this._.find($traceurRuntime.spread(this.selectedFiles), {urn: fileObj.urn});
      },
      search: function(query) {
        if (!query) {
          return;
        }
        this.isDataAvailable = true;
        this.searchTableData = [];
        this.searchView = true;
        var currentFolder = this.breadcrumbData[this.breadcrumbData.length - 1];
        var folderUrn = currentFolder ? currentFolder.urn : '';
        this.WipSearchService.query(query, folderUrn, this.searchCallback.bind(this));
      },
      searchCallback: function(err, data) {
        var $__2 = this;
        if (err) {
          this.cancelSearch();
          return;
        }
        var lineageUrns = [];
        var tempSearchTableData = data.queryResults.filter(function(item) {
          return item.stringFields && item.stringFields['adsk.wip.lineageUrn'];
        }).map(function(item) {
          lineageUrns.push(item.stringFields['adsk.wip.lineageUrn'].value);
          return {item: {
              title: item.title.replace(/[]/g, ''),
              urn: item.stringFields['adsk.wip.lineageUrn'].value,
              mimeType: item.stringFields['adsk.wip.mimeType'].value
            }};
        });
        if (tempSearchTableData.length === 0) {
          this.isDataAvailable = false;
          return;
        }
        var getFilesAndFolderInfoPromises = [];
        var filesParentsMap = new Map();
        for (var i = 0; i < 2 && lineageUrns.length > 0; i++) {
          getFilesAndFolderInfoPromises.push(this.populateRelationsMap(filesParentsMap, lineageUrns.splice(0, 50)).then(function(data) {
            return $__2.populateRelationsMap(filesParentsMap, data.parentFoldersUrn);
          }));
        }
        this.$q.all(getFilesAndFolderInfoPromises).then(function() {
          tempSearchTableData.forEach(function(row) {
            return row.fileLocation = $__2.getParentTitle(row.item.urn, filesParentsMap);
          });
          $__2.searchTableData = tempSearchTableData;
          $__2.isDataAvailable = $__2.searchTableData.length > 0;
        });
      },
      populateRelationsMap: function(map, urns) {
        var $__2 = this;
        return this.WipApiService.getFiles(urns).then(function(files) {
          files.data.versionedFiles.forEach(function(item) {
            map.set(item.lineage.urn, {
              urn: item.lineage.urn,
              parentUrn: item.lineage.parentFolderUrn,
              title: item.lineage.title
            });
          });
          files.data.folders.forEach(function(item) {
            map.set(item.urn, {
              urn: item.urn,
              parentUrn: item.parentFolderUrn,
              title: item.title
            });
          });
          var newParentsUrn = [];
          map.forEach(function(value, key, obj) {
            if (value.parentUrn && !obj.has(value.parentUrn)) {
              newParentsUrn.push(value.parentUrn);
            }
          });
          return $__2.$q.resolve({
            map: map,
            parentFoldersUrn: $__2._.uniq(newParentsUrn)
          });
        });
      },
      getParentTitle: function(itemUrn, relationMap) {
        var item = relationMap.get(itemUrn);
        if (item && item.urn) {
          var parent = relationMap.get(item.parentUrn);
          if (parent && parent.title) {
            return parent.title;
          }
        }
        return this.$rootScope.bundle.breadcrumb.home;
      },
      cancelSearch: function() {
        this.searchView = false;
        this.searchQuery = '';
        this.searchTableData = [];
      },
      isLoading: function() {
        return (this.searchView && this.searchTableData.length === 0) || (!this.searchView && this.tableData.length === 0);
      }
    }, {});
  }();
  var $__default = WipFileBrowserController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/wipFileBrowser.controller.js
;

System.registerModule("com/autodesk/wipFileBrowser.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileBrowser.directive.js";
  function WipFileBrowser($timeout) {
    return {
      restrict: 'E',
      replace: true,
      controller: 'WipFileBrowserController',
      controllerAs: 'wipFileBrowserCtrl',
      templateUrl: 'wipFileBrowser.html',
      bindToController: true,
      scope: {selectedFiles: '='},
      link: function(scope, element, attrs) {
        $timeout(function() {
          var containerHeight = document.querySelector('md-dialog-content').offsetHeight;
          var breadcrumbHeight = element[0].querySelector('.wip-breadcrumb').offsetHeight;
          var toolbarHeight = element[0].querySelector('.filebrowser-toolbar').offsetHeight;
          angular.element(document.querySelector('.filebrowser-container')).attr('style', 'height:' + (containerHeight - breadcrumbHeight - toolbarHeight) + 'px');
        }, 0);
      }
    };
  }
  WipFileBrowser.$inject = ['$timeout'];
  var $__default = WipFileBrowser;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/wipFileBrowser.directive.js
;

System.registerModule("com/autodesk/wipFileBrowser.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileBrowser.js";
  var WipFileBrowserController = System.get("com/autodesk/wipFileBrowser.controller.js").default;
  var WipFileBrowserDirective = System.get("com/autodesk/wipFileBrowser.directive.js").default;
  var BreadcrumbDirective = System.get("com/autodesk/breadcrumb/breadcrumb.directive.js").default;
  var FileSizeFilter = System.get("com/autodesk/fileSizeFilter.js").default;
  var WipFileBrowserModel = System.get("com/autodesk/wipFileBrowser.model.js").default;
  var WipSearchService = System.get("com/autodesk/wipSearch.service.js").default;
  angular.module(__moduleName, ['com/autodesk/wipFileBrowser.model.js', 'com/autodesk/wipSearch.service.js']).controller('WipFileBrowserController', WipFileBrowserController).directive('wipFileBrowser', WipFileBrowserDirective).directive('breadcrumb', BreadcrumbDirective).filter('fileSizeFilter', FileSizeFilter).constant('EnvironmentTypes', {
    STAGING: 'wipqa',
    PROD: 'wipprod'
  }).run(['WipFileBrowserModel', function() {}]);
  return {};
});
//# sourceURL=com/autodesk/wipFileBrowser.js
;

System.registerModule("com/autodesk/wipFileBrowser.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipFileBrowser.model.js";
  var GROUPFOLDER = 'groupfolder';
  var WipFileBrowserModel = function() {
    function WipFileBrowserModel(json) {
      this.json = json;
    }
    return ($traceurRuntime.createClass)(WipFileBrowserModel, {
      fetch: function(folderInfoObj) {
        var $__2 = this;
        return this.RESTWrapperService.get(this.App.hubs.link).then(function(hubs) {
          if (folderInfoObj) {
            return folderInfoObj.urn;
          }
          return (hubs.items && hubs.items.length) ? hubs.items[0].rootFolders[0] : '';
        }).then(function(folderUrn) {
          return $__2.WipApiService.getWipFolder(folderUrn);
        }).then(function(payload) {
          return new WipFileBrowserModel(payload);
        }, function(error) {});
      },
      getFolders: function() {
        return this._.filter(this.json.data.folders, function(folder) {
          return !(folder.properties.folderType) || folder.properties.folderType.value === GROUPFOLDER;
        });
      },
      getVersionedFiles: function() {
        return this.json.data.versionedFiles;
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('WipFileBrowserModel', ['$http', 'EventService', 'RESTWrapperService', 'App', 'WipApiService', '_', function($http, EventService, RESTWrapperService, App, WipApiService, _) {
    WipFileBrowserModel.prototype.$http = $http;
    WipFileBrowserModel.prototype.RESTWrapperService = RESTWrapperService;
    WipFileBrowserModel.prototype.App = new App();
    WipFileBrowserModel.prototype.WipApiService = WipApiService;
    WipFileBrowserModel.prototype._ = _;
    EventService.listen('wipFileBrowserItems:get', function(event, params) {
      var wipFileBrowser = new WipFileBrowserModel();
      wipFileBrowser.fetch(params).then(function(obj) {
        EventService.send('wipFileBrowserItems:done', obj);
      });
    });
    return WipFileBrowserModel;
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/wipFileBrowser.model.js
;

System.registerModule("com/autodesk/wipSearch.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/wipSearch.service.js";
  var OAUTH1TOKENPATH = 'api/rest/v1/token?oauth_version=1';
  var SEARCH_ENV_PATH = 'api/v3/configurations/SEARCH_SERVICE_ENV';
  var STAGING = 'stg';
  var WipSearchService = function() {
    function WipSearchService(RESTWrapperService, App, EnvironmentTypes) {
      var $__2 = this;
      var app = new App();
      RESTWrapperService.get(OAUTH1TOKENPATH).then(function(token) {
        $__2.token = token.access_token;
      });
      RESTWrapperService.get(app.hubs.link).then(function(hubs) {
        $__2.rootFolderId = (hubs.items && hubs.items.length) ? hubs.items[0].rootFolders[0].split(':').pop() : '';
      });
      RESTWrapperService.get(SEARCH_ENV_PATH).then(function(searchEnv) {
        $__2.searchSDK = new window.Autodesk.Search.SearchQueryAPI(searchEnv.value);
        $__2.folderScope = searchEnv.value === STAGING ? EnvironmentTypes.STAGING : EnvironmentTypes.PROD;
      });
    }
    return ($traceurRuntime.createClass)(WipSearchService, {query: function(query, folderUrn, callback) {
        var folderId = folderUrn ? folderUrn.split(':').pop() : this.rootFolderId;
        var PARAMS = {
          filters: (this.folderScope + "FolderScope~" + folderId),
          language: '',
          page: 1,
          pid: 'adsk.fusionlifecycle.a360items',
          profileName: 'plm360',
          query: query,
          sort: 'relevance'
        };
        var SESSION_INFO = {
          clientFeatureId: 'a360.itemSearch',
          clientId: 'adsk.plm360',
          sessionId: 'plm360',
          token: this.token || ''
        };
        this.searchSDK.query(PARAMS, SESSION_INFO, callback);
      }}, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('WipSearchService', ['RESTWrapperService', 'App', 'EnvironmentTypes', function(RESTWrapperService, App, EnvironmentTypes) {
    return new WipSearchService(RESTWrapperService, App, EnvironmentTypes);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/wipSearch.service.js
;

System.registerModule("com/autodesk/breadcrumb/breadcrumb.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/breadcrumb/breadcrumb.directive.js";
  function Breadcrumb() {
    return {
      restrict: 'E',
      templateUrl: 'breadcrumb/breadcrumb.html',
      scope: {
        breadcrumbs: '=data',
        browseFolder: '&',
        cancelSearch: '&'
      },
      controller: ['$scope', function($scope) {
        $scope.updateBreadcrumb = function(folderObj) {
          $scope.cancelSearch();
          $scope.browseFolder(folderObj);
          if (folderObj) {
            var objIndex = $scope.breadcrumbs.indexOf(folderObj.folderObj);
            $scope.breadcrumbs.splice(objIndex + 1, $scope.breadcrumbs.length - (objIndex + 1));
          } else {
            $scope.breadcrumbs = [];
          }
        };
      }]
    };
  }
  Breadcrumb.$inject = [];
  var $__default = Breadcrumb;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/breadcrumb/breadcrumb.directive.js
;

System.get("com/autodesk/wipFileBrowser.js");angular.module("com/autodesk/wipFileBrowser.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('wipFileBrowser.html',
    "<div><breadcrumb data=\"wipFileBrowserCtrl.breadcrumbData\" browse-folder=\"wipFileBrowserCtrl.browseFolder(folderObj)\" cancel-search=\"wipFileBrowserCtrl.cancelSearch()\"></breadcrumb><div layout=\"row\" layout-align=\"space-between center\"><div class=\"filebrowser-toolbar\"><span ng-if=\"wipFileBrowserCtrl.selectedFiles.size > 0\">{{wipFileBrowserCtrl.selectedFiles.size}} {{wipFileBrowserCtrl.selectedFiles.size > 1 ? $root.bundle.text.selectedItems : $root.bundle.text.selectedOneItem}}</span> <a ng-if=\"wipFileBrowserCtrl.selectedFiles.size > 0\" href=\"javascript:;\" ng-click=\"wipFileBrowserCtrl.selectedFiles.clear()\">- {{$root.bundle.text.clearSelectedItems}}</a></div><div layout layout-align=\"center\" layout-padding flex=\"{{wipFileBrowserCtrl.selectedFiles.size > 0 ? 75 : 100}}\"><div ng-class=\"{highlight: wipFileBrowserCtrl.flag}\" class=\"search-box\" layout flex=\"100\"><form ng-submit=\"wipFileBrowserCtrl.search(wipFileBrowserCtrl.searchQuery);\"><input ng-blur=\"wipFileBrowserCtrl.flag = false\" ng-focus=\"wipFileBrowserCtrl.flag = true\" class=\"search-text\" type=\"search\" placeholder=\"{{$root.bundle.wip.attachments.search}}\" ng-model=\"wipFileBrowserCtrl.searchQuery\"> <a href=\"javascript:;\" class=\"search-button\" ng-click=\"wipFileBrowserCtrl.search(wipFileBrowserCtrl.searchQuery);\"><span class=\"zmdi zmdi-search\" title=\"{{$root.bundle.text.search}}\"></span></a> <a href=\"javascript:;\" class=\"close-button\" ng-click=\"wipFileBrowserCtrl.cancelSearch()\"><span class=\"zmdi zmdi-close-circle\"></span></a></form></div></div></div><div class=\"filebrowser-container\"><table-data ng-hide=\"wipFileBrowserCtrl.searchView\" columns=\"wipFileBrowserCtrl.tableColumns\" rows=\"wipFileBrowserCtrl.tableData\" resizable-columns resize-rows client-sorting></table-data><table-data ng-show=\"wipFileBrowserCtrl.searchView\" columns=\"wipFileBrowserCtrl.searchTableColumns\" rows=\"wipFileBrowserCtrl.searchTableData\" resizable-columns resize-rows client-sorting></table-data><div ng-show=\"wipFileBrowserCtrl.isLoading()\" class=\"filebrowser-preloader\" ng-switch=\"wipFileBrowserCtrl.isDataAvailable\"><div ng-switch-when=\"false\">{{$root.bundle.text.emptyFolder}}</div><div ng-switch-default><div class=\"wip-browser-spinner\"><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div></div></div></div></div><script type=\"text/ng-template\" id=\"checkboxTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "\t\t\t<input type=\"checkbox\"\r" +
    "\n" +
    "\t\t\t\tng-value=\"COL_FIELD.urn\"\r" +
    "\n" +
    "\t\t\t\tng-model=\"COL_FIELD.selected\"\r" +
    "\n" +
    "\t\t\t\tng-checked=\"grid.appScope.wipFileBrowserCtrl.isChecked(COL_FIELD)\"\r" +
    "\n" +
    "\t\t\t\tng-disabled=\"COL_FIELD.type === 'Folder'\"\r" +
    "\n" +
    "\t\t\t\tng-click=\"grid.appScope.wipFileBrowserCtrl.selectFile(COL_FIELD)\">\r" +
    "\n" +
    "\t\t</div></script><script type=\"text/ng-template\" id=\"linkTemplate\"><div class=\"ui-grid-cell-contents\" ng-switch=\"COL_FIELD.type\">\r" +
    "\n" +
    "\t\t\t<wip-file-type-icon\r" +
    "\n" +
    "\t\t\t\tng-if=\"COL_FIELD.type === 'Folder'\"\r" +
    "\n" +
    "\t\t\t\tmime-type=\"application/folder\"\r" +
    "\n" +
    "\t\t\t\tsize=\"16\">\r" +
    "\n" +
    "\t\t\t</wip-file-type-icon>\r" +
    "\n" +
    "\t\t\t<wip-file-type-icon\r" +
    "\n" +
    "\t\t\t\tng-if=\"row.entity.item.mimeType\"\r" +
    "\n" +
    "\t\t\t\tmime-type=\"{{row.entity.item.mimeType}}\"\r" +
    "\n" +
    "\t\t\t\tsize=\"16\">\r" +
    "\n" +
    "\t\t\t</wip-file-type-icon>\r" +
    "\n" +
    "\t\t\t<a href=\"\"\r" +
    "\n" +
    "\t\t\t\tng-switch-when=\"Folder\"\r" +
    "\n" +
    "\t\t\t\tng-click=\"grid.appScope.wipFileBrowserCtrl.browseFolder(COL_FIELD)\"\r" +
    "\n" +
    "\t\t\t\ttitle=\"{{COL_FIELD.title}}\">\r" +
    "\n" +
    "\t\t\t\t{{COL_FIELD.title}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t\t<span ng-switch-default>{{COL_FIELD.title}}</span>\r" +
    "\n" +
    "\t\t</div></script><script type=\"text/ng-template\" id=\"dateTemplate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "\t\t\t<span>{{COL_FIELD | date: grid.appScope.wipFileBrowserCtrl.dateFormat.dateAndHour}}</span>\r" +
    "\n" +
    "\t\t</div></script></div>"
  );


  $templateCache.put('breadcrumb/breadcrumb.html',
    "<div class=\"wip-breadcrumb\"><div><a href=\"javascript:;\" ng-click=\"updateBreadcrumb()\">{{$root.bundle.breadcrumb.home}}</a> <span ng-repeat=\"breadcrumb in breadcrumbs\"><span class=\"md-keyboard-arrow-right\"></span> <span ng-switch on=\"breadcrumbs.length === breadcrumbs.indexOf(breadcrumb)+1\"><span ng-switch-when=\"true\" class=\"folder-selected\">{{breadcrumb.title}}</span> <a ng-switch-default href=\"javascript:;\" ng-click=\"updateBreadcrumb({folderObj: breadcrumb})\">{{breadcrumb.title}}</a></span></span></div><md-divider></md-divider></div>"
  );
}]);