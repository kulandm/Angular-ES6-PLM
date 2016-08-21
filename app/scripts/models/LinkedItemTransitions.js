'use strict';

/**
 * @ngdoc object
 * @name Models.LinkedItemTransitions
 *
 * @description This class wraps a list of LinkedItemTransitions payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var LinkedItemTransitions = function () {
};

LinkedItemTransitions.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.LinkedItemTransitions#fetch
	 * @methodOf Models.LinkedItemTransitions
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;

		return this.RESTWrapperService.get(link, null, null, {skipCache: true}).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.LinkedItemTransitions#getFullList
	 * @methodOf Models.LinkedItemTransitions
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	},

	/**
	 * @ngdoc method
	 * @name Models.LinkedItemTransitions#setLinkedItemTransitionObj
	 * @methodOf Models.LinkedItemTransitions
	 * @description Sets the object
	 *
	 * @param {String} id The title of the item used as an id
	 * @param {Object} object The linked item transition object
	 */
	setLinkedItemTransitionObj: function (id, object) {
		angular.forEach(this.json, function (linkedItem) {
			if (linkedItem.item.title === id) {
				linkedItem.obj = object;
			}
		});
	}
};

angular.module('plm360.models').factory('LinkedItemTransitions', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		LinkedItemTransitions.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('affectedItemTransitions:*:get', function (event, params) {
			var model = models[params] || new LinkedItemTransitions();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('affectedItemTransitions:' + event.split(':')[1] + ':done', obj);
			});
		});
		return LinkedItemTransitions;
	}
]);
