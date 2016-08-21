System.registerModule("com/autodesk/models/bomGraph/bomGraph.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomGraph.model.js";
  var BomPath = System.get("com/autodesk/models/bomTable/bomPath.model.js").default;
  var BomGraph = function() {
    function BomGraph() {
      var args = arguments[0] !== (void 0) ? arguments[0] : {};
      this.bomNodes = (angular.isUndefined(args.bomNodes)) ? new Map() : args.bomNodes;
      this.bomEdges = (angular.isUndefined(args.bomEdges)) ? new Map() : args.bomEdges;
      this.rootNodeId = (angular.isUndefined(args.rootNodeId)) ? null : args.rootNodeId;
    }
    return ($traceurRuntime.createClass)(BomGraph, {
      clear: function() {
        this.bomNodes.clear();
        this.bomEdges.clear();
        this.rootNodeId = null;
      },
      getRootNodeId: function() {
        return this.rootNodeId;
      },
      setRootNodeId: function(itemId) {
        this.rootNodeId = itemId;
      },
      getRootNode: function() {
        return this.getNode(this.getRootNodeId());
      },
      getEdgeForPath: function(path) {
        if (path.isPathToRoot()) {
          return null;
        } else {
          return this.getEdge(path.getFinalEdge());
        }
      },
      getNodeIdForPath: function(path) {
        if (path.isPathToRoot()) {
          return this.getRootNodeId();
        } else {
          return this.getEdgeForPath(path).toNode;
        }
      },
      getNodeForPath: function(path) {
        return this.getNode(this.getNodeIdForPath(path));
      },
      addEdge: function(bomEdge) {
        this.bomEdges.set(bomEdge.bomId, bomEdge);
      },
      hasEdge: function(bomId) {
        return this.bomEdges.has(bomId);
      },
      hasNode: function(itemId) {
        return this.bomNodes.has(itemId);
      },
      getEdge: function(bomId) {
        return this.bomEdges.get(bomId);
      },
      addNode: function(bomNode) {
        this.bomNodes.set(bomNode.itemId, bomNode);
      },
      getNode: function(itemId) {
        return this.bomNodes.get(itemId);
      },
      getNodeForEdge: function(bomId) {
        return this.getNode(this.getEdge(bomId).toNode);
      },
      getNodeUrnList: function() {
        var urnList = [];
        this.bomNodes.forEach(function(node, key) {
          urnList.push(node.getItemUrn());
        });
        return urnList;
      },
      getNodes: function() {
        return this.bomNodes;
      },
      BFT: function() {
        var path = arguments[0] !== (void 0) ? arguments[0] : BomPath.EmptyPath();
        var func = arguments[1];
        var maxDepth = arguments[2];
        var q = [path];
        var $__3 = this,
            $__4 = function() {
              var currentPath = q.shift();
              if (func) {
                func(currentPath);
              }
              if (maxDepth === undefined || currentPath.edges.length < maxDepth) {
                $__3.getNodeForPath(currentPath).outEdges.forEach(function(edgeId, index, array) {
                  q.push(currentPath.WithSucceedingEdge(edgeId));
                });
              }
            };
        while (q.length > 0) {
          $__4();
        }
      }
    }, {});
  }();
  var $__default = BomGraph;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomGraph/bomGraph.model.js
