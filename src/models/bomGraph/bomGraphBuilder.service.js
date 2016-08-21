import BomNode from 'com/autodesk/models/bomGraph/bomNode.model.js';
import BomEdge from 'com/autodesk/models/bomGraph/bomEdge.model.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Models.BomGraphBuilder
 * @description A service that handles the building of a BomGraph.
 */
class BomGraphBuilder {

    /**
     * @ngdoc method
     * @name Models.BomGraphBuilder#constructor
     * @methodOf Models.BulkBom
     * @description Intializes the BomGraphBuilder
     */
    constructor(BomField, BomFieldData) {
        this.BomField = BomField;
        this.BomFieldData = BomFieldData;
    }

    /**
     * @ngdoc method
     * @name Models.BomGraphBuilder#buildRootNode
     * @methodOf Models.BulkBom
     * @description Builds a BomNode from an instance of `BomRoot`
     *
     * @param {BomRoot} `bomRoot` An instance of BomRoot
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the root node.
     *
     * @returns {BomNode} an instance of BomNode corresponding to the root node
     */
    buildRootNode(bomRoot, viewdef) {
        let rootNodeArgs = {};
        rootNodeArgs.itemId = bomRoot.getItemId();
        rootNodeArgs.item = bomRoot.item;
        rootNodeArgs.hasChildren = bomRoot.getOccurancesCount() > 1 ? true : false;

        let rootNode = new BomNode(rootNodeArgs);
        let valueSource = this.extractFieldValues(bomRoot.getFields());
        let fields = this.buildFieldsForViewDefFields(viewdef.getFields(),
            valueSource, bomRoot.getItemUrn());
        this.addFields(rootNode, fields);

        return rootNode;
    }

    /**
     * @ngdoc method
     * @name Models.BomGraphBuilder#buildEdgeForBomNestedItem
     * @methodOf Models.BomGraphBuilder
     * @description Builds an edge given the collection of properties
     *	and the fields that should be essigned to it
     *
     * @param {BomNestedItem} `edgeNodeProperties` needing to be parsed to created an edge node
     * @param {Array} `fieldValues` an array of BomFields
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the bom edge.
     *
     * @returns {BomEdge} the edge object
     */
    buildEdgeForBomNestedItem(edgeNodeProperties, fieldValues, viewDef) {
        let edgeArgs = {};
        edgeArgs.link = edgeNodeProperties.__self__;
        edgeArgs.bomId = edgeNodeProperties.getBomId();
        edgeArgs.toNode = edgeNodeProperties.getItemId();
        edgeArgs.edgeProperties = {};
        edgeArgs.edgeProperties.itemNumber = edgeNodeProperties.getItemNumber();

        let edge = new BomEdge(edgeArgs);
        let fields = this.buildFieldsForViewDefFields(viewDef.getEdgeFields(),
            fieldValues, edgeNodeProperties.getItemUrn());
        this.addFields(edge, fields);

        return edge;
    }

    /**
     * @ngdoc method
     * @name Models.BomGraphBuilder#buildNodeForBomNestedItem
     * @methodOf Models.BomGraphBuilder
     * @description Builds an node given the collection of properties
     *	and the fields that should be essigned to it
     *
     * @param {BomNestedItem} `edgeNodeProperties` needing to be parsed to created
     * an edge node
     * @param {Array} `fieldValues` an array of BomFields
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the bom node.
     *
     * @returns {BomNode} an instance of `BomNode`
     */
    buildNodeForBomNestedItem(edgeNodeProperties, fieldValues, viewDef) {
        let nodeArgs = {};
        nodeArgs.itemId = edgeNodeProperties.getItemId();
        nodeArgs.item = edgeNodeProperties.getItem();
        nodeArgs.nodeProperties = {};
        nodeArgs.hasChildren = edgeNodeProperties.hasChildren();

        let node = new BomNode(nodeArgs);
        let fields = this.buildFieldsForViewDefFields(viewDef.getNodeFields(),fieldValues, edgeNodeProperties.getItemUrn());
        this.addFields(node, fields);

        return node;
    }

    /**
     * @ngdoc method
     * @name Models.BomGraphBuilder#addEdgeNodeToGraph
     * @methodOf Models.BomGraphBuilder
     *
     * @description Build an edge and node given the collection of properties
     *
     * |
     * |				<- Edge (Edge Created, All properties populated)
     * |
     * V
     * (Child Node)		<- Node (Node Created, All properties except OutEdges populated)
     *
     * We parse the BomNestedItem edgeNodeProperties back onto our edges/nodes and add them to the graph
     *
     * @param {BomNestedItem} `edgeNodeProperties` needing to be parsed to created an edge node
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the edge and the node fields.
     * @param {BomGraph} `bomGraph` an instance of BomGraph.
     */
    addEdgeNodeToGraph(edgeNodeProperties, viewDef, bomGraph) {
        let fieldValuesMap = this.extractFieldValues(edgeNodeProperties.getFields());
        let edge = this.buildEdgeForBomNestedItem(edgeNodeProperties, fieldValuesMap, viewDef);
        let node = this.buildNodeForBomNestedItem(edgeNodeProperties, fieldValuesMap, viewDef);

        bomGraph.addEdge(edge);

        // We know we don't have this edge because we made it this far but if we have the node, dont readd it to the graph
        if (!bomGraph.hasNode(node.itemId)) {
            bomGraph.addNode(node);
        }
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#buildEdgeForBulkBom
     * @methodOf Models.BomGraphBuilder
     * @description Builds a bom edge object using `bulkBomEdge`, and `viewDef`.
     *
     * @param {Object} `bulkBomEdge` containing the properties of a bom edge.
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the bom edge.
     *
     * @returns {BomEdge} an instance of BomEdge.
     */
    buildEdgeForBulkBom(bulkBomEdge, viewDef) {
        let newEdge = BomEdge.fromBulkEdge(bulkBomEdge);
        let bomFields = this.buildBomFields(viewDef.getEdgeFields(), bulkBomEdge.fields, bulkBomEdge.child);

        this.addFields(newEdge, bomFields);

        return newEdge;
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#addEdgesToGraph
     * @methodOf Models.BomGraphBuilder
     * @description builds BomEdge instances from `edgeList` and the
     * `viewDefs` is used to build the fields associated each instace.
     *
     * @param {Array} `edgeList` is a list of objects holding the properties
     * needed to instantiate a BomEdge.
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the BomNodes.
     * @param {BomGraph} `bomGraph` an instance of BomGraph.
     */
    addEdgesToGraph(edgeList = [], viewDef, bomGraph) {
        edgeList.forEach((edge) => {
            let newBomEdge = this.buildEdgeForBulkBom(edge, viewDef, bomGraph);
            this.addOutEdgeToParentNode(edge, bomGraph);
            bomGraph.addEdge(newBomEdge);
        });
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#buildNodeForBulkBom
     * @methodOf Models.BomGraphBuilder
     * @description Builds a bom node object using `bulkBomNode`, and `viewDef`.
     *
     * @param {Object} `bulkBomNode` containing the properties of a bom node.
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the bom node.
     *
     * @returns {BomNode} an instance of BomNode.
     */
    buildNodeForBulkBom(bulkBomNode, viewDef, rootUrn) {
        let newNode = BomNode.fromBulkNode(bulkBomNode);
        let bomFields = [];

        if (newNode.getItemUrn() === rootUrn) {
            bomFields = this.buildBomFields(viewDef.getFields(), bulkBomNode.fields, newNode.getItemUrn());
        } else {
            bomFields = this.buildBomFields(viewDef.getNodeFields(), bulkBomNode.fields, newNode.getItemUrn());
        }
        this.addFields(newNode, bomFields);

        return newNode;
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#addNodesToGraph
     * @methodOf Models.BomGraphBuilder
     * @description builds a map of BomNode instances from `nodeList` and the
     * `viewDefs` is used to build the fields associated with each instance.
     *
     * @param {Array} `nodeList` is a list of objects holding the properties
     * needed to instantiate a BomNode.
     * @param {Object} `viewDef` the current view definition that is to be used
     * in building the properties of the BomNodes.
     * @param {BomGraph} `bomGraph` an instance of BomGraph.
     */
    addNodesToGraph(nodeList = [], rootId, viewDef, bomGraph) {
        nodeList.forEach((node) => {
            if (!bomGraph.hasNode(node.item.urn)) {
                let newBomNode = this.buildNodeForBulkBom(node, viewDef, rootId);
                bomGraph.addNode(newBomNode);
            }
        });
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#updateParentNode
     * @methodOf Models.BomGraphBuilder
     * @description Builds a bom node object using `bulkBomNode`, and `viewDef`.
     *
     * @param {Object} `bulkBomEdge` containing the properties of a bom node.
     * @param {BomGraph} `bomGraph` an instance of BomGraph.
     */
    addOutEdgeToParentNode(bulkBomEdge, bomGraph) {
        let parentNode = bomGraph.getNode(bulkBomEdge.parent);
        parentNode.addOutEdge(bulkBomEdge.edgeId);
        parentNode.hasChildren = true;
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#addFields
     * @methodOf Models.BomGraphBuilder
     * @description Adds the `fields` to the `destinition`.
     *
     * @param {Object} `destinition` either a BomNode or a BomEdge.
     * @param {Array} `bomFields` is a list of BomField instances.
     */
    addFields(destinition, bomFields) {
        bomFields.forEach((field) => {
            destinition.addField(field);
        });
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#buildFieldValuesMaps
     * @methodOf Models.BomGraphBuilder
     * @description builds BomField intances using the information from the
     * `viewDefFields`, `source`, and `urn`.
     *
     * @param {Object} `viewDefFields` will be used to build the fields.
     * @param {Object} `source` is a list of objects with data .
     * @param {Object} `urn` is the urn of  of `destinition` item.
     *
     * @returns {Array} a list of `BomField` instances.
     */
    buildBomFields(viewDefFields, source, urn) {
        let values = this.extractFieldValues(source);

        return this.buildFieldsForViewDefFields(viewDefFields, values, urn);
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#extractFieldValues
     * @methodOf Models.BomGraphBuilder
     * @description creates a map of urn -> value from the given list of fields.
     *
     * @param {Array} `list` containing the list properties
     *
     * @returns {Map} containing the extracted field values.
     */
    extractFieldValues(list = []) {
        let valuesMap = new Map();

        list.forEach((field) => {
            valuesMap.set(field.metaData.urn, field.value);
        });

        return valuesMap;
    }

    /**
     * @ngdoc method
     * @name Models.BomGraphBuilder#buildFieldsForViewDefFields
     * @methodOf Models.BomGraphBuilder
     * @description Creates a list of BomFields using the provided view def fields
     *  and maps of values to give them
     *
     * @param {Array} `viewDefFields` An array of ViewDefinitionField instances
     * @param {Map} `valueSource` A map of field ids to value
     * @param {String} `sourceUrn` the urn of the object to which these fields will belong
     *
     * @returns {Array} a list of BomField instances
     */
    buildFieldsForViewDefFields(viewDefFields, valueSource, sourceUrn) {
        return viewDefFields.map((viewDefField) => {
            let field = this.BomField.FromViewDefField(viewDefField);
            field.updateFieldValue(valueSource);
            field.generateHref(sourceUrn);
            return field;
        });
    }

    /**
     * @ngdoc property
     * @name Models.BomGraphBuilder#populateBomGraph
     * @methodOf Models.BomGraphBuilder
     * @description populates the 'bomGraph' using the information from the 'bulkBom', and
     * the 'viewDef' is used to build the fields for nodes and edges of the 'bomGraph'.
     *
     * @param {BulkBom} `bulkBom` an instance of BulkBom containing the data for
     * populating a BomGraph.
     * @param {Object} `viewDef` the view definition that is to be used for building the fields
     * of the nodes and edges of the 'bomGraph'.
     * @param {BomGraph} `bomGraph` an instance of BomGraph.
     */
    populateBomGraph(bulkBom, viewDef, bomGraph) {
        this.addNodesToGraph(bulkBom.getNodes(), bulkBom.getRootNodeId(), viewDef, bomGraph);
        this.addEdgesToGraph(bulkBom.getEdges(), viewDef, bomGraph);
    }
}

BomGraphBuilder.$inject = ['BomField', 'BomFieldData'];

export default BomGraphBuilder;
