'use strict';

/**
 * @ngdoc object
 * @name Models.RelatedItem
 *
 * @description This class wraps a list of RelatedItem payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var RelatedItem = function RelatedItem(json) {
	this.json = json;
};

RelatedItem.prototype = {
	/**
  * @ngdoc method
  * @name Models.RelatedItem#fetch
  * @methodOf Models.RelatedItem
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, { skipCache: true }).then(function (payload) {
			that.json = payload;
			return that;
		});
	},
	/**
  * @ngdoc method
  * @name Models.RelatedItem#getSelfLink
  * @methodOf Models.RelatedItem
  * @description Returns the api link for this item
  *
  * @returns {Object} Link to object's api endpoint
  */
	getSelfLink: function getSelfLink() {
		// TODO: Change 'uri' to '_self_' after rest V3 implementation
		return this.json.uri.replace(/^\//, '');
	},

	/**
  * @ngdoc method
  * @name Models.RelatedItem#deleteRelatedItems
  * @methodOf Models.RelatedItem
  * @description deletes the specific related item
  *
  * @returns {Promise} The delete request promise
  */
	deleteRelatedItems: function deleteRelatedItems(selfLink) {
		var that = this;
		var options = {};
		return this.RESTWrapperService['delete'](selfLink.substr(1), null, null, null, options);
	}
};

angular.module('plm360.models').factory('RelatedItem', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	RelatedItem.prototype.RESTWrapperService = RESTWrapperService;
	// get
	EventService.listen('relatedItem:*:get', function (event, params) {
		var model = models[params] || new RelatedItem();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('relatedItem:' + event.split(':')[1] + ':done', obj);
		});
	});
	// delete
	EventService.listen('relatedItem:*:deleteItem', function (event, selfLink) {
		var model = new RelatedItem();
		model.deleteRelatedItems(selfLink).then(function (obj) {
			EventService.send('relatedItem:' + event.split(':')[1] + ':deleteDone', true);
		}, function () {
			EventService.send('relatedItem:' + event.split(':')[1] + ':deleteDone', false);
		});
	});
	return RelatedItem;
}]);
//# sourceMappingURL=RelatedItem.js.map
