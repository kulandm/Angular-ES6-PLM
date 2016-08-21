/**
 * @ngdoc object
 * @name Models.BomNode
 * @description Class defining the interface for bom graph nodes
 */
class BomNode {

	/**
	 * @ngdoc method
	 * @name Models.BomNode#constructor
	 * @methodOf Models.BomNode
	 * @description initializes the Bom Node properties
	 * @param {Object} args Object containing the following properties
	 * - itemId, outEdges, nodeProperties (which may contain fields)
	 */
	constructor(args) {

		/**
		 * @ngdoc property
		 * @name Models.BomNode#item
		 * @propertyOf Models.BomNode
		 * @description Item information for this node (urn, link, etc)
		 */
		this.item = (angular.isUndefined(args.item)) ? null : args.item;

		/**
		 * @ngdoc property
		 * @name Models.BomNode#itemId
		 * @propertyOf Models.BomNode
		 * @description Id that uniquely identifes the node in the graph.
		 */
		this.itemId = (angular.isUndefined(args.itemId)) ? null : args.itemId;

		/**
		 * @ngdoc property
		 * @name Models.BomNode#outEdges
		 * @propertyOf Models.BomNode
		 * @description Collection of ids for all the edges leaving this node
		 */
		this.outEdges = (angular.isUndefined(args.outEdges)) ? [] : args.outEdges;

		/**
		 * @ngdoc property
		 * @name Models.BomNode#hasChildren
		 * @propertyOf Models.BomNode
		 * @description boolean if this node has children
		 */
		this.hasChildren = (angular.isUndefined(args.hasChildren)) ? false : args.hasChildren;

		/**
		 * @ngdoc property
		 * @name Models.BomNode#nestedBomLink
		 * @propertyOf Models.BomNode
		 * @description the bom nested link of BomNode.
		 */
		this.nestedBomLink = (angular.isUndefined(args.nestedBomLink)) ? null : args.nestedBomLink;

		/**
		 * @ngdoc property
		 * @name Models.BomNode#bomRootLink
		 * @propertyOf Models.BomNode
		 * @description this is the `/bom ` link for fetching the BulkBom
		 * of the item that is represented by this node.
		 */
		this.bomRootLink = (angular.isUndefined(args.bomRootLink)) ? null : args.bomRootLink;

		/**
		 * @ngdoc property
		 * @name Models.BomNode#nodeProperties
		 * @propertyOf Models.BomNode
		 * @description Object holding all of this node's properties
		 *	view def fields are held on the 'fields attribute'
		 */
		this.nodeProperties = null;
		if (angular.isUndefined(args.nodeProperties)) {
			this.nodeProperties = {
				fields: new Map()
			};
		} else {
			this.nodeProperties = args.nodeProperties;
		}
		if (angular.isUndefined(this.nodeProperties.fields)) {
			this.nodeProperties.fields = new Map();
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#addField
	 * @methodOf Models.BomNode
	 * @description Adds a field to the fields collection
	 * @param {BomField} the field to add
	 */
	addField(field) {
		this.nodeProperties.fields.set(field.id, field);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getField
	 * @methodOf Models.BomNode
	 * @description returns the field corresponding to id
	 * @param {String} id the field id
	 * @returns {BomField} the field corresponding to id
	 */
	getField(id) {
		return this.nodeProperties.fields.get(id);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getFields
	 * @methodOf Models.BomNode
	 * @description getter for fields associated with this `BomNode` instance.
	 *
	 * @returns {Map} containing all fields of this `BomNode`.
	 */
	getFields() {
		return this.nodeProperties.fields;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#addOutEdge
	 * @methodOf Models.BomNode
	 * @description Adds an out-edge id to the collection of out-edges
	 * @param {Number} bomId of the edge to add to this nodes list of outEdges
	 */
	addOutEdge(bomId) {
		this.outEdges.push(bomId);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getOutDegree
	 * @methodOf Models.BomNode
	 * @description Tells us how many edges are going out of this BomNode to
	 * other BomNodes.
	 *
	 * @returns {Number} The total number of outgoing edges from this BomNode.
	 */
	getOutDegree() {
		return this.outEdges.length;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getDmsId
	 * @methodOf Models.BomNode
	 * @description gets the dms id of the item of BomNode
	 *
	 * @returns {String} dms id of the node's item.
	 */
	getDmsId() {
		return this.item.urn.split('.').pop();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getBulkBomLink
	 * @methodOf Models.BomNode
	 * @description gets the bom root link of the BomNode.
	 *
	 * @returns {String} the bulk bom link of the node.
	 */
	getBulkBomLink() {
		return this.bomRootLink;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getItemUrn
	 * @methodOf Models.BomNode
	 * @description getter for the urn of item represented by this node.
	 *
	 * @returns {String} the urn of the item of the node.
	 */
	getItemUrn() {
		return this.item.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getItem
	 * @methodOf Models.BomNode
	 * @description getter for the item represented by this BomNode.
	 *
	 * @returns {Object} the item represented by this BomNode.
	 */
	getItem() {
		return this.item;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getItemId
	 * @methodOf Models.BomNode
	 * @description getter for the id of item represented by this BomNode.
	 *
	 * @returns {String} the id of the item of the BomNode.
	 */
	getItemId() {
		return this.itemId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getResourceId
	 * @methodOf Models.BomNode
	 * @description gets a formatted resourceId  `wsId@dmsId` for BomNode.
	 *
	 * @returns {String} representing the formatted resourceId for this node.
	 */
	getResourceId() {
		let urnTokens = this.item.urn.split('.');

		return `${urnTokens[4]}@${urnTokens[5]}`;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#getWorkspaceId
	 * @methodOf Models.BomNode
	 * @description getter for the workspace id of the Nodes item
	 *
	 * @returns {String} representing the workspace id of node.
	 */
	getWorkspaceId() {
		return this.item.urn.split('.')[4];
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNode#fromBulkNode
	 * @methodOf Models.BomNode
	 * @description Builds a BomNode from the node properties of a BulkBom payload.
	 *
	 * @param {Number} bomId of the edge to add to this nodes list of outEdges
	 *
	 * @returns {BomNode} an instance of BomNode.
	 */
	static fromBulkNode(bulkBomNode) {
		let nodeArgs = {};

		nodeArgs.itemId = bulkBomNode.item.urn;
		nodeArgs.item = bulkBomNode.item;
		nodeArgs.nestedBomLink = bulkBomNode.bomItems;
		nodeArgs.bomRootLink = bulkBomNode.bomRoot;
		nodeArgs.nodeProperties = {};
		nodeArgs.outEdges = [];
		nodeArgs.hasChildren = false;

		return new BomNode(nodeArgs);
	}
}

export default BomNode;
