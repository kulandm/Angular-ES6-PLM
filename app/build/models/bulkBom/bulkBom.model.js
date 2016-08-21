System.registerModule("com/autodesk/models/bulkBom/bulkBom.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bulkBom/bulkBom.model.js";
  var BulkBom = function() {
    function BulkBom(json) {
      if (json) {
        this.configuration = (typeof json.config === 'undefined') ? null : json.config;
        this.nodes = (typeof json.nodes === 'undefined') ? [] : json.nodes;
        this.edges = (typeof json.edges === 'undefined') ? [] : json.edges;
        this.rootNodeId = (typeof json.root === 'undefined') ? null : json.root;
      }
      this.json = json;
    }
    return ($traceurRuntime.createClass)(BulkBom, {
      getConfiguration: function() {
        return this.configuration;
      },
      getConfigDate: function() {
        return this.configuration.bomViewDate;
      },
      getConfigBias: function() {
        return this.configuration.bias;
      },
      getNodes: function() {
        return this.nodes;
      },
      getEdges: function() {
        return this.edges;
      },
      getRootNodeId: function() {
        return this.rootNodeId;
      },
      getDmsId: function() {
        return this.rootNodeId.split('.').pop();
      }
    }, {fetch: function(link) {
        var params = arguments[1] !== (void 0) ? arguments[1] : {};
        var requestHeaders = {
          Accept: 'application/vnd.autodesk.plm.bom.bulk+json',
          skipCache: true
        };
        return this.RESTWrapperService.get(link, null, params, null, requestHeaders).then(function(payload) {
          return new BulkBom(payload);
        });
      }});
  }();
  var BulkBomFactory = function(BomMessageService, EventService, UrlParser, RESTWrapperService) {
    BulkBom.BomMessageService = BomMessageService;
    BulkBom.EventService = EventService;
    BulkBom.UrlParser = UrlParser;
    BulkBom.RESTWrapperService = RESTWrapperService;
    return BulkBom;
  };
  var $__default = angular.module(__moduleName, []).factory('BulkBom', ['BomMessageService', 'EventService', 'UrlParser', 'RESTWrapperService', BulkBomFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bulkBom/bulkBom.model.js
