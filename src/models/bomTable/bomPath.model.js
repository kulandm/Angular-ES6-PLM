/**
 * @ngdoc object
 * @name Models.BomPath
 * @description Class representing a path taken to reach a node from the root
 *	Instances of this class should be considered constant
 */
class BomPath {

	/**
	 * @ngdoc method
	 * @name Models.BomPath#constructor
	 * @methodOf Models.BomPath
	 * @description initializes the path from a list of edges
	 * @param {Object} args a list of arguments
	 *	-edges: a list of edgeIds
	 */
	constructor(args) {

		/**
		 * @ngdoc property
		 * @name Models.BomPath#edges
		 * @propertyOf Models.BomPath
		 * @description The array of edge ids which define the path
		 */
		this.edges = angular.isUndefined(args.edges) ? [] : args.edges;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#equals
	 * @methodOf Models.BomPath
	 * @description Returns true if the path leads to the same node
	 * @param {BomPath} bomPath the path to compare to
	 *
	 * @returns {Boolean} true if the paths are equal
	 */
	equals(bomPath) {
		if (bomPath.edges.length !== this.edges.length) {
			return false;
		}

		for (let i = 0; i < bomPath.edges.length; ++i) {
			if (bomPath.edges[i] !== this.edges[i]) {
				return false;
			}
		}

		return true;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#asString
	 * @methodOf Models.BomPath
	 * @description Converts the path into a string that can be used as a unique key in a map
	 * @returns {String} String representation of path
	 */
	asString() {
		return this.edges.join('@');
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#isPathToRoot
	 * @methodOf Models.BomPath
	 * @description Determines if the path is to the root node (that is, if there is no edges in the path)
	 *
	 * @returns {Boolean} true if the path is to the root node
	 */
	isPathToRoot() {
		return this.edges.length === 0;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#isPathToRoot
	 * @methodOf Models.BomPath
	 * @description Returns the final edge of the path
	 *
	 * @returns {String} the final edge in the path, or null if the path is to the root
	 */
	getFinalEdge() {
		if (this.isPathToRoot()) {
			return null;
		} else {
			return this.edges[this.edges.length-1];
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#WithSucceedingPath
	 * @methodOf Models.BomPath
	 * @description Returns a new path whose list of edges is the current path's edges followed by path's edges
	 * @param {BomPath} path the path with which to extend the current path
	 *
	 * @returns {BomPath} the new path
	 */
	WithSucceedingPath(path) {
		return this.WithSucceedingEdges(path.edges);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#WithSucceedingEdges
	 * @methodOf Models.BomPath
	 * @description Returns a new path whose list of edges is the current path's edges followed by edges
	 * @param {Array} edges the list of edges with which to extend the current path
	 *
	 * @returns {BomPath} the new path
	 */
	WithSucceedingEdges(edges) {
		return new BomPath({
			edges: [].concat(this.edges, edges)
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#WithSucceedingEdge
	 * @methodOf Models.BomPath
	 * @description Returns a new path whose list of edges is the current path's edges followed by edgeId
	 * @param {String} edgeId the edge with which to extend the current path
	 *
	 * @returns {BomPath} the new path
	 */
	WithSucceedingEdge(edgeId) {
		return this.WithSucceedingEdges([edgeId]);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#WithPrecedingEdges
	 * @methodOf Models.BomPath
	 * @description Returns a new path whose list of edges is edges followed by the current path's edges
	 * @param {Array} edges the list of edges with which to precede the current path
	 *
	 * @returns {BomPath} the new path
	 */
	WithPrecedingEdges(edges) {
		return new BomPath({
			edges: [].concat(edges, this.edges)
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#WithPrecedingEdge
	 * @methodOf Models.BomPath
	 * @description Returns a new path whose list of edges is edgeId followed by the current path's edges
	 * @param {String} edgeId the edge with which to precede the current path
	 *
	 * @returns {BomPath} the new path
	 */
	WithPrecedingEdge(edgeId) {
		return this.WithPrecedingEdges([edgeId]);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#getPathLength
	 * @methodOf Models.BomPath
	 * @description gets the length of this instance of `BomPath`.
	 *
	 * @returns {Number} the lengh of this `BomPath`.
	 */
	getPathLength() {
		return this.edges.length;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomPath#EmptyPath
	 * @methodOf Models.BomPath
	 * @description Returns a new path to the root node
	 *
	 * @returns {BomPath} the new path
	 */
	static EmptyPath() {
		return new BomPath({
			edges: []
		});
	}
}

export default BomPath;
