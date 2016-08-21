
'use strict';

/**
 * @ngdoc object
 * @name Models.BomRoot
 *
 * @description This class wraps a BomRoot payload into an object
 *
 * ##Dependencies
 *
 */
class BomRoot {

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#constructor
	 * @methodOf Models.BomRoot
	 * @description Sets the properties of the instance from the payload
	 * @param {Object} json the JSON payload for a BomNestedItem
	 */
	constructor(json) {
		if (json) {
			this.__self__ = json.__self__;
			this.item = json.item;
			this.occurancesCount = json.occurancesCount;
			this.configData = json.configData;
			this.fields = json.fields;
		}

		this.json = json;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getSelfLink
	 * @methodOf Models.BomRoot
	 * @description Returns the api link for this item
	 *
	 * @returns {String} Link to object's api endpoint
	 */
	getSelfLink() {
		return this.__self__.replace(/^\//, '');
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getItemId
	 * @methodOf Models.BomRoot
	 * @description The ItemId that this Node Represents
	 *
	 * @returns {String} Bom Root Node's Item Id
	 */
	getItemId() {
		let tokens = this.item.urn.split('.');
		return `${tokens[4]}@${tokens[5]}`;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getWorkspaceId
	 * @methodOf Models.BomRoot
	 * @description The WOrkspaceId of this item
	 *
	 * @returns {String} Bom Root Node's WOrkspaceId
	 */
	getWorkspaceId() {
		return this.__self__.split('/')[4];
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getDmsId
	 * @methodOf Models.BomRoot
	 * @description The DmsId of this item
	 *
	 * @returns {String} Bom Root Node's DmsId
	 */
	getDmsId() {
		return this.item.urn.split('.').pop();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getOccurancesCount
	 * @methodOf Models.BomRoot
	 * @description Returns the number of total parts, including the top level assembly itself
	 *
	 * @returns {Number} of Parts
	 */
	getOccurancesCount() {
		return this.occurancesCount;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getFields
	 * @methodOf Models.BomRoot
	 * @description Returns the full list root properties
	 *
	 * @returns {Array} Collection of root properties
	 */
	getFields() {
		return this.fields;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getConfigDate
	 * @methodOf Models.BomRoot
	 * @description Returns the date corresponding to this BOM
	 *
	 * @returns {String} Date corresponding to this BOM
	 */
	getConfigDate() {
		return this.configData.bomViewDate;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getConfigBias
	 * @methodOf Models.BomRoot
	 * @description Returns the bias for this Bom
	 *
	 * @returns {String} Bias for this BOM
	 */
	getConfigBias() {
		return this.configData.bias;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getItemUrn
	 * @methodOf Models.BomRoot
	 * @description The urn of the item
	 *
	 * @returns {String} the urn of the item
	 */
	getItemUrn() {
		return this.item.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#getAttachmentData
	 * @methodOf Models.BomRoot
	 * @description Make a call to fetch attachment data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	getAttachmentData() {
		return {
			count: this.attachmentsData.count,
			workspaceId: this.getWorkspaceId(),
			itemId: this.getDmsId(),
			itemUrn: this.getItemUrn()
		};
	}

	/**
	 * @ngdoc method
	 * @name Models.BomRoot#fetch
	 * @methodOf Models.BomRoot
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 * @param {Object} params parametrs to send with the GET
	 *
	 * @returns {BomRoot} An object representation of the formatted data
	 */
	static fetch(link, params) {
		return this.RESTWrapperService.get(link, null, params, {
			skipCache: true
		}).then((payload) => {
			return new BomRoot(payload);
		});
	}
}

let BomRootFactory = (RESTWrapperService) => {
	BomRoot.RESTWrapperService = RESTWrapperService;

	return BomRoot;
};

export default angular.module(__moduleName, []).factory('BomRoot', ['RESTWrapperService', BomRootFactory]);
