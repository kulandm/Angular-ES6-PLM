'use strict';

/**
 * @ngdoc object
 * @name Models.RelatedWorkspaces
 *
 * @description This class wraps a list of RelatedWorkspaces payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var RelatedWorkspaces = function () {
};

RelatedWorkspaces.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.RelatedWorkspaces#fetch
	 * @methodOf Models.RelatedWorkspaces
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;

			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.RelatedWorkspaces#getFullList
	 * @methodOf Models.RelatedWorkspaces
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	}
};

angular.module('plm360.models').factory('RelatedWorkspaces', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		RelatedWorkspaces.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('relatedWorkspaces:*:get', function (event, params) {
			var model = models[params] || new RelatedWorkspaces();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('relatedWorkspaces:' + event.split(':')[1] + ':done', obj);
			});
		});
		return RelatedWorkspaces;
	}
]);
