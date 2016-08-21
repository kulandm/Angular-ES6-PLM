System.registerModule("com/autodesk/models/bomGraph/bomGraphBuilder.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomGraphBuilder.service.js";
  var BomNode = System.get("com/autodesk/models/bomGraph/bomNode.model.js").default;
  var BomEdge = System.get("com/autodesk/models/bomGraph/bomEdge.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomGraphBuilder = function() {
    function BomGraphBuilder(BomField, BomFieldData) {
      this.BomField = BomField;
      this.BomFieldData = BomFieldData;
    }
    return ($traceurRuntime.createClass)(BomGraphBuilder, {
      buildRootNode: function(bomRoot, viewdef) {
        var rootNodeArgs = {};
        rootNodeArgs.itemId = bomRoot.getItemId();
        rootNodeArgs.item = bomRoot.item;
        rootNodeArgs.hasChildren = bomRoot.getOccurancesCount() > 1 ? true : false;
        var rootNode = new BomNode(rootNodeArgs);
        var valueSource = this.extractFieldValues(bomRoot.getFields());
        var fields = this.buildFieldsForViewDefFields(viewdef.getFields(), valueSource, bomRoot.getItemUrn());
        this.addFields(rootNode, fields);
        return rootNode;
      },
      buildEdgeForBomNestedItem: function(edgeNodeProperties, fieldValues, viewDef) {
        var edgeArgs = {};
        edgeArgs.link = edgeNodeProperties.__self__;
        edgeArgs.bomId = edgeNodeProperties.getBomId();
        edgeArgs.toNode = edgeNodeProperties.getItemId();
        edgeArgs.edgeProperties = {};
        edgeArgs.edgeProperties.itemNumber = edgeNodeProperties.getItemNumber();
        var edge = new BomEdge(edgeArgs);
        var fields = this.buildFieldsForViewDefFields(viewDef.getEdgeFields(), fieldValues, edgeNodeProperties.getItemUrn());
        this.addFields(edge, fields);
        return edge;
      },
      buildNodeForBomNestedItem: function(edgeNodeProperties, fieldValues, viewDef) {
        var nodeArgs = {};
        nodeArgs.itemId = edgeNodeProperties.getItemId();
        nodeArgs.item = edgeNodeProperties.getItem();
        nodeArgs.nodeProperties = {};
        nodeArgs.hasChildren = edgeNodeProperties.hasChildren();
        var node = new BomNode(nodeArgs);
        var fields = this.buildFieldsForViewDefFields(viewDef.getNodeFields(), fieldValues, edgeNodeProperties.getItemUrn());
        this.addFields(node, fields);
        return node;
      },
      addEdgeNodeToGraph: function(edgeNodeProperties, viewDef, bomGraph) {
        var fieldValuesMap = this.extractFieldValues(edgeNodeProperties.getFields());
        var edge = this.buildEdgeForBomNestedItem(edgeNodeProperties, fieldValuesMap, viewDef);
        var node = this.buildNodeForBomNestedItem(edgeNodeProperties, fieldValuesMap, viewDef);
        bomGraph.addEdge(edge);
        if (!bomGraph.hasNode(node.itemId)) {
          bomGraph.addNode(node);
        }
      },
      buildEdgeForBulkBom: function(bulkBomEdge, viewDef) {
        var newEdge = BomEdge.fromBulkEdge(bulkBomEdge);
        var bomFields = this.buildBomFields(viewDef.getEdgeFields(), bulkBomEdge.fields, bulkBomEdge.child);
        this.addFields(newEdge, bomFields);
        return newEdge;
      },
      addEdgesToGraph: function() {
        var edgeList = arguments[0] !== (void 0) ? arguments[0] : [];
        var viewDef = arguments[1];
        var bomGraph = arguments[2];
        var $__5 = this;
        edgeList.forEach(function(edge) {
          var newBomEdge = $__5.buildEdgeForBulkBom(edge, viewDef, bomGraph);
          $__5.addOutEdgeToParentNode(edge, bomGraph);
          bomGraph.addEdge(newBomEdge);
        });
      },
      buildNodeForBulkBom: function(bulkBomNode, viewDef, rootUrn) {
        var newNode = BomNode.fromBulkNode(bulkBomNode);
        var bomFields = [];
        if (newNode.getItemUrn() === rootUrn) {
          bomFields = this.buildBomFields(viewDef.getFields(), bulkBomNode.fields, newNode.getItemUrn());
        } else {
          bomFields = this.buildBomFields(viewDef.getNodeFields(), bulkBomNode.fields, newNode.getItemUrn());
        }
        this.addFields(newNode, bomFields);
        return newNode;
      },
      addNodesToGraph: function() {
        var nodeList = arguments[0] !== (void 0) ? arguments[0] : [];
        var rootId = arguments[1];
        var viewDef = arguments[2];
        var bomGraph = arguments[3];
        var $__5 = this;
        nodeList.forEach(function(node) {
          if (!bomGraph.hasNode(node.item.urn)) {
            var newBomNode = $__5.buildNodeForBulkBom(node, viewDef, rootId);
            bomGraph.addNode(newBomNode);
          }
        });
      },
      addOutEdgeToParentNode: function(bulkBomEdge, bomGraph) {
        var parentNode = bomGraph.getNode(bulkBomEdge.parent);
        parentNode.addOutEdge(bulkBomEdge.edgeId);
        parentNode.hasChildren = true;
      },
      addFields: function(destinition, bomFields) {
        bomFields.forEach(function(field) {
          destinition.addField(field);
        });
      },
      buildBomFields: function(viewDefFields, source, urn) {
        var values = this.extractFieldValues(source);
        return this.buildFieldsForViewDefFields(viewDefFields, values, urn);
      },
      extractFieldValues: function() {
        var list = arguments[0] !== (void 0) ? arguments[0] : [];
        var valuesMap = new Map();
        list.forEach(function(field) {
          valuesMap.set(field.metaData.urn, field.value);
        });
        return valuesMap;
      },
      buildFieldsForViewDefFields: function(viewDefFields, valueSource, sourceUrn) {
        var $__5 = this;
        return viewDefFields.map(function(viewDefField) {
          var field = $__5.BomField.FromViewDefField(viewDefField);
          field.updateFieldValue(valueSource);
          field.generateHref(sourceUrn);
          return field;
        });
      },
      populateBomGraph: function(bulkBom, viewDef, bomGraph) {
        this.addNodesToGraph(bulkBom.getNodes(), bulkBom.getRootNodeId(), viewDef, bomGraph);
        this.addEdgesToGraph(bulkBom.getEdges(), viewDef, bomGraph);
      }
    }, {});
  }();
  BomGraphBuilder.$inject = ['BomField', 'BomFieldData'];
  var $__default = BomGraphBuilder;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomGraph/bomGraphBuilder.service.js
