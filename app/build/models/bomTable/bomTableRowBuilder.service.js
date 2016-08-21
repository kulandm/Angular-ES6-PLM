System.registerModule("com/autodesk/models/bomTable/bomTableRowBuilder.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomTableRowBuilder.service.js";
  var BomTableRow = System.get("com/autodesk/models/bomTable/bomTableRow.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomAttachmentList = System.get("com/autodesk/models/bomAttachment/bomAttachmentList.model.js").default;
  var BomTableRowBuilder = function() {
    function BomTableRowBuilder(BomField, BomFieldData) {
      this.BomField = BomField;
      this.BomFieldData = BomFieldData;
    }
    return ($traceurRuntime.createClass)(BomTableRowBuilder, {
      buildRowFromPath: function(path, bomGraph, viewDef) {
        var rowArgs = {};
        rowArgs.displayProperties = {};
        rowArgs.path = path;
        this.addNodeData(bomGraph.getNodeForPath(path), rowArgs, viewDef);
        if (path.isPathToRoot()) {
          rowArgs.itemNumber = 0;
          rowArgs.edgeId = null;
        } else {
          this.addEdgeData(bomGraph.getEdgeForPath(path), rowArgs);
        }
        this.addItemNumberField(rowArgs);
        return new BomTableRow(rowArgs);
      },
      addNodeData: function(node, rowArgs, viewDef) {
        rowArgs.nodeId = node.getItemId();
        rowArgs.item = node.getItem();
        rowArgs.hasFetchedChildren = node.getOutDegree() > 0;
        rowArgs.isExpandable = node.hasChildren;
        if (viewDef.hasAttachmentField()) {
          this.formatAttachmentValue(node, viewDef);
        }
        this.addFieldsToTableRow(rowArgs, node);
      },
      addEdgeData: function(edge, rowArgs) {
        rowArgs.edgeId = edge.getBomId();
        rowArgs.itemNumber = edge.getItemNumber();
        this.addFieldsToTableRow(rowArgs, edge);
      },
      addItemNumberField: function(rowArgs) {
        var itemNumberField = this.BomField.ItemNumberField();
        itemNumberField.value = {
          depth: rowArgs.path.getPathLength(),
          itemNumber: rowArgs.itemNumber
        };
        var itemNumberFieldData = this.BomFieldData.fromField(itemNumberField);
        rowArgs.displayProperties[itemNumberFieldData.getFieldId()] = itemNumberFieldData;
      },
      addFieldsToTableRow: function(rowArgs, fieldSource) {
        var $__5 = this;
        fieldSource.getFields().forEach(function(field, key) {
          rowArgs.displayProperties[key] = $__5.BomFieldData.fromField(field);
        });
      },
      formatAttachmentValue: function(node, viewDef) {
        var attachmentViewDefField = viewDef.getFieldWithSemantics(BomUIFieldSemantics.ATTACHMENTS);
        var attachmentBomField = node.getField(attachmentViewDefField.getUrn());
        var valueObj = {
          count: 0,
          itemId: node.getDmsId(),
          workspaceId: node.getWorkspaceId(),
          itemUrn: node.getItemUrn(),
          attachmentLink: attachmentBomField.getValue(),
          attachments: new BomAttachmentList([], node.getItemUrn())
        };
        attachmentBomField.value = valueObj;
      }
    }, {});
  }();
  angular.module(__moduleName, []).service('BomTableRowBuilder', ['BomField', 'BomFieldData', BomTableRowBuilder]);
  return {};
});
//# sourceURL=com/autodesk/models/bomTable/bomTableRowBuilder.service.js
