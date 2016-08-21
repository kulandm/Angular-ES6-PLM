import BomTableRow from 'com/autodesk/models/bomTable/bomTableRow.model.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';
import BomAttachmentList from 'com/autodesk/models/bomAttachment/bomAttachmentList.model.js';

/**
 * @ngdoc object
 * @name Models.BomTableRowBuilder
 * @description This service has methods for building BomTableRow.
 */
class BomTableRowBuilder {
    /**
     * @ngdoc object
     * @name Models.BomTableRowBuilder
     * @description Initializer for the BomTableRowBuilder service.
     */
    constructor(BomField, BomFieldData) {
        this.BomField = BomField;
        this.BomFieldData = BomFieldData;
    }

    /**
     * @ngdoc method
     * @name Models.BomTableRowBuilder#buildRowFromPath
     * @methodOf Models.BulkBom
     * @description Intializes the BomTableRowBuilder
     *
     * @param {BomPath} `path` an instance of `BomPath` class.
     * @param {BomGraph} `bomGraph` an instance of `BomGraph` class.
     */
    buildRowFromPath(path, bomGraph, viewDef) {
        let rowArgs = {};
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
    }

    /**
     * @ngdoc method
     * @name Models.BomTableRowBuilder#addNodeData
     * @methodOf Models.BulkBom
     * @description Adds data from a `BomNode` instance to the `rowArgs`
     *
     * @param {BomNode} `node` an instance of BomNode class.
     * @param {Object} `rowArgs` Holder object for all the arguments needed to construct
     * an instance of `BomTableRow`.
     */
    addNodeData(node, rowArgs, viewDef) {
        rowArgs.nodeId = node.getItemId();
        rowArgs.item = node.getItem();
        rowArgs.hasFetchedChildren = node.getOutDegree() > 0;
        rowArgs.isExpandable = node.hasChildren;
        if (viewDef.hasAttachmentField()) {
            this.formatAttachmentValue(node, viewDef);
        }
        this.addFieldsToTableRow(rowArgs, node);
    }

    /**
     * @ngdoc method
     * @name Models.BomTableRowBuilder#addEdgeData
     * @methodOf Models.BulkBom
     * @description Intializes the BomTableRowBuilder
     *
     * @param {BomEdge} `edge` an instance of BomEdge.
     * @param {Object} `rowArgs` Holder object for all the arguments needed to construct
     * an instance of `BomTableRow`.
     */
    addEdgeData(edge, rowArgs) {
        rowArgs.edgeId = edge.getBomId();
        rowArgs.itemNumber = edge.getItemNumber();
        this.addFieldsToTableRow(rowArgs, edge);
    }

    /**
     * @ngdoc method
     * @name Models.BomTableRowBuilder#addItemNumberField
     * @methodOf Models.BulkBom
     * @description Adds item number as a field to holder object `rowArgs`
     * as a BomField instance.
     *
     * @param {Object} `rowArgs` Holder object for all the arguments needed to construct
     * an instance of `BomTableRow`.
     */
    addItemNumberField(rowArgs) {
        let itemNumberField = this.BomField.ItemNumberField();
        itemNumberField.value = {
            depth: rowArgs.path.getPathLength(),
            itemNumber: rowArgs.itemNumber
        };
        let itemNumberFieldData = this.BomFieldData.fromField(itemNumberField);
        rowArgs.displayProperties[itemNumberFieldData.getFieldId()] = itemNumberFieldData;
    }

    /**
     * @ngdoc method
     * @name Models.BomTableRowBuilder#addFieldsToTableRow
     * @methodOf Models.BulkBom
     * @description Adds a list BomField instances to the displayProperties of `rowArgs`.
     *
     * @param {Object} `rowArgs` Holder object for all the arguments needed to construct
     * an instance of `BomTableRow`.
     * @param {Object} `fieldSource` either an instance of `BomNode` or a `BomEdge`.
     */
    addFieldsToTableRow(rowArgs, fieldSource) {
        fieldSource.getFields().forEach((field, key) => {
            rowArgs.displayProperties[key] = this.BomFieldData.fromField(field);
        });
    }

    /**
     * @ngdoc method
     * @name Models.BomTableRowBuilder#formatAttachmentValue
     * @methodOf Models.BulkBom
     * @description Updates the value of the attachment field to make sure that
     * it has all the properties needed for correct viewing. It is assumed that
     * this method is only called when there is attachment in the view.
     *
     * @param {Object} `node` an instance of BomNode containing the field.
     * @param {Object} `viewDef` ViewDefinition instance.
     */
    formatAttachmentValue(node, viewDef) {
        let attachmentViewDefField = viewDef.getFieldWithSemantics(BomUIFieldSemantics.ATTACHMENTS);
        let attachmentBomField = node.getField(attachmentViewDefField.getUrn());
        let valueObj = {
            // The initial count is zero for all attachment fields.
            // This field will be updated to the correct count once attachment data becomes available.
            count: 0,
            itemId: node.getDmsId(),
            workspaceId: node.getWorkspaceId(),
            itemUrn: node.getItemUrn(),
            attachmentLink: attachmentBomField.getValue(),
            attachments: new BomAttachmentList([], node.getItemUrn())
        };
        attachmentBomField.value = valueObj;
    }
}

angular.module(__moduleName, []).service('BomTableRowBuilder', ['BomField', 'BomFieldData', BomTableRowBuilder]);
