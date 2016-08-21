System.registerModule("com/autodesk/models/bomGraph/bomNode.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomNode.model.js";
  var BomNode = function() {
    function BomNode(args) {
      this.item = (angular.isUndefined(args.item)) ? null : args.item;
      this.itemId = (angular.isUndefined(args.itemId)) ? null : args.itemId;
      this.outEdges = (angular.isUndefined(args.outEdges)) ? [] : args.outEdges;
      this.hasChildren = (angular.isUndefined(args.hasChildren)) ? false : args.hasChildren;
      this.nestedBomLink = (angular.isUndefined(args.nestedBomLink)) ? null : args.nestedBomLink;
      this.bomRootLink = (angular.isUndefined(args.bomRootLink)) ? null : args.bomRootLink;
      this.nodeProperties = null;
      if (angular.isUndefined(args.nodeProperties)) {
        this.nodeProperties = {fields: new Map()};
      } else {
        this.nodeProperties = args.nodeProperties;
      }
      if (angular.isUndefined(this.nodeProperties.fields)) {
        this.nodeProperties.fields = new Map();
      }
    }
    return ($traceurRuntime.createClass)(BomNode, {
      addField: function(field) {
        this.nodeProperties.fields.set(field.id, field);
      },
      getField: function(id) {
        return this.nodeProperties.fields.get(id);
      },
      getFields: function() {
        return this.nodeProperties.fields;
      },
      addOutEdge: function(bomId) {
        this.outEdges.push(bomId);
      },
      getOutDegree: function() {
        return this.outEdges.length;
      },
      getDmsId: function() {
        return this.item.urn.split('.').pop();
      },
      getBulkBomLink: function() {
        return this.bomRootLink;
      },
      getItemUrn: function() {
        return this.item.urn;
      },
      getItem: function() {
        return this.item;
      },
      getItemId: function() {
        return this.itemId;
      },
      getResourceId: function() {
        var urnTokens = this.item.urn.split('.');
        return (urnTokens[4] + "@" + urnTokens[5]);
      },
      getWorkspaceId: function() {
        return this.item.urn.split('.')[4];
      }
    }, {fromBulkNode: function(bulkBomNode) {
        var nodeArgs = {};
        nodeArgs.itemId = bulkBomNode.item.urn;
        nodeArgs.item = bulkBomNode.item;
        nodeArgs.nestedBomLink = bulkBomNode.bomItems;
        nodeArgs.bomRootLink = bulkBomNode.bomRoot;
        nodeArgs.nodeProperties = {};
        nodeArgs.outEdges = [];
        nodeArgs.hasChildren = false;
        return new BomNode(nodeArgs);
      }});
  }();
  var $__default = BomNode;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomGraph/bomNode.model.js
