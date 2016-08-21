/**
 * @ngdoc object
 * @name Models.BomEdge
 * @description Class defining the interface for bom graph edges
 */
class BomEdge {

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#constructor
	 * @methodOf Models.BomEdge
	 * @description initializes the Bom Edge properties
	 * @param {Object} args Object containing the following properties
	 * - bomId, toNode, edgeProperties (which may contain fields)
	 */
	constructor(args) {

		/**
		 * @ngdoc property
		 * @name Models.BomEdge#link
		 * @propertyOf Models.BomEdge
		 * @description link to this edge
		 */
		this.link = (angular.isUndefined(args.link)) ? null : args.link;

		/**
		 * @ngdoc property
		 * @name Models.BomEdge#bomId
		 * @propertyOf Models.BomEdge
		 * @description id that uniquely identifes this edge
		 */
		this.bomId = (angular.isUndefined(args.bomId)) ? null : args.bomId;

		/**
		 * @ngdoc property
		 * @name Models.BomEdge#toNode
		 * @propertyOf Models.BomEdge
		 * @description itemId for the node this edge points to
		 */
		this.toNode = (angular.isUndefined(args.toNode)) ? null : args.toNode;

		/**
		 * @ngdoc property
		 * @name Models.BomEdge#edgeProperties
		 * @propertyOf Models.BomEdge
		 * @description Object holding all of this edge's properties
		 */
		this.edgeProperties = (angular.isUndefined(args.edgeProperties)) ? {} : args.edgeProperties;

		/**
		 * @ngdoc property
		 * @name Models.BomEdge#edgeProperties.fields
		 * @propertyOf Models.BomEdge
		 * @description Map holding specificlly all of this edge's properties that are view def related fields
		 */
		this.edgeProperties.fields = (angular.isUndefined(args.edgeProperties.fields)) ? new Map() : args.edgeProperties.fields;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#addField
	 * @methodOf Models.BomEdge
	 * @description Adds a field to the fields collection
	 * @param {BomField} the field to add
	 */
	addField(field) {
		this.edgeProperties.fields.set(field.id, field);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#getField
	 * @methodOf Models.BomEdge
	 * @description returns the field corresponding to id
	 * @param {String} id the field id
	 * @returns {BomField} the field corresponding to id
	 */
	getField(id) {
		return this.edgeProperties.fields.get(id);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#getBomId
	 * @methodOf Models.BomEdge
	 * @description getter for the bomId of this `BomEdge`.
	 *
	 * @returns {String} the bomId of this `BomEdge` instance.
	 */
	getBomId() {
		return this.bomId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#getFields
	 * @methodOf Models.BomEdge
	 * @description getter for the fields of this `BomEdge`
	 *
	 * @returns {Map} returns fields that are associated with an instance of `BomEdge`
	 */
	getFields() {
		return this.edgeProperties.fields;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#getItemNumber
	 * @methodOf Models.BomEdge
	 * @description getter for the item number of this `BomEdge`
	 *
	 * @returns {String} returns item number of `BomEdge`
	 */
	getItemNumber() {
		return this.edgeProperties.itemNumber;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomEdge#fromBulkEdge
	 * @methodOf Models.BomEdge
	 * @description Builds a BomEdge from from the edge properties of a BulkBom payload.
	 *
	 * @param {Object} `edgeArgs` object containing the properties needed to create a
	 * BomEdge
	 *
	 * @returns {BomEdge} an instance of BomEdge.
	 */
	static fromBulkEdge(bulkBomEdge) {
		let edgeArgs = {};
		// This needs to be a link in the format dmsId/bom-items/bomId
	    edgeArgs.link = bulkBomEdge.edgeLink;
	    edgeArgs.bomId = bulkBomEdge.edgeId;
	    edgeArgs.toNode = bulkBomEdge.child;
	    edgeArgs.edgeProperties = {};
	    edgeArgs.edgeProperties.itemNumber = bulkBomEdge.itemNumber;

	    return new BomEdge(edgeArgs);
	}
}

export default BomEdge;
