System.registerModule("com/autodesk/models/bomViewDefinition/viewDefinitions.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomViewDefinition/viewDefinitions.model.js";
  var ViewDefinitions = function() {
    function ViewDefinitions(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.count = json.count;
        this.bomViews = json.bomViews;
      }
      this.viewsMap = new Map();
      this.json = json;
    }
    return ($traceurRuntime.createClass)(ViewDefinitions, {
      getLink: function() {
        return this.__self__.link;
      },
      getUrn: function() {
        return this.__self__.urn;
      },
      getCount: function() {
        return this.count;
      },
      getViews: function() {
        var $__2 = this;
        var views = [];
        this.bomViews.forEach(function(view) {
          if ($__2.viewsMap.has(view.urn)) {
            views.push($__2.viewsMap.get(view.urn));
          }
        });
        return views;
      },
      getViewsMap: function() {
        return this.viewsMap;
      },
      getDefaultView: function() {
        var defaultView = null;
        this.getViewsMap().forEach(function(view, key) {
          if (view.isDefaultView()) {
            defaultView = view;
          }
        });
        return defaultView;
      },
      find: function(id) {
        var foundView = null;
        this.getViewsMap().forEach(function(view, key) {
          if (view.getId() === id) {
            foundView = view;
          }
        });
        return foundView;
      },
      loadViews: function() {
        var $__2 = this;
        var deferred = ViewDefinitions.$q.defer();
        var expectedViewsCount = this.bomViews.length;
        var checkCompleted = function() {
          if ($__2.viewsMap.size === expectedViewsCount) {
            deferred.resolve();
          }
        };
        this.bomViews.forEach(function(view) {
          var urn = ViewDefinitions.UrnParser.encode(view.urn);
          var responseMessage = ViewDefinitions.BomMessageService.getViewDefinitionReceivedMessage(urn);
          var viewDefListenerId = ViewDefinitions.EventService.listen(responseMessage, function(event, viewDef) {
            ViewDefinitions.EventService.unlisten(viewDefListenerId);
            $__2.viewsMap.set(viewDef.getUrn(), viewDef);
            checkCompleted();
          });
          ViewDefinitions.EventService.send(ViewDefinitions.BomMessageService.getViewDefinitionGetMessage(urn), view.link.replace(/^\//, ''));
        });
        return deferred.promise;
      },
      buildViewStorageKey: function(wsId) {
        return ("workspace:" + wsId + "_bomView");
      }
    }, {fetch: function(link, params) {
        var model = null;
        return ViewDefinitions.RESTWrapperService.get(link, null, params, {skipCache: true}).then(function(payload) {
          model = new ViewDefinitions(payload);
          return model.loadViews();
        }).then(function() {
          return model;
        });
      }});
  }();
  var ViewDefinitionsFactory = function($q, RESTWrapperService, EventService, UrnParser, BomMessageService) {
    ViewDefinitions.$q = $q;
    ViewDefinitions.RESTWrapperService = RESTWrapperService;
    ViewDefinitions.EventService = EventService;
    ViewDefinitions.UrnParser = UrnParser;
    ViewDefinitions.BomMessageService = BomMessageService;
    return ViewDefinitions;
  };
  var $__default = angular.module(__moduleName, []).factory('ViewDefinitions', ['$q', 'RESTWrapperService', 'EventService', 'UrnParser', 'BomMessageService', ViewDefinitionsFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomViewDefinition/viewDefinitions.model.js
