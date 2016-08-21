'use strict';

/**
 * @ngdoc object
 * @name Models.NamedRelationshipsItems
 *
 * @description This class wraps a list of NamedRelationshipsItems payload into an object.
 *
 * ##Dependencies
 *
 */

// Define the constructor
var NamedRelationshipsItems = function NamedRelationshipsItems() {};

NamedRelationshipsItems.prototype = {
	/**
  * @ngdoc method
  * @name Models.NamedRelationshipsItems#fetch
  * @methodOf Models.NamedRelationshipsItems
  * @description Make a call to fetch raw data.
  *
  * @param {String} link		The URL to use for fetching the data.
  * @param {Object} params	The parameters used for fetching (ex. page, page size, etc.).
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, params) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {}).then(function (payload) {
			that.array = [];
			angular.forEach(payload.items, function (item, index) {
				/* global NamedRelationshipsItem */
				that.array[index] = new NamedRelationshipsItem(item);
			}, that);
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.NamedRelationshipsItems#getFullList
  * @methodOf Models.NamedRelationshipsItems
  * @description Returns the full list of data.
  *
  * @returns {Array} The full list of data.
  */
	getFullList: function getFullList() {
		return angular.copy(this.array);
	}
};

angular.module('plm360.models').factory('NamedRelationshipsItems', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	NamedRelationshipsItems.prototype.RESTWrapperService = RESTWrapperService;

	EventService.listen('namedRelations:*:get', function (event, params, requestParams) {
		var model = models[params] || new NamedRelationshipsItems();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('namedRelations:' + event.split(':')[1] + ':done', obj);
		});
	});

	return NamedRelationshipsItems;
}]);
//# sourceMappingURL=NamedRelationshipsItems.js.map
