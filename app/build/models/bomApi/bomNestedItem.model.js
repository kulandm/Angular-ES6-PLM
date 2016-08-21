System.registerModule("com/autodesk/models/bomApi/bomNestedItem.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomApi/bomNestedItem.model.js";
  var BomNestedItem = function() {
    function BomNestedItem(json) {
      if (json) {
        this.__self__ = json.__self__;
        this.urn = json.urn;
        this.description = json.description;
        this.item = json.item || {};
        this.depth = json.depth;
        this.itemNumber = json.itemNumber;
        this.quantity = json.quantity;
        this.isUsingDefaultQuote = json.isUsingDefaultQuote;
        this.isPinned = json.isPinned;
        this.children = json.children || [];
        this.fields = json.fields || [];
      }
      this.json = json;
    }
    return ($traceurRuntime.createClass)(BomNestedItem, {
      getSelfLink: function() {
        return this.__self__.replace(/^\//, '');
      },
      getItemId: function() {
        var selfLinkTokens = this.item.link.split('/');
        return selfLinkTokens[4] + '@' + selfLinkTokens[6];
      },
      getWorkspaceId: function() {
        return this.item.link.split('/')[4];
      },
      getDmsId: function() {
        return this.item.link.split('/')[6];
      },
      getItemUrn: function() {
        return this.item.urn;
      },
      getItem: function() {
        return this.item;
      },
      getBomId: function() {
        return this.__self__.split('/').pop();
      },
      getItemNumber: function() {
        return this.itemNumber;
      },
      getItemTitle: function() {
        return this.item.title;
      },
      getUrn: function() {
        return this.urn;
      },
      getChildren: function() {
        return this.children;
      },
      hasChildren: function() {
        return this.children.length > 0;
      },
      getFields: function() {
        return this.fields;
      },
      getFieldLink: function(fieldId) {
        return this.item.link + '/bom-items/' + this.getBomId() + '/fields/' + fieldId;
      }
    }, {
      fetch: function(link, params) {
        var headers = {skipCache: true};
        return this.RESTWrapperService.get(link, null, params, headers).then(function(payload) {
          return new BomNestedItem(payload);
        });
      },
      add: function(link, bomNestedItem) {
        var headers = {'Content-Type': 'application/json'};
        return this.RESTWrapperService.post(bomNestedItem, link, null, {}, headers, null);
      },
      edit: function(bomNestedItem) {
        var headers = {'Content-Type': 'application/json'};
        return this.RESTWrapperService.patch(bomNestedItem, bomNestedItem.getSelfLink(), null, {}, headers, null);
      },
      delete: function(bomNestedItem) {
        var headers = {'Content-Type': 'application/json'};
        return this.RESTWrapperService.delete(bomNestedItem.getSelfLink(), null, {}, headers, null);
      }
    });
  }();
  var BomNestedItemFactory = function(RESTWrapperService) {
    BomNestedItem.RESTWrapperService = RESTWrapperService;
    return BomNestedItem;
  };
  var $__default = angular.module(__moduleName, []).factory('BomNestedItem', ['RESTWrapperService', BomNestedItemFactory]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomApi/bomNestedItem.model.js
