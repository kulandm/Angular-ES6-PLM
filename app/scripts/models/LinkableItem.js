'use strict';

/**
 * @ngdoc object
 * @name Models.LinkableItem
 *
 * @description This class wraps a LinkableItem payload into an object
 *
 * ##Dependencies
 * TODO: remove this model, as it has nothing but some functions to get some json properties. Move this stuff to {@link AddExistingLinkableItemController}.
 */

// Define the constructor
var LinkableItem = function (json) {
	this.json = json;

	/**
	 * @ngdoc property
	 * @name Models.LinkableItem#selected
	 * @propertyOf Models.LinkableItem
	 * @description true, if current item is selected.
	 *
	 * @type {Boolean} true, if current item is selected.
	 *
	 * TODO: this should be moved away from the modal as its related to presentation.
	 */
	this.selected = false;

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#removeBaseUrl
	 * @methodOf Models.LinkableItem
	 * @description Remove base url from the given link.
	 *
	 * @param {String} link The url to be truncated.
	 * @returns {String} Relative url without base url.
	 */
	this.removeBaseUrl = function (link) {
		if ((link.indexOf('api/v2/') !== -1) || (link.indexOf('api/v3/') !== -1)) {
			return link.substr(7);
		} else if (link.indexOf('api/rest/v1/') !== -1) {
			return link.substr(12);
		}
		return link;
	};

	/**
	 * @ngdoc property
	 * @name Models.LinkableItem#link
	 * @propertyOf Models.LinkableItem
	 * @description The association link of this item.
	 *
	 * @type {String} The association link of this item.
	 */
	this.link = null;

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getObject
	 * @methodOf Models.LinkableItem
	 * @description Returns a copy of the object's JSON
	 *
	 * @returns {Object} The linked item object
	 */
	this.getObject = function () {
		return angular.copy(this.json);
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getItemLink
	 * @methodOf Models.LinkableItem
	 * @description Returns item link
	 *
	 * @returns {String} item link
	 */
	this.getItemLink = function () {
		this.link = this.link || this.json.item.link;
		return this.link;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getItemId
	 * @methodOf Models.LinkableItem
	 * @description Returns item resourceId
	 *
	 * @returns {String} ResourceId
	 */
	this.getItemId = function () {
		var ids = this.getItemLink().split(/\//);
		return ids[4] + '@' + ids[6];
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getItemTitle
	 * @methodOf Models.LinkableItem
	 * @description Returns item title
	 *
	 * @returns {String} item title
	 */
	this.getItemTitle = function () {
		return this.json.item.title;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getItemUrn
	 * @methodOf Models.LinkableItem
	 * @description Returns item urn
	 *
	 * @returns {String} item urn
	 */
	this.getItemUrn = function () {
		return this.json.item.urn;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getItemVersion
	 * @methodOf Models.LinkableItem
	 * @description Returns item version information for revision-controlled
	 * items
	 *
	 * @returns {String} Version tag
	 */
	this.getItemVersion = function () {
		return this.json.item.version || '';
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getWorkspaceTitle
	 * @methodOf Models.LinkableItem
	 * @description Returns workspace title
	 *
	 * @returns {String} workspace title
	 */
	this.getWorkspaceTitle = function () {
		return this.json.workspace.title;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getLifecycleTitle
	 * @methodOf Models.LinkableItem
	 * @description Returns lifecycle title
	 *
	 * @returns {String} lifecycle title
	 */
	this.getLifecycleTitle = function () {
		return this.json.lifecycle.title;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#isLifecycle
	 * @methodOf Models.LinkableItem
	 * @description Returns true, if item has lifecycle
	 *
	 * @returns {Boolean} true, if item has lifecycle
	 */
	this.isLifecycle = function () {
		return !!this.json.lifecycle;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#isLinkedTo
	 * @methodOf Models.LinkableItem
	 * @description Return true, if item is already associated with another workspace item.
	 *
	 * @returns {boolean} true, if item is already associated with another workspace item.
	 */
	this.isLinkedTo = function () {
		return this.json['linked-to'] && this.json['linked-to'].length > 0;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#itemLinkedTo
	 * @methodOf Models.LinkableItem
	 * @description Return the item(s) to which this item is linked
	 * TODO Since the endpoint doesn't really work properly, this is temporary
	 *
	 * @returns {Object} Object with `link` and `title` properties
	 */
	this.itemLinkedTo = function () {
		return this.json['linked-to'][0];
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#itemLinkedToId
	 * @methodOf Models.LinkableItem
	 * @description Returns resourceId of the item to which this item is linked
	 * TODO Since the endpoint doesn't really work properly, this is temporary
	 *
	 * @returns {String} ResourceId
	 */
	this.itemLinkedToId = function () {
		var ids = this.itemLinkedTo().link.split(/\//);
		return ids[4] + '@' + ids[6];
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#setSelection
	 * @methodOf Models.LinkableItem
	 * @description set selection stage of the item.
	 *
	 * TODO: this should be moved away from the modal as its related to presentation.
	 */
	this.setSelection = function (selected) {
		this.selected = selected;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#isSelected
	 * @methodOf Models.LinkableItem
	 * @description Returns true, if item is in selected state
	 *
	 * @returns {Boolean} true, if item is in selected state
	 *
	 * TODO: this should be moved away from the modal as its related to presentation.
	 */
	this.isSelected = function () {
		return !!this.selected;
	};

	/**
	 * @ngdoc method
	 * @name Models.LinkableItem#getWorkspaceId
	 * @methodOf Models.LinkableItem
	 * @description Returns item's workspace id
	 *
	 * @returns {String} Workspace id
	 */
	this.getWorkspaceId = function () {
		return this.getItemUrn().split('.').reverse()[1];
	};
};

angular.module('plm360.models').factory('LinkableItem', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		LinkableItem.prototype.RESTWrapperService = RESTWrapperService;
		// get
		EventService.listen('linkableItem:*:get', function (event, params) {
			var model = models[params] || new LinkableItem();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('linkableItem:' + event.split(':')[1] + ':done', obj);
			});
		});
		return LinkableItem;
	}
]);
