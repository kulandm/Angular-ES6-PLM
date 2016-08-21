'use strict';
/**
 * @ngdoc object
 * @name Models.SearchPlmResult
 * @description The Dao for SearchPlmResult
 */
class SearchPlmResult {

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#constructor
	 * @methodOf Models.SearchPlmResult
	 * @description Sets the properties of the instance from the payload
	 * @param {Object} json the JSON payload for a SearchPlmResult
	 */
	constructor(json) {
		if (json) {
			this.__self__ = json.__self__;
			this.urn = json.urn;
			this.descriptor = json.descriptor || null;
			this.category = json.category || null;
			this.categoryThumbnail = json.categoryThumbnail || null;
			this.categoryThumbnailSmall = json.categoryThumbnailSmall || null;
			this.creator = json.creator || null;
			this.owner = json.owner || null;
			this.workspaceLongName = json.workspaceLongName || null;
			this.workspaceShortName = json.workspaceShortName || null;
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getSelfLink
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the api link for this item
	 *
	 * @returns {Object} Link to object's api endpoint
	 */
	getSelfLink() {
		return this.__self__.replace(/^\//, '');
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getDescriptor
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the item's descriptor
	 *
	 * @returns {String} descriptor
	 */
	getDescriptor() {
		return this.descriptor;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getCategory
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the item's category
	 *
	 * @returns {String} the item's item category
	 */
	getCategory() {
		return this.category;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getCategoryThumbnail
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the item's category thumbnail
	 *
	 * @returns {String} the item's item category thumbnail
	 */
	getCategoryThumbnail() {
		return this.categoryThumbnail;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getCategoryThumbnailSmall
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the item's category thumbnail small
	 *
	 * @returns {String} the item's item category thumbnail small
	 */
	getCategoryThumbnailSmall() {
		return this.categoryThumbnailSmall;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getUrn
	 * @methodOf Models.SearchPlmResult
	 * @description Returns this item's urn
	 *
	 * @returns {String} the item's urn
	 */
	getUrn() {
		return this.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getCreator
	 * @methodOf Models.SearchPlmResult
	 * @description returns the creator's name
	 *
	 * @returns {String} the creator's name
	 */
	getCreator() {
		return this.creator;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getOwner
	 * @methodOf Models.SearchPlmResult
	 * @description returns the owner's name
	 *
	 * @returns {String} the owner's name
	 */
	getOwner() {
		return this.owner;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getWorkspaceName
	 * @methodOf Models.SearchPlmResult
	 * @description returns the workspace's name
	 *
	 * @returns {String} the workspace's name
	 */
	getWorkspaceName() {
		return this.workspaceLongName;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getWorkspaceShortName
	 * @methodOf Models.SearchPlmResult
	 * @description returns the workspace's name
	 *
	 * @returns {String} the workspace's name
	 */
	getWorkspaceShortName() {
		return this.workspaceShortName;
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getUrnLink
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the urn as a link parameter
	 * @returns {String} The urn parameter for link that would lead the field if it existed
	 */
	getUrnLink() {
		return this.getUrn().replace(/\:/g, '`').replace(/\./g, ',');
	}

	/**
	 * @ngdoc method
	 * @name Models.SearchPlmResult#getWorkspaceId
	 * @methodOf Models.SearchPlmResult
	 * @description Returns the workspaceId from urn
	 * @returns {Number} The workspace id
	 */
	getWorkspaceId() {
		let components = this.getUrn().split('.');
		return components[components.length - 2];
	}
}

export default SearchPlmResult;
