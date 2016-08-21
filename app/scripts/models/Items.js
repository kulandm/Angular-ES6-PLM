'use strict';

/**
 * @ngdoc object
 * @name Models.Items
 *
 * @description This class wraps a list of items payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Items = function () {
};

Items.prototype = {

	/**
	 * @ngdoc method
	 * @name Models.Items#fetch
	 * @methodOf Models.Items
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 * @param {Object} params The parameters used for fetching (ex. page, page size, etc.)
	 * @param {String} workspaceId The ID of workspace whose items to retrieve
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link, params, workspaceId) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {skipCache: true}, {
			ACCEPT: 'application/json'
		}).then(function (payload) {
			that.json = payload;
			var promises = [];
			angular.forEach(that.json.items, function (item) {
				item.urn = that.UrnParser.encode(item.item.urn);
			});
			return that.$q.all(promises).then(function () {
				return that;
			});
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.Items#getFullList
	 * @methodOf Models.Items
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	},

	/**
	 * @ngdoc method
	 * @name Models.Items#getItemLink
	 * @methodOf Models.Items
	 * @description Returns the REST api link for the item given the id
	 *
	 * @param {Number} workspaceId The ID of the workspace of the item to be retrieved
	 * @param {Number} dmsId The ID of the item to be retrieved
	 *
	 * @returns {String} The string representation of the REST link
	 */
	getItemLink: function (workspaceId, dmsId) {
		var ret = '';
		angular.forEach(this.json.items, function (item) {
			if (item.dmsId === dmsId) {
				ret = item.link.replace('[workspaceId]', workspaceId);
			}
		});
		return ret;
	},

	/**
	 * @ngdoc method
	 * @name Models.Items#setItemObj
	 * @methodOf Models.Items
	 * @description Attaches the item object to the tree
	 *
	 * @param {Number} dmsId The ID of the item to be stored
	 * @param {Object} obj The item object
	 */
	setItemObj: function (dmsId, obj) {
		angular.forEach(this.json.items, function (item) {
			if (item.dmsId === dmsId) {
				item.obj = obj;
			}
		});
	}
};

angular.module('plm360.models').factory('Items', [
	'RESTWrapperService',
	'$q',
	'EventService',
	'UrnParser',
	function (RESTWrapperService, $q, EventService, UrnParser) {
		var models = {};
		Items.prototype.RESTWrapperService = RESTWrapperService;
		Items.prototype.$q = $q;
		Items.prototype.UrnParser = UrnParser;
		EventService.listen('items:*:get', function (event, params, requestParams) {
			var model = models[params] || new Items();
			models[params] = model;
			model.fetch(params, requestParams, event.split(':')[1]).then(function (obj) {
				EventService.send('items:' + event.split(':')[1] + ':done', obj);
			});
		});
		return Items;
	}
]);
