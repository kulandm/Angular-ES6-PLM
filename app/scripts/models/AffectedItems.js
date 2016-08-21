'use strict';

/**
 * @ngdoc object
 * @name Models.AffectedItems
 *
 * @description This class wraps a list of AffectedItems payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var AffectedItems = function () {
};

AffectedItems.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.AffectedItems#fetch
	 * @methodOf Models.AffectedItems
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = [];
			angular.forEach(payload.affectedItems, function (item, index) {
				/* global AffectedItem */
				that.json[index] = new AffectedItem(item);
			}, that);
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.AffectedItems#getFullList
	 * @methodOf Models.AffectedItems
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	},

	/**
	 * @ngdoc method
	 * @name Models.AffectedItems#setFullList
	 * @methodOf Models.AffectedItems
	 * @description Sets again the data based on added items
	 *
	 * @param {Array} array 	The array containing a list of affected items to be updated here
	 *
	 */
	setFullList: function (array) {
		this.json = [];

		// Iterates through the supplied array to re-set the affected items again
		angular.forEach(array, function (item, index) {
			this.json[index] = new AffectedItem(item.json);
		}, this);
	},

	/**
	 * @ngdoc method
	 * @name Models.AffectedItems#find
	 * @methodOf Models.AffectedItems
	 * @description Returns the requested AffectedItem object
	 *
	 * @param {Number} id The ID of the affected item to be found
	 *
	 * @returns {AffectedItem} The affected item object
	 */
	find: function (id) {
		return _.find(this.getFullList(), function (item) {
			return +item.getId() === id;
		});
	}
};

angular.module('plm360.models').factory('AffectedItems', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		AffectedItems.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('affectedItems:*:get', function (event, params) {
			var model = models[params] || new AffectedItems();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('affectedItems:' + event.split(':')[1] + ':done', obj);
			});
		});
		return AffectedItems;
	}
]);
