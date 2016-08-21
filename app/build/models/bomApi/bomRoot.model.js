System.registerModule("com/autodesk/models/bomApi/bomRoot.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomApi/bomRoot.model.js";
  var BomRoot = function() {
    function BomRoot(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.item = json.item;
        this.occurancesCount = json.occurancesCount;
        this.configData = json.configData;
        this.fields = json.fields;
      }
      this.json = json;
    }
    return ($traceurRuntime.createClass)(BomRoot, {
      getSelfLink: function() {
        return this.__self__.replace(/^\//, '');
      },
      getItemId: function() {
        var tokens = this.item.urn.split('.');
        return (tokens[4] + "@" + tokens[5]);
      },
      getWorkspaceId: function() {
        return this.__self__.split('/')[4];
      },
      getDmsId: function() {
        return this.item.urn.split('.').pop();
      },
      getOccurancesCount: function() {
        return this.occurancesCount;
      },
      getFields: function() {
        return this.fields;
      },
      getConfigDate: function() {
        return this.configData.bomViewDate;
      },
      getConfigBias: function() {
        return this.configData.bias;
      },
      getItemUrn: function() {
        return this.item.urn;
      },
      getAttachmentData: function() {
        return {
          count: this.attachmentsData.count,
          workspaceId: this.getWorkspaceId(),
          itemId: this.getDmsId(),
          itemUrn: this.getItemUrn()
        };
      }
    }, {fetch: function(link, params) {
        return this.RESTWrapperService.get(link, null, params, {skipCache: true}).then(function(payload) {
          return new BomRoot(payload);
        });
      }});
  }();
  var BomRootFactory = function(RESTWrapperService) {
    BomRoot.RESTWrapperService = RESTWrapperService;
    return BomRoot;
  };
  var $__default = angular.module(__moduleName, []).factory('BomRoot', ['RESTWrapperService', BomRootFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomApi/bomRoot.model.js
