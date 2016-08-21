System.registerModule("com/autodesk/search.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/search.controller.js";
  var MAX_ITEM_COUNT = 100;
  var REVISION = {
    latest: 1,
    all: 2,
    working: 3
  };
  var OPERATION_STATE = {
    recordsFound: 1,
    noRecordsFound: 2,
    invalidQuery: 3,
    loading: 4
  };
  var MILLISECONDS_TO_SECOND = 1000;
  var SearchPlmController = function() {
    function SearchPlmController($scope, $rootScope, _, $location, $state, SearchPlmService, NotificationService, NotificationTypes) {
      var $__2 = this;
      this.$state = $state;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this._ = _;
      this.$location = $location;
      var getTime = function() {
        return performance && performance.now ? performance.now() : new Date().getTime();
      };
      this.getSearchQuery = function() {
        return $__2.$location.search().query;
      };
      this.getSearchFilterEnabled = function() {
        return $__2.$location.search().enableSearchFilterPanel;
      };
      this.getRevisionFilter = function() {
        return $__2.$location.search().revision;
      };
      var revisionOptions = {};
      revisionOptions[REVISION.working] = $rootScope.bundle.search.page.label.filter.working;
      revisionOptions[REVISION.latest] = $rootScope.bundle.search.page.label.filter.latest;
      revisionOptions[REVISION.all] = $rootScope.bundle.search.page.label.filter.all;
      this.currentRevisionLabel = revisionOptions[REVISION.latest];
      this.getRevisionOptions = function() {
        return revisionOptions;
      };
      this.performSearch = function() {
        var startTime = getTime();
        var query = $__2.getSearchQuery();
        var revisionFilter = $__2.getRevisionFilter();
        $__2.$scope.searchPlm.enableSearchFilterPanel = $__2.getSearchFilterEnabled();
        if (angular.isDefined(revisionFilter) && revisionFilter !== null) {
          $__2.currentRevisionLabel = revisionOptions[revisionFilter];
        }
        if (angular.isDefined(query) && query !== null && query.length > 0) {
          $__2.$scope.searchPlm.query = query;
          $__2.$scope.searchPlm.operationState = OPERATION_STATE.loading;
          SearchPlmService.search(query, {
            revision: revisionFilter || REVISION.latest,
            limit: MAX_ITEM_COUNT
          }).then(function(result) {
            $__2.$scope.searchResults = result;
            $__2.$scope.searchPlm.lastQueryDuration = ((getTime() - startTime) / MILLISECONDS_TO_SECOND).toFixed(2);
            $__2.$scope.searchPlm.operationState = result.length > 0 ? OPERATION_STATE.recordsFound : OPERATION_STATE.noRecordsFound;
          });
        }
      };
      this.$scope.OPERATION_STATE = OPERATION_STATE;
      this.$scope.searchPlm = {};
      this.$scope.searchPlm.lastQueryDuration = 0;
      this.$scope.$on('$locationChangeStart', function(event) {
        return $__2.performSearch();
      });
      this.performSearch();
    }
    return ($traceurRuntime.createClass)(SearchPlmController, {
      constructItemUrl: function(item, isFullView) {
        var view = isFullView ? 'full' : 'split';
        return this.$state.href('details', {
          itemId: item.getUrnLink(),
          workspaceId: item.getWorkspaceId(),
          tab: 'details',
          view: view,
          mode: 'view'
        });
      },
      setCurrentRevisionOption: function(optionId) {
        this.$location.search('revision', optionId);
      }
    }, {});
  }();
  var $__default = SearchPlmController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/search.controller.js
;

System.registerModule("com/autodesk/search.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/search.directive.js";
  var SEARCH_PAGE = '/search';
  var TEMPLATE_URL = 'searchPlm.html';
  var STATES = {
    expanded: 'expanded',
    notExpanded: 'not-expanded'
  };
  var location;
  var timeout;
  var SearchPlm = function() {
    function SearchPlm($location, $timeout) {
      this.restrict = 'E';
      this.replace = true;
      this.templateUrl = TEMPLATE_URL;
      this.scope = {query: '@'};
      timeout = $timeout;
      location = $location;
    }
    return ($traceurRuntime.createClass)(SearchPlm, {link: function(scope, element) {
        var setSearchTextFocus = function() {
          return timeout(function() {
            return element.find('input').focus();
          }, 100);
        };
        var isSearchResultPage = function() {
          return location.path().indexOf(SEARCH_PAGE) >= 0;
        };
        var getDefaultState = function() {
          return isSearchResultPage() ? STATES.expanded : STATES.notExpanded;
        };
        var setNotExpandedState = function() {
          scope.classStatus = STATES.notExpanded;
        };
        var setExpandedState = function() {
          scope.classStatus = STATES.expanded;
          setSearchTextFocus();
        };
        scope.classStatus = getDefaultState();
        scope.onClickMagnify = function() {
          if (scope.classStatus === STATES.notExpanded) {
            setExpandedState();
          } else if (scope.query) {
            scope.performSearch();
          } else {
            setNotExpandedState();
          }
        };
        scope.onBlur = function(event) {
          if (element[0].contains(event.relatedTarget)) {
            return;
          }
          setNotExpandedState();
        };
        scope.performSearch = function() {
          if (angular.isDefined(scope.query)) {
            location.path('/search').search({query: scope.query});
          }
        };
        scope.$on('$locationChangeStart', function(event, next) {
          if (angular.isDefined(next) && next.indexOf(SEARCH_PAGE) === -1) {
            setNotExpandedState();
          }
        });
      }}, {directiveFactory: function($location, $timeout) {
        SearchPlm.instance = new SearchPlm($location, $timeout);
        return SearchPlm.instance;
      }});
  }();
  SearchPlm.directiveFactory.$inject = ['$location', '$timeout'];
  var $__default = SearchPlm;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/search.directive.js
;

System.registerModule("com/autodesk/search.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/search.js";
  System.get("com/autodesk/UnderscoreService.js");
  System.get("com/autodesk/EventService.js");
  System.get("com/autodesk/RESTWrapperService.js");
  var SearchPlm = System.get("com/autodesk/search.directive.js").default;
  var SearchPlmController = System.get("com/autodesk/search.controller.js").default;
  var SearchPlmService = System.get("com/autodesk/search.service.js").default;
  var SearchPlmResult = System.get("com/autodesk/searchResult.model.js").default;
  angular.module(__moduleName, ['com/autodesk/EventService.js', 'com/autodesk/RESTWrapperService.js']).directive('searchPlm', ['$location', '$timeout', SearchPlm.directiveFactory]).controller('SearchPlmController', ['$scope', '$rootScope', '_', '$location', '$state', 'SearchPlmService', 'NotificationService', 'NotificationTypes', SearchPlmController]).value('SearchPlmResult', SearchPlmResult).factory('SearchPlmService', ['RESTWrapperService', 'SearchPlmResult', 'SEARCH_URL', 'PARAMETERS', 'TAGS', function(RESTWrapperService, SearchPlmResult, SEARCH_URL, PARAMETERS, TAGS) {
    return new SearchPlmService(RESTWrapperService, SearchPlmResult, SEARCH_URL, PARAMETERS, TAGS);
  }]).constant('SEARCH_URL', 'api/v3/search-results?query=<query>').constant('PARAMETERS', {
    workspace: '&workspace=<workspace>',
    revision: '&revision=<revision>',
    offset: '&offset=<offset>',
    limit: '&limit=<limit>'
  }).constant('TAGS', {
    query: '<query>',
    workspace: '<workspace>',
    revision: '<revision>',
    offset: '<offset>',
    limit: '<limit>'
  });
  return {};
});
//# sourceURL=com/autodesk/search.js
;

System.registerModule("com/autodesk/search.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/search.service.js";
  var SearchPlmService = function() {
    function SearchPlmService(RESTWrapperService, SearchPlmResult, SEARCH_URL, PARAMETERS, TAGS) {
      this.RESTWrapperService = RESTWrapperService;
      this.SearchPlmResultConstructor = SearchPlmResult;
      this.SEARCH_URL = SEARCH_URL;
      this.PARAMETERS = PARAMETERS;
      this.TAGS = TAGS;
    }
    return ($traceurRuntime.createClass)(SearchPlmService, {
      buildUrl: function(query, filters) {
        var url = this.SEARCH_URL;
        url = url.replace(this.TAGS.query, query);
        for (var filter in filters) {
          if (filters.hasOwnProperty(filter) && filters[filter] && this.PARAMETERS[filter] && this.TAGS[filter]) {
            url += this.PARAMETERS[filter].replace(this.TAGS[filter], filters[filter]);
          }
        }
        return url;
      },
      search: function(query, filters) {
        var $__2 = this;
        var url = this.buildUrl(query, filters);
        return this.RESTWrapperService.get(url, null, null, {skipCache: true}).then(function(result) {
          var processed = [];
          if (result.totalCount > 0) {
            result.items.forEach(function(item) {
              return processed.push(new $__2.SearchPlmResultConstructor(item));
            });
          }
          return processed;
        }, function(error) {
          return console.log(error);
        });
      }
    }, {});
  }();
  var $__default = SearchPlmService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/search.service.js
;

System.registerModule("com/autodesk/searchResult.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/searchResult.model.js";
  var SearchPlmResult = function() {
    function SearchPlmResult(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.urn = json.urn;
        this.descriptor = json.descriptor || null;
        this.category = json.category || null;
        this.categoryThumbnail = json.categoryThumbnail || null;
        this.categoryThumbnailSmall = json.categoryThumbnailSmall || null;
        this.creator = json.creator || null;
        this.owner = json.owner || null;
        this.workspaceLongName = json.workspaceLongName || null;
        this.workspaceShortName = json.workspaceShortName || null;
      }
    }
    return ($traceurRuntime.createClass)(SearchPlmResult, {
      getSelfLink: function() {
        return this.__self__.replace(/^\//, '');
      },
      getDescriptor: function() {
        return this.descriptor;
      },
      getCategory: function() {
        return this.category;
      },
      getCategoryThumbnail: function() {
        return this.categoryThumbnail;
      },
      getCategoryThumbnailSmall: function() {
        return this.categoryThumbnailSmall;
      },
      getUrn: function() {
        return this.urn;
      },
      getCreator: function() {
        return this.creator;
      },
      getOwner: function() {
        return this.owner;
      },
      getWorkspaceName: function() {
        return this.workspaceLongName;
      },
      getCategoryName: function() {
        return this.category;
      },
      getWorkspaceShortName: function() {
        return this.workspaceShortName;
      },
      getUrnLink: function() {
        return this.getUrn().replace(/\:/g, '`').replace(/\./g, ',');
      },
      getWorkspaceId: function() {
        var components = this.getUrn().split('.');
        return components[components.length - 2];
      }
    }, {});
  }();
  var $__default = SearchPlmResult;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/searchResult.model.js
;

System.get("com/autodesk/search.js");angular.module("com/autodesk/search.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('search.html',
    "<div class=\"ui segments searchPlmPage\"><div class=\"ui segment searchCount\" ng-show=\"searchPlm.lastQueryDuration > 0\"><div class=\"ui grid\"><div class=\"sixteen column center aligned\">{{$root.bundle.search.page.label.result.count.found}} <b>{{searchResults.length}}</b> {{$root.bundle.search.page.label.result.count.result}} ({{searchPlm.lastQueryDuration}} {{$root.bundle.search.page.label.result.count.seconds}})</div></div></div><div class=\"searchContainer\"><div class=\"ui segment searchContent\"><div class=\"ui vertical stripe quote segment\"><div class=\"ui grid\"><div class=\"row\"><div class=\"sixteen wide column\"><div class=\"ui segment emptyResult\" ng-if=\"searchPlm.operationState === OPERATION_STATE.noRecordsFound\"><p>{{$root.bundle.search.page.texts.result.empty.textOne}} <b>{{searchPlm.query}}</b> {{$root.bundle.search.page.texts.result.empty.textTwo}}</p><div>{{$root.bundle.search.page.texts.result.empty.suggestions}}<ul><li>{{$root.bundle.search.page.texts.result.empty.suggestionOne}}</li><li>{{$root.bundle.search.page.texts.result.empty.suggestionTwo}}</li></ul></div></div><div class=\"ui segments searchRecords\" ng-if=\"searchPlm.operationState === OPERATION_STATE.recordsFound\"><div class=\"ui segment header searchRecord\" ng-repeat=\"item in searchResults\"><img ng-src=\"{{item.getCategoryThumbnail()}}\"><div class=\"content\"><h4 title=\"{{item.getDescriptor()}}\"><a class=\"truncate\" href=\"{{searchPlmCtrl.constructItemUrl(item, true)}}\" ng-bind-html=\"item.getDescriptor() | escapeHtmlEntities | HighlightText: searchPlm.query\"></a></h4><div class=\"sub header\"><span>{{$root.bundle.search.page.texts.result.label.categories}}</span> <span class=\"info-spacing\" ng-bind-html=\"item.getCategoryName() | escapeHtmlEntities | HighlightText: searchPlm.query\"></span> <span class=\"info-spacing\" ng-bind-html=\"item.getWorkspaceName() | escapeHtmlEntities | HighlightText: searchPlm.query\"></span></div></div></div></div></div></div></div></div></div><div ng-if=\"searchPlm.enableSearchFilterPanel\" class=\"searchFilter\"><h1>Search Filter Panel</h1><md-button id=\"search-filter-dropdown-button\" class=\"md-default-theme dropdown-widget-button\"><span>{{searchPlmCtrl.currentRevisionLabel}}</span> <span class=\"caret-flex down static-rotateCaretVertical\"></span></md-button><dropdown-widget id=\"search-filter-dropdown-widget\" anchor=\"#search-filter-dropdown-button\" h-pos=\"left\"><ul><li ng-repeat=\"(id,label) in searchPlmCtrl.getRevisionOptions()\"><a href=\"javascript:;\" ng-click=\"searchPlmCtrl.setCurrentRevisionOption(id)\" aria-label=\"{{label}}\"><span>{{label}}</span></a></li></ul></dropdown-widget></div></div></div>"
  );


  $templateCache.put('searchPlm.html',
    "<div class=\"searchPLM\" ng-class=\"{'expanded' : classStatus === 'expanded' }\"><input placeholder=\"{{$root.bundle.search.input.placeholder}}\" type=\"text\" id=\"searchTextBox\" ng-model=\"query\" ng-keyup=\"($event.keyCode === 13) ? performSearch() : null\" ng-blur=\"onBlur($event)\"><svg title=\"{{$root.bundle.search.button.search}}\" ng-click=\"onClickMagnify()\" class=\"search-icon\" viewbox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4.304 12.012a7.708 7.708 0 1 1 15.416 0 7.708 7.708 0 0 1-15.416 0zm-3.304 0c0 6.082 4.93 11.012 11.012 11.012a10.968 10.968 0 0 0 6.866-2.4l.614.614c-.138.718.09 1.458.606 1.975l7.14 7.142a2.204 2.204 0 0 0 3.118-3.117l-7.143-7.14a2.202 2.202 0 0 0-1.975-.606l-.615-.614a10.968 10.968 0 0 0 2.4-6.866C23.024 5.93 18.094 1 12.014 1 5.93 1 1 5.93 1 12.012z\" fill-rule=\"evenodd\"></svg></div>"
  );
}]);