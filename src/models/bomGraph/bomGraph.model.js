import BomPath from 'com/autodesk/models/bomTable/bomPath.model.js';

/**
 * @ngdoc object
 * @name Models.BomGraph
 * @description Class represnting the Bom Graph
 */
class BomGraph {

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#constructor
	 * @methodOf Models.BomGraph
	 * @description initializes the Bom Graph properties
	 * @param {Object} args Object containing the following properties
	 * - bomNodes, bomEdges, rootNode
	 */
	constructor(args = {}) {

		/**
		 * @ngdoc property
		 * @name Models.BomGraph#bomNodes
		 * @propertyOf Models.BomGraph
		 * @description Map of nodes, keyed on itemId
		 */
		this.bomNodes = (angular.isUndefined(args.bomNodes)) ? new Map() : args.bomNodes;

		/**
		 * @ngdoc property
		 * @name Models.BomGraph#bomEdges
		 * @propertyOf Models.BomGraph
		 * @description Map of edges, keyed on Bom ID
		 */
		this.bomEdges = (angular.isUndefined(args.bomEdges)) ? new Map() : args.bomEdges;

		/**
		 * @ngdoc property
		 * @name Models.BomGraph#rootNode
		 * @propertyOf Models.BomGraph
		 * @description Key to the root node
		 */
		this.rootNodeId = (angular.isUndefined(args.rootNodeId)) ? null : args.rootNodeId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#clear
	 * @methodOf Models.BomGraph
	 * @description Clears the bom graph properties in a way that maintains dual bindings
	 */
	clear() {
		this.bomNodes.clear();
		this.bomEdges.clear();
		this.rootNodeId = null;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getRootNodeId
	 * @methodOf Models.BomGraph
	 * @description Returns the root node itemId. Can be used to pull the root node properties out of the nodes collection
	 */
	getRootNodeId() {
		return this.rootNodeId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#setRootNodeId
	 * @methodOf Models.BomGraph
	 * @description Sets the pointer to the root node in the nodes collection
	 * @param {String} itemId of the item to be the root node
	 */
	setRootNodeId(itemId) {
		this.rootNodeId = itemId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getRootNode
	 * @methodOf Models.BomGraph
	 * @description Returns the root node object
	 */
	getRootNode() {
		return this.getNode(this.getRootNodeId());
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getEdgeForPath
	 * @methodOf Models.BomGraph
	 * @description Returns the edge object corresponding to the path
	 */
	getEdgeForPath(path) {
		if (path.isPathToRoot()) {
			return null;
		} else {
			return this.getEdge(path.getFinalEdge());
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getNodeIdForPath
	 * @methodOf Models.BomGraph
	 * @description Returns the node id pointed at by the path
	 */
	getNodeIdForPath(path) {
		if (path.isPathToRoot()) {
			return this.getRootNodeId();
		} else {
			return this.getEdgeForPath(path).toNode;
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getNodeForPath
	 * @methodOf Models.BomGraph
	 * @description Returns the node corresponding to the path
	 */
	getNodeForPath(path) {
		return this.getNode(this.getNodeIdForPath(path));
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#addEdge
	 * @methodOf Models.BomGraph
	 * @description Add an edge to the graph, keyed on bomId
	 * @param {BomEdge} A BomEdge Object to add to the graph
	 */
	addEdge(bomEdge) {
		this.bomEdges.set(bomEdge.bomId, bomEdge);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#hasEdge
	 * @methodOf Models.BomGraph
	 * @description Returns true if the graph has the edge
	 * @param {String} bomId to check
	 * @returns {Boolean} True if the graph has the edge
	 */
	hasEdge(bomId) {
		return this.bomEdges.has(bomId);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#hasNode
	 * @methodOf Models.BomGraph
	 * @description Returns true if the graph has the node
	 * @param {String} itemId to check
	 * @returns {Boolean} True if the graph has the node
	 */
	hasNode(itemId) {
		return this.bomNodes.has(itemId);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getEdge
	 * @methodOf Models.BomGraph
	 * @description Get a node from the edge by its bomId
	 * @param {String} bomId of the edge to fetch
	 * @returns {BomEdge} BomEdge Object Fetched
	 */
	getEdge(bomId) {
		return this.bomEdges.get(bomId);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#addNode
	 * @methodOf Models.BomGraph
	 * @description Add a node the the graph, keyed on itemId
	 * @param {BomNode} BomNode Object to add to the graph
	 */
	addNode(bomNode) {
		this.bomNodes.set(bomNode.itemId, bomNode);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getNode
	 * @methodOf Models.BomGraph
	 * @description Get a node from the graph by its itemId
	 * @param {String} itemId of the BomNode to fetch from the graph
	 * @returns {BomNode} BomNode Object Fetched
	 */
	getNode(itemId) {
		return this.bomNodes.get(itemId);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getNodeForEdge
	 * @methodOf Models.BomGraph
	 * @description Get a node from the graph by an edge that leads to it
	 * @param {String} bomId of the edge to follow
	 * @returns {BomNode} BomNode Object Fetched
	 */
	getNodeForEdge(bomId) {
		return this.getNode(this.getEdge(bomId).toNode);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getNodeUrnList
	 * @methodOf Models.BomGraph
	 * @description builds a list of urn of all nodes present in the graph.
	 *
	 * @returns {Array} list of urns.
	 */
	getNodeUrnList() {
		let urnList = [];
		this.bomNodes.forEach((node, key) => {
			urnList.push(node.getItemUrn());
		});
		return urnList;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#getNodes
	 * @methodOf Models.BomGraph
	 * @description returns the nodes of the graph.
	 *
	 * @returns {Map} a Map of BomNode instances.
	 */
	getNodes() {
		return this.bomNodes;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomGraph#BFT
	 * @methodOf Models.BomGraph
	 * @description Breadth First Traversal of the Bom Graph.
	 * At each path in the traversal, calls a given function with paramters, then continues.
	 * @param {BomPath} path The path to start at (if undefined, starts at the root)
	 * @param {Function} func Optional Function to call on each Path in the graph
	 * @param {Number} maxDepth Optional maximum depth of the traversal (inclusive)
	 *			if undefined, will do a full traversal
	 */
	BFT(path = BomPath.EmptyPath(), func, maxDepth) {
		// edgeId, func, context, depth, path = BomPath.EmptyPath) {
		// Init queue with first path
		let q = [path];

		// Begin Looping and calling the function on each path in BF order
		while (q.length > 0) {
			let currentPath = q.shift();

			if (func) {
				func(currentPath);
			}

			if (maxDepth === undefined || currentPath.edges.length < maxDepth) {
				this.getNodeForPath(currentPath).outEdges.forEach((edgeId, index, array) => {
					q.push(currentPath.WithSucceedingEdge(edgeId));
				});
			}
		}
	}
}

export default BomGraph;
