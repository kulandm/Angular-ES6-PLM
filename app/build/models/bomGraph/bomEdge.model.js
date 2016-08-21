System.registerModule("com/autodesk/models/bomGraph/bomEdge.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomEdge.model.js";
  var BomEdge = function() {
    function BomEdge(args) {
      this.link = (angular.isUndefined(args.link)) ? null : args.link;
      this.bomId = (angular.isUndefined(args.bomId)) ? null : args.bomId;
      this.toNode = (angular.isUndefined(args.toNode)) ? null : args.toNode;
      this.edgeProperties = (angular.isUndefined(args.edgeProperties)) ? {} : args.edgeProperties;
      this.edgeProperties.fields = (angular.isUndefined(args.edgeProperties.fields)) ? new Map() : args.edgeProperties.fields;
    }
    return ($traceurRuntime.createClass)(BomEdge, {
      addField: function(field) {
        this.edgeProperties.fields.set(field.id, field);
      },
      getField: function(id) {
        return this.edgeProperties.fields.get(id);
      },
      getBomId: function() {
        return this.bomId;
      },
      getFields: function() {
        return this.edgeProperties.fields;
      },
      getItemNumber: function() {
        return this.edgeProperties.itemNumber;
      }
    }, {fromBulkEdge: function(bulkBomEdge) {
        var edgeArgs = {};
        edgeArgs.link = bulkBomEdge.edgeLink;
        edgeArgs.bomId = bulkBomEdge.edgeId;
        edgeArgs.toNode = bulkBomEdge.child;
        edgeArgs.edgeProperties = {};
        edgeArgs.edgeProperties.itemNumber = bulkBomEdge.itemNumber;
        return new BomEdge(edgeArgs);
      }});
  }();
  var $__default = BomEdge;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomGraph/bomEdge.model.js
