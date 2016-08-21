/**
 * @ngdoc object
 * @name Models.BomNestedItem
 * @description The Dao for BomNestedItem
 */
class BomNestedItem {

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#constructor
	 * @methodOf Models.BomNestedItem
	 * @description Sets the properties of the instance from the payload
	 * @param {Object} json the JSON payload for a BomNestedItem
	 */
	constructor(json) {
		if (json) {
			this.__self__ = json.__self__;
			this.urn = json.urn;
			this.description = json.description;
			this.item = json.item || {};
			this.depth = json.depth;
			this.itemNumber = json.itemNumber;
			this.quantity = json.quantity;
			this.isUsingDefaultQuote = json.isUsingDefaultQuote;
			this.isPinned = json.isPinned;
			this.children = json.children || [];
			this.fields = json.fields || [];
		}

		// Save json for debugging only
		this.json = json;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getSelfLink
	 * @methodOf Models.BomNestedItem
	 * @description Returns the api link for this item
	 *
	 * @returns {Object} Link to object's api endpoint
	 */
	getSelfLink() {
		return this.__self__.replace(/^\//, '');
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getItemId
	 * @methodOf Models.BomNestedItem
	 * @description The ItemId that this EdgeNode Represents
	 *
	 * @returns {String} Bom Item EdgeNode's ItemId
	 */
	getItemId() {
		let selfLinkTokens = this.item.link.split('/');
		return selfLinkTokens[4] + '@' + selfLinkTokens[6];
	}

	/**
     * @ngdoc method
     * @name Models.BomNestedItem#getWorkspaceId
     * @methodOf Models.BomNestedItem
     * @description The WOrkspaceId of this item
     *
     * @returns {String} Bom nested Node's WorkspaceId
     */
    getWorkspaceId() {
        return this.item.link.split('/')[4];
    }

    /**
     * @ngdoc method
     * @name Models.BomNestedItem#getDmsId
     * @methodOf Models.BomNestedItem
     * @description The DmsId of this item
     *
     * @returns {String} Bom nested Node's DmsId
     */
    getDmsId() {
        return this.item.link.split('/')[6];
    }

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getItemUrn
	 * @methodOf Models.BomNestedItem
	 * @description The urn of the item that this EdgeNode Represents
	 *
	 * @returns {String} the urn of the item
	 */
	getItemUrn() {
		return this.item.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getItem
	 * @methodOf Models.BomNestedItem
	 * @description The item information that this EdgeNode represents
	 *
	 * @returns {Object} The item information that this EdgeNode represents
	 */
	getItem() {
		return this.item;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getBomId
	 * @methodOf Models.BomNestedItem
	 * @description Returns this EdgeNode's bomId
	 *
	 * @returns {String} EdgeNode's bomId
	 */
	getBomId() {
		return this.__self__.split('/').pop();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getItemNumber
	 * @methodOf Models.BomNestedItem
	 * @description Returns this EdgeNode's item number
	 *
	 * @returns {Number} the EdgeNode's item number
	 */
	getItemNumber() {
		return this.itemNumber;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getItemTitle
	 * @methodOf Models.BomNestedItem
	 * @description Returns this EdgeNode's item title
	 *
	 * @returns {String} the EdgeNode's item title
	 */
	getItemTitle() {
		return this.item.title;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getUrn
	 * @methodOf Models.BomNestedItem
	 * @description Returns this EdgeNode's urn
	 *
	 * @returns {String} the EdgeNode's urn
	 */
	getUrn() {
		return this.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getChildren
	 * @methodOf Models.BomNestedItem
	 * @description returns the collection of children
	 *
	 * @returns {Array} Collection of children
	 */
	getChildren() {
		return this.children;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getChildren
	 * @methodOf Models.BomNestedItem
	 * @description returns the collection of children
	 *
	 * @returns {Array} Collection of children
	 */
	hasChildren() {
		return this.children.length > 0;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getFields
	 * @methodOf Models.BomNestedItem
	 * @description Returns the collection of view def fields
	 *
	 * @returns {Array} Collection of View Def Fields
	 */
	getFields() {
		return this.fields;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#getFieldLink
	 * @methodOf Models.BomNestedItem
	 * @description Generates a link that looks like the link to a field of the item
	 *		Though because that field may not have a value, the link may not point to anything
	 *	We can't retrieve it from a field already in the item, since that list could be empty
	 * @param {String} fieldId the id of the field
	 *
	 * @returns {String} The link that would lead the field if it existed
	 */
	getFieldLink(fieldId) {
		return this.item.link + '/bom-items/' + this.getBomId() + '/fields/' + fieldId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#fetch
	 * @methodOf Models.BomNestedItem
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} A Promise returing an object representation of the formatted data
	 */
	static fetch(link, params) {
		let headers = {
			skipCache: true
		};
		return this.RESTWrapperService.get(link, null, params, headers).then((payload) => {
			return new BomNestedItem(payload);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#add
	 * @methodOf Models.BomNestedItem
	 * @description Make a post call to add a new item
	 *
	 * @param {String} link The URL to use for adding the item
	 * @param {BomNestedItem} the item to add
	 *
	 * @returns {Object} A Promise returning the post response
	 */
	static add(link, bomNestedItem) {
		let headers = {
			'Content-Type': 'application/json'
		};
		return this.RESTWrapperService.post(bomNestedItem, link, null, {}, headers, null);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#edit
	 * @methodOf Models.BomNestedItem
	 * @description Make a patch call to edit an item
	 *
	 * @param {BomNestedItem} the item with the edited fields
	 *
	 * @returns {Object} A Promise returning the patch response
	 */
	static edit(bomNestedItem) {
		let headers = {
			'Content-Type': 'application/json'
		};

		return this.RESTWrapperService.patch(bomNestedItem, bomNestedItem.getSelfLink(), null, {}, headers, null);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomNestedItem#delete
	 * @methodOf Models.BomNestedItem
	 * @description Make a delete call to remove an item from the bom
	 *
	 * @param {BomNestedItem} the item to be deleted
	 *
	 * @returns {Object} A Promise returning the delete's response
	 */
	static delete(bomNestedItem) {
		let headers = {
			'Content-Type': 'application/json'
		};

		return this.RESTWrapperService.delete(bomNestedItem.getSelfLink(), null, {}, headers, null);
	}
}

/**
 * @ngdoc function
 * @name BomNestedItemFactory
 * @description Sets the injected services on the BomNestedItem Class object, then returns that object
 */
let BomNestedItemFactory = (RESTWrapperService) => {
	BomNestedItem.RESTWrapperService = RESTWrapperService;

	return BomNestedItem;
};

export default angular.module(__moduleName, []).factory('BomNestedItem', ['RESTWrapperService', BomNestedItemFactory]);
