'use strict';

/**
 * @ngdoc object
 * @name Models.LinkableItems
 *
 * @description This class wraps a list of LinkableItems payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var LinkableItems = function LinkableItems() {
	var that = this;
};

LinkableItems.prototype = {
	/**
  * @ngdoc method
  * @name Models.LinkableItems#fetch
  * @methodOf Models.LinkableItems
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Object} params The parameters used for fetching (ex. page, page size, etc.)
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, params) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, { skipCache: true }).then(function (payload) {
			that.json = payload;
			angular.forEach(that.json.items, function (linkableItem, index) {
				/* global LinkableItem */
				that.json.items[index] = new LinkableItem(linkableItem);
			}, that);
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.LinkableItems#getFullList
  * @methodOf Models.LinkableItems
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json.items);
	},

	/**
  * @ngdoc method
  * @name Models.LinkableItems#getTotalCount
  * @methodOf Models.LinkableItems
  * @description Returns the total count of the items
  *
  * @returns {Number} the total count of the items.
  */
	getTotalCount: function getTotalCount() {
		return this.json.totalCount;
	},

	/**
  * @ngdoc method
  * @name Models.LinkableItems#isNext
  * @methodOf Models.LinkableItems
  * @description Returns true, if next page exists
  *
  * @returns {Boolean} true, if next page exists
  */
	isNext: function isNext() {
		return !!this.json.next;
	},

	/**
  * @ngdoc method
  * @name Models.LinkableItems#getNextLink
  * @methodOf Models.LinkableItems
  * @description Returns a link to fetch next page if next page exists
  *
  * @returns {String} a link to fetch next page if next page exists
  */
	getNextLink: function getNextLink() {
		return this.json.next ? this.json.next.link : null;
	},

	/**
  * @ngdoc method
  * @name Models.LinkableItems#getLength
  * @methodOf Models.LinkableItems
  * @description Returns the size of the list
  *
  * @returns {Number} the size of the list
  */
	getLength: function getLength() {
		return this.json.items.length;
	}
};

angular.module('plm360.models').factory('LinkableItems', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	LinkableItems.prototype.RESTWrapperService = RESTWrapperService;

	EventService.listen('linkableItems:*:get', function (event, params, requestParams) {
		var model = models[params] || new LinkableItems();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('linkableItems:' + event.split(':')[1] + ':done', obj);
		});
	});

	return LinkableItems;
}]);
//# sourceMappingURL=LinkableItems.js.map
