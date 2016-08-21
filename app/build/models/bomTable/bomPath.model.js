System.registerModule("com/autodesk/models/bomTable/bomPath.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomPath.model.js";
  var BomPath = function() {
    function BomPath(args) {
      this.edges = angular.isUndefined(args.edges) ? [] : args.edges;
    }
    return ($traceurRuntime.createClass)(BomPath, {
      equals: function(bomPath) {
        if (bomPath.edges.length !== this.edges.length) {
          return false;
        }
        for (var i = 0; i < bomPath.edges.length; ++i) {
          if (bomPath.edges[i] !== this.edges[i]) {
            return false;
          }
        }
        return true;
      },
      asString: function() {
        return this.edges.join('@');
      },
      isPathToRoot: function() {
        return this.edges.length === 0;
      },
      getFinalEdge: function() {
        if (this.isPathToRoot()) {
          return null;
        } else {
          return this.edges[this.edges.length - 1];
        }
      },
      WithSucceedingPath: function(path) {
        return this.WithSucceedingEdges(path.edges);
      },
      WithSucceedingEdges: function(edges) {
        return new BomPath({edges: [].concat(this.edges, edges)});
      },
      WithSucceedingEdge: function(edgeId) {
        return this.WithSucceedingEdges([edgeId]);
      },
      WithPrecedingEdges: function(edges) {
        return new BomPath({edges: [].concat(edges, this.edges)});
      },
      WithPrecedingEdge: function(edgeId) {
        return this.WithPrecedingEdges([edgeId]);
      },
      getPathLength: function() {
        return this.edges.length;
      }
    }, {EmptyPath: function() {
        return new BomPath({edges: []});
      }});
  }();
  var $__default = BomPath;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomTable/bomPath.model.js
