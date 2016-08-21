'use strict';

/**
 * @ngdoc object
 * @name Models.NamedRelationshipsItem
 *
 * @description This class wraps a list of NamedRelationships payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var NamedRelationshipsItem = function (json) {
	this.json = json;
};

NamedRelationshipsItem.prototype = {
	
	/**
	 * @ngdoc method
	 * @name Models.NamedRelationshipsItem#getItemTitle
	 * @methodOf Models.NamedRelationshipsItem
	 * @description Returns item title
	 *
	 * @returns {String} Item title
	 */
	getItemTitle: function () {
		return this.json.item.title;
	},

	/**
	 * @ngdoc method
	 * @name Models.NamedRelationshipsItem#getWorkspaceId
	 * @methodOf Models.NamedRelationshipsItem
	 * @description Returns the workspace id.
	 *
	 * @returns {String} the workspace id.
	 */
	getWorkspaceId: function () {
		return this.json.item.link.split('/')[4];
	},
	
	/**
	 * @ngdoc method
	 * @name Models.NamedRelationshipsItem#getResourceId
	 * @methodOf Models.NamedRelationshipsItem
	 * @description Returns the resource id.
	 *
	 * @returns {String} the resource id.
	 */
	getResourceId: function () {
		var resourceParts = this.json.item.link.split('/');
		return resourceParts[4] + '@' + resourceParts[6];
	},

	/**
	 * @ngdoc method
	 * @name Models.NamedRelationshipsItem#getItemDescriptorValue
	 * @methodOf Models.NamedRelationshipsItem
	 * @description Returns the item descriptor's value.
	 *
	 * @returns {String} the item descriptor's value.
	 */
	getItemDescriptorValue: function () {
		var title = this.json.item.title ? (this.json.item.title + ' ') : '';
		var version = this.json.item.version || '';
		return (title + version).trim();
	},
	
	/**
	 * @ngdoc method
	 * @name Models.NamedRelationshipsItem#getItemUrn
	 * @methodOf Models.NamedRelationshipsItem
	 * @description Returns the item's urn.
	 *
	 * @returns {String} the item's urn.
	 */
	getItemUrn: function () {
		return this.json.item.urn;
	},
	
	/**
	 * @ngdoc method
	 * @name Models.NamedRelationshipsItem#delete
	 * @methodOf Models.NamedRelationshipsItem
	 * @description Deletes this item
	 *
	 * @param {String} selfLink link from event service, use for identifying the item
	 *
	 * @returns {Promise} The delete request promise.
	 */
	delete: function (selfLink) {
		var that = this;
		var options = {};

		return this.RESTWrapperService.delete(selfLink.substr(1), null, null, {'Content-Type': 'application/json'}, options);
	}
};

angular.module('plm360.models').factory('NamedRelationshipsItem', ['EventService', 'RESTWrapperService',
	function (EventService, RESTWrapperService) {
		var models = {};
		NamedRelationshipsItem.prototype.RESTWrapperService = RESTWrapperService;
		
		// Delete
		EventService.listen('namedRelationshipsItem:*:deleteItem', function (event, selfLink) {
			var model = new NamedRelationshipsItem();
			model.delete(selfLink).then(function () {
				EventService.send('namedRelationshipsItem:' + event.split(':')[1] + ':deleteDone', true);
			}, function () {
				EventService.send('namedRelationshipsItem:' + event.split(':')[1] + ':deleteDone', false);
			});
		});
		
		return NamedRelationshipsItem;
	}
]);
